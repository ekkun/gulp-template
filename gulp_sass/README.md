# Gulp Template

Gulp + Sass
For node v16 or v14

(macOS12.4 / node v16.15.1, node v14.19.3 検証済み)

Sass (Scss) に特化したタスクランナー。
ドキュメントルートに gulpfile.js, package.json を置いて `npm i` するだけで Scss を監視、ベンダープレフィックス付与、メディアクエリ集約、コンパイル、ミニファイまでします。

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
│  └─ js/  (JSファイル)
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
│  └─ style.scss
│
├─ .gitignore
├─ gulpfile.js
├─ package.json
├─ README.md
├─ index.html (ドキュメントルートに置く全ての静的ファイル群)
└─ 他、静的ディレクトリ、ファイル群...

```
