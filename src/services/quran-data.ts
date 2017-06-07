
// Quran Metadata (ver 1.0)
// Copyright (C) 2008-2009 Tanzil.info
// License: Creative Commons Attribution 3.0
export class QuranReference{
  public sura:number;
  public aya:number;
  public substrIndex:number;
  constructor(obj:any={sura:0,aya:0}){
    this.sura = obj.sura;
    this.aya  = obj.aya;
  }
}
export enum TanzilLocation{
  Meccan,
  Medinan,
}
export class Sura{
  public tanzilOrder:number;
  public order : number;
  public rukus:number;
  public name:string;
  public englishName:string;
  public tanzilLocation:TanzilLocation;
  public ayas : number;

  init(input,ind){
    this.tanzilOrder=input[2];
    this.rukus=input[3];
    this.name=input[4];
    this.englishName=input[5];
    this.tanzilLocation=input[7];
    this.order = ind+1;
    this.ayas = input[1];
  }
}


export class QuranSection{
  public start:QuranReference;
  public end:QuranReference;
}

export class QuranTelavat{
  public bitrate:string;
  public name:string;
  public subfolder:string;
  public quality:string;

  constructor(initObj:any={}){
    ['bitrate','name','subfolder'].forEach(el=>this[el]=initObj[el]?initObj[el]:'');
    this.qualityNamer();
  }

  qualityNamer(){
  let q = parseInt(this.bitrate);
  if(q<32)
    this.quality = "Telephone";
  else if(q<64)
    this.quality = "AM Radio";
  else if(q<128)
    this.quality = "FM Radio";
  else this.quality = "CD"
}
}

export class QuranSections extends Array<QuranReference>{

}

export class QuranSajda{
  loc:QuranReference;
  vajeb:boolean;
}

export class QuranData{
  suras:Sura[];
  juz:QuranSections;
  qhizb:QuranSections;
  hizb:QuranSections;
  page:QuranSections;
  halfPage:QuranSections;
  ruku:QuranSections;
  manzil:QuranSections;
  sajda:QuranSajda[];
  tartilInfo:any;
  endJuzPage:number[];
  suraBismillah:number[];
  constructor(){
    this.suras=new Array<Sura>();
    this.qhizb=new QuranSections();
    this.hizb=new QuranSections();
    this.manzil=new QuranSections();
    this.ruku=new QuranSections();
    this.juz=new QuranSections();
    this.page=new QuranSections();
    this.halfPage= new QuranSections();
    this.sajda=new Array<QuranSajda>();
    this.tartilInfo=new Array<QuranTelavat>();
    this.endJuzPage = [21,41,61,81,101,120,141,161,181,200,221,241,261,281,301,321,341,361,381,401,421,441,461,481,501,521,541,561,581,604];
    this.suraBismillah = [81,83,84,85,87,88,89,90,92,94,96,98,100,102,105,108,111,113];
  }
}
var quranData = new QuranData();
//------------------ Sura Data ---------------------
[
	// [start, ayas, order, rukus, name, tname, ename, type]
	[0, 7, 5, 1, 'الفاتحة', "Al-Faatiha", 'The Opening', 'Meccan'],
	[7, 286, 87, 40, 'البقرة', "Al-Baqara", 'The Cow', 'Medinan'],
	[293, 200, 89, 20, 'آل عمران', "Aal-i-Imraan", 'The Family of Imraan', 'Medinan'],
	[493, 176, 92, 24, 'النساء', "An-Nisaa", 'The Women', 'Medinan'],
	[669, 120, 112, 16, 'المائدة', "Al-Maaida", 'The Table', 'Medinan'],
	[789, 165, 55, 20, 'الأنعام', "Al-An'aam", 'The Cattle', 'Meccan'],
	[954, 206, 39, 24, 'الأعراف', "Al-A'raaf", 'The Heights', 'Meccan'],
	[1160, 75, 88, 10, 'الأنفال', "Al-Anfaal", 'The Spoils of War', 'Medinan'],
	[1235, 129, 113, 16, 'التوبة', "At-Tawba", 'The Repentance', 'Medinan'],
	[1364, 109, 51, 11, 'يونس', "Yunus", 'Jonas', 'Meccan'],
	[1473, 123, 52, 10, 'هود', "Hud", 'Hud', 'Meccan'],
	[1596, 111, 53, 12, 'يوسف', "Yusuf", 'Joseph', 'Meccan'],
	[1707, 43, 96, 6, 'الرعد', "Ar-Ra'd", 'The Thunder', 'Medinan'],
	[1750, 52, 72, 7, 'ابراهيم', "Ibrahim", 'Abraham', 'Meccan'],
	[1802, 99, 54, 6, 'الحجر', "Al-Hijr", 'The Rock', 'Meccan'],
	[1901, 128, 70, 16, 'النحل', "An-Nahl", 'The Bee', 'Meccan'],
	[2029, 111, 50, 12, 'الإسراء', "Al-Israa", 'The Night Journey', 'Meccan'],
	[2140, 110, 69, 12, 'الكهف', "Al-Kahf", 'The Cave', 'Meccan'],
	[2250, 98, 44, 6, 'مريم', "Maryam", 'Mary', 'Meccan'],
	[2348, 135, 45, 8, 'طه', "Taa-Haa", 'Taa-Haa', 'Meccan'],
	[2483, 112, 73, 7, 'الأنبياء', "Al-Anbiyaa", 'The Prophets', 'Meccan'],
	[2595, 78, 103, 10, 'الحج', "Al-Hajj", 'The Pilgrimage', 'Medinan'],
	[2673, 118, 74, 6, 'المؤمنون', "Al-Muminoon", 'The Believers', 'Meccan'],
	[2791, 64, 102, 9, 'النور', "An-Noor", 'The Light', 'Medinan'],
	[2855, 77, 42, 6, 'الفرقان', "Al-Furqaan", 'The Criterion', 'Meccan'],
	[2932, 227, 47, 11, 'الشعراء', "Ash-Shu'araa", 'The Poets', 'Meccan'],
	[3159, 93, 48, 7, 'النمل', "An-Naml", 'The Ant', 'Meccan'],
	[3252, 88, 49, 8, 'القصص', "Al-Qasas", 'The Stories', 'Meccan'],
	[3340, 69, 85, 7, 'العنكبوت', "Al-Ankaboot", 'The Spider', 'Meccan'],
	[3409, 60, 84, 6, 'الروم', "Ar-Room", 'The Romans', 'Meccan'],
	[3469, 34, 57, 3, 'لقمان', "Luqman", 'Luqman', 'Meccan'],
	[3503, 30, 75, 3, 'السجدة', "As-Sajda", 'The Prostration', 'Meccan'],
	[3533, 73, 90, 9, 'الأحزاب', "Al-Ahzaab", 'The Clans', 'Medinan'],
	[3606, 54, 58, 6, 'سبإ', "Saba", 'Sheba', 'Meccan'],
	[3660, 45, 43, 5, 'فاطر', "Faatir", 'The Originator', 'Meccan'],
	[3705, 83, 41, 5, 'يس', "Yaseen", 'Yaseen', 'Meccan'],
	[3788, 182, 56, 5, 'الصافات', "As-Saaffaat", 'Those drawn up in Ranks', 'Meccan'],
	[3970, 88, 38, 5, 'ص', "Saad", 'The letter Saad', 'Meccan'],
	[4058, 75, 59, 8, 'الزمر', "Az-Zumar", 'The Groups', 'Meccan'],
	[4133, 85, 60, 9, 'غافر', "Al-Ghaafir", 'The Forgiver', 'Meccan'],
	[4218, 54, 61, 6, 'فصلت', "Fussilat", 'Explained in detail', 'Meccan'],
	[4272, 53, 62, 5, 'الشورى', "Ash-Shura", 'Consultation', 'Meccan'],
	[4325, 89, 63, 7, 'الزخرف', "Az-Zukhruf", 'Ornaments of gold', 'Meccan'],
	[4414, 59, 64, 3, 'الدخان', "Ad-Dukhaan", 'The Smoke', 'Meccan'],
	[4473, 37, 65, 4, 'الجاثية', "Al-Jaathiya", 'Crouching', 'Meccan'],
	[4510, 35, 66, 4, 'الأحقاف', "Al-Ahqaf", 'The Dunes', 'Meccan'],
	[4545, 38, 95, 4, 'محمد', "Muhammad", 'Muhammad', 'Medinan'],
	[4583, 29, 111, 4, 'الفتح', "Al-Fath", 'The Victory', 'Medinan'],
	[4612, 18, 106, 2, 'الحجرات', "Al-Hujuraat", 'The Inner Apartments', 'Medinan'],
	[4630, 45, 34, 3, 'ق', "Qaaf", 'The letter Qaaf', 'Meccan'],
	[4675, 60, 67, 3, 'الذاريات', "Adh-Dhaariyat", 'The Winnowing Winds', 'Meccan'],
	[4735, 49, 76, 2, 'الطور', "At-Tur", 'The Mount', 'Meccan'],
	[4784, 62, 23, 3, 'النجم', "An-Najm", 'The Star', 'Meccan'],
	[4846, 55, 37, 3, 'القمر', "Al-Qamar", 'The Moon', 'Meccan'],
	[4901, 78, 97, 3, 'الرحمن', "Ar-Rahmaan", 'The Beneficent', 'Medinan'],
	[4979, 96, 46, 3, 'الواقعة', "Al-Waaqia", 'The Inevitable', 'Meccan'],
	[5075, 29, 94, 4, 'الحديد', "Al-Hadid", 'The Iron', 'Medinan'],
	[5104, 22, 105, 3, 'المجادلة', "Al-Mujaadila", 'The Pleading Woman', 'Medinan'],
	[5126, 24, 101, 3, 'الحشر', "Al-Hashr", 'The Exile', 'Medinan'],
	[5150, 13, 91, 2, 'الممتحنة', "Al-Mumtahana", 'She that is to be examined', 'Medinan'],
	[5163, 14, 109, 2, 'الصف', "As-Saff", 'The Ranks', 'Medinan'],
	[5177, 11, 110, 2, 'الجمعة', "Al-Jumu'a", 'Friday', 'Medinan'],
	[5188, 11, 104, 2, 'المنافقون', "Al-Munaafiqoon", 'The Hypocrites', 'Medinan'],
	[5199, 18, 108, 2, 'التغابن', "At-Taghaabun", 'Mutual Disillusion', 'Medinan'],
	[5217, 12, 99, 2, 'الطلاق', "At-Talaaq", 'Divorce', 'Medinan'],
	[5229, 12, 107, 2, 'التحريم', "At-Tahrim", 'The Prohibition', 'Medinan'],
	[5241, 30, 77, 2, 'الملك', "Al-Mulk", 'The Sovereignty', 'Meccan'],
	[5271, 52, 2, 2, 'القلم', "Al-Qalam", 'The Pen', 'Meccan'],
	[5323, 52, 78, 2, 'الحاقة', "Al-Haaqqa", 'The Reality', 'Meccan'],
	[5375, 44, 79, 2, 'المعارج', "Al-Ma'aarij", 'The Ascending Stairways', 'Meccan'],
	[5419, 28, 71, 2, 'نوح', "Nooh", 'Noah', 'Meccan'],
	[5447, 28, 40, 2, 'الجن', "Al-Jinn", 'The Jinn', 'Meccan'],
	[5475, 20, 3, 2, 'المزمل', "Al-Muzzammil", 'The Enshrouded One', 'Meccan'],
	[5495, 56, 4, 2, 'المدثر', "Al-Muddaththir", 'The Cloaked One', 'Meccan'],
	[5551, 40, 31, 2, 'القيامة', "Al-Qiyaama", 'The Resurrection', 'Meccan'],
	[5591, 31, 98, 2, 'الانسان', "Al-Insaan", 'Man', 'Medinan'],
	[5622, 50, 33, 2, 'المرسلات', "Al-Mursalaat", 'The Emissaries', 'Meccan'],
	[5672, 40, 80, 2, 'النبإ', "An-Naba", 'The Announcement', 'Meccan'],
	[5712, 46, 81, 2, 'النازعات', "An-Naazi'aat", 'Those who drag forth', 'Meccan'],
	[5758, 42, 24, 1, 'عبس', "Abasa", 'He frowned', 'Meccan'],
	[5800, 29, 7, 1, 'التكوير', "At-Takwir", 'The Overthrowing', 'Meccan'],
	[5829, 19, 82, 1, 'الإنفطار', "Al-Infitaar", 'The Cleaving', 'Meccan'],
	[5848, 36, 86, 1, 'المطففين', "Al-Mutaffifin", 'Defrauding', 'Meccan'],
	[5884, 25, 83, 1, 'الإنشقاق', "Al-Inshiqaaq", 'The Splitting Open', 'Meccan'],
	[5909, 22, 27, 1, 'البروج', "Al-Burooj", 'The Constellations', 'Meccan'],
	[5931, 17, 36, 1, 'الطارق', "At-Taariq", 'The Morning Star', 'Meccan'],
	[5948, 19, 8, 1, 'الأعلى', "Al-A'laa", 'The Most High', 'Meccan'],
	[5967, 26, 68, 1, 'الغاشية', "Al-Ghaashiya", 'The Overwhelming', 'Meccan'],
	[5993, 30, 10, 1, 'الفجر', "Al-Fajr", 'The Dawn', 'Meccan'],
	[6023, 20, 35, 1, 'البلد', "Al-Balad", 'The City', 'Meccan'],
	[6043, 15, 26, 1, 'الشمس', "Ash-Shams", 'The Sun', 'Meccan'],
	[6058, 21, 9, 1, 'الليل', "Al-Lail", 'The Night', 'Meccan'],
	[6079, 11, 11, 1, 'الضحى', "Ad-Dhuhaa", 'The Morning Hours', 'Meccan'],
	[6090, 8, 12, 1, 'الشرح', "Ash-Sharh", 'The Consolation', 'Meccan'],
	[6098, 8, 28, 1, 'التين', "At-Tin", 'The Fig', 'Meccan'],
	[6106, 19, 1, 1, 'العلق', "Al-Alaq", 'The Clot', 'Meccan'],
	[6125, 5, 25, 1, 'القدر', "Al-Qadr", 'The Power, Fate', 'Meccan'],
	[6130, 8, 100, 1, 'البينة', "Al-Bayyina", 'The Evidence', 'Medinan'],
	[6138, 8, 93, 1, 'الزلزلة', "Az-Zalzala", 'The Earthquake', 'Medinan'],
	[6146, 11, 14, 1, 'العاديات', "Al-Aadiyaat", 'The Chargers', 'Meccan'],
	[6157, 11, 30, 1, 'القارعة', "Al-Qaari'a", 'The Calamity', 'Meccan'],
	[6168, 8, 16, 1, 'التكاثر', "At-Takaathur", 'Competition', 'Meccan'],
	[6176, 3, 13, 1, 'العصر', "Al-Asr", 'The Declining Day, Epoch', 'Meccan'],
	[6179, 9, 32, 1, 'الهمزة', "Al-Humaza", 'The Traducer', 'Meccan'],
	[6188, 5, 19, 1, 'الفيل', "Al-Fil", 'The Elephant', 'Meccan'],
	[6193, 4, 29, 1, 'قريش', "Quraish", 'Quraysh', 'Meccan'],
	[6197, 7, 17, 1, 'الماعون', "Al-Maa'un", 'Almsgiving', 'Meccan'],
	[6204, 3, 15, 1, 'الكوثر', "Al-Kawthar", 'Abundance', 'Meccan'],
	[6207, 6, 18, 1, 'الكافرون', "Al-Kaafiroon", 'The Disbelievers', 'Meccan'],
	[6213, 3, 114, 1, 'النصر', "An-Nasr", 'Divine Support', 'Medinan'],
	[6216, 5, 6, 1, 'المسد', "Al-Masad", 'The Palm Fibre', 'Meccan'],
	[6221, 4, 22, 1, 'الإخلاص', "Al-Ikhlaas", 'Sincerity', 'Meccan'],
	[6225, 5, 20, 1, 'الفلق', "Al-Falaq", 'The Dawn', 'Meccan'],
	[6230, 6, 21, 1, 'الناس', "An-Naas", 'Mankind', 'Meccan'],
].forEach(function(el,ind){
  var s = new Sura();
  s.init(el,ind);
  quranData.suras.push(s);
});

let tartilInfo:any;
tartilInfo = [
  {
    subfolder: "Abdul_Basit_Murattal_64kbps",
    name: "Abdul Basit Murattal",
    bitrate: "64kbps"
  },
  {
    subfolder: "Abdul_Basit_Murattal_192kbps",
    name: "Abdul Basit Murattal",
    bitrate: "192kbps"
  },
  {
    subfolder: "Abdul_Basit_Mujawwad_128kbps",
    name: "Abdul Basit Mujawwad",
    bitrate: "128kbps"
  },
  {
    subfolder: "Abdullah_Basfar_32kbps",
    name: "Abdullah Basfar",
    bitrate: "32kbps"
  },
  {
    subfolder: "Abdullah_Basfar_64kbps",
    name: "Abdullah Basfar",
    bitrate: "64kbps"
  },
  {
    subfolder: "Abdullah_Basfar_192kbps",
    name: "Abdullah Basfar",
    bitrate: "192kbps"
  },
  {
    subfolder: "Abdurrahmaan_As-Sudais_64kbps",
    name: "Abdurrahmaan As-Sudais",
    bitrate: "64kbps"
  },
  {
    subfolder: "Abdurrahmaan_As-Sudais_192kbps",
    name: "Abdurrahmaan As-Sudais",
    bitrate: "192kbps"
  },
  {
    subfolder: "AbdulSamad_64kbps_QuranExplorer.Com",
    name: "AbdulSamad QuranExplorer.Com",
    bitrate: "64kbps"
  },
  {
    subfolder: "Abu_Bakr_Ash-Shaatree_64kbps",
    name: "Abu Bakr Ash-Shaatree",
    bitrate: "64kbps"
  },
  {
    subfolder: "Abu_Bakr_Ash-Shaatree_128kbps",
    name: "Abu Bakr Ash-Shaatree",
    bitrate: "128kbps"
  },
  {
    subfolder: "Ahmed_ibn_Ali_al-Ajamy_64kbps_QuranExplorer.Com",
    name: "Ahmed ibn Ali al-Ajamy QuranExplorer.Com",
    bitrate: "64kbps"
  },
  {
    subfolder: "Ahmed_ibn_Ali_al-Ajamy_128kbps_ketaballah.net",
    name: "Ahmed ibn Ali al-Ajamy KetabAllah.Net",
    bitrate: "128kbps"
  },
  {
    subfolder: "Alafasy_64kbps",
    name: "Alafasy",
    bitrate: "64kbps"
  },
  {
    subfolder: "Alafasy_128kbps",
    name: "Alafasy",
    bitrate: "128kbps"
  },
  {
    subfolder: "Ghamadi_40kbps",
    name: "Ghamadi",
    bitrate: "40kbps"
  },
  {
    subfolder: "Hani_Rifai_64kbps",
    name: "Hani Rifai",
    bitrate: "64kbps"
  },
  {
    subfolder: "Hani_Rifai_192kbps",
    name: "Hani Rifai",
    bitrate: "192kbps"
  },
  {
    subfolder: "Husary_64kbps",
    name: "Husary",
    bitrate: "64kbps"
  },
  {
    subfolder: "Husary_128kbps",
    name: "Husary",
    bitrate: "128kbps"
  },
  {
    subfolder: "Husary_Mujawwad_64kbps",
    name: "Husary Mujawwad",
    bitrate: "64kbps"
  },
  {
    subfolder: "Husary_128kbps_Mujawwad",
    name: "Husary Mujawwad",
    bitrate: "128kbps"
  },
  {
    subfolder: "Hudhaify_32kbps",
    name: "Hudhaify",
    bitrate: "32kbps"
  },
  {
    subfolder: "Hudhaify_64kbps",
    name: "Hudhaify",
    bitrate: "64kbps"
  },
  {
    subfolder: "Hudhaify_128kbps",
    name: "Hudhaify",
    bitrate: "128kbps"
  },
  {
    subfolder: "Ibrahim_Akhdar_32kbps",
    name: "Ibrahim Akhdar",
    bitrate: "32kbps"
  },
  {
    subfolder: "Ibrahim_Akhdar_64kbps",
    name: "Ibrahim Akhdar",
    bitrate: "64kbps"
  },
  {
    subfolder: "Maher_AlMuaiqly_64kbps",
    name: "Maher Al Muaiqly",
    bitrate: "64kbps"
  },
  {
    subfolder: "MaherAlMuaiqly128kbps",
    name: "Maher Al Muaiqly",
    bitrate: "128kbps"
  },
  {
    subfolder: "Menshawi_16kbps",
    name: "Menshawi",
    bitrate: "16kbps"
  },
  {
    subfolder: "Menshawi_32kbps",
    name: "Menshawi",
    bitrate: "32kbps"
  },
  {
    subfolder: "Minshawy_Mujawwad_64kbps",
    name: "Minshawy Mujawwad",
    bitrate: "64kbps"
  },
  {
    subfolder: "Minshawy_Mujawwad_192kbps",
    name: "Minshawy Mujawwad",
    bitrate: "192kbps"
  },
  {
    subfolder: "Minshawy_Murattal_128kbps",
    name: "Minshawy Murattal",
    bitrate: "128kbps"
  },
  {
    subfolder: "Mohammad_al_Tablaway_64kbps",
    name: "Mohammad al Tablaway",
    bitrate: "64kbps"
  },
  {
    subfolder: "Mohammad_al_Tablaway_128kbps",
    name: "Mohammad al Tablaway",
    bitrate: "128kbps"
  },
  {
    subfolder: "Muhammad_Ayyoub_128kbps",
    name: "Muhammad Ayyoub",
    bitrate: "128kbps"
  },
  {
    subfolder: "Muhammad_Ayyoub_64kbps",
    name: "Muhammad Ayyoub",
    bitrate: "64kbps"
  },
  {
    subfolder: "Muhammad_Ayyoub_32kbps",
    name: "Muhammad Ayyoub",
    bitrate: "32kbps"
  },
  {
    subfolder: "Muhammad_Jibreel_64kbps",
    name: "Muhammad Jibreel",
    bitrate: "64kbps"
  },
  {
    subfolder: "Muhammad_Jibreel_128kbps",
    name: "Muhammad Jibreel",
    bitrate: "128kbps"
  },
  {
    subfolder: "Mustafa_Ismail_48kbps",
    name: "Mustafa Ismail",
    bitrate: "48kbps"
  },
  {
    subfolder: "Saood_ash-Shuraym_64kbps",
    name: "Saood bin Ibraaheem Ash-Shuraym",
    bitrate: "64kbps"
  },
  {
    subfolder: "Saood_ash-Shuraym_128kbps",
    name: "Saood bin Ibraaheem Ash-Shuraym",
    bitrate: "128kbps"
  },
  {
    subfolder: "English/Sahih_Intnl_Ibrahim_Walk_192kbps",
    name: "(English) Translated by Sahih International Recited by Ibrahim Walk",
    bitrate: "192kbps"
  },
  {
    subfolder: "MultiLanguage/Basfar_Walk_192kbps",
    name: "MultiLanguage/Basfar Walk",
    bitrate: "192kbps"
  },
  {
    subfolder: "translations/Makarem_Kabiri_16Kbps",
    name: "(Persian) Translated by Makarem Recited by Kabiri",
    bitrate: "64Kbps"
  },
  {
    subfolder: "translations/Fooladvand_Hedayatfar_40Kbps",
    name: "(Persian) Translated by Fooladvand Recited by Hedayatfar",
    bitrate: "64Kbps"
  },
  {
    subfolder: "Parhizgar_48kbps",
    name: "Parhizgar_64Kbps",
    bitrate: "64Kbps"
  },
  {
    subfolder: "translations/azerbaijani/balayev",
    name: "Balayev",
    bitrate: "64Kbps"
  },
  {
    subfolder: "Salaah_AbdulRahman_Bukhatir_128kbps",
    name: "Salaah AbdulRahman Bukhatir",
    bitrate: "128kbps"
  },
  {
    subfolder: "Muhsin_Al_Qasim_192kbps",
    name: "Muhsin Al Qasim",
    bitrate: "192kbps"
  },
  {
    subfolder: "Abdullaah_3awwaad_Al-Juhaynee_128kbps",
    name: "Abdullaah 3awwaad Al-Juhaynee",
    bitrate: "128kbps"
  },
  {
    subfolder: "Salah_Al_Budair_128kbps",
    name: "Salah Al Budair",
    bitrate: "128kbps"
  },
  {
    subfolder: "Abdullah_Matroud_128kbps",
    name: "Abdullah Matroud",
    bitrate: "128kbps"
  },
  {
    subfolder: "Ahmed_Neana_128kbps",
    name: "Ahmed Neana",
    bitrate: "128kbps"
  },
  {
    subfolder: "Muhammad_AbdulKareem_128kbps",
    name: "Muhammad AbdulKareem",
    bitrate: "128kbps"
  },
  {
    subfolder: "khalefa_al_tunaiji_64kbps",
    name: "Khalefa Al-Tunaiji",
    bitrate: "64kbps"
  },
  {
    subfolder: "mahmoud_ali_al_banna_32kbps",
    name: "Mahmoud Ali Al-Banna",
    bitrate: "32kbps"
  },
  {
    subfolder: "warsh/warsh_ibrahim_aldosary_128kbps",
    name: "(Warsh) Ibrahim Al-Dosary",
    bitrate: "128kbps"
  },
  {
    subfolder: "warsh/warsh_yassin_al_jazaery_64kbps",
    name: "(Warsh) Yassin Al-Jazaery",
    bitrate: "64kbps"
  },
  {
    subfolder: "warsh/warsh_Abdul_Basit_128kbps",
    name: "(Warsh) Abdul Basit",
    bitrate: "128kbps"
  },
  {
    subfolder: "translations/urdu_shamshad_ali_khan_46kbps",
    name: "(Urdu) Shamshad Ali Khan",
    bitrate: "46kbps"
  },
  {
    subfolder: "Karim_Mansoori_40kbps",
    name: "Karim Mansoori (Iran)",
    bitrate: "40kbps"
  },
  {
    subfolder: "Husary_Muallim_128kbps",
    name: "Husary (Muallim)",
    bitrate: "128kbps"
  },
  {
    subfolder: "Khaalid_Abdullaah_al-Qahtaanee_192kbps",
    name: "Khalid Abdullah al-Qahtanee",
    bitrate: "192kbps"
  },
  {
    subfolder: "Yasser_Ad-Dussary_128kbps",
    name: "Yasser_Ad-Dussary",
    bitrate: "128kbps"
  },
  {
    subfolder: "Nasser_Alqatami_128kbps",
    name: "Nasser_Alqatami",
    bitrate: "128kbps"
  },
  {
    subfolder: "Ali_Hajjaj_AlSuesy_128kbps",
    name: "Ali_Hajjaj_AlSuesy",
    bitrate: "128kbps"
  },
  {
    subfolder: "Sahl_Yassin_128kbps",
    name: "Sahl_Yassin",
    bitrate: "128kbps"
  },
  {
    subfolder: "ahmed_ibn_ali_al_ajamy_128kbps",
    name: "Ahmed Ibn Ali Al Ajamy",
    bitrate: "128kbps"
  },
  {
    subfolder: "translations/besim_korkut_ajet_po_ajet",
    name: "Besim Korkut (Bosnian)",
    bitrate: "128kbps"
  },
  {
    subfolder: "aziz_alili_128kbps",
    name: "Aziz Alili",
    bitrate: "128kbps"
  },
  {
    subfolder: "Yaser_Salamah_128kbps",
    name: "Yaser Salamah",
    bitrate: "128kbps"
  },
  {
    subfolder: "Akram_AlAlaqimy_128kbps",
    name: "Akram Al Alaqimy",
    bitrate: "128kbps"
  },
  {
    subfolder: "Ali_Jaber_64kbps",
    name: "Ali Jaber",
    bitrate: "64kbps"
  },
  {
    subfolder: "Fares_Abbad_64kbps",
    name: "Fares Abbad",
    bitrate: "64kbps"
  },
  {
    subfolder: "translations/urdu_farhat_hashmi",
    name: "Farhat Hashmi (Urdu word for word translation)",
    bitrate: "32kbps"
  },
];

tartilInfo.forEach((el)=>{
  var tartil = new QuranTelavat(el);
  quranData.tartilInfo.push(tartil);
});


//------------------ Juz Data ---------------------

[
	// [sura, aya]
	[1, 1], 	[2, 142], 	[2, 253], 	[3, 93], 	[4, 24],
	[4, 148], 	[5, 82], 	[6, 111], 	[7, 88], 	[8, 41],
	[9, 93], 	[11, 6], 	[12, 53], 	[15, 1], 	[17, 1],
	[18, 75], 	[21, 1], 	[23, 1], 	[25, 21], 	[27, 56],
	[29, 46], 	[33, 31], 	[36, 28], 	[39, 32], 	[41, 47],
	[46, 1], 	[51, 31], 	[58, 1], 	[67, 1], 	[78, 1]
].forEach((el,ind)=>{
  var qr = new QuranReference();
  qr.aya=el[1];
  qr.sura=el[0];
  quranData.juz.push(qr);
});

//------------------ Hizb Data ---------------------

[
	// [sura, aya]
	[1, 1], 	[2, 26], 	[2, 44], 	[2, 60],
	[2, 75], 	[2, 92], 	[2, 106], 	[2, 124],
	[2, 142], 	[2, 158], 	[2, 177], 	[2, 189],
	[2, 203], 	[2, 219], 	[2, 233], 	[2, 243],
	[2, 253], 	[2, 263], 	[2, 272], 	[2, 283],
	[3, 15], 	[3, 33], 	[3, 52], 	[3, 75],
	[3, 93], 	[3, 113], 	[3, 133], 	[3, 153],
	[3, 171], 	[3, 186], 	[4, 1], 	[4, 12],
	[4, 24], 	[4, 36], 	[4, 58], 	[4, 74],
	[4, 88], 	[4, 100], 	[4, 114], 	[4, 135],
	[4, 148], 	[4, 163], 	[5, 1], 	[5, 12],
	[5, 27], 	[5, 41], 	[5, 51], 	[5, 67],
	[5, 82], 	[5, 97], 	[5, 109], 	[6, 13],
	[6, 36], 	[6, 59], 	[6, 74], 	[6, 95],
	[6, 111], 	[6, 127], 	[6, 141], 	[6, 151],
	[7, 1], 	[7, 31], 	[7, 47], 	[7, 65],
	[7, 88], 	[7, 117], 	[7, 142], 	[7, 156],
	[7, 171], 	[7, 189], 	[8, 1], 	[8, 22],
	[8, 41], 	[8, 61], 	[9, 1], 	[9, 19],
	[9, 34], 	[9, 46], 	[9, 60], 	[9, 75],
	[9, 93], 	[9, 111], 	[9, 122], 	[10, 11],
	[10, 26], 	[10, 53], 	[10, 71], 	[10, 90],
	[11, 6], 	[11, 24], 	[11, 41], 	[11, 61],
	[11, 84], 	[11, 108], 	[12, 7], 	[12, 30],
	[12, 53], 	[12, 77], 	[12, 101], 	[13, 5],
	[13, 19], 	[13, 35], 	[14, 10], 	[14, 28],
	[15, 1], 	[15, 50], 	[16, 1], 	[16, 30],
	[16, 51], 	[16, 75], 	[16, 90], 	[16, 111],
	[17, 1], 	[17, 23], 	[17, 50], 	[17, 70],
	[17, 99], 	[18, 17], 	[18, 32], 	[18, 51],
	[18, 75], 	[18, 99], 	[19, 22], 	[19, 59],
	[20, 1], 	[20, 55], 	[20, 83], 	[20, 111],
	[21, 1], 	[21, 29], 	[21, 51], 	[21, 83],
	[22, 1], 	[22, 19], 	[22, 38], 	[22, 60],
	[23, 1], 	[23, 36], 	[23, 75], 	[24, 1],
	[24, 21], 	[24, 35], 	[24, 53], 	[25, 1],
	[25, 21], 	[25, 53], 	[26, 1], 	[26, 52],
	[26, 111], 	[26, 181], 	[27, 1], 	[27, 27],
	[27, 56], 	[27, 82], 	[28, 12], 	[28, 29],
	[28, 51], 	[28, 76], 	[29, 1], 	[29, 26],
	[29, 46], 	[30, 1], 	[30, 31], 	[30, 54],
	[31, 22], 	[32, 11], 	[33, 1], 	[33, 18],
	[33, 31], 	[33, 51], 	[33, 60], 	[34, 10],
	[34, 24], 	[34, 46], 	[35, 15], 	[35, 41],
	[36, 28], 	[36, 60], 	[37, 22], 	[37, 83],
	[37, 145], 	[38, 21], 	[38, 52], 	[39, 8],
	[39, 32], 	[39, 53], 	[40, 1], 	[40, 21],
	[40, 41], 	[40, 66], 	[41, 9], 	[41, 25],
	[41, 47], 	[42, 13], 	[42, 27], 	[42, 51],
	[43, 24], 	[43, 57], 	[44, 17], 	[45, 12],
	[46, 1], 	[46, 21], 	[47, 10], 	[47, 33],
	[48, 18], 	[49, 1], 	[49, 14], 	[50, 27],
	[51, 31], 	[52, 24], 	[53, 26], 	[54, 9],
	[55, 1], 	[56, 1], 	[56, 75], 	[57, 16],
	[58, 1], 	[58, 14], 	[59, 11], 	[60, 7],
	[62, 1], 	[63, 4], 	[65, 1], 	[66, 1],
	[67, 1], 	[68, 1], 	[69, 1], 	[70, 19],
	[72, 1], 	[73, 20], 	[75, 1], 	[76, 19],
	[78, 1], 	[80, 1], 	[82, 1], 	[84, 1],
	[87, 1], 	[90, 1], 	[94, 1], 	[100, 9]
].forEach((el,ind)=>{
  var qr = new QuranReference();
  qr.aya=el[1];
  qr.sura=el[0];

  quranData.qhizb.push(qr);
  if(!(ind%4)){
    var h=new QuranReference();
    h.aya=el[1];
    h.sura=el[0];
    quranData.hizb.push(h);
  }
});

//------------------ Manzil Data ---------------------

[
	// [sura, aya]
	[1, 1], 	[5, 1], 	[10, 1], 	[17, 1],
	[26, 1], 	[37, 1], 	[50, 1]
].forEach(el=>{
  var qr = new QuranReference();
  qr.aya=el[1];
  qr.sura=el[0];

  quranData.manzil.push(qr);
});

//------------------ Ruku Data ---------------------
[
	// [sura, aya]
	[1, 1], 	[2, 1], 	[2, 8], 	[2, 21], 	[2, 30],
	[2, 40], 	[2, 47], 	[2, 60], 	[2, 62], 	[2, 72],
	[2, 83], 	[2, 87], 	[2, 97], 	[2, 104], 	[2, 113],
	[2, 122], 	[2, 130], 	[2, 142], 	[2, 148], 	[2, 153],
	[2, 164], 	[2, 168], 	[2, 177], 	[2, 183], 	[2, 189],
	[2, 197], 	[2, 211], 	[2, 217], 	[2, 222], 	[2, 229],
	[2, 232], 	[2, 236], 	[2, 243], 	[2, 249], 	[2, 254],
	[2, 258], 	[2, 261], 	[2, 267], 	[2, 274], 	[2, 282],
	[2, 284], 	[3, 1], 	[3, 10], 	[3, 21], 	[3, 31],
	[3, 42], 	[3, 55], 	[3, 64], 	[3, 72], 	[3, 81],
	[3, 92], 	[3, 102], 	[3, 110], 	[3, 121], 	[3, 130],
	[3, 144], 	[3, 149], 	[3, 156], 	[3, 172], 	[3, 181],
	[3, 190], 	[4, 1], 	[4, 11], 	[4, 15], 	[4, 23],
	[4, 26], 	[4, 34], 	[4, 43], 	[4, 51], 	[4, 60],
	[4, 71], 	[4, 77], 	[4, 88], 	[4, 92], 	[4, 97],
	[4, 101], 	[4, 105], 	[4, 113], 	[4, 116], 	[4, 127],
	[4, 135], 	[4, 142], 	[4, 153], 	[4, 163], 	[4, 172],
	[5, 1], 	[5, 6], 	[5, 12], 	[5, 20], 	[5, 27],
	[5, 35], 	[5, 44], 	[5, 51], 	[5, 57], 	[5, 67],
	[5, 78], 	[5, 87], 	[5, 94], 	[5, 101], 	[5, 109],
	[5, 116], 	[6, 1], 	[6, 11], 	[6, 21], 	[6, 31],
	[6, 42], 	[6, 51], 	[6, 56], 	[6, 61], 	[6, 71],
	[6, 83], 	[6, 91], 	[6, 95], 	[6, 101], 	[6, 111],
	[6, 122], 	[6, 130], 	[6, 141], 	[6, 145], 	[6, 151],
	[6, 155], 	[7, 1], 	[7, 11], 	[7, 26], 	[7, 32],
	[7, 40], 	[7, 48], 	[7, 54], 	[7, 59], 	[7, 65],
	[7, 73], 	[7, 85], 	[7, 94], 	[7, 100], 	[7, 109],
	[7, 127], 	[7, 130], 	[7, 142], 	[7, 148], 	[7, 152],
	[7, 158], 	[7, 163], 	[7, 172], 	[7, 182], 	[7, 189],
	[8, 1], 	[8, 11], 	[8, 20], 	[8, 29], 	[8, 38],
	[8, 45], 	[8, 49], 	[8, 59], 	[8, 65], 	[8, 70],
	[9, 1], 	[9, 7], 	[9, 17], 	[9, 25], 	[9, 30],
	[9, 38], 	[9, 43], 	[9, 60], 	[9, 67], 	[9, 73],
	[9, 81], 	[9, 90], 	[9, 100], 	[9, 111], 	[9, 119],
	[9, 123], 	[10, 1], 	[10, 11], 	[10, 21], 	[10, 31],
	[10, 41], 	[10, 54], 	[10, 61], 	[10, 71], 	[10, 83],
	[10, 93], 	[10, 104], 	[11, 1], 	[11, 9], 	[11, 25],
	[11, 36], 	[11, 50], 	[11, 61], 	[11, 69], 	[11, 84],
	[11, 96], 	[11, 110], 	[12, 1], 	[12, 7], 	[12, 21],
	[12, 30], 	[12, 36], 	[12, 43], 	[12, 50], 	[12, 58],
	[12, 69], 	[12, 80], 	[12, 94], 	[12, 105], 	[13, 1],
	[13, 8], 	[13, 19], 	[13, 27], 	[13, 32], 	[13, 38],
	[14, 1], 	[14, 7], 	[14, 13], 	[14, 22], 	[14, 28],
	[14, 35], 	[14, 42], 	[15, 1], 	[15, 16], 	[15, 26],
	[15, 45], 	[15, 61], 	[15, 80], 	[16, 1], 	[16, 10],
	[16, 22], 	[16, 26], 	[16, 35], 	[16, 41], 	[16, 51],
	[16, 61], 	[16, 66], 	[16, 71], 	[16, 77], 	[16, 84],
	[16, 90], 	[16, 101], 	[16, 111], 	[16, 120], 	[17, 1],
	[17, 11], 	[17, 23], 	[17, 31], 	[17, 41], 	[17, 53],
	[17, 61], 	[17, 71], 	[17, 78], 	[17, 85], 	[17, 94],
	[17, 101], 	[18, 1], 	[18, 13], 	[18, 18], 	[18, 23],
	[18, 32], 	[18, 45], 	[18, 50], 	[18, 54], 	[18, 60],
	[18, 71], 	[18, 83], 	[18, 102], 	[19, 1], 	[19, 16],
	[19, 41], 	[19, 51], 	[19, 66], 	[19, 83], 	[20, 1],
	[20, 25], 	[20, 55], 	[20, 77], 	[20, 90], 	[20, 105],
	[20, 116], 	[20, 129], 	[21, 1], 	[21, 11], 	[21, 30],
	[21, 42], 	[21, 51], 	[21, 76], 	[21, 94], 	[22, 1],
	[22, 11], 	[22, 23], 	[22, 26], 	[22, 34], 	[22, 39],
	[22, 49], 	[22, 58], 	[22, 65], 	[22, 73], 	[23, 1],
	[23, 23], 	[23, 33], 	[23, 51], 	[23, 78], 	[23, 93],
	[24, 1], 	[24, 11], 	[24, 21], 	[24, 27], 	[24, 35],
	[24, 41], 	[24, 51], 	[24, 58], 	[24, 62], 	[25, 1],
	[25, 10], 	[25, 21], 	[25, 35], 	[25, 45], 	[25, 61],
	[26, 1], 	[26, 10], 	[26, 34], 	[26, 53], 	[26, 70],
	[26, 105], 	[26, 123], 	[26, 141], 	[26, 160], 	[26, 176],
	[26, 192], 	[27, 1], 	[27, 15], 	[27, 32], 	[27, 45],
	[27, 59], 	[27, 67], 	[27, 83], 	[28, 1], 	[28, 14],
	[28, 22], 	[28, 29], 	[28, 43], 	[28, 51], 	[28, 61],
	[28, 76], 	[29, 1], 	[29, 14], 	[29, 23], 	[29, 31],
	[29, 45], 	[29, 52], 	[29, 64], 	[30, 1], 	[30, 11],
	[30, 20], 	[30, 28], 	[30, 41], 	[30, 54], 	[31, 1],
	[31, 12], 	[31, 20], 	[32, 1], 	[32, 12], 	[32, 23],
	[33, 1], 	[33, 9], 	[33, 21], 	[33, 28], 	[33, 35],
	[33, 41], 	[33, 53], 	[33, 59], 	[33, 69], 	[34, 1],
	[34, 10], 	[34, 22], 	[34, 31], 	[34, 37], 	[34, 46],
	[35, 1], 	[35, 8], 	[35, 15], 	[35, 27], 	[35, 38],
	[36, 1], 	[36, 13], 	[36, 33], 	[36, 51], 	[36, 68],
	[37, 1], 	[37, 22], 	[37, 75], 	[37, 114], 	[37, 139],
	[38, 1], 	[38, 15], 	[38, 27], 	[38, 41], 	[38, 65],
	[39, 1], 	[39, 10], 	[39, 22], 	[39, 32], 	[39, 42],
	[39, 53], 	[39, 64], 	[39, 71], 	[40, 1], 	[40, 10],
	[40, 21], 	[40, 28], 	[40, 38], 	[40, 51], 	[40, 61],
	[40, 69], 	[40, 79], 	[41, 1], 	[41, 9], 	[41, 19],
	[41, 26], 	[41, 33], 	[41, 45], 	[42, 1], 	[42, 10],
	[42, 20], 	[42, 30], 	[42, 44], 	[43, 1], 	[43, 16],
	[43, 26], 	[43, 36], 	[43, 46], 	[43, 57], 	[43, 68],
	[44, 1], 	[44, 30], 	[44, 43], 	[45, 1], 	[45, 12],
	[45, 22], 	[45, 27], 	[46, 1], 	[46, 11], 	[46, 21],
	[46, 27], 	[47, 1], 	[47, 12], 	[47, 20], 	[47, 29],
	[48, 1], 	[48, 11], 	[48, 18], 	[48, 27], 	[49, 1],
	[49, 11], 	[50, 1], 	[50, 16], 	[50, 30], 	[51, 1],
	[51, 24], 	[51, 47], 	[52, 1], 	[52, 29], 	[53, 1],
	[53, 26], 	[53, 33], 	[54, 1], 	[54, 23], 	[54, 41],
	[55, 1], 	[55, 26], 	[55, 46], 	[56, 1], 	[56, 39],
	[56, 75], 	[57, 1], 	[57, 11], 	[57, 20], 	[57, 26],
	[58, 1], 	[58, 7], 	[58, 14], 	[59, 1], 	[59, 11],
	[59, 18], 	[60, 1], 	[60, 7], 	[61, 1], 	[61, 10],
	[62, 1], 	[62, 9], 	[63, 1], 	[63, 9], 	[64, 1],
	[64, 11], 	[65, 1], 	[65, 8], 	[66, 1], 	[66, 8],
	[67, 1], 	[67, 15], 	[68, 1], 	[68, 34], 	[69, 1],
	[69, 38], 	[70, 1], 	[70, 36], 	[71, 1], 	[71, 21],
	[72, 1], 	[72, 20], 	[73, 1], 	[73, 20], 	[74, 1],
	[74, 32], 	[75, 1], 	[75, 31], 	[76, 1], 	[76, 23],
	[77, 1], 	[77, 41], 	[78, 1], 	[78, 31], 	[79, 1],
	[79, 27], 	[80, 1], 	[81, 1], 	[82, 1], 	[83, 1],
	[84, 1], 	[85, 1], 	[86, 1], 	[87, 1], 	[88, 1],
	[89, 1], 	[90, 1], 	[91, 1], 	[92, 1], 	[93, 1],
	[94, 1], 	[95, 1], 	[96, 1], 	[97, 1], 	[98, 1],
	[99, 1], 	[100, 1], 	[101, 1], 	[102, 1], 	[103, 1],
	[104, 1], 	[105, 1], 	[106, 1], 	[107, 1], 	[108, 1],
	[109, 1], 	[110, 1], 	[111, 1], 	[112, 1], 	[113, 1],
	[114, 1]
].forEach(el=>{
  var qr = new QuranReference();
  qr.aya=el[1];
  qr.sura=el[0];
  quranData.ruku.push(qr);
});


//------------------ Page Data ---------------------

[
	// [sura, aya]
	[1, 1], 	[2, 1], 	[2, 6], 	[2, 17], 	[2, 25],
	[2, 30], 	[2, 38], 	[2, 49], 	[2, 58], 	[2, 62],
	[2, 70], 	[2, 77], 	[2, 84], 	[2, 89], 	[2, 94],
	[2, 102], 	[2, 106], 	[2, 113], 	[2, 120], 	[2, 127],
	[2, 135], 	[2, 142], 	[2, 146], 	[2, 154], 	[2, 164],
	[2, 170], 	[2, 177], 	[2, 182], 	[2, 187], 	[2, 191],
	[2, 197], 	[2, 203], 	[2, 211], 	[2, 216], 	[2, 220],
	[2, 225], 	[2, 231], 	[2, 234], 	[2, 238], 	[2, 246],
	[2, 249], 	[2, 253], 	[2, 257], 	[2, 260], 	[2, 265],
	[2, 270], 	[2, 275], 	[2, 282], 	[2, 283], 	[3, 1],
	[3, 10], 	[3, 16], 	[3, 23], 	[3, 30], 	[3, 38],
	[3, 46], 	[3, 53], 	[3, 62], 	[3, 71], 	[3, 78],
	[3, 84], 	[3, 92], 	[3, 101], 	[3, 109], 	[3, 116],
	[3, 122], 	[3, 133], 	[3, 141], 	[3, 149], 	[3, 154],
	[3, 158], 	[3, 166], 	[3, 174], 	[3, 181], 	[3, 187],
	[3, 195], 	[4, 1], 	[4, 7], 	[4, 12], 	[4, 15],
	[4, 20], 	[4, 24], 	[4, 27], 	[4, 34], 	[4, 38],
	[4, 45], 	[4, 52], 	[4, 60], 	[4, 66], 	[4, 75],
	[4, 80], 	[4, 87], 	[4, 92], 	[4, 95], 	[4, 102],
	[4, 106], 	[4, 114], 	[4, 122], 	[4, 128], 	[4, 135],
	[4, 141], 	[4, 148], 	[4, 155], 	[4, 163], 	[4, 171],
	[4, 176], 	[5, 3], 	[5, 6], 	[5, 10], 	[5, 14],
	[5, 18], 	[5, 24], 	[5, 32], 	[5, 37], 	[5, 42],
	[5, 46], 	[5, 51], 	[5, 58], 	[5, 65], 	[5, 71],
	[5, 77], 	[5, 83], 	[5, 90], 	[5, 96], 	[5, 104],
	[5, 109], 	[5, 114], 	[6, 1], 	[6, 9], 	[6, 19],
	[6, 28], 	[6, 36], 	[6, 45], 	[6, 53], 	[6, 60],
	[6, 69], 	[6, 74], 	[6, 82], 	[6, 91], 	[6, 95],
	[6, 102], 	[6, 111], 	[6, 119], 	[6, 125], 	[6, 132],
	[6, 138], 	[6, 143], 	[6, 147], 	[6, 152], 	[6, 158],
	[7, 1], 	[7, 12], 	[7, 23], 	[7, 31], 	[7, 38],
	[7, 44], 	[7, 52], 	[7, 58], 	[7, 68], 	[7, 74],
	[7, 82], 	[7, 88], 	[7, 96], 	[7, 105], 	[7, 121],
	[7, 131], 	[7, 138], 	[7, 144], 	[7, 150], 	[7, 156],
	[7, 160], 	[7, 164], 	[7, 171], 	[7, 179], 	[7, 188],
	[7, 196], 	[8, 1], 	[8, 9], 	[8, 17], 	[8, 26],
	[8, 34], 	[8, 41], 	[8, 46], 	[8, 53], 	[8, 62],
	[8, 70], 	[9, 1], 	[9, 7], 	[9, 14], 	[9, 21],
	[9, 27], 	[9, 32], 	[9, 37], 	[9, 41], 	[9, 48],
	[9, 55], 	[9, 62], 	[9, 69], 	[9, 73], 	[9, 80],
	[9, 87], 	[9, 94], 	[9, 100], 	[9, 107], 	[9, 112],
	[9, 118], 	[9, 123], 	[10, 1], 	[10, 7], 	[10, 15],
	[10, 21], 	[10, 26], 	[10, 34], 	[10, 43], 	[10, 54],
	[10, 62], 	[10, 71], 	[10, 79], 	[10, 89], 	[10, 98],
	[10, 107], 	[11, 6], 	[11, 13], 	[11, 20], 	[11, 29],
	[11, 38], 	[11, 46], 	[11, 54], 	[11, 63], 	[11, 72],
	[11, 82], 	[11, 89], 	[11, 98], 	[11, 109], 	[11, 118],
	[12, 5], 	[12, 15], 	[12, 23], 	[12, 31], 	[12, 38],
	[12, 44], 	[12, 53], 	[12, 64], 	[12, 70], 	[12, 79],
	[12, 87], 	[12, 96], 	[12, 104], 	[13, 1], 	[13, 6],
	[13, 14], 	[13, 19], 	[13, 29], 	[13, 35], 	[13, 43],
	[14, 6], 	[14, 11], 	[14, 19], 	[14, 25], 	[14, 34],
	[14, 43], 	[15, 1], 	[15, 16], 	[15, 32], 	[15, 52],
	[15, 71], 	[15, 91], 	[16, 7], 	[16, 15], 	[16, 27],
	[16, 35], 	[16, 43], 	[16, 55], 	[16, 65], 	[16, 73],
	[16, 80], 	[16, 88], 	[16, 94], 	[16, 103], 	[16, 111],
	[16, 119], 	[17, 1], 	[17, 8], 	[17, 18], 	[17, 28],
	[17, 39], 	[17, 50], 	[17, 59], 	[17, 67], 	[17, 76],
	[17, 87], 	[17, 97], 	[17, 105], 	[18, 5], 	[18, 16],
	[18, 21], 	[18, 28], 	[18, 35], 	[18, 46], 	[18, 54],
	[18, 62], 	[18, 75], 	[18, 84], 	[18, 98], 	[19, 1],
	[19, 12], 	[19, 26], 	[19, 39], 	[19, 52], 	[19, 65],
	[19, 77], 	[19, 96], 	[20, 13], 	[20, 38], 	[20, 52],
	[20, 65], 	[20, 77], 	[20, 88], 	[20, 99], 	[20, 114],
	[20, 126], 	[21, 1], 	[21, 11], 	[21, 25], 	[21, 36],
	[21, 45], 	[21, 58], 	[21, 73], 	[21, 82], 	[21, 91],
	[21, 102], 	[22, 1], 	[22, 6], 	[22, 16], 	[22, 24],
	[22, 31], 	[22, 39], 	[22, 47], 	[22, 56], 	[22, 65],
	[22, 73], 	[23, 1], 	[23, 18], 	[23, 28], 	[23, 43],
	[23, 60], 	[23, 75], 	[23, 90], 	[23, 105], 	[24, 1],
	[24, 11], 	[24, 21], 	[24, 28], 	[24, 32], 	[24, 37],
	[24, 44], 	[24, 54], 	[24, 59], 	[24, 62], 	[25, 3],
	[25, 12], 	[25, 21], 	[25, 33], 	[25, 44], 	[25, 56],
	[25, 68], 	[26, 1], 	[26, 20], 	[26, 40], 	[26, 61],
	[26, 84], 	[26, 112], 	[26, 137], 	[26, 160], 	[26, 184],
	[26, 207], 	[27, 1], 	[27, 14], 	[27, 23], 	[27, 36],
	[27, 45], 	[27, 56], 	[27, 64], 	[27, 77], 	[27, 89],
	[28, 6], 	[28, 14], 	[28, 22], 	[28, 29], 	[28, 36],
	[28, 44], 	[28, 51], 	[28, 60], 	[28, 71], 	[28, 78],
	[28, 85], 	[29, 7], 	[29, 15], 	[29, 24], 	[29, 31],
	[29, 39], 	[29, 46], 	[29, 53], 	[29, 64], 	[30, 6],
	[30, 16], 	[30, 25], 	[30, 33], 	[30, 42], 	[30, 51],
	[31, 1], 	[31, 12], 	[31, 20], 	[31, 29], 	[32, 1],
	[32, 12], 	[32, 21], 	[33, 1], 	[33, 7], 	[33, 16],
	[33, 23], 	[33, 31], 	[33, 36], 	[33, 44], 	[33, 51],
	[33, 55], 	[33, 63], 	[34, 1], 	[34, 8], 	[34, 15],
	[34, 23], 	[34, 32], 	[34, 40], 	[34, 49], 	[35, 4],
	[35, 12], 	[35, 19], 	[35, 31], 	[35, 39], 	[35, 45],
	[36, 13], 	[36, 28], 	[36, 41], 	[36, 55], 	[36, 71],
	[37, 1], 	[37, 25], 	[37, 52], 	[37, 77], 	[37, 103],
	[37, 127], 	[37, 154], 	[38, 1], 	[38, 17], 	[38, 27],
	[38, 43], 	[38, 62], 	[38, 84], 	[39, 6], 	[39, 11],
	[39, 22], 	[39, 32], 	[39, 41], 	[39, 48], 	[39, 57],
	[39, 68], 	[39, 75], 	[40, 8], 	[40, 17], 	[40, 26],
	[40, 34], 	[40, 41], 	[40, 50], 	[40, 59], 	[40, 67],
	[40, 78], 	[41, 1], 	[41, 12], 	[41, 21], 	[41, 30],
	[41, 39], 	[41, 47], 	[42, 1], 	[42, 11], 	[42, 16],
	[42, 23], 	[42, 32], 	[42, 45], 	[42, 52], 	[43, 11],
	[43, 23], 	[43, 34], 	[43, 48], 	[43, 61], 	[43, 74],
	[44, 1], 	[44, 19], 	[44, 40], 	[45, 1], 	[45, 14],
	[45, 23], 	[45, 33], 	[46, 6], 	[46, 15], 	[46, 21],
	[46, 29], 	[47, 1], 	[47, 12], 	[47, 20], 	[47, 30],
	[48, 1], 	[48, 10], 	[48, 16], 	[48, 24], 	[48, 29],
	[49, 5], 	[49, 12], 	[50, 1], 	[50, 16], 	[50, 36],
	[51, 7], 	[51, 31], 	[51, 52], 	[52, 15], 	[52, 32],
	[53, 1], 	[53, 27], 	[53, 45], 	[54, 7], 	[54, 28],
	[54, 50], 	[55, 17], 	[55, 41], 	[55, 68], 	[56, 17],
	[56, 51], 	[56, 77], 	[57, 4], 	[57, 12], 	[57, 19],
	[57, 25], 	[58, 1], 	[58, 7], 	[58, 12], 	[58, 22],
	[59, 4], 	[59, 10], 	[59, 17], 	[60, 1], 	[60, 6],
	[60, 12], 	[61, 6], 	[62, 1], 	[62, 9], 	[63, 5],
	[64, 1], 	[64, 10], 	[65, 1], 	[65, 6], 	[66, 1],
	[66, 8], 	[67, 1], 	[67, 13], 	[67, 27], 	[68, 16],
	[68, 43], 	[69, 9], 	[69, 35], 	[70, 11], 	[70, 40],
	[71, 11], 	[72, 1], 	[72, 14], 	[73, 1], 	[73, 20],
	[74, 18], 	[74, 48], 	[75, 20], 	[76, 6], 	[76, 26],
	[77, 20], 	[78, 1], 	[78, 31], 	[79, 16], 	[80, 1],
	[81, 1], 	[82, 1], 	[83, 7], 	[83, 35], 	[85, 1],
	[86, 1], 	[87, 16], 	[89, 1], 	[89, 24], 	[91, 1],
	[92, 15], 	[95, 1], 	[97, 1], 	[98, 8], 	[100, 10],
	[103, 1], 	[106, 1], 	[109, 1],[112, 1]
].forEach(el=>{
  var qr = new QuranReference();
  qr.aya=el[1];
  qr.sura=el[0];
  quranData.page.push(qr);
});

[
  [1,1],[2,1],[2,6],[2,10],[2,17],[2,20],[2,25],[2,26],[2,30],[2,33],[2,38],[2,41],[2,49],[2,53],[2,58],[2,60],[2,62],[2,64],[2,70],[2,73],[2,77],[2,80],[2,84],[2,85],[2,89],[2,90],[2,94],[2,96],[2,102],[2,102,209],[2,106],[2,109,130],[2,113],[2,114],[2,120],[2,123],[2,127],[2,130],[2,135],[2,137],[2,142],[2,143],[2,146],[2,149],[2,154],[2,158],[2,164],[2,165],[2,170],[2,173],[2,177],[2,178,116],[2,182],[2,184],[2,187],[2,187,117],[2,191],[2,194],[2,197],[2,198],[2,203],[2,205],[2,211],[2,213,207],[2,216],[2,217,254],[2,220],[2,221],[2,225],[2,228],[2,231],[2,232],[2,234],[2,235],[2,238],[2,240],[2,246],[2,247,245],[2,249],[2,249,85],[2,253],[2,254],[2,257],[2,258],[2,260],[2,261],[2,265],[2,266],[2,270],[2,272],[2,275],[2,276],[2,282],[2,282,1138],[2,283],[2,284],[3,0],[3,6],[3,10],[3,13],[3,16],[3,19],[3,23],[3,26],[3,30],[3,33],[3,38],[3,41],[3,46],[3,49,174],[3,53],[3,56],[3,62],[3,65],[3,71],[3,73],[3,78],[3,79],[3,84],[3,86],[3,92],[3,95],[3,101],[3,103],[3,109],[3,112,81],[3,116],[3,118],[3,122],[3,125],[3,133],[3,135],[3,141],[3,144],[3,149],[3,152,216],[3,154],[3,154,117],[3,158],[3,161],[3,166],[3,168],[3,174],[3,177],[3,181],[3,183],[3,187],[3,190],[3,195],[3,196],[4,0],[4,3],[4,7],[4,10],[4,12],[4,12,113],[4,15],[4,17],[4,20],[4,22],[4,24],[4,25,129],[4,27],[4,30],[4,34],[4,35],[4,38],[4,41],[4,45],[4,47],[4,52],[4,56],[4,60],[4,62],[4,66],[4,69],[4,75],[4,77,152],[4,80],[4,83],[4,87],[4,89],[4,92],[4,92,345],[4,95],[4,97],[4,102],[4,102,135],[4,106],[4,109],[4,114],[4,116],[4,122],[4,124],[4,128],[4,129],[4,135],[4,136],[4,141],[4,142],[4,148],[4,151],[4,155],[4,157],[4,163],[4,165],[4,171],[4,172],[4,176],[5,1],[5,3],[5,4,410],[5,6],[5,6,93],[5,10],[5,12,298],[5,14],[5,15],[5,18],[5,19],[5,24],[5,27],[5,32],[5,33],[5,37],[5,40],[5,42],[5,44,289],[5,46],[5,48,95],[5,51],[5,53],[5,58],[5,61],[5,65],[5,67],[5,71],[5,72],[5,77],[5,79],[5,83],[5,86],[5,90],[5,93],[5,96],[5,98],[5,104],[5,106,194],[5,109],[5,110,134],[5,114],[5,116],[6,0],[6,4],[6,9],[6,12],[6,19],[6,21],[6,28],[6,31],[6,36],[6,39],[6,45],[6,48],[6,53],[6,56],[6,60],[6,63],[6,69],[6,70],[6,74],[6,77],[6,82],[6,85],[6,91],[6,92],[6,95],[6,98],[6,102],[6,106],[6,111],[6,113],[6,119],[6,121],[6,125],[6,128,82],[6,132],[6,135],[6,138],[6,139],[6,143],[6,144],[6,147],[6,149],[6,152],[6,153],[6,158],[6,160],[7,0],[7,5],[7,12],[7,18],[7,23],[7,27,157],[7,31],[7,33],[7,38],[7,40],[7,44],[7,47],[7,52],[7,54],[7,58],[7,61],[7,68],[7,70],[7,74],[7,75],[7,82],[7,85,168],[7,88],[7,89],[7,96],[7,100],[7,105],[7,110],[7,121],[7,126],[7,131],[7,133],[7,138],[7,141],[7,144],[7,146],[7,150],[7,152],[7,156],[7,157,68],[7,160],[7,161,240],[7,164],[7,167],[7,171],[7,173],[7,179],[7,182],[7,188],[7,189],[7,196],[7,201],[8,0],[8,3],[8,9],[8,11],[8,17],[8,20],[8,26],[8,29],[8,34],[8,36],[8,41],[8,42],[8,46],[8,48],[8,53],[8,56],[8,62],[8,65],[8,70],[8,72,191],[9,0],[9,3],[9,7],[9,9],[9,14],[9,17],[9,21],[9,24,168],[9,27],[9,29],[9,32],[9,34],[9,37],[9,38],[9,41],[9,43],[9,48],[9,51],[9,55],[9,58],[9,62],[9,65],[9,69],[9,70],[9,73],[9,74],[9,80],[9,82],[9,87],[9,90],[9,94],[9,95],[9,100],[9,102],[9,107],[9,109],[9,112],[9,114],[9,118],[9,120,209],[9,123],[9,125],[10,0],[10,3],[10,7],[10,10],[10,15],[10,17],[10,21],[10,22],[10,26],[10,28],[10,34],[10,37],[10,43],[10,46],[10,54],[10,57],[10,62],[10,66],[10,71],[10,73],[10,79],[10,83],[10,89],[10,92],[10,98],[10,101],[10,107],[10,109],[11,6],[11,8],[11,13],[11,16],[11,20],[11,23],[11,29],[11,31],[11,38],[11,41],[11,46],[11,48],[11,54],[11,58],[11,63],[11,66],[11,72],[11,77],[11,82],[11,85],[11,89],[11,92],[11,98],[11,102],[11,109],[11,112],[11,118],[11,121],[12,5],[12,8],[12,15],[12,18],[12,23],[12,25],[12,31],[12,33],[12,38],[12,40],[12,44],[12,47],[12,53],[12,57],[12,64],[12,66],[12,70],[12,75],[12,79],[12,81],[12,87],[12,89],[12,96],[12,100,54],[12,104],[12,108],[13,0],[13,3],[13,6],[13,9],[13,14],[13,16],[13,19],[13,23],[13,29],[13,31],[13,35],[13,37],[13,43],[14,2],[14,6],[14,8],[14,11],[14,13],[14,19],[14,22,127],[14,25],[14,28],[14,34],[14,37],[14,43],[14,45],[15,0],[15,6],[15,16],[15,22],[15,32],[15,39],[15,52],[15,59],[15,71],[15,80],[15,91],[15,99],[16,7],[16,10],[16,15],[16,21],[16,27],[16,30],[16,35],[16,36],[16,43],[16,47],[16,55],[16,60],[16,65],[16,68],[16,73],[16,76],[16,80],[16,81],[16,88],[16,90],[16,94],[16,97],[16,103],[16,106],[16,111],[16,114],[16,119],[16,123],[17,0],[17,4],[17,8],[17,12],[17,18],[17,22],[17,28],[17,32],[17,39],[17,44],[17,50],[17,53],[17,59],[17,61],[17,67],[17,70],[17,76],[17,80],[17,87],[17,91],[17,97],[17,99],[17,105],[17,110],[18,5],[18,10],[18,16],[18,18],[18,21],[18,22],[18,28],[18,29],[18,35],[18,39],[18,46],[18,49],[18,54],[18,57,100],[18,62],[18,66],[18,75],[18,79],[18,84],[18,89],[18,98],[18,103],[19,0],[19,6],[19,12],[19,18],[19,26],[19,30],[19,39],[19,44],[19,52],[19,58],[19,65],[19,70],[19,77],[19,83],[19,96],[20,3],[20,13],[20,19],[20,38],[20,40],[20,52],[20,57],[20,65],[20,71],[20,77],[20,81],[20,88],[20,92],[20,99],[20,105],[20,114],[20,118],[20,126],[20,130],[21,0],[21,4],[21,11],[21,17],[21,25],[21,29],[21,36],[21,39],[21,45],[21,48],[21,58],[21,64],[21,73],[21,76],[21,82],[21,85],[21,91],[21,95],[21,102],[21,105],[22,0],[22,4],[22,6],[22,10],[22,16],[22,18],[22,24],[22,26],[22,31],[22,34],[22,39],[22,41],[22,47],[22,52],[22,56],[22,59],[22,65],[22,68],[22,73],[22,75],[23,0],[23,8],[23,18],[23,23],[23,28],[23,33],[23,43],[23,48],[23,60],[23,65],[23,75],[23,80],[23,90],[23,95],[23,105],[23,110],[24,0],[24,3],[24,11],[24,14],[24,21],[24,22],[24,28],[24,31,737],[24,32],[24,33],[24,37],[24,40],[24,44],[24,47],[24,54],[24,55],[24,59],[24,61,652],[24,62],[24,63],[25,3],[25,6],[25,12],[25,17],[25,21],[25,25],[25,33],[25,37],[25,44],[25,48],[25,56],[25,60],[25,68],[25,71],[26,0],[26,7],[26,20],[26,27],[26,40],[26,47],[26,61],[26,68],[26,84],[26,95],[26,112],[26,121],[26,137],[26,146],[26,160],[26,169],[26,184],[26,191],[26,207],[26,216],[27,0],[27,7],[27,14],[27,17],[27,23],[27,27],[27,36],[27,40],[27,45],[27,48],[27,56],[27,60],[27,64],[27,68],[27,77],[27,82],[27,89],[27,92],[28,6],[28,9],[28,14],[28,16],[28,22],[28,25],[28,29],[28,31],[28,36],[28,38],[28,44],[28,47],[28,51],[28,55],[28,60],[28,63],[28,71],[28,73],[28,78],[28,80],[28,85],[28,88],[29,7],[29,10],[29,15],[29,18],[29,24],[29,26],[29,31],[29,33],[29,39],[29,41],[29,46],[29,48],[29,53],[29,58],[29,64],[29,67],[30,6],[30,9],[30,16],[30,20],[30,25],[30,28],[30,33],[30,37],[30,42],[30,46],[30,51],[30,54],[31,0],[31,6],[31,12],[31,15],[31,20],[31,22],[31,29],[31,31],[32,0],[32,5],[32,12],[32,15],[32,21],[32,24],[33,0],[33,4],[33,7],[33,10],[33,16],[33,19],[33,23],[33,26],[33,31],[33,33],[33,36],[33,37],[33,44],[33,49],[33,51],[33,52],[33,55],[33,57],[33,63],[33,68],[34,0],[34,3],[34,8],[34,11],[34,15],[34,18],[34,23],[34,26],[34,32],[34,34],[34,40],[34,43],[34,49],[34,54],[35,4],[35,8],[35,12],[35,13],[35,19],[35,25],[35,31],[35,33],[35,39],[35,41],[35,45],[36,6],[36,13],[36,18],[36,28],[36,33],[36,41],[36,47],[36,55],[36,62],[36,71],[36,76],[37,0],[37,10],[37,25],[37,35],[37,52],[37,62],[37,77],[37,89],[37,103],[37,113],[37,127],[37,139],[37,154],[37,165],[38,0],[38,7],[38,17],[38,22],[38,27],[38,31],[38,43],[38,48],[38,62],[38,70],[38,84],[39,2],[39,6],[39,7],[39,11],[39,16],[39,22],[39,24],[39,32],[39,36],[39,41],[39,43],[39,48],[39,51],[39,57],[39,61],[39,68],[39,71,152],[39,75],[40,4],[40,8],[40,11],[40,17],[40,21,168],[40,26],[40,28],[40,34],[40,36],[40,41],[40,44],[40,50],[40,53],[40,59],[40,62],[40,67],[40,70],[40,78],[40,80],[41,0],[41,6],[41,12],[41,15],[41,21],[41,24],[41,30],[41,33],[41,39],[41,42],[41,47],[41,50],[42,0],[42,6],[42,11],[42,13],[42,16],[42,18],[42,23],[42,25],[42,32],[42,37],[42,45],[42,47],[42,52],[43,2],[43,11],[43,15],[43,23],[43,27],[43,34],[43,39],[43,48],[43,52],[43,61],[43,65],[43,74],[43,81],[44,0],[44,8],[44,19],[44,28],[44,40],[44,48],[45,0],[45,6],[45,14],[45,17],[45,23],[45,26],[45,33],[45,37],[46,6],[46,9],[46,15],[46,16],[46,21],[46,24],[46,29],[46,32],[47,0],[47,4],[47,12],[47,15],[47,20],[47,23],[47,30],[47,33],[48,0],[48,5],[48,10],[48,11],[48,16],[48,18],[48,24],[48,25],[48,29],[49,1,83],[49,5],[49,7],[49,12],[49,14],[50,0],[50,6],[50,16],[50,22],[50,36],[50,39],[51,7],[51,18],[51,31],[51,40],[51,52],[51,58],[52,15],[52,21],[52,32],[52,39],[53,0],[53,14],[53,27],[53,31],[53,45],[53,55],[54,7],[54,14],[54,28],[54,36],[54,50],[55,3],[55,17],[55,28],[55,41],[55,51],[55,68],[55,77],[56,17],[56,30],[56,51],[56,61],[56,77],[56,87],[57,4],[57,7],[57,12],[57,14],[57,19],[57,20],[57,25],[57,27,179],[58,0],[58,3],[58,7],[58,8],[58,12],[58,14],[58,22],[59,1,121],[59,4],[59,7,274],[59,10],[59,11],[59,17],[59,20],[60,0],[60,2],[60,6],[60,9],[60,12],[60,13],[61,6],[61,9],[62,0],[62,4],[62,9],[62,11],[63,5],[63,7],[64,0],[64,5],[64,10],[64,13],[65,0],[65,2],[65,6],[65,8],[66,0],[66,3],[66,8],[66,9],[67,0],[67,5],[67,13],[67,19],[67,27],[67,30],[68,16],[68,28],[68,43],[68,49],[69,9],[69,17],[69,35],[69,46],[70,11],[70,24],[70,40],[71,1],[71,11],[71,20],[72,0],[72,6],[72,14],[72,20],[73,0],[73,9],[73,20],[73,20,22],[74,18],[74,31,27],[74,48],[75,1],[75,20],[75,35],[76,6],[76,13],[76,26],[76,31],[77,20],[77,32],[78,0],[78,13],[78,31],[78,39],[79,16],[79,29],[80,0],[80,18],[81,0],[81,13],[82,0],[82,11],[83,7],[83,17],[83,35],[84,8],[85,0],[85,9],[86,0],[86,13],[87,16],[88,8],[89,0],[89,12],[89,24],[90,4],[91,0],[91,13],[92,15],[93,4],[95,0],[96,1],[97,0],[98,1],[98,8],[99,4],[100,10],[101,6],[103,0],[104,3],[106,0],[107,1],[109,0],[110,0]
].forEach(el=>{
  var qr = new QuranReference();
  qr.aya=el[1];
  qr.sura=el[0];
  qr.substrIndex=el[2]?el[2]:NaN;
  quranData.halfPage.push(qr);
});
//------------------ Sajda Data ---------------------

[
	// [sura, aya, type
	[7, 206, 'recommended'],
	[13, 15, 'recommended'],
	[16, 50, 'recommended'],
	[17, 109, 'recommended'],
	[19, 58, 'recommended'],
	[22, 18, 'recommended'],
	[22, 77, 'recommended'],
	[25, 60, 'recommended'],
	[27, 26, 'recommended'],
	[38, 24, 'recommended'],
  [84, 21, 'recommended'],
  [32, 15, 'obligatory'],
	[41, 38, 'obligatory'],
	[53, 62, 'obligatory'],
	[96, 19, 'obligatory']
].forEach(el=>{
  var qr = new QuranReference();
  qr.aya= <number>el[1];
  qr.sura= <number>el[0];
  var sajda = new QuranSajda();
  sajda.loc = qr;
  sajda.vajeb = el[2]==='obligatory';
  quranData.sajda.push(sajda);
});


export const QURAN_DATA:QuranData = quranData;

