import Utils from '../aria-utils';

const SubMenu = function(parent, domNode) {
  this.domNode = domNode;
  this.parent = parent;
  this.subMenuItems = [];
  this.subIndex = 0;
  this.init();
};

SubMenu.prototype.init = function() {
  // 这里应该是约定导航必须是 nav/ul/ol 组件, 这些组件才有 li 子组件
  this.subMenuItems = this.domNode.querySelectorAll('li');
  this.addListeners();
};

SubMenu.prototype.gotoSubIndex = function(idx) {
  // 循环
  if (idx === this.subMenuItems.length) {
    idx = 0;
  } else if (idx < 0) {
    idx = this.subMenuItems.length - 1;
  }
  this.subMenuItems[idx].focus(); // 获得焦点
  this.subIndex = idx;
};

SubMenu.prototype.addListeners = function() {
  const keys = Utils.keys;
  const parentNode = this.parent.domNode;
  Array.prototype.forEach.call(this.subMenuItems, el => {
    // 菜单选择的快捷键
    el.addEventListener('keydown', event => {
      let prevDef = false;
      switch (event.keyCode) {
        case keys.down:
          this.gotoSubIndex(this.subIndex + 1);
          prevDef = true;
          break;
        case keys.up:
          this.gotoSubIndex(this.subIndex - 1);
          prevDef = true;
          break;
        case keys.tab:
          Utils.triggerEvent(parentNode, 'mouseleave'); // 收起二级菜单
          break;
        case keys.enter:
        case keys.space:
          prevDef = true;
          event.currentTarget.click(); // 模拟点击事件
          break;
      }
      // 判断是否阻止默认事件和冒泡
      if (prevDef) {
        event.preventDefault();
        event.stopPropagation();
      }
      return false;
    });
  });
};

export default SubMenu;
