import { EnumLanguage } from '@ts/enums/language';

export default function mapLanguage(language: EnumLanguage) {
  switch (language) {
    case EnumLanguage.en_US:
      return 'English (US)';
    case EnumLanguage.cs_CZ:
      return 'Čeština';
    case EnumLanguage.de_DE:
      return 'Deutsch';
    case EnumLanguage.el_GR:
      return 'Ελληνικά';
    case EnumLanguage.en_AU:
      return 'English (Australia)';
    case EnumLanguage.en_GB:
      return 'English (UK)';
    case EnumLanguage.en_PH:
      return 'English (Philippines)';
    case EnumLanguage.en_SG:
      return 'English (Singapore)';
    case EnumLanguage.es_AR:
      return 'Español (Argentina)';
    case EnumLanguage.es_ES:
      return 'Español (España)';
    case EnumLanguage.es_MX:
      return 'Español (México)';
    case EnumLanguage.fr_FR:
      return 'Français';
    case EnumLanguage.hu_HU:
      return 'Magyar';
    case EnumLanguage.it_IT:
      return 'Italiano';
    case EnumLanguage.ja_JP:
      return '日本語';
    case EnumLanguage.ko_KR:
      return '한국어';
    case EnumLanguage.pl_PL:
      return 'Polski';
    case EnumLanguage.pt_BR:
      return 'Português (Brasil)';
    case EnumLanguage.ro_RO:
      return 'Română';
    case EnumLanguage.ru_RU:
      return 'Русский';
    case EnumLanguage.th_TH:
      return 'ไทย';
    case EnumLanguage.tr_TR:
      return 'Türkçe';
    case EnumLanguage.vi_VN:
      return 'Tiếng Việt';
    case EnumLanguage.zh_CN:
      return '简体中文';
    case EnumLanguage.zh_MY:
      return '繁體中文 (台灣)';
    case EnumLanguage.zh_TW:
      return '繁體中文 (香港)';
  }
}
