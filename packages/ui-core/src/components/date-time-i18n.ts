export type DateTimeTranslationKey =
  | 'calendarLabel'
  | 'today'
  | 'clear'
  | 'apply'
  | 'cancel'
  | 'now'
  | 'previousMonth'
  | 'nextMonth'
  | 'chooseMonthYear'
  | 'previousYear'
  | 'nextYear'
  | 'syncingSchedule'
  | 'unableToSyncEvents'
  | 'scheduleSynced'
  | 'event'
  | 'selectDate'
  | 'selectDateRange'
  | 'startDate'
  | 'endDate'
  | 'startEnd'
  | 'toggleCalendar'
  | 'clearDate'
  | 'clearDateRange'
  | 'invalidDate'
  | 'dateOutOfRange'
  | 'invalidRange'
  | 'invalidTime'
  | 'invalidDateTime'
  | 'invalidRangeOrder'
  | 'rangeIncomplete'
  | 'last7Days'
  | 'thisMonth'
  | 'hour'
  | 'minute'
  | 'second'
  | 'meridiem'
  | 'am'
  | 'pm'
  | 'startTime'
  | 'endTime'
  | 'datePickerPanel'
  | 'timePlaceholder'
  | 'timePlaceholderSeconds'
  | 'dateTimePlaceholder'
  | 'dateRangeTimePlaceholder';

export type DateTimeTranslationMap = Record<DateTimeTranslationKey, string>;

type SupportedDateTimeLang = 'en' | 'zh' | 'fr';

const EN_TRANSLATIONS: DateTimeTranslationMap = {
  calendarLabel: 'Calendar',
  today: 'Today',
  clear: 'Clear',
  apply: 'Apply',
  cancel: 'Cancel',
  now: 'Now',
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  chooseMonthYear: 'Choose month and year',
  previousYear: 'Previous year',
  nextYear: 'Next year',
  syncingSchedule: 'Syncing schedule...',
  unableToSyncEvents: 'Unable to sync events',
  scheduleSynced: 'Schedule synced',
  event: 'Event',
  selectDate: 'Select date',
  selectDateRange: 'Select date range',
  startDate: 'Start date',
  endDate: 'End date',
  startEnd: 'Start — End',
  toggleCalendar: 'Toggle calendar',
  clearDate: 'Clear date',
  clearDateRange: 'Clear date range',
  invalidDate: 'Invalid date',
  dateOutOfRange: 'Date is outside the allowed range',
  invalidRange: 'Invalid range',
  invalidTime: 'Invalid time',
  invalidDateTime: 'Invalid date-time',
  invalidRangeOrder: 'Invalid range order',
  rangeIncomplete: 'Range is incomplete',
  last7Days: 'Last 7 days',
  thisMonth: 'This month',
  hour: 'Hour',
  minute: 'Minute',
  second: 'Second',
  meridiem: 'Meridiem',
  am: 'AM',
  pm: 'PM',
  startTime: 'Start time',
  endTime: 'End time',
  datePickerPanel: 'Date picker panel',
  timePlaceholder: 'HH:mm',
  timePlaceholderSeconds: 'HH:mm:ss',
  dateTimePlaceholder: 'YYYY-MM-DD HH:mm',
  dateRangeTimePlaceholder: 'Start — End'
};

const ZH_TRANSLATIONS: DateTimeTranslationMap = {
  calendarLabel: '日历',
  today: '今天',
  clear: '清除',
  apply: '应用',
  cancel: '取消',
  now: '现在',
  previousMonth: '上个月',
  nextMonth: '下个月',
  chooseMonthYear: '选择月份和年份',
  previousYear: '上一年',
  nextYear: '下一年',
  syncingSchedule: '正在同步日程...',
  unableToSyncEvents: '无法同步事件',
  scheduleSynced: '日程已同步',
  event: '事件',
  selectDate: '选择日期',
  selectDateRange: '选择日期范围',
  startDate: '开始日期',
  endDate: '结束日期',
  startEnd: '开始 — 结束',
  toggleCalendar: '切换日历',
  clearDate: '清除日期',
  clearDateRange: '清除日期范围',
  invalidDate: '日期无效',
  dateOutOfRange: '日期超出允许范围',
  invalidRange: '范围无效',
  invalidTime: '时间无效',
  invalidDateTime: '日期时间无效',
  invalidRangeOrder: '范围顺序无效',
  rangeIncomplete: '范围不完整',
  last7Days: '最近7天',
  thisMonth: '本月',
  hour: '小时',
  minute: '分钟',
  second: '秒',
  meridiem: '上午/下午',
  am: '上午',
  pm: '下午',
  startTime: '开始时间',
  endTime: '结束时间',
  datePickerPanel: '日期选择面板',
  timePlaceholder: 'HH:mm',
  timePlaceholderSeconds: 'HH:mm:ss',
  dateTimePlaceholder: 'YYYY-MM-DD HH:mm',
  dateRangeTimePlaceholder: '开始 — 结束'
};

const FR_TRANSLATIONS: DateTimeTranslationMap = {
  calendarLabel: 'Calendrier',
  today: "Aujourd'hui",
  clear: 'Effacer',
  apply: 'Appliquer',
  cancel: 'Annuler',
  now: 'Maintenant',
  previousMonth: 'Mois precedent',
  nextMonth: 'Mois suivant',
  chooseMonthYear: 'Choisir le mois et l annee',
  previousYear: 'Annee precedente',
  nextYear: 'Annee suivante',
  syncingSchedule: 'Synchronisation du planning...',
  unableToSyncEvents: 'Impossible de synchroniser les evenements',
  scheduleSynced: 'Planning synchronise',
  event: 'Evenement',
  selectDate: 'Selectionner une date',
  selectDateRange: 'Selectionner une periode',
  startDate: 'Date de debut',
  endDate: 'Date de fin',
  startEnd: 'Debut — Fin',
  toggleCalendar: 'Afficher le calendrier',
  clearDate: 'Effacer la date',
  clearDateRange: 'Effacer la periode',
  invalidDate: 'Date invalide',
  dateOutOfRange: 'La date est hors de la plage autorisee',
  invalidRange: 'Periode invalide',
  invalidTime: 'Heure invalide',
  invalidDateTime: 'Date/heure invalide',
  invalidRangeOrder: 'Ordre de periode invalide',
  rangeIncomplete: 'Periode incomplete',
  last7Days: '7 derniers jours',
  thisMonth: 'Ce mois-ci',
  hour: 'Heure',
  minute: 'Minute',
  second: 'Seconde',
  meridiem: 'AM/PM',
  am: 'AM',
  pm: 'PM',
  startTime: 'Heure de debut',
  endTime: 'Heure de fin',
  datePickerPanel: 'Panneau de selection de date',
  timePlaceholder: 'HH:mm',
  timePlaceholderSeconds: 'HH:mm:ss',
  dateTimePlaceholder: 'YYYY-MM-DD HH:mm',
  dateRangeTimePlaceholder: 'Debut — Fin'
};

const DEFAULT_TRANSLATIONS_BY_LANG: Record<SupportedDateTimeLang, DateTimeTranslationMap> = {
  en: EN_TRANSLATIONS,
  zh: ZH_TRANSLATIONS,
  fr: FR_TRANSLATIONS
};

const RESOLVED_TRANSLATION_CACHE = new Map<string, DateTimeTranslationMap>();

function normalizeLangToken(raw: string): string {
  return raw.trim().toLowerCase().replace(/_/g, '-');
}

function resolveSupportedLang(localeAttr: string | null): SupportedDateTimeLang {
  const preferredRaw = localeAttr || (typeof navigator !== 'undefined' && navigator.language ? navigator.language : 'en');
  const preferred = normalizeLangToken(preferredRaw || '');

  if (
    preferred === 'zh' ||
    preferred.startsWith('zh-') ||
    preferred === 'cn' ||
    preferred === 'chinese' ||
    preferred === 'zh-cn' ||
    preferred === 'zh-hans' ||
    preferred === 'zh-hant'
  ) {
    return 'zh';
  }

  if (preferred === 'fr' || preferred.startsWith('fr-') || preferred === 'french') {
    return 'fr';
  }

  return 'en';
}

function sanitizeObject(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const out: Record<string, string> = {};
  Object.entries(value as Record<string, unknown>).forEach(([key, entry]) => {
    if (typeof entry === 'string') out[key] = entry;
  });
  return out;
}

function parseTranslationOverrides(raw: string | null, lang: SupportedDateTimeLang): Record<string, string> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const direct = sanitizeObject(parsed);
    const langScoped = sanitizeObject((parsed as Record<string, unknown>)[lang]);
    return { ...direct, ...langScoped };
  } catch {
    return {};
  }
}

export function resolveDateTimeTranslations(
  localeAttr: string | null,
  translationsAttr: string | null
): DateTimeTranslationMap {
  const lang = resolveSupportedLang(localeAttr);
  const cacheKey = `${lang}::${translationsAttr || ''}`;
  const cached = RESOLVED_TRANSLATION_CACHE.get(cacheKey);
  if (cached) return cached;

  const defaults = DEFAULT_TRANSLATIONS_BY_LANG[lang];
  const overrides = parseTranslationOverrides(translationsAttr, lang);
  const resolved = { ...defaults, ...overrides };
  RESOLVED_TRANSLATION_CACHE.set(cacheKey, resolved);
  return resolved;
}
