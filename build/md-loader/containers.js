// container块的解析
const mdContainer = require('markdown-it-container');

module.exports = md => { // :::demo
  md.use(mdContainer, 'demo', {
    validate(params) {
      return params.trim().match(/^demo\s*(.*)$/);
    },
    render(tokens, idx) {
      const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);
      if (tokens[idx].nesting === 1) {
        const description = m && m.length > 1 ? m[1] : '';
        const content = tokens[idx + 1].type === 'fence' ? tokens[idx + 1].content : '';
        // 把 `:::demo` 块替换成 <demo-block> 组件
        // 并把代码部分复制出来用 <!--element-demo: :element-demo--> 来包裹, 这里的代码将会被转换成组件渲染出来, 做预览用
        return `<demo-block>
        ${description ? `<div>${md.render(description)}</div>` : ''}
        <!--element-demo: ${content}:element-demo-->
        `;
      }
      return '</demo-block>';
    }
  });

  md.use(mdContainer, 'tip'); // :::tip
  md.use(mdContainer, 'warning'); // :::warning
};
