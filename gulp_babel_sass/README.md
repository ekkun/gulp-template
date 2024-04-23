# Gulp Template

Gulp + Babel(Webpack) + Sass + Image Compression  
JavaScrip トランスパイル, Sass (Scss), 画像最適化＆webp 化を目的としたビルダー（タスクランナー）。  
ドキュメントルートに Gulp まわりの設定ファイルを置いて `yarn install` するだけで JavaScript の監視、バンドル、トランスパイル、ミニファイ、Scss の監視、ベンダープレフィックス付与、メディアクエリ集約、コンパイル、ミニファイ、画像の監視、圧縮までします。

(macOS 14.3.1 / node v21.7.3 / Yarn v4.1.1 検証済み)

## yarn パッケージをインストール

プロジェクトのディレクトリに移動して

```
$ yarn install
```

## gulp の監視

```
$ yarn start
```

- Browser Sync は入れていません。

## 納品ファイル生成

公開用のファイル一式を生成

```
$ yarn build
```

<small>※ 必ず納品時にこのコマンドを実行してください。</small>

## 画像最適化＆webp 化

画像の画像最適化と webp 化を同時に実行します  
png -> png & webp  
jpeg -> jpeg & webp  
svg -> minify  
監視、開発用、公開用すべてのコマンドで実行します

```
$ yarn images
```

<small>※ 画像追加、修正時にこのコマンドを実行してください。</small>

### 設定変更

各種設定 package.json の script に記載されています

- 画像が出力されるディレクトリを変更する場合はパスを変更してください
- webp 化の際に png, jpeg など元ファイルを出力しない場合はオプション `-m` を外してください
- webp 化を行わない場合はオプション `-w` を外してください

```JSON
"scripts": {
  "images": "node convertImage.mjs -i ./src/images -o ./public/assets/images -m -w -t -v",
},
```

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
