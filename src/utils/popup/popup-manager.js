import Vue from 'vue';
import { addClass, removeClass } from 'element-ui/src/utils/dom';

let hasModal = false;
let hasInitZIndex = false;
let zIndex;

// 遮罩层单例模式
const getModal = function() {
  if (Vue.prototype.$isServer) return; // ssr 的情况忽略
  let modalDom = PopupManager.modalDom; // 获取遮罩层
  if (modalDom) {
    hasModal = true;
  } else {
    hasModal = false;
    // 没有就创建一个
    modalDom = document.createElement('div');
    PopupManager.modalDom = modalDom;

    // 遮罩层阻止滚动穿透
    modalDom.addEventListener('touchmove', function(event) {
      event.preventDefault();
      event.stopPropagation();
    });

    // 遮罩层点击关闭
    modalDom.addEventListener('click', function() {
      PopupManager.doOnModalClick && PopupManager.doOnModalClick();
    });
  }

  return modalDom;
};

const instances = {};

// Popup管理
const PopupManager = {
  modalFade: true, // 遮罩动画开关

  getInstance: function(id) {
    return instances[id];
  },

  register: function(id, instance) {
    if (id && instance) {
      instances[id] = instance;
    }
  },

  deregister: function(id) {
    if (id) {
      instances[id] = null;
      delete instances[id];
    }
  },

  // 获取 zindex, 不断累加
  nextZIndex: function() {
    return PopupManager.zIndex++;
  },

  modalStack: [],

  doOnModalClick: function() {
    const topItem = PopupManager.modalStack[PopupManager.modalStack.length - 1]; // 最上层遮罩层框
    if (!topItem) return;

    const instance = PopupManager.getInstance(topItem.id); // 获取实例
    if (instance && instance.closeOnClickModal) { // 有开启点击关闭的熟悉
      instance.close();
    }
  },

  openModal: function(id, zIndex, dom, modalClass, modalFade) {
    if (Vue.prototype.$isServer) return;
    if (!id || zIndex === undefined) return;
    this.modalFade = modalFade;

    const modalStack = this.modalStack;

    // 如果存在该 id 的遮罩层实例, 就退出方法. 不能重复添加
    for (let i = 0, j = modalStack.length; i < j; i++) {
      const item = modalStack[i];
      if (item.id === id) {
        return;
      }
    }

    const modalDom = getModal();

    addClass(modalDom, 'v-modal');
    if (this.modalFade && !hasModal) { // 渐变动画, 如果已经存在遮罩层, 就不执行动画
      addClass(modalDom, 'v-modal-enter');
    }
    // 附加的遮罩层样式
    if (modalClass) {
      let classArr = modalClass.trim().split(/\s+/);
      classArr.forEach(item => addClass(modalDom, item));
    }
    // 动画结束
    setTimeout(() => {
      removeClass(modalDom, 'v-modal-enter');
    }, 200);

    // 把遮罩层添加到文档中.
    // 判断是否在 body 层添加
    if (dom && dom.parentNode && dom.parentNode.nodeType !== 11) {
      dom.parentNode.appendChild(modalDom);
    } else {
      document.body.appendChild(modalDom);
    }

    // 更新 zIndex
    if (zIndex) {
      modalDom.style.zIndex = zIndex;
    }
    modalDom.tabIndex = 0;
    modalDom.style.display = '';

    // 压入遮罩层框的栈中
    this.modalStack.push({ id: id, zIndex: zIndex, modalClass: modalClass });
  },

  closeModal: function(id) {
    const modalStack = this.modalStack;
    const modalDom = getModal();

    if (modalStack.length > 0) {
      const topItem = modalStack[modalStack.length - 1];
      if (topItem.id === id) { // 如果是最上层的遮罩层
        if (topItem.modalClass) { // 删除样式
          let classArr = topItem.modalClass.trim().split(/\s+/);
          classArr.forEach(item => removeClass(modalDom, item));
        }

        modalStack.pop(); // 从遮罩层栈中移除
        if (modalStack.length > 0) { // 还原上一级遮罩层的 zIndex
          modalDom.style.zIndex = modalStack[modalStack.length - 1].zIndex;
        }
      } else {
        // 查找要删除的遮罩层
        for (let i = modalStack.length - 1; i >= 0; i--) {
          if (modalStack[i].id === id) {
            modalStack.splice(i, 1);
            break;
          }
        }
      }
    }

    // 如果关闭的是最后一个遮罩层, 就显示动画
    if (modalStack.length === 0) {
      if (this.modalFade) {
        addClass(modalDom, 'v-modal-leave');
      }
      setTimeout(() => {
        if (modalStack.length === 0) {
          if (modalDom.parentNode) modalDom.parentNode.removeChild(modalDom);
          modalDom.style.display = 'none'; // 只是隐藏, dom 节点依然留在页面上, 避免每次创建造成的性能损耗
          PopupManager.modalDom = undefined;
        }
        removeClass(modalDom, 'v-modal-leave');
      }, 200);
    }
  }
};

// zIndex 的初始化
Object.defineProperty(PopupManager, 'zIndex', {
  configurable: true,
  get() {
    if (!hasInitZIndex) {
      zIndex = zIndex || (Vue.prototype.$ELEMENT || {}).zIndex || 2000;
      hasInitZIndex = true;
    }
    return zIndex;
  },
  set(value) {
    zIndex = value;
  }
});

// 获取最上面的Popup实例
const getTopPopup = function() {
  if (Vue.prototype.$isServer) return;
  if (PopupManager.modalStack.length > 0) {
    const topPopup = PopupManager.modalStack[PopupManager.modalStack.length - 1];
    if (!topPopup) return;
    const instance = PopupManager.getInstance(topPopup.id);

    return instance;
  }
};

if (!Vue.prototype.$isServer) {
  // handle `esc` key when the popup is shown
  // esc 快捷键关闭弹框
  window.addEventListener('keydown', function(event) {
    if (event.keyCode === 27) {
      const topPopup = getTopPopup();

      if (topPopup && topPopup.closeOnPressEscape) { // 有开启这个功能的选项
        topPopup.handleClose
          ? topPopup.handleClose()
          : (topPopup.handleAction ? topPopup.handleAction('cancel') : topPopup.close());
      }
    }
  });
}

export default PopupManager;
