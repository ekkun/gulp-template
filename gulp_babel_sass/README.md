# Gulp Template

Gulp + Babel(Webpack) + Sass + Image Compression
JavaScrip トランスパイル, Sass (Scss), 画像圧縮を目的としたタスクランナー。
ドキュメントルートに Gulp まわりの設定ファイルを置いて `npm i` or `yarn install` するだけで JavaScript の監視、バンドル、トランスパイル、ミニファイ、Scss の監視、ベンダープレフィックス付与、メディアクエリ集約、コンパイル、ミニファイ、画像の監視、圧縮までします。

(macOS 14.3.1 / node v18.19.0 / npm v10.5.0 / Yarn v4.1.1 検証済み)

## npm パッケージをインストール

```
#プロジェクトのディレクトリに移動して
$ npm install
or
$ yarn install
```

## gulp の監視

```
$ npm run start
or
$ yarn start
```

- Browser Sync は入れていません。

## 納品ファイル生成

デプロイ用のファイル一式を生成

```
$ npm run build
or
$ yarn build
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
├─ .yarnrc.yml
├─ convertImage.mjs
├─ gulpfile.mjs
├─ package.json
├─ README.md
├─ webpack.development.js
├─ webpack.production.js
├─ yarn.lock
├─ index.html (ドキュメントルートに置く全ての静的ファイル群)
└─ 他、静的ディレクトリ、ファイル群...

```
