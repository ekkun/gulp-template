# Gulp Template

Gulp + PUG + TypeScript (Webpack) + Sass + Image Compression
PUG テンプレートエンジン, TavaScript トランスパイル, Sass (Scss), 画像圧縮を目的としたタスクランナー。

(macOS 14.4.1 / node v21.6.2 / npm v10.5.0 / Yarn v4.1.1 検証済み)

- pug -> html
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
$ npm run start
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
│  ├─ pug/
│  │  ├─ _templates/
│  │  └─ index.pug
│  ├─ fonts/
│  ├─ images/
│  ├─ js/
│  │  ├─ modules/
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
├─ .yarnrc.yml
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