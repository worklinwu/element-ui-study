'use strict';
// 应该是添加云搜索的服务的功能
// 在发布版本的时候才执行该命令
// 如何解决不同版本的搜索问题?

// 读取所有语言的 md 文件
// -> 去掉所有代码部分
// -> 按照一个标题一个内容的规则提取内容
// -> 生成可用的结果
// -> 提交到 algolia 服务器

const fs = require('fs');
const path = require('path');
const algoliasearch = require('algoliasearch'); // 云搜索的服务
const slugify = require('transliteration').slugify; // 中文转拼音?
const key = require('./algolia-key'); // 云搜索的服务key, 敏感信息, 在 .gitignore 有忽略了, 所以下载的源码里面没有

const client = algoliasearch('4C63BTGP6S', key);
const langs = {
  'zh-CN': 'element-zh',
  'en-US': 'element-en',
  'es': 'element-es',
  'fr-FR': 'element-fr'
};

['zh-CN', 'en-US', 'es', 'fr-FR'].forEach(lang => {
  const indexName = langs[lang];
  const index = client.initIndex(indexName);
  index.clearIndex(err => {
    if (err) return;
    fs.readdir(path.resolve(__dirname, `../../examples/docs/${ lang }`), (err, files) => { // 获取所有组件的文档文件
      if (err) return;
      let indices = [];
      files.forEach(file => {
        const component = file.replace('.md', '');
        const content = fs.readFileSync(path.resolve(__dirname, `../../examples/docs/${ lang }/${ file }`), 'utf8'); // 读取内容
        const matches = content
          .replace(/:::[\s\S]*?:::/g, '') // 删除掉代码块
          .replace(/```[\s\S]*?```/g, '')
          .match(/#{2,4}[^#]*/g) // 获取二级到四级的标题下面的内容
          .map(match => match.replace(/\n+/g, '\n').split('\n').filter(part => !!part)) // 去掉无意义的内容, 然后分段成数组
          .map(match => {
            const length = match.length;
            if (length > 2) { // 对超过两段的内容做处理
              const desc = match.slice(1, length).join('');
              return [match[0], desc]; // match[0] 是标题, desc 是内容
            }
            return match;
          });

        indices = indices.concat(matches.map(match => {
          const isComponent = match[0].indexOf('###') < 0; // ## 后面跟的是组件名
          const title = match[0].replace(/#{2,4}/, '').trim();
          const index = { component, title };
          index.ranking = isComponent ? 2 : 1; // 搜索等级
          index.anchor = slugify(title); // 链接
          index.content = (match[1] || title).replace(/<[^>]+>/g, '');
          return index;
        }));
      });

      index.addObjects(indices, (err, res) => {
        console.log(err, res);
      });
    });
  });
});
