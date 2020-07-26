// 生成 index.scss[css], 集合所有除了特殊组件(['icon', 'option', 'option-group'])外的组件样式
// 取到所有组件名称
// 取到所有主题名称
// 生成index.scss[css]的文件, 包含所有组件, 如果该组件没有样式文件, 就生成一个空的文件
var fs = require('fs');
var path = require('path');
var Components = require('../../components.json'); // 组件列表
var themes = [
  'theme-chalk'
];
Components = Object.keys(Components); // 组件名列表
var basepath = path.resolve(__dirname, '../../packages/');

function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

themes.forEach((theme) => {
  var isSCSS = theme !== 'theme-default'; // 这边是假设有 theme-default 主题, theme-default 是纯 css 编写的
  var indexContent = isSCSS ? '@import "./base.scss";\n' : '@import "./base.css";\n';
  Components.forEach(function(key) {
    if (['icon', 'option', 'option-group'].indexOf(key) > -1) return; // 除去一些特殊组件
    var fileName = key + (isSCSS ? '.scss' : '.css'); // 判断是 scss 还是 css
    indexContent += '@import "./' + fileName + '";\n';
    var filePath = path.resolve(basepath, theme, 'src', fileName);
    if (!fileExists(filePath)) { // 避免遗漏的样式文件, 以免在按需导入的时候找不到对应的样式文件, 严格的遵守一个组件一个样式文件
      fs.writeFileSync(filePath, '', 'utf8');
      console.log(theme, ' 创建遗漏的 ', fileName, ' 文件');
    }
  });
  fs.writeFileSync(path.resolve(basepath, theme, 'src', isSCSS ? 'index.scss' : 'index.css'), indexContent);
});
