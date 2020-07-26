const Config = require('markdown-it-chain');
const anchorPlugin = require('markdown-it-anchor');
const slugify = require('transliteration').slugify;
const containers = require('./containers');
const overWriteFenceRule = require('./fence');

const config = new Config();

config
  .options.html(true).end() // 允许使用 html

  // 把标题转换成锚链接, # 后面的内容是标题的拼音的格式
  // 例如 输入框 => shu-ru-kuang
  .plugin('anchor').use(anchorPlugin, [
    {
      level: 2,
      slugify: slugify,
      permalink: true,
      permalinkBefore: true
    }
  ]).end()

  .plugin('containers').use(containers).end(); // :::xx 的解析

const md = config.toMd();
overWriteFenceRule(md);

module.exports = md;
