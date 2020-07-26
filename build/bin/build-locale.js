// 将 /src/locale/lang 下面的文件 打包到 /lib/umd/locale 下面
var fs = require('fs');
var save = require('file-save'); // 文件保存
var resolve = require('path').resolve;
var basename = require('path').basename;
var localePath = resolve(__dirname, '../../src/locale/lang');
var fileList = fs.readdirSync(localePath);

var transform = function(filename, name, cb) {
  require('babel-core').transformFile(resolve(localePath, filename), {
    plugins: [
      'add-module-exports',
      ['transform-es2015-modules-umd', { loose: true }]
    ],
    moduleId: name
  }, cb);
};

// 类似 webpack 处理文件的过程
fileList
  .filter(function(file) {
    return /\.js$/.test(file);
  })
  .forEach(function(file) {
    var name = basename(file, '.js');

    transform(file, name, function(err, result) {
      if (err) {
        console.error(err);
      } else {
        var code = result.code;

        // 特殊处理, 使得引入的语言文件可以自动注册
        code = code
          .replace('define(\'', 'define(\'element/locale/')
          .replace('global.', 'global.ELEMENT.lang = global.ELEMENT.lang || {}; \n    global.ELEMENT.lang.');
        save(resolve(__dirname, '../../lib/umd/locale', file)).write(code);

        console.log(file);
      }
    });
  });

// 输出大致长这样
// (function (global, factory) {
//   if (typeof define === "function" && define.amd) {
//     // define('', ['module', 'exports'], factory);
//     define('element/locale/zh-CN', ['module', 'exports'], factory);
//   } else if (typeof exports !== "undefined") {
//     factory(module, exports);
//   } else {
//     var mod = {
//       exports: {}
//     };
//     factory(mod, mod.exports);
//     // global.zhCN = mod.exports;
//     global.ELEMENT.lang = global.ELEMENT.lang || {};
//     global.ELEMENT.lang.zhCN = mod.exports;
//   }
// })(this, function (module, exports) {
//   'use strict';
//   exports.__esModule = true;
//   exports.default = {
//     ...具体的翻译
//   };
//   module.exports = exports['default'];
// });
