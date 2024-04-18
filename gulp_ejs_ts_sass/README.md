# Gulp Template

Gulp + EJS + TypeScript (Webpack) + Sass + Image Compression
EJS テンプレートエンジン, TypeScrip トランスパイル, Sass (Scss), 画像圧縮を目的としたタスクランナー。

(macOS 14.4.1 / node v21.6.2 / npm v10.5.0 / Yarn v4.1.1 検証済み)

- ejs -> html
- typescript -> js
- sass -> css

## npm パッケージをインストール

プロジェクトのディレクトリに移動して実行

```
$ npm install
or
$ yarn install
```

## gulp の監視

```
$ npm start
or
$ yarn start
```

- npm で Gulp をグローバルにインストールしている場合は `$ gulp` のみで実行可能です。

## 開発用ファイル生成

デベロップ用のファイル一式を生成

```
$ npm run dev
or
$ yarn dev
```

## 納品ファイル生成

デプロイ用のファイル一式を生成

```
$ npm run build
or
$ yarn build
```

<small>※ 必ず納品時にこのコマンドを実行してください。</small>

## EJS 設定

設定用の EJS に初期の値を入力してください。

```
./src/ejs/_templates/_config.ejs
```

## ディレクトリ構成

```
├─ node_modules/
│  └─ パッケージ各種
│
├─ public/ (ビルド後、納品ファイルがここに生成される)
│  ├─ assets/
│  │  ├─ css/
│  │  ├─ fonts/
│  │  ├─ images/
│  │  ├─ js/
│  │  └─ json/
│  └─ index.html 他、ファイル、ディレクトリ群...
│
├─ src/（ソース）
│  ├─ ejs/
│  │  ├─ _templates/
│  │  └─ index.ejs
│  ├─ fonts/
│  ├─ images/
│  ├─ js/
│  │  ├─ component/
│  │  ├─ home.ts
│  │  └─ main.ts
│  ├─ sass/
│  │  ├─ foundation/
│  │  ├─ global/
│  │  ├─ layout/
│  │  ├─ object/
│  │  │  ├─ component/
│  │  │  ├─ project/
│  │  │  └─ utility/
│  │  ├─ page/
│  │  ├─ home.scss
│  │  └─ style.scss
│  └─ static/ (静的ファイル一式は/public/にコピーされる)
│
├─ .eslintrc.js
├─ .gitignore
├─ .htmlhintrc
├─ .yarnrc.yml
├─ convertImage.mjs
├─ gulpfile.mjs
├─ package.json
├─ README.md
├─ tsconfig.json
├─ webpack.development.js
└─ webpack.production.js
```

## 再インストール

`npm`, `yarn` まわりでエラーが出た場合は node_modules の再インストールをしてください。

```
$ rm -rf node_modules
$ npm cache clean --force
$ npm install
or
$ rm -rf node_modules
$ yarn cache clean
$ yarn install
```

## 参考 <!-- Reference -->
