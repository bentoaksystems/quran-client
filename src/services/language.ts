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
  'my khatms': {
    fa: 'ختم های من',
    ar: 'بلدي ختم القرآن',
  },
  'general specification': {
    fa: 'اطلاعات عمومی',
    ar: 'معلومات عامة',
  },
  'title': {
    fa: 'عنوان',
    ar: 'لقب',
  },
  'description': {
    fa: 'توضیحات',
    ar: 'وصف',
  },
  "show owner's details to others":{
    fa: 'نمایش مشخصات مالک ختم به دیگران',
    ar: 'عرض تفاصيل المالك للآخرين',
  },
  "range": {
    fa: 'محدوده',
    ar: 'نطاق',
  },
  'whole Quran': {
    fa: 'تمام قرآن',
    ar: 'ختم القرآن كله',
  },
  'repeat': {
    fa: 'تکرار',
    ar: 'کرر',
  },
  'date specification': {
    fa: 'مشخصات زمانی',
    ar: 'تاريخ المواصفات',
  },
  'start date': {
    fa: 'تاریخ شروع',
    ar: 'تاريخ البدء'
  },
  'duration': {
    fa: 'مدت',
    ar: 'المدة الزمنية',
  },
  'end date': {
    fa: 'تاریخ پایان',
    ar: 'تاريخ الانتهاء',
  },
  'khatm': {
    fa: 'ختم',
    ar: 'ختم القرآن',
  },
  'submit': {
    fa: 'ارسال',
    ar: 'عرض',
  },
  'khatm information': {
    fa: 'اطلاعات ختم',
    ar: 'معلومات ختم القرآن',
  },
  'name': {
    fa: 'نام',
    ar: 'اسم',
  },
  'owner': {
    fa: 'مالک',
    ar: 'صاحب',
  },
  'read pages': {
    fa: 'صفحات خوانده شده',
    ar: 'قراءة صفحات',
  },
  'participating numbers': {
    fa: 'تعداد شرکت کنندگان',
    ar: 'أرقام المشاركة',
  },
  'rest days': {
    fa: 'روزهای باقی مانده',
    ar: 'الأيام المتبقية',
  },
  'you read': {
    fa: 'شما خوانده اید',
    ar: 'كنت قد قرأت',
  },
  'remain of your commitments': {
    fa: 'باقی مانده صفحات شما',
    ar: 'الصفحات المتبقية لك',
  },
  'copy link': {
    fa: 'کپی کردن لینک',
    ar: 'انسخ الرابط',
  },
  'share via': {
    fa: 'اشتراک گذاری در',
    ar: 'شارك عبر',
  },
  'commit pages': {
    fa: 'صفحات تعهد شده',
    ar: 'ارتكاب صفحات',
  },
  'close': {
    fa: 'بستن',
    ar: 'أغلق',
  },
  'start khatm': {
    fa: 'شروع ختم',
    ar: 'بداية ختم القرآن',
  },
  'stop khatm': {
    fa: 'توقف خواندن',
    ar: 'توقف ختم القرآن',
  },
  'this khatm is not started yet': {
    fa: 'زمان شروع این ختم هنوز فرا نرسیده است',
    ar: 'منذ بداية ختم القرآن لم يأت بعد',
  },
  'create khatm': {
    fa: 'ساخت ختم',
    ar: 'خلق ختم القرآن',
  },
  'back': {
    fa: 'بازگشت',
    ar: 'الى الخلف',
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
      momentJalali.loadPersian(true);
      return momentJalali(date).format('jYYYY-jMMMM-jD');
    }
    else if(this._lang === 'ar'){
      var hijri = require('./date-convertor');
      return hijri.convertToHijri(date);
    }

    return moment(date).format('YYYY-MMM-DD');
  }
}
