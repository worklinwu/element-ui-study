const { compileTemplate } = require('@vue/component-compiler-utils');
const compiler = require('vue-template-compiler');

// 提取 script 内容
function stripScript(content) {
  const result = content.match(/<(script)>([\s\S]+)<\/\1>/);
  return result && result[2] ? result[2].trim() : '';
}

// 提取 style 内容
function stripStyle(content) {
  const result = content.match(/<(style)\s*>([\s\S]+)<\/\1>/);
  return result && result[2] ? result[2].trim() : '';
}

// 编写例子时不一定有 template。所以采取的方案是剔除其他的内容
function stripTemplate(content) {
  content = content.trim();
  if (!content) {
    return content;
  }
  return content.replace(/<(script|style)[\s\S]+<\/\1>/g, '').trim();
}

function pad(source) {
  return source
    .split(/\r?\n/)
    .map(line => `  ${line}`)
    .join('\n');
}

// 转换成组件对象
function genInlineComponentText(template, script) {
  // https://github.com/vuejs/vue-loader/blob/423b8341ab368c2117931e909e2da9af74503635/lib/loaders/templateLoader.js#L46
  const finalOptions = {
    source: `<div>${template}</div>`,
    filename: 'inline-component', // TODO：这里有待调整
    compiler
  };
  const compiled = compileTemplate(finalOptions);
  // tips
  if (compiled.tips && compiled.tips.length) {
    compiled.tips.forEach(tip => {
      console.warn(tip);
    });
  }
  // errors
  if (compiled.errors && compiled.errors.length) {
    console.error(
      `\n  Error compiling template:\n${pad(compiled.source)}\n` +
        compiled.errors.map(e => `  - ${e}`).join('\n') +
        '\n'
    );
  }
  let demoComponentContent = `
    ${compiled.code}
  `;
  // el-radio 为例, demoComponentContent 的结果类似:
  /* var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[[_c('el-radio',{attrs:{"label":"1"},model:{value:(_vm.radio),callback:function ($$v) {_vm.radio=$$v},expression:"radio"}},[_vm._v("Option A")]),_vm._v(" "),_c('el-radio',{attrs:{"label":"2"},model:{value:(_vm.radio),callback:function ($$v) {_vm.radio=$$v},expression:"radio"}},[_vm._v("Option B")])]],2)}
  var staticRenderFns = []
  */
  // todo: 这里采用了硬编码有待改进
  script = script.trim();
  if (script) {
    script = script.replace(/export\s+default/, 'const democomponentExport =');
  } else {
    script = 'const democomponentExport = {}';
  }
  // el-radio 为例, script 的结果类似:
  /* const democomponentExport = { data () { return { radio: '1' }; } } */
  demoComponentContent = `(function() {
    ${demoComponentContent}
    ${script}
    return {
      render,
      staticRenderFns,
      ...democomponentExport
    }
  })()`;
  return demoComponentContent;
}

module.exports = {
  stripScript,
  stripStyle,
  stripTemplate,
  genInlineComponentText
};
