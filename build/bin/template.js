// 监听模板的变化, 来执行 i18n, 生成所有语言的文件

const path = require('path');
const templates = path.resolve(process.cwd(), './examples/pages/template');

const chokidar = require('chokidar');
let watcher = chokidar.watch([templates]);

watcher.on('ready', function() {
  watcher
    .on('change', function() {
      exec('npm run i18n');
    });
});

function exec(cmd) {
  return require('child_process').execSync(cmd).toString().trim();
}
