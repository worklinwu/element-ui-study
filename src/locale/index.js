import defaultLang from 'element-ui/src/locale/lang/zh-CN';
import Vue from 'vue';
import deepmerge from 'deepmerge';
import Format from './format';

// 格式化的方法
const format = Format(Vue); // 传入的 Vue 目前没有用到
let lang = defaultLang;
let merged = false; // 合并参数使用
let i18nHandler = function() {
  const vuei18n = Object.getPrototypeOf(this || Vue).$t; // $t 兼容第三方的多语言方案, 例如 vue-i18n
  if (typeof vuei18n === 'function' && !!Vue.locale) { // vue-i18n 会提供 Vue.locale 这个方法
    if (!merged) {
      merged = true;
      Vue.locale(
        Vue.config.lang,
        // 合并用户自定义的语言扩展, 用户可以通过 Vue.config.lang 来定义自己的语言
        deepmerge(lang, Vue.locale(Vue.config.lang) || {}, { clone: true })
      );
    }
    return vuei18n.apply(this, arguments);
  }
};

// 原理:
// 把第一个参数到 /src/locale/lang/[lang].js 文件中查找对应的翻译.
// 第二个参数是数据, 只有在第一个参数返回的结果带有 `{xx}` 这样的占位符时才有用, 替换为第二个参数提供的值
// 例如:
// t('el.colorpicker.clear') => '清空'
// t('el.pagination.total', { total: this.$parent.total } => t('共 {total} 条', {total:10}) => '共 10 条'
export const t = function(path, options) {
  let value = i18nHandler.apply(this, arguments);
  if (value !== null && value !== undefined) return value;
  // 没有找到, 就尝试把第一个参数当做路径风格的 key 来处理
  const array = path.split('.');
  let current = lang;

  for (let i = 0, j = array.length; i < j; i++) {
    const property = array[i];
    value = current[property];
    if (i === j - 1) return format(value, options);
    if (!value) return '';
    current = value;
  }
  return '';
};

// 设置当前语言
export const use = function(l) {
  lang = l || lang;
};

// 设置第三方的 i18n 插件
export const i18n = function(fn) {
  i18nHandler = fn || i18nHandler;
};

export default { use, t, i18n };
