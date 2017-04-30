#!/usr/bin/env node
const fs = require('fs');
const cheerio = require('cheerio');
const chalk = require('chalk');
const option = require('./options');
const getDirName = require('path').dirname;
const mkdirp = require('mkdirp');
const argv =
  require('yargs')
    .options(option)
    .help('help')
    .version(() => {
      return require('./package.json').version;
    })
    .argv;

/**
 * readHTML HTML を cheerio に読み込ませる
 * @returns {Promise}
 */
function readHTML() {
  return new Promise((resolve, reject) => {

    if(argv.in) {
      try {
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', (chunk) => { resolve(cheerio.load(chunk, {decodeEntities: false})) });
      }
      catch(err) { reject(err); }
      return;
    }

    fs.readFile(argv.src, 'utf8', (err, text) => {
      if(err) reject(err);
      resolve(cheerio.load(text, {decodeEntities: false}));
    });
  });
}

/**
 * attributesExistCheck 指定した属性値の存在チェック、存在していた場合は配列にして返す
 * @param $elm - チェックする対象となる要素
 * @param attr {String} -　チェックする属性値名
 * @returns {Array} - 属性値を配列化したもの
 */
function attributesExistCheck($elm, attr) {
  return $elm.attr(attr) ? $elm.attr(attr).split(' ') : null;
}

/**
 * addPrefix セレクタの前に接頭辞をつける
 * @param attributes {Array} - 属性値
 * @param prefix - 接頭辞
 * @returns {Array}
 */
function addPrefix(attributes, prefix) {
  if(!attributes) return [];
  return attributes.map((elm, i) => prefix + elm);
}

/**
 * makeDir ファイルの出力
 */
function makeDir($) {
  mkdirp(getDirName(argv.o), (err) => {
    if (err) throw err;

    fs.writeFile(argv.o, $.html(), (err) => {
      if(err) throw err;
      console.log(chalk.blue.bold(
        `-----------------------------
  The file has been saved!
-----------------------------`));
    });
  });
}

/**
 * addComment - 閉じタグコメントを表示する
 * @param $ {Object} - cheerio object
 */
function addComment($) {
  $('body *').filter((index, elm) => {
    // 改行毎に分割する
    const lines = $(elm).html().split('\n');

    // 1行以上を対象とする
    const lastLine = lines.length > 1 ? lines.slice(-1)[0] : null;

    // 1行以上あって既にコメントタグが入っていないものを対象とする
    return lastLine !== null && lastLine.match(/^(?!.*(<\!--)).*$/);
  }).each((index, elm) => {
    // クラスが存在していればクラスを分割する
    const ids = attributesExistCheck($(elm), 'id');
    const idsStr = argv.fo ? addPrefix(ids, '#')[0] : addPrefix(ids, '#').join(' ');

    const classes = attributesExistCheck($(elm), 'class');
    const classesStr = argv.fo ? addPrefix(classes, '.')[0] : addPrefix(classes, '.').join('');

    // 閉じタグコメントを追加する
    const closeComment = `<!-- ${idsStr && !argv.co ? idsStr : ''}${classesStr ? classesStr : ''} -->`;
    argv.outside ? $(elm).after('\n' + closeComment) : $(elm).append(closeComment);
  });

  argv.stdout ? console.log($.html()) : makeDir($);
}

readHTML().then(addComment);