import {
  ELEMENT_THEME_PREVIEW_CONFIG,
  ELEMENT_THEME_USER_CONFIG
} from './constant';

export const saveToLocal = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const loadFromLocal = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const savePreviewToLocal = (value) => {
  saveToLocal(ELEMENT_THEME_PREVIEW_CONFIG, value);
};

export const loadPreviewFromLocal = () => {
  return loadFromLocal(ELEMENT_THEME_PREVIEW_CONFIG) || {};
  // 大概长这样子
  // {
  //   "type": "user",
  //   "name": "Element-1",
  //   "theme": "{\"global\":{\"$--color-primary\":\"#409EFF\"},\"local\":{\"$--alert-title-font-size\":\"12px\"}}"
  // }
};

export const removePreviewFromLocal = () => {
  return localStorage.removeItem(ELEMENT_THEME_PREVIEW_CONFIG);
};

export const saveUserThemeToLocal = (value) => {
  saveToLocal(ELEMENT_THEME_USER_CONFIG, value);
};

export const loadUserThemeFromLocal = () => {
  return loadFromLocal(ELEMENT_THEME_USER_CONFIG);
  // 大概长这样子
  // [{
  //  "update":1595819930562,
  //  "name":"Element-1",
  //  "theme":"{\"global\":{\"$--color-primary\":\"#409EFF\"},\"local\":{\"$--button-small-font-size\":\"11px\"}}"
  // }]
};

