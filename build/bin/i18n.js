'use strict';

// 页面级别的多语言

// 检查所有语言, 并判断是否在 /examples/pages 下面是否有对应的语言文件夹
// -> 读取 /examples/pages/template/*.tpl 文件
// -> 读取 i18n 文件的内容来替换的模板文件中的占位符
// -> 输出到 /examples/pages 对应的语言文件夹下面

var fs = require('fs');
var path = require('path');
var langConfig = require('../../examples/i18n/page.json');

langConfig.forEach(lang => {
  try {
    fs.statSync(path.resolve(__dirname, `../../examples/pages/${ lang.lang }`));
  } catch (e) {
    fs.mkdirSync(path.resolve(__dirname, `../../examples/pages/${ lang.lang }`));
  }

  Object.keys(lang.pages).forEach(page => {
    var templatePath = path.resolve(__dirname, `../../examples/pages/template/${ page }.tpl`);
    var outputPath = path.resolve(__dirname, `../../examples/pages/${ lang.lang }/${ page }.vue`);
    var content = fs.readFileSync(templatePath, 'utf8');
    var pairs = lang.pages[page];

    Object.keys(pairs).forEach(key => {
      // 把标志位地方的字段，替换成page.json里预先写好的字段
      // 例如：匹配 <%= 1 %> 替换成展示内容
      content = content.replace(new RegExp(`<%=\\s*${ key }\\s*>`, 'g'), pairs[key]);
    });

    fs.writeFileSync(outputPath, content);
  });
});
