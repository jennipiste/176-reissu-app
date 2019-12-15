import { Destination, Packing, Category, Todo } from "./interfaces";

export const START_TIME = '2019-12-07T14:00:00.000+02:00';
export const END_TIME = '2019-01-13T05:25:00.000+02:00';

export const destinations: Destination[] = [{
    name: 'Helsinki',
    startTime: '2019-12-25T14:00:00.000+02:00',
    endTime: '2019-12-26T07:54:59.999+07:00',
    position: {
        x: 100,
        y: 200,
    },
}, {
    name: 'Ho Chi Minh City',
    startTime: '2019-12-26T07:55:00.000+07:00',
    endTime: '2019-12-29T16:34:59.999+07:00',
    position: {
        x: 300,
        y: 500,
    },
}, {
    name: 'Phu Quoc',
    startTime: '2019-12-29T16:35:00.000+07:00',
    endTime: '2020-01-03T20:49:59.999+07:00',
    position: {
        x: 110,
        y: 950,
    },
}, {
    name: 'Hoi An',
    startTime: '2020-01-03T20:50:00.000+07:00',
    endTime: '2020-01-07T08:19:59.999+07:00',
    position: {
        x: 320,
        y: 1300,
    },
}, {
    name: 'Halong Bay',
    startTime: '2020-01-07T08:20:00.000+07:00',
    endTime: '2020-01-08T13:59:59.999+07:00', // TODO: fix time
    position: {
        x: 200,
        y: 1670,
    },
}, {
    name: 'Hanoi',
    startTime: '2020-01-08T14:00:00.000+07:00', // TODO: fix time
    endTime: '2020-01-13T05:25:00.000+02:00',
    position: {
        x: 80,
        y: 2180,
    },
}];

export const packings: Packing[] = [{
    id: 1,
    name: 'Passi',
    category: Category.important,
    completed: false,
}, {
    id: 2,
    name: 'Lentoliput',
    category: Category.important,
    completed: false,
}, {
    id: 3,
    name: 'Pankki- ja luottokortti',
    category: Category.important,
    completed: false,
}, {
    id: 4,
    name: 'Matkavakuutus',
    category: Category.important,
    completed: false,
}, {
    id: 5,
    name: 'Matkapuhelin ja laturi',
    category: Category.important,
    completed: false,
}, {
    id: 6,
    name: 'Reppu, matkalaukku',
    category: Category.important,
    completed: false,
}, {
    id: 7,
    name: 'Viisumiasiakirjat',
    category: Category.important,
    completed: false,
}, {
    id: 8,
    name: 'Vietnamin valuuttaa',
    category: Category.important,
    completed: false,
}, {
    id: 9,
    name: 'Kävelykengät',
    category: Category.clothes,
    completed: false,
}, {
    id: 10,
    name: 'Takki',
    category: Category.clothes,
    completed: false,
}, {
    id: 11,
    name: 'Farkut tai muut housut',
    category: Category.clothes,
    completed: false,
}, {
    id: 12,
    name: 'Hame ja/tai mekko',
    category: Category.clothes,
    completed: false,
}, {
    id: 13,
    name: 'Pitkähihaisia paitoja',
    category: Category.clothes,
    completed: false,
}, {
    id: 14,
    name: 'T-paitoja ja toppeja',
    category: Category.clothes,
    completed: false,
}, {
    id: 15,
    name: 'Alusvaatteet',
    category: Category.clothes,
    completed: false,
}, {
    id: 16,
    name: 'Pyjama',
    category: Category.clothes,
    completed: false,
}, {
    id: 17,
    name: 'Sadetakki tai sateenvarjo',
    category: Category.clothes,
    completed: false,
}, {
    id: 18,
    name: 'Sukat',
    category: Category.clothes,
    completed: false,
}, {
    id: 19,
    name: 'Shortsit',
    category: Category.clothes,
    completed: false,
}, {
    id: 20,
    name: 'Uima-asu',
    category: Category.clothes,
    completed: false,
}, {
    id: 21,
    name: 'Sandaalit',
    category: Category.clothes,
    completed: false,
}, {
    id: 22,
    name: 'Lippis/Aurinkohattu',
    category: Category.accessories,
    completed: false,
}, {
    id: 23,
    name: 'Aurinkolasit',
    category: Category.accessories,
    completed: false,
}, {
    id: 24,
    name: 'Korut',
    category: Category.accessories,
    completed: false,
}, {
    id: 25,
    name: 'Rannekello',
    category: Category.accessories,
    completed: false,
}, {
    id: 26,
    name: 'Käsidesi',
    category: Category.hygiene,
    completed: false,
}, {
    id: 27,
    name: 'Hiusharja',
    category: Category.hygiene,
    completed: false,
}, {
    id: 28,
    name: 'Vanupuikkoja',
    category: Category.hygiene,
    completed: false,
}, {
    id: 29,
    name: 'Vanulappuja',
    category: Category.hygiene,
    completed: false,
}, {
    id: 30,
    name: 'Hammaslanka',
    category: Category.hygiene,
    completed: false,
}, {
    id: 31,
    name: 'Deodorantti',
    category: Category.hygiene,
    completed: false,
}, {
    id: 32,
    name: 'Kondomit tai ehkäisypillerit',
    category: Category.hygiene,
    completed: false,
}, {
    id: 33,
    name: 'Silmälasit tai piilolinssit puhdistustarvikkeineen',
    category: Category.hygiene,
    completed: false,
}, {
    id: 34,
    name: 'Hajuvesi',
    category: Category.hygiene,
    completed: false,
}, {
    id: 35,
    name: 'Silmälaput',
    category: Category.hygiene,
    completed: false,
}, {
    id: 36,
    name: 'Korvatulpat',
    category: Category.hygiene,
    completed: false,
}, {
    id: 37,
    name: 'Hiusten muotoilutuotteet',
    category: Category.hygiene,
    completed: false,
}, {
    id: 38,
    name: 'Huulivoide',
    category: Category.hygiene,
    completed: false,
}, {
    id: 39,
    name: 'Meikkitarvikkeet',
    category: Category.hygiene,
    completed: false,
}, {
    id: 40,
    name: 'Meikinpoistoaineet',
    category: Category.hygiene,
    completed: false,
}, {
    id: 41,
    name: 'Kosteusvoiteet kasvoille ja vartalolle',
    category: Category.hygiene,
    completed: false,
}, {
    id: 42,
    name: 'Parranajokone tai shaver',
    category: Category.hygiene,
    completed: false,
}, {
    id: 43,
    name: 'Suihkusaippua',
    category: Category.hygiene,
    completed: false,
}, {
    id: 44,
    name: 'Shampoo ja hoitoaine',
    category: Category.hygiene,
    completed: false,
}, {
    id: 45,
    name: 'Aurinkorasva',
    category: Category.hygiene,
    completed: false,
}, {
    id: 46,
    name: 'Afterburner',
    category: Category.hygiene,
    completed: false,
}, {
    id: 47,
    name: 'Kuukautissuojat',
    category: Category.hygiene,
    completed: false,
}, {
    id: 48,
    name: 'Hammasharja ja -tahna',
    category: Category.hygiene,
    completed: false,
}, {
    id: 49,
    name: 'Kosteuspyyhkeet',
    category: Category.hygiene,
    completed: false,
}, {
    id: 50,
    name: 'Kosteuspyyhkeet',
    category: Category.firstaid,
    completed: false,
}, {
    id: 51,
    name: 'Maitohappobakteerit',
    category: Category.firstaid,
    completed: false,
}, {
    id: 52,
    name: 'Reseptilääkkeet',
    category: Category.firstaid,
    completed: false,
}, {
    id: 53,
    name: 'Matkapahoinvointilääkkeet',
    category: Category.firstaid,
    completed: false,
}, {
    id: 54,
    name: 'Särkylääkkeet',
    category: Category.firstaid,
    completed: false,
}, {
    id: 55,
    name: 'Ripulilääkkeet',
    category: Category.firstaid,
    completed: false,
}, {
    id: 56,
    name: 'Pienet sakset',
    category: Category.firstaid,
    completed: false,
}, {
    id: 57,
    name: 'Pinsetit',
    category: Category.firstaid,
    completed: false,
}, {
    id: 58,
    name: 'Todistus saaduista rokotuksista',
    category: Category.firstaid,
    completed: false,
}, {
    id: 59,
    name: 'Kartat, myös offline',
    category: Category.phone,
    completed: false,
}, {
    id: 60,
    name: 'Valokuvat matka-asiakirjoista ja muista tärkeistä papereista',
    category: Category.phone,
    completed: false,
}, {
    id: 61,
    name: 'Taskulamppu',
    category: Category.phone,
    completed: false,
}, {
    id: 62,
    name: 'Herätyskello',
    category: Category.phone,
    completed: false,
}, {
    id: 63,
    name: 'Askelmittari',
    category: Category.phone,
    completed: false,
}, {
    id: 64,
    name: 'Whatsapp',
    category: Category.phone,
    completed: false,
}, {
    id: 65,
    name: 'Sääsovellus',
    category: Category.phone,
    completed: false,
}, {
    id: 66,
    name: 'Musiikkisovellus',
    category: Category.phone,
    completed: false,
}, {
    id: 67,
    name: 'Elokuvat, sarjat ja (ääni)kirjat',
    category: Category.phone,
    completed: false,
}, {
    id: 68,
    name: 'Pelit',
    category: Category.phone,
    completed: false,
}, {
    id: 69,
    name: 'Uber tai kohteen taksipalvelu',
    category: Category.phone,
    completed: false,
}, {
    id: 71,
    name: 'Purukumia',
    category: Category.other,
    completed: false,
}, {
    id: 72,
    name: 'Puhallettava matkatyyny',
    category: Category.other,
    completed: false,
}, {
    id: 73,
    name: 'Adapteri',
    category: Category.other,
    completed: false,
}, {
    id: 74,
    name: 'Pyyhe',
    category: Category.other,
    completed: false,
}, {
    id: 75,
    name: 'Matka-akku',
    category: Category.other,
    completed: false,
}, {
    id: 76,
    name: 'Pyykinpesuaine',
    category: Category.other,
    completed: false,
}];

export const todos: Todo[] = [{
    id: 1,
    name: 'Saavu Vietnamiin',
    completed: false,
}, {
    id: 2,
    name: 'Makaa rannalla',
    completed: false,
}, {
    id: 25,
    name: 'Aja mopolla',
    completed: false,
}, {
    id: 13,
    name: 'Ammu ilotulitteita',
    completed: false,
}, {
    id: 4,
    name: 'Patikoi',
    completed: false,
}, {
    id: 5,
    name: 'Käy casinolla',
    completed: false,
}, {
    id: 6,
    name: 'Biletä',
    completed: false,
}, {
    id: 7,
    name: 'Juo paikallista olutta',
    completed: false,
}, {
    id: 8,
    name: 'Syö katukeittiössä',
    completed: false,
}, {
    id: 9,
    name: 'Käy museossa',
    completed: false,
}, {
    id: 10,
    name: 'Osta riisihattu',
    completed: false,
}, {
    id: 11,
    name: 'Käytä riisihattua',
    completed: false,
}, {
    id: 12,
    name: 'Tee jotain autenttista',
    completed: false,
}, {
    id: 3,
    name: 'Käy veneretkellä',
    completed: false,
}, {
    id: 14,
    name: 'Käy saarella',
    completed: false,
}, {
    id: 15,
    name: 'Innostu kulttuurista',
    completed: false,
}, {
    id: 16,
    name: 'Opi Vietnamin historiasta',
    completed: false,
}, {
    id: 17,
    name: 'Syö koiraa',
    completed: false,
}, {
    id: 18,
    name: 'Surffaa',
    completed: false,
}, {
    id: 19,
    name: 'Sukella',
    completed: false,
}, {
    id: 20,
    name: 'Ota kuva apinasta',
    completed: false,
}, {
    id: 21,
    name: 'Puhu vietnamia',
    completed: false,
}, {
    id: 22,
    name: 'Kysy avioliittoneuvoja vanhalta parilta',
    completed: false,
}, {
    id: 23,
    name: 'Käytä afterburneria',
    completed: false,
}, {
    id: 24,
    name: 'Selviä ripulista',
    completed: false,
}, {
    id: 26,
    name: 'Tingi taksin hinnasta',
    completed: false,
}, {
    id: 27,
    name: 'Osta tuliaiset Hanoin lentokentältä',
    completed: false,
}, {
    id: 28,
    name: 'Rentoudu',
    completed: false,
}, {
    id: 29,
    name: 'Käy hieronnassa',
    completed: false,
}, {
    id: 30,
    name: 'Silitä koiraa',
    completed: false,
}, {
    id: 31,
    name: 'Ota kuva auringonnoususta',
    completed: false,
}, {
    id: 32,
    name: 'Ota kuva auringonlaskusta',
    completed: false,
}, {
    id: 33,
    name: 'Kirjoita postaus',
    completed: false,
}, {
    id: 34,
    name: 'Käy temppelissä',
    completed: false,
}, {
    id: 35,
    name: 'Istu iltanuotiolla',
    completed: false,
}, {
    id: 36,
    name: 'Eksy',
    completed: false,
}, {
    id: 37,
    name: 'Naura niin että mahaan sattuu',
    completed: false,
}, {
    id: 38,
    name: 'Juokse mereen uimaan',
    completed: false,
}, {
    id: 39,
    name: 'Tee ruokaa',
    completed: false,
}, {
    id: 40,
    name: 'Palaa Suomeen',
    completed: false,
}];
