```json
{
  "name": "element-ui", // 项目名称
  "version": "2.13.2", // 项目版本（格式：大版本.次要版本.小版本）
  "description": "A Component Library for Vue.js.", // 项目描述
  "main": "lib/element-ui.common.js", // 入口文件, import 'element-ui' 指向的文件
  // npm publish 命令后推送到 npm 服务器的文件列表
  "files": [
    "lib",
    "src",
    "packages",
    "types"
  ],
  "typings": "types/index.d.ts", // 指定 typescript 的 types 入口文件
  "scripts": { // 指定运行脚本命令的 npm 命令行缩写
    // 安装依赖，官方推荐优先用yarn
    "bootstrap": "yarn || npm i",
    // build/bin/iconInit.js 解析icon.scss。把所有的icon的名字放在icon.json里。最后挂到Vue原型上的$icon的上，方便循环出来.具体使用见【补充资料】
    // build/bin/build-entry.js 根据components.json，生成src/index.js文件，核心就是json-templater/string插件的使用【插件使用见参考资料】
    // build/bin/i18n.js 根据examples/i18n/page.json和模板，生成不同语言的demo
    // build/bin/version.js 根据package.json中的versions,生成examples/versions.json
    "build:file": "node build/bin/iconInit.js & node build/bin/build-entry.js & node build/bin/i18n.js & node build/bin/version.js",
    // build/bin/gen-cssfile // 根据components.json，生成生成package/theme-chalk/index.scss
    // gulp build --gulpfile packages/theme-chalk/gulpfile.js 用gulp构建工具，编译scss、压缩、输出css
    // cp-cli 是一个跨平台的copy工具，和CopyWebpackPlugin类似、linux的cp差不多（不具有跨平台的功能），
    "build:theme": "node build/bin/gen-cssfile && gulp build --gulpfile packages/theme-chalk/gulpfile.js && cp-cli packages/theme-chalk/lib lib/theme-chalk",
    // 把src目录下的除了index.js入口文件外的其他文件通过babel转译，然后移动到lib文件夹下。
    "build:utils": "cross-env BABEL_ENV=utils babel src --out-dir lib --ignore src/index.js",
    "build:umd": "node build/bin/build-locale.js",
    // 清除之前构建出来的东西
    "clean": "rimraf lib && rimraf packages/*/lib && rimraf test/**/coverage",
    "deploy:build": "npm run build:file && cross-env NODE_ENV=production webpack --config build/webpack.demo.js && echo element.eleme.io>>examples/element-ui/CNAME",
    "deploy:extension": "cross-env NODE_ENV=production webpack --config build/webpack.extension.js",
    "dev:extension": "rimraf examples/extension/dist && cross-env NODE_ENV=development webpack --watch --config build/webpack.extension.js",
    "dev": "npm run bootstrap && npm run build:file && cross-env NODE_ENV=development webpack-dev-server --config build/webpack.demo.js & node build/bin/template.js",
    "dev:play": "npm run build:file && cross-env NODE_ENV=development PLAY_ENV=true webpack-dev-server --config build/webpack.demo.js",
    // 整体构建,打包出lib库
    "dist": "npm run clean && npm run build:file && npm run lint && webpack --config build/webpack.conf.js && webpack --config build/webpack.common.js && webpack --config build/webpack.component.js && npm run build:utils && npm run build:umd && npm run build:theme",
    "i18n": "node build/bin/i18n.js",
    // 对项目进行eslint检测
    "lint": "eslint src/**/* test/**/* packages/**/* build/**/* --quiet",
    // 发布
    "pub": "npm run bootstrap && sh build/git-release.sh && sh build/release.sh && node build/bin/gen-indices.js && sh build/deploy-faas.sh",
    // 单元测试
    "test": "npm run lint && npm run build:theme && cross-env CI_ENV=/dev/ BABEL_ENV=test karma start test/unit/karma.conf.js --single-run",
    "test:watch": "npm run build:theme && cross-env BABEL_ENV=test karma start test/unit/karma.conf.js"
  },
  // 功能即服务
  "faas": [
    {
      "domain": "element",
      "public": "temp_web/element"
    },
    {
      "domain": "element-theme",
      "public": "examples/element-ui",
      "build": [
        "yarn",
        "npm run deploy:build"
      ]
    }
  ],
  "repository": {
    "type": "git",
    "url": "git@github.com:ElemeFE/element.git"
  },
  "homepage": "http://element.eleme.io",
  "keywords": [
    "eleme",
    "vue",
    "components"
  ],
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/ElemeFE/element/issues"
  },
  "unpkg": "lib/index.js",
  "style": "lib/theme-chalk/index.css",
  "dependencies": {
    // 异步验证插件
    "async-validator": "~1.8.1",
    // JSX语法
    "babel-helper-vue-jsx-merge-props": "^2.0.0",
    // 深度合并插件
    "deepmerge": "^1.2.0",
    // 滚轮插件
    "normalize-wheel": "^1.0.1",
    // 实现响应式VUE组件
    "resize-observer-polyfill": "^1.5.0",
    // 防抖节流插件
    "throttle-debounce": "^1.0.1"
  },
  "peerDependencies": {
    "vue": "^2.5.17"
  },
  "devDependencies": {
    // 编译.vue文件
    "@vue/component-compiler-utils": "^2.6.0",
    // 一个托管的全文、数字和分面搜索引擎，能够在第一次按键时提供实时结果。
    "algoliasearch": "^3.24.5",
    // babel
    "babel-cli": "^6.26.0",
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.5",
    "babel-plugin-add-module-exports": "^0.2.1",
    "babel-plugin-istanbul": "^4.1.1",
    "babel-plugin-module-resolver": "^2.2.0",
    "babel-plugin-syntax-jsx": "^6.18.0",
    "babel-plugin-transform-vue-jsx": "^3.7.0",
    "babel-preset-env": "^1.7.0",
    "babel-preset-stage-2": "^6.24.1",
    "babel-regenerator-runtime": "^6.5.0",
    // node fs工具
    "chokidar": "^1.7.0",
    // 将单个文件或整个目录复制到构建目录。
    "copy-webpack-plugin": "^5.0.0",
    // 跨平台支持UNIX命令
    "cp-cli": "^1.0.2",
    // 运行在平台上设置和使用环境变量的脚本。
    "cross-env": "^3.1.3",
    // es6 promise支持
    "es6-promise": "^4.0.5",
    // eslint
    "eslint": "4.18.2",
    "eslint-config-elemefe": "0.1.1",
    "eslint-loader": "^2.0.0",
    "eslint-plugin-html": "^4.0.1",
    "eslint-plugin-json": "^1.2.0",
    // 文件保存
    "file-save": "^0.2.0",
    // gulp
    "gulp": "^4.0.0",
    "gulp-autoprefixer": "^6.0.0",
    "gulp-cssmin": "^0.2.0",
    "gulp-sass": "^4.0.2",
    // js 高亮
    "highlight.js": "^9.3.0",
    // html webpack插件
    "html-webpack-plugin": "^3.2.0",
    // json加载器
    "json-loader": "^0.5.7",
    // json和js的模版生成工具
    "json-templater": "^1.0.4",
    // 测试相关
    "karma": "^4.0.1", // 测试运行器，它可以呼起浏览器，加载测试脚本，然后运行测试用例
    "karma-chrome-launcher": "^2.2.0",
    "karma-coverage": "^1.1.2",
    "karma-mocha": "^1.3.0",
    "karma-sinon-chai": "^2.0.2",
    "karma-sourcemap-loader": "^0.3.7",
    "karma-spec-reporter": "^0.0.32",
    "karma-webpack": "^3.0.5",
    // mocha测试库
    "mocha": "^6.0.2",
    // sinon测试框架
    "sinon": "^7.2.7",
    "sinon-chai": "^3.3.0",
    // chai断言库
    "chai": "^4.2.0",
    // 代码测试覆盖率
    "coveralls": "^3.0.3",
    // 将markdown变为html的解析器
    "markdown-it": "^8.4.1",
    "markdown-it-anchor": "^5.0.2",
    "markdown-it-chain": "^1.3.0",
    "markdown-it-container": "^2.0.0",
    // 压缩css
    "mini-css-extract-plugin": "^0.4.1",
    // node.js的sass
    "node-sass": "^4.11.0",
    // 优化/最小化css资源
    "optimize-css-assets-webpack-plugin": "^5.0.1",
    // 视差滚动 https://perspective.js.org/#/zh-cn/
    "perspective.js": "^1.0.0",
    "postcss": "^7.0.14",
    // 命令行进度条插件
    "progress-bar-webpack-plugin": "^1.11.0",
    // node.js 深度删除模块
    "rimraf": "^2.5.4",
    // 选择发布版本
    "select-version-cli": "^0.0.2",
    // utf-8 字符转换
    "transliteration": "^1.1.11",
    // 压缩js插件
    "uglifyjs-webpack-plugin": "^2.1.1",
    // 驼峰写法
    "uppercamelcase": "^1.1.0",
    // CSS加载器
    "css-loader": "^2.1.0",
    // 文件加载
    "file-loader": "^1.1.11",
    // sass加载器
    "sass-loader": "^7.1.0",
    "style-loader": "^0.23.1",
    // url加载器
    "url-loader": "^1.0.1",
    // vue
    "vue": "2.5.21",
    "vue-loader": "^15.7.0",
    "vue-router": "^3.0.1",
    "vue-template-compiler": "2.5.21",
    "vue-template-es2015-compiler": "^1.6.0",
    // webpack
    "webpack": "^4.14.0",
    "webpack-cli": "^3.0.8",
    "webpack-dev-server": "^3.1.11",
    "webpack-node-externals": "^1.7.2"
  }
}
```
