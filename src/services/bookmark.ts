/**
 * Created by Amin on 25/07/2017.
 */
import {Injectable} from "@angular/core";
import {ReplaySubject} from "rxjs";
import {Storage} from "@ionic/storage";

@Injectable()
export class BookmarkService {
  constructor(private storage: Storage){
    ['pageNumber','scrollLocation'].forEach(key=>{
      this.storage.get(key)
        .then(val=>{
          this[key] = val;
          if(val!==undefined && val!==null)
            this[key+'Stream'].next(val)
        })
        .catch(err=>console.log(err));
    })
  }
  pageNumber = 1;
  scrollLocation = 0;

  private pageNumberStream = new ReplaySubject<number>(1);
  scrollLocationStream = new ReplaySubject<boolean>(1);

  pageNumber$ = this.pageNumberStream.asObservable();
  scrollLocation$ = this.scrollLocationStream.asObservable();

  setPageNumber(p){
    this.setValue('pageNumber', p);
  }

  setScrollLocation(s) {
    this.setValue('scrollLocation', s);
  }

  private setValue(variable, val) {
    this[variable] = val;
    this.storage.set(variable,this[variable]);
  }
}
