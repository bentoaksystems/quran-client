import {Injectable} from "@angular/core";
import {Storage} from "@ionic/storage";
import * as moment from 'moment';
import * as momentJalali from 'jalali-moment';

const translations = {
  registration: {
    fa: "عضویت",
    ar:'التسجيل',
  },
  email: {
    fa: "ایمیل",
    ar:'عنوان البريد الإلكتروني',
  },
  "re-enter email":{
    fa:"تکرار ایمیل",
    ar:'أعد عنوان البريد الإلكتروني',
  },
  register:{
    fa: "عضو شوید",
    ar: 'تسجل',
  },
  skip:{
    fa:"بازگشت",
    ar:'غادر'
  },
  "display name":{
    fa:"به نام",
    ar:'اسم العرض',
  },
  'the verification code has been sent to ':{
    fa:"کد تأیید به این آدرس ارسال شد: ",
    ar: 'تم إرسال رمز التحقق إلى هذا العنوان: ',
  },
  'verification code':{
    fa:"کد تأیید",
    ar:'رمز التحقق',
  },
  'have you not got email?':{
    fa:"ایمیل به شما نرسیده؟",
    ar:'لم تحصل على البريد الإلكتروني؟',
  },
  'change email':{
    fa:"تغییر ایمیل",
    ar:'تغيير البريد الالكتروني',
  },
  verify:{
    fa:"تأیید",
    ar:'التحقق',
  },
  logout:{
    fa:"خروج",
    ar:'الخروج',
  },
  profile:{
    fa:'پروفایل',
    ar:'الملف الشخصي',
  },
  "day mode":{
    fa:'نور روزانه',
    ar:'الرؤية اليومية',
  },
  "night mode":{
    fa:'نور شبانه',
    ar:'الرؤية الليلية',
  },
  "zoom in":{
    fa:"بزرگتر",
    ar:'تكبير الخط القرآني',
  },
  "zoom out":{
    fa:"کوچکتر",
    ar:"تصغير الخط القرآني",
  },
  "change quran font":{
    fa:"تغییر فونت قرآن",
    ar:"تغيير الخط القرآني",
  },
  settings:{
    fa:'تنظیمات',
    ar:'إعدادات',
  },
  'emails do not match':{
    fa:'ایمیل‌های وارد شده یکسان نیستند',
    ar:'لا تتطابق الرسائل الإلكترونية',
  },
  'the email address is not valid':{
    fa:'آدرس ایمیل درست نیست',
    ar: 'عنوان البريد الإلكتروني غير صالح',
  },
  'the verification code consists of 6 digits':{
    fa:'کد تأیید شامل ۶ رقم است',
    ar:'يتكون رمز التحقق من 6 أرقام',
  },

};

const directionRTL = {
  fa: true,
  ar: true,
  ur: true,
};

@Injectable()
export class LanguageService {
  private _lang='en';
  set lang(l){
    this._lang=l;
    this.storage.set('language',l);
  }
  get lang(){
    return this._lang
  };

  constructor(private storage: Storage){
    this.storage.get('language')
      .then(l => this._lang = l)
      .catch(err=>console.log(err));
  }
  translate(label) {
    if(this.lang === 'en')
      return label;
    else {
      let t = translations[label.toLowerCase()];
      if(t)
        t = t[this.lang];
      if(t)
        return t;
      else
        return label;
    }
  }

  direction(){
    if(directionRTL[this.lang])
      return 'rtl';
    else
      return 'ltr';
  }

  convertDate(date){
    if(this._lang === 'fa'){
      momentJalali.loadPersian();
      return momentJalali(date).format('jYYYY-jMMMM-jD');
    }
    else if(this._lang === 'ar'){
      var hijri = require('./date-convertor');
      return hijri.convertToHijri(date);
    }

    return moment(date).format('YYYY-MMM-DD');
  }
}
