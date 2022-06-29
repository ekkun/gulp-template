# Gulp Template

Gulp + Babel(Webpack) + Sass + Image Compression
For node v16 or v14

(macOS12.4 / node v16.15.1, node v14.19.3 検証済み)

JavaScrip トランスパイル, Sass (Scss), 画像圧縮を目的としたタスクランナー。
ドキュメントルートに Gulp まわりの設定ファイルを置いて `npm i` するだけで JavaScript の監視、バンドル、トランスパイル、ミニファイ、Scss の監視、ベンダープレフィックス付与、メディアクエリ集約、コンパイル、ミニファイ、画像の監視、圧縮までします。

## npm パッケージをインストール

```
#プロジェクトのディレクトリに移動して
$ npm install
```

## gulp の監視

```
$ npx gulp
```

- npm で Gulp をグローバルにインストールしている場合は `$ gulp` のみで実行可能です。
- Browser Sync は入れていません。

## 納品ファイル生成

デプロイ用のファイル一式を生成

```
$ npx gulp build
```

<small>※ 必ず納品時にこのコマンドを実行してください。</small>

## ディレクトリ構成

./src/js/, ./src/sass/ 内のファイルを編集

- babel -> js
- sass -> css

```
├─ node_modules/
│  └─ パッケージ各種
│
├─ assets/
│  ├─ css/
│  │  ├─ style.css (コンパイルされたファイルが生成される)
│  │  └─ custom.css (静的CSSファイル)
│  ├─ images/ (圧縮された画像ファイル)
│  ├─ js/
│  │  ├─ main.js (トランスパイルされたJSファイル)
│  │  └─ custom.js (静的JSファイル)
│  └─ 他、静的ディレクトリ、ファイル群...
│
├─ src/（ソース）
│  ├─ images/
│  ├─ js/
│  │  ├─ component/
│  │  └─ main.js
│  └─ sass/
│      ├─ foundation/
│      ├─ global/
│      ├─ layout/
│      ├─ object/
│      │  ├─ component/
│      │  ├─ project/
│      │  └─ utility/
│      ├─ page/
│      └─ style.scss
│
├─ .eslintrc.js
├─ .gitignore
├─ gulpfile.js
├─ package.json
├─ README.md
├─ webpack.development.js
├─ webpack.production.js
├─ index.html (ドキュメントルートに置く全ての静的ファイル群)
└─ 他、静的ディレクトリ、ファイル群...

```
