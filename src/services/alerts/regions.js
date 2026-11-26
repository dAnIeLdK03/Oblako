// @ts-check
// Области на България: ISO 3166-2 код (връща го BigDataCloud, напр. "BG-22") -> NUTS3 код,
// по който MeteoAlarm групира предупрежденията (напр. "BG411"), и имена.
// Таблицата е сверена с живия feed на MeteoAlarm (имената по NUTS3) и с BigDataCloud (ISO кодовете).

/** @type {Record<string, { nuts: string, bg: string, en: string }>} */
export const BG_REGIONS = {
  'BG-01': { nuts: 'BG413', bg: 'Благоевград', en: 'Blagoevgrad' },
  'BG-02': { nuts: 'BG341', bg: 'Бургас', en: 'Burgas' },
  'BG-03': { nuts: 'BG331', bg: 'Варна', en: 'Varna' },
  'BG-04': { nuts: 'BG321', bg: 'Велико Търново', en: 'Veliko Tarnovo' },
  'BG-05': { nuts: 'BG311', bg: 'Видин', en: 'Vidin' },
  'BG-06': { nuts: 'BG313', bg: 'Враца', en: 'Vratsa' },
  'BG-07': { nuts: 'BG322', bg: 'Габрово', en: 'Gabrovo' },
  'BG-08': { nuts: 'BG332', bg: 'Добрич', en: 'Dobrich' },
  'BG-09': { nuts: 'BG425', bg: 'Кърджали', en: 'Kardzhali' },
  'BG-10': { nuts: 'BG415', bg: 'Кюстендил', en: 'Kyustendil' },
  'BG-11': { nuts: 'BG315', bg: 'Ловеч', en: 'Lovech' },
  'BG-12': { nuts: 'BG312', bg: 'Монтана', en: 'Montana' },
  'BG-13': { nuts: 'BG423', bg: 'Пазарджик', en: 'Pazardzhik' },
  'BG-14': { nuts: 'BG414', bg: 'Перник', en: 'Pernik' },
  'BG-15': { nuts: 'BG314', bg: 'Плевен', en: 'Pleven' },
  'BG-16': { nuts: 'BG421', bg: 'Пловдив', en: 'Plovdiv' },
  'BG-17': { nuts: 'BG324', bg: 'Разград', en: 'Razgrad' },
  'BG-18': { nuts: 'BG323', bg: 'Русе', en: 'Ruse' },
  'BG-19': { nuts: 'BG325', bg: 'Силистра', en: 'Silistra' },
  'BG-20': { nuts: 'BG342', bg: 'Сливен', en: 'Sliven' },
  'BG-21': { nuts: 'BG424', bg: 'Смолян', en: 'Smolyan' },
  'BG-22': { nuts: 'BG411', bg: 'София град', en: 'Sofia City' },
  'BG-23': { nuts: 'BG412', bg: 'Софийска област', en: 'Sofia Province' },
  'BG-24': { nuts: 'BG344', bg: 'Стара Загора', en: 'Stara Zagora' },
  'BG-25': { nuts: 'BG334', bg: 'Търговище', en: 'Targovishte' },
  'BG-26': { nuts: 'BG422', bg: 'Хасково', en: 'Haskovo' },
  'BG-27': { nuts: 'BG333', bg: 'Шумен', en: 'Shumen' },
  'BG-28': { nuts: 'BG343', bg: 'Ямбол', en: 'Yambol' },
};
