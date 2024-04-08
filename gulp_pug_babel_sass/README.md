# Gulp Template

Gulp + PUG + Babel(Webpack) + Sass + Image Compression
PUG テンプレートエンジン, JavaScript トランスパイル, Sass (Scss), 画像圧縮を目的としたタスクランナー。

(macOS 14.4.1 / node v21.6.2 / npm v10.5.0 / Yarn v4.1.1 検証済み)

- pug -> html
- babel -> js
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
$ npx gulp
or
$ yarn start
```

- npm で Gulp をグローバルにインストールしている場合は `$ gulp` のみで実行可能です。

## 開発用ファイル生成

デベロップ用のファイル一式を生成

```
$ npx gulp dev --env dev
or
$ yarn dev
```

## 納品ファイル生成

デプロイ用のファイル一式を生成

```
$ npx gulp build --env prod
or
$ yarn build
```

<small>※ 必ず納品時にこのコマンドを実行してください。</small>

以下のコマンドのように `--env` に `prod`, `dev` を付与することで環境変数が反映されます。

- 本番環境: `$ npx gulp build --env prod`
- 開発環境: `$ npx gulp dev --env dev`
- ローカル: `$ npx gulp`

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
│  │  ├─ component/
│  │  └─ main.js
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
├─ gulpfile.js
├─ package.json
├─ README.md
├─ webpack.development.js
└─ webpack.production.js
```

## 再インストール

`npm`, `gulp` まわりでエラーが出た場合は node_modules の再インストールをしてください。

```
$ rm -rf node_modules
$ npm cache clean --force
$ npm install
```

## 参考 <!-- Reference -->
