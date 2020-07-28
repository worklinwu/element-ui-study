import { once, on } from 'element-ui/src/utils/dom';

// 单击一次连续触发点击事件, 例如 inputNumber 组件, 点住+号不放, 就持续新增
export default {
  bind(el, binding, vnode) {
    let interval = null;
    let startTime;
    const handler = () => vnode.context[binding.expression].apply(); // 取到要执行的函数
    const clear = () => {
      if (Date.now() - startTime < 100) { // 如果按下弹起之间的时间少于 100ms 就当做点击事件, 执行一直 handler
        handler();
      }
      clearInterval(interval);
      interval = null;
    };

    on(el, 'mousedown', (e) => {
      if (e.button !== 0) return;
      startTime = Date.now(); // 记住当前时间
      once(document, 'mouseup', clear); // 鼠标放开就停止
      clearInterval(interval); // 清除旧的定时器
      interval = setInterval(handler, 100); // 100ms 触发一次
    });
  }
};
