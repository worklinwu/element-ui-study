import normalizeWheel from 'normalize-wheel'; // normalize-wheel是由facebook针对滚轮事件在不同浏览器在兼容性、滚动距离和滚动速度做的优化代码

const isFirefox = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

// 鼠标滚轮事件, 解决兼容性/行为不一致问题
// 把原来的 `@mousewheel="..."` 改为 `v-mousewheel="..."` 就行
const mousewheel = function(element, callback) {
  if (element && element.addEventListener) {
    element.addEventListener(isFirefox ? 'DOMMouseScroll' : 'mousewheel', function(event) {
      const normalized = normalizeWheel(event);
      callback && callback.apply(this, [event, normalized]);
    });
  }
};

export default {
  bind(el, binding) {
    mousewheel(el, binding.value);
  }
};
