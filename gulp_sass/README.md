# Gulp Template

Gulp + Sass
Sass (Scss) に特化したタスクランナー。
ドキュメントルートに gulpfile.js, package.json を置いて `npm i` or `yarn install` するだけで Scss を監視、ベンダープレフィックス付与、メディアクエリ集約、コンパイル、ミニファイまでします。

(macOS 14.3.1 / node v18.19.0 / npm v10.5.0 / Yarn v4.1.1 検証済み)

## npm / yarn パッケージをインストール

```
#プロジェクトのディレクトリに移動して
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
- Browser Sync は入れていません。

<!--
## stylelint の実行

```
$ npx gulp stylelint
or
$ yarn stylelint
```
-->

## ディレクトリ構成

./sass/ 内のファイルを編集

- sass -> css

```
├─ node_modules/
│  └─ パッケージ各種
│
├─ assets/
│  ├─ css/
│  │  ├─ style.css (コンパイルされたファイルが生成される)
│  │  ├─ style.css.map (ソースマップ)
│  │  └─ custom.css (静的CSSファイル)
│  ├─ images/ (画像ファイル)
│  ├─ js/  (静的JSファイル)
│  └─ 他、静的ディレクトリ、ファイル群...
│
├─ sass/（ソース）
│  ├─ foundation/
│  ├─ global/
│  ├─ layout/
│  ├─ object/
│  │  ├─ component/
│  │  ├─ project/
│  │  └─ utility/
│  ├─ page/
│  └─ **style.scss**
│
├─ .gitignore
├─ .yarnrc.yml
├─ gulpfile.js
├─ package.json
├─ README.md
├─ stylelint.config.js
├─ yarn.lock
├─ index.html
└─ 他、静的ディレクトリ、ファイル群...

```
