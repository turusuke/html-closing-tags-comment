const options = {
  'first-only': {
    alias: 'fo',
    describe: '属性値が複数設定されていた場合、最初のものをコメントに含みます',
    default: true,
    type: 'boolean'
  },
  'class-name-only': {
    alias: 'co',
    describe: 'クラス属性のみ出力します',
    default: true,
    type: 'boolean'
  },
  'source': {
    alias: 'src',
    describe: '入力ファイルを指定します',
    type: 'string'
  },
  'stdin': {
    alias: 'in',
    describe: 'HTML文字列を標準入力から渡します',
    default: false,
    type: 'boolean',
  },
  'output': {
    alias: 'o',
    describe: '出力先のパスを指定します',
    type: 'string',
    default: './dist/output.html'
  },
  'stdout': {
    alias: 's',
    describe: '閉じタグコメントを追加したHTMLを標準出力します',
    type: 'boolean',
    default: false
  },
  'help': {
    alias: 'h',
    describe: 'ヘルプを表示します',
    type: 'boolean'
  },
  'version': {
    alias: 'v',
    describe: 'バージョン番号を確認します',
    type: 'boolean'
  },
  'outside': {
    alias: 'outsd',
    describe: '外側に閉じタグコメントを表示します',
    type: 'boolean',
    default: false
  }
};

module.exports = options;