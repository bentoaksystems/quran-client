/**
 * Created by Ali on 5/21/2017.
 */
import {Injectable} from "@angular/core";
import {Http, Response, Headers, ResponseOptions} from "@angular/http";
import {Observable} from "rxjs";
import {Network} from "@ionic-native/network";
import {Storage} from "@ionic/storage";
import * as moment from 'moment-timezone';

@Injectable()
export class HttpService{
  // serverAddress: string = isDevMode()?'http://192.168.1.10:3000/api':
  //    'https://quran-together.herokuapp.com/api';
  serverAddress: string = 'http://read.quran.parts/api';
  user: any = null;

  constructor(private http: Http, private network: Network,
              private storage: Storage){

    this.network.onConnect().subscribe(
        () => {
          if(this.user !== null){
            this.sendDiff()
              .then(() => console.log('diff is sent'))
              .catch(err => console.log(err));
          }
        }
    );
  }

  postData(address, data, needAuthDetails: boolean) : Observable<Response>{
    if(this.network.type === 'none')
      return Observable.of(new Response(new ResponseOptions({body: JSON.stringify('You are offline now. Please connect to network'), status: 500})));

    let headers = new Headers();
    if(needAuthDetails){
      headers.append('email', (this.user === null) ? null : this.user.email);
      headers.append('token', (this.user === null) ? null : this.user.token);
    }

    return this.http.post(this.serverAddress + '/' + address, data, {
      headers: headers
    });
  }

  putData(address, data, needAuthDetails: boolean) : Observable<Response> {
    if(this.network.type === 'none')
      return Observable.of(new Response(new ResponseOptions({body: JSON.stringify('You are offline now. Please connect to network'), status: 500})));

    let headers = new Headers();
    if(needAuthDetails){
      headers.append('email', (this.user === null) ? null : this.user.email);
      headers.append('token', (this.user === null) ? null : this.user.token);
    }

    return this.http.put(this.serverAddress + '/' + address, data, {
      headers: headers
    });
  }

  getData(address, needAuthDetails: boolean) : Observable<Response>{
    if(this.network.type === 'none')
      return Observable.of(new Response(new ResponseOptions({body: JSON.stringify('You are offline now. Please connect to network'), status: 500})));

    let headers = new Headers();
    if(needAuthDetails){
      headers.append('email', (this.user === null) ? null : this.user.email);
      headers.append('token', (this.user === null) ? null : this.user.token);
    }

    return this.http.get(this.serverAddress + '/' + address, {
      headers: headers
    });
  }

  deleteData(address, needAuthDetails: boolean, email = null, token = null) : Observable<Response>{
    if(this.network.type === 'none')
      return Observable.of(new Response(new ResponseOptions({body: JSON.stringify('You are offline now. Please connect to network'), status: 500})));

    let headers = new Headers();
    if(needAuthDetails){
      headers.append('email', (this.user === null) ? null : this.user.email);
      headers.append('token', (this.user === null) ? null : this.user.token);
    }

   return this.http.delete(this.serverAddress + '/' + address, {
      headers: headers
    });
  }

  getKhatms(): any{
    return new Promise((resolve, reject) => {
      if(this.network.type === 'none'){
        this.storage.get('khatms')
          .then(res => resolve(res))
          .catch(err => reject(err));
      }
      else{
        this.getData('khatm', true).subscribe(
          (res) => {
            let mDate = moment(new Date());

            let tempList = [];
            for (let item of res.json()) {
              //Check rest days of khatm
              if (moment(item.end_date).diff(mDate, 'days') >= 0)
                tempList.push(item);
            }

            this.storage.set('khatms', tempList);
            resolve(tempList);
          },
          (err) => {
            reject(err);
          }
        )
      }
    });
  }

  getCommitments(khatm_id): any{
    return new Promise((resolve, reject) => {
      if(this.network.type === 'none'){
        let mainValue = null;
        let diffValue = null;

        this.storage.get('khatm_' + khatm_id)
          .then(res => {
            mainValue = res;
            return this.storage.get('diff_khatm_' + khatm_id);
          })
          .then(res => {
            diffValue = res;
            resolve(this.getFinalResult(mainValue, diffValue));
          })
          .catch(err => reject(err));
      }
      else{
        this.sendDiff()
          .then(data => {
            return this.storage.get('khatms');
          })
          .then(data => {
            let promiseList = [Promise.resolve(null)];

            for(let id of data.map(el => el.khid))
              promiseList.push(this.storage.remove('diff_khatm_' + id));

            return Promise.all(promiseList);
          })
          .then(data => {
            this.getData('khatm/commitment/' + khatm_id, true).subscribe(
              (res) => {
                this.storage.set('khatm_' + khatm_id, res.json());
                resolve(res.json());
              },
              (err) => {
                reject(err);
              }
            );
          })
          .catch(err => reject(err));
      }
    });
  }

  commitPages(khatm_id, pages, isread): any{
    return new Promise((resolve, reject) => {
      let returnValue = null;

      if(this.network.type === 'none'){
        if(isread){
          this.modifyCommitmentsStorage('diff_khatm', khatm_id, pages, 'add')
            .then(res => {
              returnValue = res;

              if(res)
                return this.modifyKhatmsStorage(khatm_id, isread, pages.length);
              else
                return Promise.resolve();
            })
            .then(res => resolve(returnValue))
            .catch(err => reject(err));
        }
        else{
          this.modifyCommitmentsStorage('diff_khatm', khatm_id, pages, 'delete')
            .then(res => {
              returnValue = res;

              if(res)
                return this.modifyKhatmsStorage(khatm_id, isread, pages.length);
              else
                return Promise.resolve();
            })
            .then(res => resolve(returnValue))
            .catch(err => reject(err));
        }
      }
      else{
        let cids = pages.map(el => el.cid);

        this.postData('khatm/commitment/commit', {cids: cids, isread: isread}, true).subscribe(
          (data) => {
            if(isread){
              this.modifyCommitmentsStorage('khatm', khatm_id, pages, 'delete')
                .then(res => {
                  returnValue = res;

                  if(res)
                    return this.modifyKhatmsStorage(khatm_id, isread, pages.length);
                  else
                    return Promise.resolve();
                })
                .then(res => resolve(returnValue))
                .catch(err => reject(err));
            }
            else{
              this.modifyCommitmentsStorage('khatm', khatm_id, pages, 'add')
                .then(res => {
                  returnValue = res;

                  if(res)
                    return this.modifyKhatmsStorage(khatm_id, isread, pages.length);
                  else
                    return Promise.resolve();
                })
                .then(res => resolve(returnValue))
                .catch(err => reject(err));
            }
          },
          (err) => {
            reject(err);
          }
        )
      }
    })
  }

  modifyCommitmentsStorage(storageName, khatm_id, pages, action) {
    return new Promise((resolve, reject) => {
      let isValueChange: boolean = true;

      this.storage.get(storageName + '_' + khatm_id)
        .then((value) => {
          let firstValueLen = (value === null) ? 0 : value.length;

          if (value != null) {
            if (action === 'add') {
              value = value.concat(pages);
            }
            else if (action === 'delete') {
              let pNumbers = pages.map(el => el.page_number);
              value = value.filter(el => pNumbers.findIndex(i => i === el.page_number) === -1);
            }
            else if (action === 'update') {
              let pNumbers = pages.map(el => el.page_number);
              value = value.filter(el => pNumbers.findIndex(i => i === el.page_number) === -1);
              value = value.concat(pages);
            }
          }
          else {
            value = pages;
          }

          isValueChange = (value.length !== firstValueLen);

          if(action === 'update')
            isValueChange = true;

          if (value.length === 0)
            return this.storage.remove(storageName + '_' + khatm_id);
          else
            return this.storage.set(storageName + '_' + khatm_id, value);
        })
        .then((res) => {
          resolve(isValueChange);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  modifyKhatmsStorage(khatm_id, isread, pageNumbers){
    return new Promise((resolve, reject) => {
      this.storage.get('khatms')
        .then(res => {
          let khatm = res.find(el => el.khid === khatm_id);

          khatm.you_read = (isread) ? parseInt(khatm.you_read) + pageNumbers : parseInt(khatm.you_read) - pageNumbers;
          khatm.you_unread = (isread) ? parseInt(khatm.you_unread) - pageNumbers : parseInt(khatm.you_unread) + pageNumbers;
          khatm.read_pages = (isread) ? parseInt(khatm.read_pages) + pageNumbers : parseInt(khatm.read_pages) - pageNumbers;

          return this.storage.set('khatms', res);
        })
        .then(res => resolve())
        .catch(err => reject(err));
    });
  }

  getKhatm(share_link, isExpired){
    return new Promise((resolve, reject) => {
      if(this.network.type === 'none'){
        this.storage.get('khatms')
          .then(res => {
            let khatm = res.find(el => el.share_link === share_link);
            resolve(khatm);
          })
          .catch(err => {
            reject(err);
          })
      }
      else{
        this.getData('khatm/link/' + share_link + '/' + isExpired, true).subscribe(
          (res) => {
            let data = res.json();

            if(data.length > 0){
              let mDate = moment(new Date());

              if (moment(data[0].end_date).diff(mDate, 'days') >= 0 && !isExpired)
                resolve(data[0]);
              else
                reject('expired');
            }
            else
              resolve(null);
          },
          (err) => reject(err)
        );
      }
    })
  }

  sendDiff(): any{
    return new Promise((resolve, reject) => {
      this.storage.get('khatms')
        .then(res => {
          if(res === null)
            return Promise.resolve(null);

          let khids = res.map(el => el.khid);
          let promiseList = [Promise.resolve(null)];

          for(let id of khids)
            promiseList.push(this.storage.get('diff_khatm_' + id));

          return Promise.all(promiseList);
        })
        .then(res => {
          if(res === null)
            return Promise.resolve(null);

          let promiseList = [];
          let data = res.filter(el => el !== null);

          if(data.length === 0)
            promiseList.push(Promise.resolve());
          else{
            data.forEach(cel => {
              let readPages = [];
              readPages = cel.map(el => el.cid);

              promiseList.push(this.postData('khatm/commitment/commit', {cids: readPages, isread: true}, true).toPromise());
            });
          }

          return Promise.all(promiseList);
        })
        .then(res => resolve())
        .catch(err => {
          reject(err);
        })
    })
  }

  getFinalResult(mainValue, diffValue): any{
    if(diffValue !== null){
      diffValue.forEach(el => {
        mainValue.find(item => item.cid === el.cid).isread = true;
      });
    }

    return mainValue.filter(el => el.isread === false);
  }
}
