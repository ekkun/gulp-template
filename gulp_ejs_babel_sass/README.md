# Gulp Template

Gulp + EJS + Babel(Webpack) + Sass + Image Compression
For node v16 or v14

(macOS12.4 / node v16.15.1, node v14.19.3 検証済み)

EJS テンプレートエンジン, JavaScrip トランスパイル, Sass (Scss), 画像圧縮を目的としたタスクランナー。

- ejs -> html
- babel -> js
- sass -> css

## npm パッケージをインストール

プロジェクトのディレクトリに移動して実行

```
$ npm install
```

## gulp の監視

```
$ npx gulp
```

- npm で Gulp をグローバルにインストールしている場合は `$ gulp` のみで実行可能です。

## 開発用ファイル生成

デベロップ用のファイル一式を生成

```
$ npx gulp dev --env dev
```

## 納品ファイル生成

デプロイ用のファイル一式を生成

```
$ npx gulp build --env prod
```

<small>※ 必ず納品時にこのコマンドを実行してください。</small>

## EJS 設定

設定用の EJS に初期の値を入力してください。
`./src/ejs/_templates/_config.ejs`

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
│  ├─ ejs/
│  │  ├─ _templates/
│  │  └─ index.ejs
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
│  │  └─ style.scss
│  └─ static/ (静的ファイル一式は/public/にコピーされる)
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

## 再インストール

`npm`, `gulp` まわりでエラーが出た場合は node_modules の再インストールをしてください。

```
$ rm -rf node_modules
$ npm cache clean --force
$ npm install
```

## 参考(Reference)

https://onedarling.site/programming/htmlcss/gulp-ejs-sass/
