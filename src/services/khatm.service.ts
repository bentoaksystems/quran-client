/**
 * Created by Ali on 6/3/2017.
 */
import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {Storage} from '@ionic/storage';
import * as moment from 'moment-timezone';

import {HttpService} from "./http.service";
import {AuthService} from "./auth.service";

@Injectable()
export class KhatmService{
  khatms: BehaviorSubject<any> = new BehaviorSubject([]);
  activeKhatm: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private httpService: HttpService, private authService: AuthService,
              private storage: Storage){
      // this.storage.remove('khatms');
      // this.storage.remove('khatm_35');
      // this.storage.remove('khatm_40');
  }

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
                              // console.log('data:', data);
                              let mDate = moment(new Date());

                              let tempList = [];
                              for (let item of data) {
                                  //Check rest days of khatm
                                  if(moment(item.end_date).diff(mDate, 'days') >= 0)
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
                  // data.forEach(el => promiseList.push(this.storeKhatmPages(el.khid, el.pages, 'add')));
                  data.forEach(el => promiseList.push(this.commitmentsReconciliation(el.khid, el.pages)));

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
            else if(type === 'update'){
              let pNumbers = pages.map(el => el.page_number);
              value = value.filter(el => pNumbers.findIndex(i => i === el.page_number) === -1);
              value = value.concat(pages);
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
    if(khatm.you_read === null || khatm.you_unread === null)
        this.activeKhatm.next(null);
    else if(this.activeKhatm.getValue() === null || this.activeKhatm.getValue().khid !== khatm.khid) {
      let actKhatm = Object.assign({}, khatm);
      this.getKhatmPages(khatm.khid)
        .then((value) => {
          if(value === null)
            actKhatm.pages = value;

          this.activeKhatm.next(actKhatm);
          // console.log('Active khatm is: ', this.activeKhatm.getValue());
        })
        .catch((err) => {
          console.log(err);
          this.activeKhatm.next(null);
          // console.log('Active khatm is: ', this.activeKhatm.getValue());
        });
    }
    else if(this.activeKhatm.getValue().khid === khatm.khid) {
      this.activeKhatm.next(null);
      // console.log('Active khatm is: ', this.activeKhatm.getValue());
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

  commitmentsReconciliation(khatm_id, pages){
    return new Promise((resolve, reject) => {
      this.storage.get('khatm_' + khatm_id)
          .then(values => {
              let updateServer_List = [];
              let updateLocal_List = [];

              if(values === null){
                  pages.forEach(el => {
                      updateLocal_List.push({type: 'add', page: el});
                  })
              }
              else if(values.length > pages.length){
                  for(let index = 0; index < pages.length; index++){
                      if(values.findIndex(el => el.cid === pages[index].cid) === -1){
                          updateLocal_List.push({type: 'add', page: pages[index]});
                      }
                      else if(values.find(el => el.cid === pages[index].cid).isread !== pages[index].isread){
                          updateLocal_List.push({type: 'update', page: pages[index]});
                      }
                  }

                  values.forEach(el => {
                      if(pages.find(i => i.cid === el.cid) === undefined){
                          updateServer_List.push({type: 'add', page: el});
                      }
                  })
              }
              else{
                  for(let index = 0; index < values.length; index++){
                      if(pages.findIndex(el => el.cid === values[index].cid) === -1){
                          updateServer_List.push({type: 'add', page: values[index]});
                      }
                      else if(pages.find(el => el.cid === values[index].cid).isread !== values[index].isread){
                          updateServer_List.push({type: 'update', page: values[index]});
                      }
                  }

                  pages.forEach(el => {
                      if(values.find(i => i.cid === el.cid) === undefined){
                          updateLocal_List.push({type: 'add', page: el});
                      }
                  })
              }

              //Update server
              let readPages = updateServer_List.filter(el => el.page.isread === true).map(el => el.page);
              let unreadPages = updateServer_List.filter(el => el.page.isread === false).map(el => el.page);
              if(readPages.length > 0)
                this.commitPages(khatm_id, readPages, true);
              if(unreadPages.length > 0)
                this.commitPages(khatm_id, unreadPages, false);

              //Update local
              let addPages = updateLocal_List.filter(el => el.type === 'add').map(el => el.page);
              let updatePages = updateLocal_List.filter(el => el.type === 'update').map(el => el.page);

              let promiseList = [];
              promiseList.push(Promise.resolve());
              if(addPages.length > 0)
                promiseList.push(this.storeKhatmPages(khatm_id, addPages, 'add'));
              if(updatePages.length > 0)
                promiseList.push(this.storeKhatmPages(khatm_id, updatePages, 'update'));

              Promise.all(promiseList)
                  .then(res => resolve())
                  .catch(err => reject())
          })
          .catch(err => {
              console.log(err);
              reject(err);
          });
    });
  }
}