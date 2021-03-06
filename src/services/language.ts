import {Injectable} from "@angular/core";
import {Storage} from "@ionic/storage";
import * as moment from 'moment';
import * as momentJalali from 'jalali-moment';
import {Http} from "@angular/http";

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
    ar: 'بلدي الأختام القرآن',
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
  'whole quran': {
    fa: 'تمام قرآن',
    ar: 'ختم القرآن كله',
  },
  'repeat': {
    fa: 'تکرار',
    ar: 'کرر',
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
    ar: 'صفحات',
  },
  'participants number': {
    fa: 'تعداد شرکت کنندگان',
    ar: 'أرقام المشاركة',
  },
  'remaining days': {
    fa: 'روزهای باقی مانده',
    ar: 'الأيام المتبقية',
  },
  'number of pages you read': {
    fa: 'تعداد صفحات خوانده شده شما',
    ar: 'أرقام الصفحات ما أنت قرأت',
  },
  'copy link': {
    fa: 'کپی کردن لینک',
    ar: 'إنسخ الرابط',
  },
  'share link': {
    fa: 'اشتراک‌گذاری لینک',
    ar: 'شارك الرابط',
  },
  'remainder of your committed pages': {
    fa: 'باقیمانده صفحات تعهد شده شما',
    ar: 'بقیة صفحاتك ملتزمة',
  },
  'close': {
    fa: 'بستن',
    ar: 'أغلق',
  },
  'start khatm': {
    fa: 'شروع ختم',
    ar: 'بدء الختم',
  },
  'stop khatm': {
    fa: 'توقف ختم',
    ar: 'إنهاء الختم',
  },
  'start time for this khatm is in future': {
    fa: 'زمان شروع این ختم هنوز فرا نرسیده است',
    ar: 'لم يأت وقت البداية هذا الختم',
  },
  'create khatm': {
    fa: ' ختم',
    ar: 'انشاء ختم جديد',
  },
  'back': {
    fa: 'بازگشت',
    ar: 'الى الخلف',
  },
  'Please wait until your committed pages are loaded ...':{
    fa:"لطفاّ صبر کنید تا صفحات تهعد شده شما بارگذاری شود...",
    ar:"يرجى الانتظار...",
  },
  "please wait until changes are saved": {
    fa: "لطفا صبر کنید تا تغییرات را اعمال کنیم",
    ar: "يرجى الانتظار حتى يتم حفظ التغييرات",
  },
  "sorry. all pages are committed": {
    fa: "متأسفانه تمام صفحات اختصاص یافته اند",
    ar: "معذرة. جميع الصفحات ملتزمة",
  },
  "the pages are assigned to you":{
    fa: "صفحات به شما اختصاص یافت",
    ar: "يتم تعيين الصفحات لك",
  },
  "The pages were removed from your commitments":{
    fa: "صفحات از تعهد شما برداشته شد",
    ar: "صفحات الحصول على أسفل من الالتزامات الخاصة بك",
  },
  "cannot assign requested pages to you at the moment": {
    fa: "در حال حاضر نمی توانیم صفحات درخواست شده به شما اختصاص دهیم",
    ar: "لا يمكن تعيين الصفحات المطلوبة الآن",
  },
  "the khatm end date is in the past": {
    fa: "تاریخ پایان این ختم گذشته است",
    ar: "يتم تمرير تاريخ نهاية خاتم",
  },
  "cannot get khatm details": {
    fa: "اطلاعات ختم دریافت نشد",
    ar: "لا يمكن الحصول على تفاصيل خاتم",
  },
  "the khatm should have a name": {
    fa: "ختم باید دارای یک عنوان باشد",
    ar: "يجب أن يكون للختم إسم",
  },
  "the end date field cannot be left blank": {
    fa: "بخش تاریخ پایانی نمی تواند خالی باشد",
    ar: "لا يمكن أن يكون حقل وقت الانهاء فارغا",
  },
  "the start date cannot be later than end date": {
    fa: "تاریخ شروع نمی تواند پس از تاریخ پایان باشد",
    ar: "لا يمكن أن يكون وقت البدء یحدث بعد  وقت الانتهاء",
  },
  "please choose sura": {
    fa: "لطفا سوره را انتخاب کنید",
    ar: "الرجاء إختيار سورة",
  },
  "your khatm is created successfully": {
    fa: "ختم با موفقیت ساخته شد",
    ar: "تم إنشاء الختم بنجاح",
  },
  "please wait until your khatms are loaded ...":{
    fa:"لطفاً صبر کنید تا ختم‌های شما بارگذاری شوند...",
    ar:"يرجي الإنتظار حتی تحميل أختامك"
  },
  "cannot save your khatm now. please try again": {
    fa: "ذخیره ختم اکنون ممکن نیست. لطفا بعدا دوباره سعی کنید",
    ar: "لا يمكن حفظ الختم الآن. حاول مرة اخرى",
  },
  'Number of your committed pages is changed. Would you like to save it?':{
    fa:"تعداد صفحات تعهد شده شما تغییر کرده، تمایل دارید آن را ذخیره کنید؟",
    ar:"لقد تغير عدد صفحاتك ملتزمة، هل ترجی حفظه؟"
  },
  "please choose a valid start date": {
    fa: "لطفا تاریخ شروع معتبری انتخاب کنید",
    ar: "الرجاء إختيار وقت للبدء صحيحة",
  },
  "please choose a valid end date": {
    fa: "لطفا تاریخ پایان معتبری انتخاب کنید",
    ar: "الرجاء إختيار وقت للإنهاء صحيحة",
  },
  "the duration cannot be greater than 10 years": {
    fa: "مدت زمان نمی تواند بیش از 10 سال باشد",
    ar: "مدة لا يمكن أن تكون أكبر من 10 عاما",
  },
  "the duration cannot be negative": {
    fa: "مدت زمان نمی تواند مقدار منفی داشته باشد",
    ar: "لا يمكن أن تكون المدة عدد سلبی",
  },
  "the start date cannot be before today": {
    fa: "تاریخ شروع نمی تواند قبل از امروز باشد",
    ar: "لا يمكن أن يكون تاريخ البدء قبل الیوم",
  },
  "the end date cannot be before today": {
    fa: "تاریخ پایان نمی تواند پیش از امروز باشد",
    ar: "لا يمكن أن يكون وقت الانهاء قبل الیوم",
  },
  "manual":{
    fa:"دستی",
    ar:"اليدوي"
  },
  "automatic":{
    fa:"خودکار",
    ar:"التلقائي",
  },
  'in automatic mode the pages will be marked as "read" once you scroll them up':{
    fa:"در حالت خودکار صفحاتی که از آن‌‌ها رد می‌شوید به عنوان صفحات «خوانده شده» علامت می‌خورند.",
    ar:'في الوضع التلقائي سيتم وضع علامة على الصفحات على أنها "مقروء" بمجرد التمرير لهم',
  },
  'in manual mode you should come back to the khatm page and mark the pages as "read" yourself':{
    fa:"در حالت دستی باید خودتان به صفحه ختم برگردید و صفحات خوانده شده را علامت بزنید.",
    ar:'قي الوضع اليدوي يجب أن تعود إلى صفحة الختم و تضع علامة علی الصفحات بأنها"مقروء" نفسك'
  },
  "sign in": {
    fa: "ورود",
    ar: "تسجيل الدخول",
  },
  "not logged in yet": {
    fa: 'هنوز وارد نشدید',
    ar: 'عدم تسجيل الدخول حتى الآن',
  },
  "you must log in to join this khatm": {
    fa: "برای دیدن اطلاعات ختم باید وارد شوید",
    ar: "يجب تسجيل الدخول للانضمام إلى الختم",
  },
  'all': {
    fa: 'همه',
    ar: 'الكل',
  },
  'committed pages': {
    fa: "صفحات تعهد شده",
    ar: "صفحات الملتزمة",
  },
  "confirm committed pages": {
    fa: "تأیید تعهد صفحات",
    ar: "تأكيد الصفحات الملتزمة",
  },
  "changes will be irreversible after exit, are you sure?": {
    fa: 'تغییرات پس از خارج شدن قابل بازگشت نیستند. مطئمن هستید؟',
    ar: 'التغييرات ستكون لا رجعة فيها بعد الخروج. هل أنت متأكد من الخروج؟',
  },
  'yes': {
    fa: 'بله',
    ar: 'نعم',
  },
  'no': {
    fa: 'خیر',
    ar: 'لا',
  },
  'cancel': {
    fa: 'انصراف',
    ar: 'إلغاء',
  },
  "your pages": {
    fa: "صفحات شما",
    ar: "صفحاتك",
  },
  "general specification": {
    fa: "مشخصات کلی",
    ar: "مواصفات عامة",
  },
  "date specification": {
    fa: "مشخصات تاریخ",
    ar: "مواصفات الوقت",
  },
  "edit": {
    fa: "ویرایش",
    ar: "تصحيح",
  },
  "please wait until we send you verification code...": {
    fa: 'لطفاً صبر کنید تا کد تأیید را برایتان ارسال کنیم ...',
    ar: 'الرجاء الانتظار حتى نرسل لك رمز التحقق ...',
  },
  "you cannot join to this khatm unless you commit some pages. do you want to join this khatm?": {
    fa: 'شما تا زمانی که صفحه ای متعهد نشوید نمیتوانید عضو ختم شوید. آیا میخواهید عضو ختم شوید؟',
    ar: 'لا يمكنك الانضمام إلى هذا الختم إلا إذا ارتكبت بعض الصفحات. هل تريد الانضمام إلى هذا الختم؟',
  },
  "do you want to save your changes in committed pages?": {
    fa: 'آیا می‌خواهید تغییرات در صفحات تعهد شده اعمال شود؟',
    ar: 'هل تريد حفظ التغييرات في الصفحات الالملتزمة؟',
  },
  "confirm commit pages": {
    fa: 'تأیید تعهد صفحات',
    ar: 'تأکيد للإلتزام الصفحات',
  },
  "interested to join": {
    fa: 'مایل به عضویت هستم',
    ar: 'أنا مهتم للإنضمام',
  },
  "uninterested to join": {
    fa: 'مایل به عضویت نیستم',
    ar: 'أنا ممانع للإنضمام',
  },
  "page": {
    fa: 'صفحه',
    ar: 'صفحة',
  },
  "marked as": {
    fa: 'علامت زده شد به عنوان',
    ar: 'تم وضع علامة باسم',
  },
  "unread": {
    fa: 'خوانده نشده',
    ar: 'غير مقروء',
  },
  "read": {
    fa: 'خوانده شده',
    ar: 'اقرأ',
  },
  "pages from": {
    fa: 'صفحات از',
    ar: 'صفحات من',
  },
  "to": {
    fa: 'تا',
    ar: 'إلى',
  },
  "all pages marked as read": {
    fa: 'تمام صفحات به عنوان خوانده شده علامت زده شدند',
    ar: 'تم وضع علامة على جميع الصفحات كمقروءة',
  },
  "all pages marked as unread": {
    fa: 'تمام صفحات به عنوان خوانده نشده علامت زده شدند',
    ar: 'تم وضع علامة على جميع الصفحات كغير مقروءة',
  },
  "no khatm is found": {
    fa: 'هیچ ختمی یافت نشد',
    ar: 'لم وُجد ختمٌ',
  },
  "recently seen khatms": {
    fa: 'ختم های اخیراً دیده شده',
    ar: 'شهدت مؤخرا القرآن',
  },
  "(not join)": {
    fa: '(عضو نشده)',
    ar: '(لا الانضمام)',
  },
  "my profile": {
    fa: 'پروفایل من',
    ar: '',
  },
  "my email": {
    fa: 'ایمیل من',
    ar: '',
  },
  "my display name": {
    fa: 'نام نمایشی من',
    ar: '',
  },
  "please wait ...": {
    fa: 'لطفاً صبر کنید ...',
    ar: 'أرجو الإنتظار ...',
  },
  "you are not join to any khatm": {
    fa: 'شما در هیج ختمی عضو نشده اید',
    ar: 'أنت لا تنضم إلى أي القرآن',
  },
  "you are not create any khatm": {
    fa: 'شما هیچ ختمی نساخته اید',
    ar: 'أنت لا تنشئ أي القرآن',
  },
  "i created": {
    fa: 'من ساختم',
    ar: 'صنعت'
  },
  "i joined": {
    fa: 'من عضو شدم',
    ar: 'أنا انضممت',
  },
  "statistical data": {
    fa: 'اطلاعات آماری',
    ar: 'البيانات الإحصائية',
  },
  "all pages": {
    fa: 'تمام صفحات',
    ar: 'كل الصفحات',
  },
  "unread pages": {
    fa: 'صفحات خوانده نشده',
    ar: 'صفحات غير مقروءة',
  },
  "(expired khatms)": {
    fa: 'ختم های منقضی',
    ar: 'انتهت القرآن',
  },
  "cannot get khatm details. maybe this khatm is expired": {
    fa: 'قادر به دریافت اطلاعات ختم نیستیم. شاید این ختم منقضی شده باشد.',
    ar: 'لا يمكن الحصول على تفاصيل القرآن. ربما هذا القرآن منتهية الصلاحية',
  },
  "select your favorite pages": {
    fa: 'صفحات مورد علاقه خود را انتخاب کنید',
    ar: 'حدد الصفحات المفضلة لديك',
  },
  "choose pages": {
    fa: 'انتخاب صفحات',
    ar: 'اختر الصفحات',
  },
  "assigned": {
    fa: 'تعلق گرفته',
    ar: 'تعيين',
  },
  "unassigned": {
    fa: 'پس گرفته',
    ar: 'غير معين',
  },
  "commitments alert": {
    fa: 'هشدار تعهدات',
    ar: '',
  },
  "you have some page to read. cannot disjoint from this khatm": {
    fa: 'شما چند صفحه برای خواندن دارید. قادر به خروج از ختم نیستید.',
    ar: 'لديك بعض الصفحة القرآن. لا يمكن فصلها عن هذا القرآن',
  },
  "ok": {
    fa: 'باشد',
    ar: 'حسنا',
  },
  "disjoint confirmation": {
    fa: 'تأیید خروج از ختم',
    ar: 'تأكيد منفصلة',
  },
  "are you sure to disjoint this khatm?": {
    fa: 'آیا می خواهید از این ختم خارج شوید؟',
    ar: 'هل أنت متأكد من فصل هذا القرآن؟',
  },
  "cannot assign you page": {
    fa: 'قادر نیستیم به انصاب صفحه ',
    ar: 'لا يمكن تعيين صفحتك',
  },
  "choose another page.": {
    fa: 'صفحه ی دیگری انتخاب کنید.',
    ar: 'اختر صفحة أخرى.',
  },
  "cannot assign you below pages:": {
    fa: 'قادر به انتصاب صفحات زیر به شما نیستیم.',
    ar: 'لا يمكن تعيين الصفحات أدناه:',
  },
  "choose another pages.": {
    fa: 'صفحات دیگری انتخاب کنید.',
    ar: 'اختر صفحات أخرى.',
  },
  "cannot select all pages in this mode": {
    fa: 'در این حالت انتخاب همه صفحات ناممکن است',
    ar: 'لا يمكن تحديد جميع الصفحات في هذا الوضع',
  },
  "loading previous page...": {
    fa: 'بارگذاری صفحه قبل...',
    ar: 'تحميل الصفحة السابقة...',
  },
  "loading next page...": {
    fa: 'باگذاری صفحه بعد...',
    ar: 'تحميل الصفحة التالية...',
  },
  "you disjoint from this khatm now": {
    fa: 'شما از عضویت این ختم خارج شدید',
    ar: 'أنت الآن فصل من هذا القرآن',
  },
  "cannot do disjoint you from khatm. please try again": {
    fa: 'قادر به خارج کردن شما از عضویت ختم نیستیم. لطفاً دوباره تلاش کنید',
    ar: 'لا تستطيع أن تفكك من القرآن. حاول مرة اخرى',
  },
  "you join to this khatm now": {
    fa: 'شما عضو این ختم شدید',
    ar: 'أنت تنضم إلى هذا القرآن الآن',
  },
  "cannot join you to this khatm. please try again": {
    fa: 'قادر به عضو کردن شما به ختم نسیتیم. لطفاً دوباره تلاش کنید',
    ar: 'لا يمكن أن ينضم إليكم هذا القرآن. حاول مرة اخرى',
  },
};

const directionRTL = {
  fa: true,
  ar: true,
  ur: true,
};

@Injectable()
export class LanguageService {
  qt: any = {};
  private _lang='en';
  set lang(l) {
    this._lang = l;
    this.storage.set('language', l);
    this.getTranslation(l);
  }

  get lang(){
    return this._lang
  };

  constructor(private storage: Storage, private http : Http){
    this.storage.get('language')
      .then(l => {
        if(!l)
          l = 'en';
        this._lang = l;
        this.getTranslation(l);
      })
      .catch(err=>console.log(err));
  }
  private getTranslation(l) {
    this.http.request(`assets/${l}.trans.json`)
      .map(res => res.json())
      .subscribe(qt => this.qt = qt);
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
      return momentJalali(date).format('jD jMMMM jYYYY');
    }
    else if(this._lang === 'ar'){
      momentJalali.loadPersian(false);
      var hijri = require('./date-convertor');
      return hijri.convertToHijri(date);
    }
    moment.locale('en-GB');
    return moment(date).format('D MMMM YYYY');
  }

  convertDigits(number) {
    if(this.lang === 'en')
      return number;

    let persianNumber = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

    let tempNumber = number.toString().split('');

    for(let i = 0; i < tempNumber.length; i++){
      if(tempNumber[i].charCodeAt(0) >= 48 && tempNumber[i].charCodeAt(0) <= 57)
        tempNumber[i] = persianNumber[parseInt(tempNumber[i])];
    }

    return tempNumber.join('');
  }
}
