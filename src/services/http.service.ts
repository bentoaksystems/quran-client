/**
 * Created by Ali on 5/21/2017.
 */
import {Injectable, isDevMode} from "@angular/core";
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs";
import {Network} from "@ionic-native/network";
import {Storage} from "@ionic/storage";
import * as moment from 'moment-timezone';

@Injectable()
export class HttpService{
  // serverAddress: string = isDevMode()?'http://192.168.1.10:3000/api':
  //    'https://quran-together.herokuapp.com/api';

  // serverAddress: string = 'http://www.read.quran.parts/api';
  serverAddress: string = 'http://192.168.15.6:3000/api';
  isDisconnected: boolean = false;
  user: any = null;

  constructor(private http: Http, private network: Network,
              private storage: Storage){
    if(this.network.type === 'none')
      this.isDisconnected = true;

    this.network.onDisconnect().subscribe(
        () => this.isDisconnected = true
    );

    this.network.onConnect().subscribe(
        () => {
          if(this.user !== null){
            this.sendDiff()
              .then(() => this.isDisconnected = false)
              .catch(err => console.log(err));
          }
        }
    );
  }

  postData(address, data, needAuthDetails: boolean) : Observable<Response>{
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
      if(this.isDisconnected){
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
      if(this.isDisconnected){
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

      if(this.isDisconnected){
        if(isread){
          this.modifyCommitmentsStorage('diff_khatm', khatm_id, pages, 'add')
            .then(res => {
              returnValue = res;
              return this.modifyKhatmsStorage(khatm_id, isread);
            })
            .then(res => resolve(returnValue))
            .catch(err => reject(err));
        }
        else{
          this.modifyCommitmentsStorage('diff_khatm', khatm_id, pages, 'delete')
            .then(res => {
              returnValue = res;
              return this.modifyKhatmsStorage(khatm_id, isread);
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
                  return this.modifyKhatmsStorage(khatm_id, isread);
                })
                .then(res => resolve(returnValue))
                .catch(err => reject(err));
            }
            else{
              this.modifyCommitmentsStorage('khatm', khatm_id, pages, 'add')
                .then(res => {
                  returnValue = res;
                  return this.modifyKhatmsStorage(khatm_id, isread);
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
      this.storage.get(storageName + '_' + khatm_id)
        .then((value) => {
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

          if (value.length === 0)
            return this.storage.remove(storageName + '_' + khatm_id);
          else
            return this.storage.set(storageName + '_' + khatm_id, value);
        })
        .then((res) => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  modifyKhatmsStorage(khatm_id, isread){
    return new Promise((resolve, reject) => {
      this.storage.get('khatms')
        .then(res => {
          let khatm = res.find(el => el.khid === khatm_id);

          khatm.you_read = (isread) ? parseInt(khatm.you_read) + 1 : parseInt(khatm.you_read) - 1;
          khatm.you_unread = (isread) ? parseInt(khatm.you_unread) - 1 : parseInt(khatm.you_unread) + 1;
          khatm.read_pages = (isread) ? parseInt(khatm.read_pages) + 1 : parseInt(khatm.read_pages) - 1;

          return this.storage.set('khatms', res);
        })
        .then(res => resolve())
        .catch(err => reject(err));
    });
  }

  sendDiff(): any{
    return new Promise((resolve, reject) => {
      this.storage.get('khatms')
        .then(res => {
          let khids = res.map(el => el.khid);
          let promiseList = [Promise.resolve(null)];

          for(let id of khids)
            promiseList.push(this.storage.get('diff_khatm_' + id));

          return Promise.all(promiseList);
        })
        .then(res => {
          let promiseList = [];
          let data = res.filter(el => el !== null);

          if(data.length === 0)
            promiseList.push(Promise.resolve());
          else{
            let readPages = [];

            data.forEach(cel => {
              readPages = readPages.concat(cel.map(el => el.cid));
            });

            promiseList.push(this.postData('khatm/commitment/commit', {cids: readPages, isread: true}, true).toPromise());

            // let unreadPages = [];
            //
            // data.forEach(cel => {
            //   readPages = readPages.concat(cel.filter(el => el.isread === true).map(el => el.cid));
            //   unreadPages = unreadPages.concat(cel.filter(el => el.isread === false).map(el => el.cid));
            // });
            //
            // if(readPages.length > 0)
            //   promiseList.push(this.postData('khatm/commitment/commit', {cids: readPages, isread: true}, true).toPromise());
            //
            // if(unreadPages.length > 0)
            //   promiseList.push(this.postData('khatm/commitment/commit', {cids: unreadPages, isread: false}, true).toPromise());
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
        mainValue.find(item => item.cid === el.cid).isread = el.isread;
      });
    }

    return mainValue.filter(el => el.isread === false);
  }
}
