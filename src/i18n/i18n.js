import i18n from "i18n-js";
import * as RNLocalize from "react-native-localize";
import memoize from "lodash.memoize";
import { I18nManager, Platform } from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector, useDispatch} from 'react-redux';
export const getLanguage = () => {
  return [
    {
      label: "简",
      value: "cn"
    },
    {
      label: "繁",
      value: "hk"
    },
    {
      label: "EN",
      value: "en"
    },
    {
      label: "日文",
      value: "jp"
    }
  ];
};

export const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  zh_tw: () => require("./zh_tw.json"),
  en: () => require("./en.json"),
  zh_cn: () => require("./zh_cn.json"),
  ja_jp: () => require("./ja_jp.json")

};

export const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
);

export const t = translate; // translate short-form

export const getAvailableLanguage = languageTag => {
  let { isRTL } = translationGetters[languageTag]();
  return { languageTag, isRTL };
};

export const setI18nConfig = async () => {
  // fallback if no available language fits
  const fallback = { languageTag: 'en', isRTL: false };
  const { languageTag, isRTL } =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback;
    
  const {language} = useSelector(state => state.settingReducer);

  // const storedLanguageTag = await getStorage('languageTag');
  if (language){
    setLocale(language);
  }else 
    setLocale(languageTag);
}

export const setLocale = languageTag => {
  // console.log(languageTag);
  const { isRTL } = getAvailableLanguage(languageTag);
  //clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);
  // set i18n-js config
  i18n.locale = languageTag;
  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  // setStorage("languageTag", languageTag);
};
