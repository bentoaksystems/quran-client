import {Component, Input} from '@angular/core';
import {ToastController} from "ionic-angular";

/**
 * Generated class for the Alama component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'alama',
  templateUrl: 'alama.html'
})
export class Alama {
  @Input () sign;
  @Input () tooltipMessage;
  @Input () hizbNumber;
  private sectionNumber: number = 0;
  private message: string = '';
  constructor(public toastCtrl: ToastController) { }

  ngOnInit() {
    if(this.hizbNumber%8===0)
      this.sectionNumber = this.hizbNumber/8 + 1;
    else
    if( this.hizbNumber%4===0 )
      this.sectionNumber = this.hizbNumber/4;
    else
      this.sectionNumber = Math.floor(this.hizbNumber/4)+1 ;

    switch (this.tooltipMessage)
    {
      case 'obligatory':
        this.message = "سجدة واجبة";
        break;
      case 'recommended':
        this.message = "سجدة";
        break;
      case 'juz':
        this.message = "الجزء ";
        break;
      case 'hizb':
        this.message =  "الحزب ";
        break;
      case '3qhizb':
        this.message = "ثلاثة أرباع الحزب ";
        break;
      case 'hhizb':
        this.message ="نصف الحزب ";
        break;
      case 'qhizb':
        this.message = "ربع الحزب ";
        break;
    }
  }
  showToast(){
    let toast = this.toastCtrl.create({
      message: this.message + (this.hizbNumber ? this.sectionNumber.toLocaleString('ar') : ''),
      duration: 3000,
      cssClass: 'alamaToast'
    });
    toast.present();
  }
}
