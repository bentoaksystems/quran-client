/**
 * Created by Ali on 6/3/2017.
 */
import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {Storage} from '@ionic/storage';
import * as moment from 'moment-timezone';

import {HttpService} from "./http.service";

@Injectable()
export class KhatmService {
  khatms: BehaviorSubject<any> = new BehaviorSubject([]);
  activeKhatm: BehaviorSubject<any> = new BehaviorSubject(null);

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
          },
          (err) => {
            console.log(err.message);
            reject(err);
          }
        );
    });
  }

  getKhatm(khatm_link){
    return new Promise((resolve, reject) => {
      this.httpService.getData('khatm/link/' + khatm_link, true).subscribe(
        (res) => {
          let data = res.json();
          let mDate = moment(new Date());

          if (moment(data[0].end_date).diff(mDate, 'days') >= 0)
            resolve(data[0]);
          else
            reject('expired');
        },
        (err) => reject(err)
      );
    })
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
}
