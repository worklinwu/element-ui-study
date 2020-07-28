<script>
const ORIGINAL_THEME = '#409EFF';
import { get as ajaxGet } from './ajax.js';
import { updateDomHeadStyle } from '../utils.js';

export default {
  data() {
    return {
      docs: '', // content of docs css
      theme: ORIGINAL_THEME,
      asyncCb: true
    };
  },
  methods: {
    updateDocStyle(e, cb) {
      const val = e.global['$--color-primary'] || ORIGINAL_THEME; // 获取主色
      const oldVal = this.theme; // 当前主题名称
      const getHandler = (variable, id) => {
        return () => {
          let newStyle = this.updateStyle(this[variable], ORIGINAL_THEME, val);
          updateDomHeadStyle(id, newStyle);
          this.asyncCb && cb();
        };
      };
      const docsHandler = getHandler('docs', 'docs-style'); // 更新的方法
      // 检查 link 标签
      if (!this.docs) { // 如果样式文件内容还没有获取到
        const links = [].filter.call(document.querySelectorAll('link'), link => {
          return /docs\..+\.css/.test(link.href || ''); // 检查是否包含有 'docs' 关键字, 例如 <link href="docs.84b973e.css" rel="stylesheet">
        });
        if (links[0]) { // 只获取匹配的第一个样式文件
          this.getCSSString(links[0].href, docsHandler, 'docs'); // 获取样式内容并更新样式
        } else {
          this.asyncCb = false;
        }
      } else {
        docsHandler(); // 更新样式
      }
      // 检查 style 标签
      // 过滤得到内容包含有主题关键字的 style 标签对象
      const styles = [].slice.call(document.querySelectorAll('style'))
        .filter(style => {
          const text = style.innerText;
          return new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text);
        });
      // 更新样式
      styles.forEach(style => {
        const { innerText } = style;
        if (typeof innerText !== 'string') return;
        style.innerText = this.updateStyle(innerText, oldVal, val);
      });
      // 更换主题名称
      this.theme = val;
      // 执行回调
      !this.asyncCb && cb();
    },
    // 用正则替换颜色的关键字
    updateStyle(style, oldColor, newColor) {
      return style.replace(new RegExp(oldColor, 'ig'), newColor);
    },
    // 获取 css 内容
    getCSSString(url, callback, variable) {
      ajaxGet(url).then((res) => {
        this[variable] = res;
        callback();
      });
    }
  }
};
</script>
