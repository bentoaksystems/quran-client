/**
 * Created by Ali on 6/3/2017.
 */
import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {Storage} from '@ionic/storage';

import {HttpService} from "./http.service";
import {AuthService} from "./auth.service";

@Injectable()
export class KhatmService{
  khatms: BehaviorSubject<any> = new BehaviorSubject([]);
  activeKhatm: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private httpService: HttpService, private authService: AuthService,
              private storage: Storage){}

  createKhatm(data){
    return new Promise((resolve, reject) => {
      this.httpService.putData('khatm', data, true, true, this.authService.user.getValue().email, this.authService.user.getValue().token)
          .subscribe(
              (data) => {
                this.loadKhatm(this.authService.user.getValue().email);
                resolve();
              },
              (err) => {
                console.log(err);
                reject(err);
              }
          )
    });
  }

  loadKhatm(userEmail) {
      console.log('UserEmail:' + userEmail);
      this.authService.user.subscribe(
          (data) => {
              if(data !== null)
                  this.httpService.getData('khatm', true, true, userEmail, data.token)
                      .subscribe(
                          (res) => {
                              let data = res.json();
                              console.log('data:', data);
                              let tempList = [];
                              for (let item of data) {
                                  tempList.push(item);
                              }
                              this.storeKhatms(tempList);
                              this.khatms.next(tempList);
                          },
                          (err) => {
                              console.log(err.message);
                              this.khatms.next([]);
                          }
                      )
          },
          (err) => console.log(err.message)
      );
  }

  loadAllCommitments(){
    return new Promise((resolve, reject) => {
      this.httpService.getData('khatm/commitment', true, false,
                                this.authService.user.getValue().email, this.authService.user.getValue().token)
          .subscribe(
              (res) => {
                  let data = res.json();
                  console.log('DATACommitments:', data);

                  let promiseList = [];
                  data.forEach(el => promiseList.push(this.storeKhatmPages(el.khid, el.pages, 'add')));

                  Promise.all(promiseList)
                      .then((res) => resolve())
                      .catch((err) => reject(err));
              },
              (err) => {
                  console.log(err.message);
                  reject(err);
              }
          )
    });
  }

  getPages(number, khatm_id, type){
    return new Promise((resolve, reject) => {
        this.httpService.postData('khatm/commitment/auto', {khid: khatm_id, pages: number}, true, true,
            this.authService.user.getValue().email, this.authService.user.getValue().token)
            .subscribe(
                (res) => {
                  let data = res.json();
                  if(data === null)
                    resolve();
                  else {
                    //Save/Update page numbers
                    this.storeKhatmPages(khatm_id, data, type)
                      .then((re) => this.updateKhatmCommtiments(khatm_id, number))
                      .then((r) => resolve())
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

  storeKhatms(khatms){
    this.storage.set('khatms', khatms);
  }

  getKhatms(){
    return this.storage.get('khatms');
  }

  storeKhatmPages(khatm_id, pages, type){
    return new Promise((resolve, reject) => {
      this.storage.get('khatm_' + khatm_id)
        .then((value) => {
          if(value != null){
            console.log('VALUE:', value);
            if(type === 'add'){
              value = value.concat(pages);
            }
            else if(type === 'delete'){
              let pNumbers = pages.map(el => el.page_number);
              value = value.filter(el => pNumbers.findIndex(i => i === el.page_number) === -1);
            }
          }
          else{
            value = pages;
          }

          if(value.length === 0)
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

  getKhatmPages(khatm_id){
    return this.storage.get('khatm_' + khatm_id);
  }

  updateKhatmCommtiments(khatm_id, page_numbers){
    return new Promise((resolve, reject) => {
      this.storage.get('khatms')
        .then((res) => {
          let data = res.find(el => el.khid === khatm_id);
          console.log(data);
          data.you_unread = page_numbers;
          return this.storage.set('khatms', res);
        })
        .then((res) => resolve())
        .catch((err) => {
          reject(err);
        });
    });
  }

  start_stop_Khatm(khatm){
    if(this.activeKhatm.getValue() === null || this.activeKhatm.getValue().khid !== khatm.khid) {
      let actKhatm = Object.assign({}, khatm);
      this.getKhatmPages(khatm.khid)
        .then((value) => {
          if(value === null)
            actKhatm.pages = value;

          this.activeKhatm.next(actKhatm);
          console.log('Active khatm is: ', this.activeKhatm.getValue());
        })
        .catch((err) => {
          console.log(err);
          this.activeKhatm.next(null);
          console.log('Active khatm is: ', this.activeKhatm.getValue());
        });
    }
    else if(this.activeKhatm.getValue().khid === khatm.khid) {
      this.activeKhatm.next(null);
      console.log('Active khatm is: ', this.activeKhatm.getValue());
    }
  }

  commitPages(khatm_id, pages, is_read){
    let cids = pages.map(el => el.cid);

    this.httpService.postData('khatm/commitment/commit', {cids: cids, isread: is_read}, true, true,
                                this.authService.user.getValue().email, this.authService.user.getValue().token)
      .subscribe(
        (data) => {
          console.log(data);
        },
        (err) => {
          console.log(err);
        }
      )
  }

  clearStorage(){
    let promiseList = [];
    if(this.khatms.getValue() !== null){
      let khids = this.khatms.getValue().map(el => el.khid);
      for(let id of khids){
        promiseList.push(this.storage.remove('khatm_'+id));
      }
    }
    else
      promiseList.push(Promise.resolve());

    this.storage.remove('khatms')
      .then(value => console.log(value)).catch(err => console.log(err));

    Promise.all(promiseList)
      .then(value => this.khatms.next(null))
      .catch(err => {
        this.khatms.next(null);
        console.log(err)
      });

    this.activeKhatm.next(null);
  }
}