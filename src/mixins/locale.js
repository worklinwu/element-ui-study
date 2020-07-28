import { t } from 'element-ui/src/locale';

export default {
  methods: {
    // i18n 的工具方法
    t(...args) {
      return t.apply(this, args);
    }
  }
};
