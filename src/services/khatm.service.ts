/**
 * Created by Ali on 6/3/2017.
 */
import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {Storage} from '@ionic/storage';
import {HttpService} from "./http.service";
import * as moment from 'moment-timezone';

@Injectable()
export class KhatmService {
  khatms: BehaviorSubject<any> = new BehaviorSubject([]);
  notJoinKhatms: BehaviorSubject<any> = new BehaviorSubject([]);
  activeKhatm: BehaviorSubject<any> = new BehaviorSubject(null);
  isAutomaticCommit: boolean = true;

  constructor(private httpService: HttpService, private storage: Storage) {}

  createKhatm(data) {
    return new Promise((resolve, reject) => {
      this.httpService.putData('khatm', data, true)
        .subscribe(
          (data) => {
            this.loadKhatms();
            resolve();
          },
          (err) => {
            console.log(err);
            reject(err);
          }
        )
    });
  }

  loadKhatms() {
    this.httpService.getKhatms()
      .then(res => this.khatms.next(res))
      .catch(err => {
        console.log(err);
        this.khatms.next([]);
      });
  }

  loadCommitments(khatm_id){
    return this.httpService.getCommitments(khatm_id);
  }

  getPages(number, khatm_id, type, isMember) {
    return new Promise((resolve, reject) => {
      this.httpService.postData('khatm/commitment/auto', {khid: khatm_id, pages: number}, true)
        .subscribe(
          (res) => {
            if(res.status === 500)
              reject(res.json());
            else{
              let data = res.json();

              if (data === null)
                resolve(null);
              else {
                let numberOfFinal = (type === 'delete') ? number : data.length;

                if(!isMember)
                  resolve(numberOfFinal);
                else
                //Save/Update page numbers
                  this.storeKhatmPages(khatm_id, data, type)
                    .then((re) => this.updateKhatmCommtiments(khatm_id, numberOfFinal))
                    .then((r) => resolve(numberOfFinal))
                    .catch((er) => reject(er));
              }
            }
          },
          (err) => {
            console.log(err.message);
            reject(err);
          }
        );
    });
  }

  getKhatm(khatm_link, isExpired: boolean = false){
    return this.httpService.getKhatm(khatm_link, isExpired);
  }

  storeKhatmPages(khatm_id, pages, action) {
    return new Promise((resolve, reject) => {
      this.storage.get('khatm_' + khatm_id)
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
            return this.storage.remove('khatm_' + khatm_id);
          else
            return this.storage.set('khatm_' + khatm_id, value);
        })
        .then((res) => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getKhatmPages(khatm_id) {
    return this.httpService.getCommitments(khatm_id);
  }

  updateKhatmCommtiments(khatm_id, page_numbers) {
    return new Promise((resolve, reject) => {
      this.storage.get('khatms')
        .then((res) => {
          let data = res.find(el => el.khid === khatm_id);
          // console.log(data);
          data.you_unread = page_numbers;
          return this.storage.set('khatms', res);
        })
        .then((res) => resolve())
        .catch((err) => {
          reject(err);
        });
    });
  }

  start_stop_Khatm(khatm) {
    if (khatm.you_read === null || khatm.you_unread === null || khatm.you_unread <= 0)
      this.activeKhatm.next(null);
    else if (this.activeKhatm.getValue() === null || this.activeKhatm.getValue().khid !== khatm.khid) {
      let actKhatm = Object.assign({}, khatm);
      this.getKhatmPages(khatm.khid)
        .then((value) => {
          if (value === null)
            actKhatm.pages = value;

          this.activeKhatm.next(actKhatm);
        })
        .catch((err) => {
          console.log(err);
          this.activeKhatm.next(null);
        });
    }
    else if (this.activeKhatm.getValue().khid === khatm.khid) {
      this.activeKhatm.next(null);
    }
  }

  commitPages(khatm_id, pages, is_read) {
    return this.httpService.commitPages(khatm_id, pages, is_read);
  }

  clearStorage() {
    let promiseList = [];
    if (this.khatms.getValue() !== null) {
      let khids = this.khatms.getValue().map(el => el.khid);
      for (let id of khids) {
        promiseList.push(this.storage.remove('khatm_' + id));
        promiseList.push(this.storage.remove('diff_khatm_' + id));
      }
    }
    else
      promiseList.push(Promise.resolve());

    this.storage.remove('khatms')
      .then(/*console.log(value)*/).catch(err => console.log(err));

    Promise.all(promiseList)
      .then(value => this.khatms.next(null))
      .catch(err => {
        this.khatms.next(null);
        console.log(err)
      });

    this.activeKhatm.next(null);
  }

  updateKhatmDetails(khatm_id, readPage){
    let khatms = this.khatms.getValue();

    let khatm = khatms.find(el => el.khid === khatm_id);
    khatm.you_read = (readPage) ? parseInt(khatm.you_read) + 1 : parseInt(khatm.you_read) - 1;
    khatm.you_unread = (!readPage) ? parseInt(khatm.you_unread) + 1 : parseInt(khatm.you_unread) - 1;
    khatm.read_pages = (readPage) ? parseInt(khatm.read_pages) + 1 : parseInt(khatm.read_pages) - 1;
  }

  getFreePages(khatm_id){
    return this.httpService.getData('khatm/commitment/free/' + khatm_id, true).toPromise();
  }

  selfAssignPage(khatm_id, commitment_ids, shouldGet, isMember): any{
    return new Promise((resolve, reject) => {
      this.httpService.postData('khatm/commitment/getpage', {
        cids: commitment_ids,
        shouldget: shouldGet
      }, true).subscribe(
        (res) => {
          let data = res.json();

          if (data === null)
            resolve(null);
          else {
            let numberOfFinal = data.length;
            let type = shouldGet ? 'add' : 'delete';

            if(!isMember)
              resolve(numberOfFinal);
            else
            //Save/Update page numbers
              this.storeKhatmPages(khatm_id, data, type)
                .then((re) => this.updateKhatmCommtiments(khatm_id, numberOfFinal))
                .then((r) => resolve(data))
                .catch((er) => reject(er));
          }}
        ,
        (err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  saveNotJoinSeenKhatms(khatm_name, khatm_sharelink, khatm_endDate){
    return new Promise((resolve, reject) => {
      let data: any;
      this.storage.get('not_join_khatms')
        .then(res => {
          if(res && res.findIndex(t => t.share_link === khatm_sharelink) !== -1){
            data = res;
            return Promise.resolve();
          }

          data = (res === null) ? [] : (res.length > 2 ? res.slice(1, res.length) : res);
          data.push({khatm_name: khatm_name, share_link: khatm_sharelink, end_date: khatm_endDate});
          return this.storage.set('not_join_khatms', data);
        })
        .then(res => {
          this.notJoinKhatms.next(data);
          resolve();
        })
        .catch(err => {
          reject('Cannot save this seen khatm');
        });
    });
  }

  deleteNotJoinSeenKhatms(khatm_share_link, shouldUpdateList = true){
    return new Promise((resolve, reject) => {
      let data: any = null;
      this.storage.get('not_join_khatms')
        .then(res => {
          data = [];
          if(res !== null && res !== undefined && res.length > 0)
            data = res.filter(t => t.share_link !== khatm_share_link);

          return this.storage.set('not_join_khatms', data);
        })
        .then(res => {
          if(shouldUpdateList)
            this.notJoinKhatms.next(data);
          resolve();
        })
        .catch(err => {
          reject('Cannot delete this khatm from seen khatms');
        });
    });
  }

  getNotJoinSeenKhatms(){
    this.storage.get('not_join_khatms')
      .then(res => {
        let currentDate = moment(new Date());
        let result = [];
        let shouldDelete = [];

        if(res !== null && res !== undefined)
          for(let item of res){
            if(moment(item.end_date) >= currentDate)
              result.push(item);
            else{
              shouldDelete.push(item);
            }
          }

        this.notJoinKhatms.next(result);

        for(let item of shouldDelete)
          this.deleteNotJoinSeenKhatms(item.share_link, false);
      })
      .catch(err => {
        console.log(err);
      })
  }
}
