# Gulp Template

Gulp + PUG + TypeScript (Webpack) + Sass + Image Compression  
PUG テンプレートエンジン, TypeScript トランスパイル, Sass (Scss), 画像最適化＆webp 化を目的としたビルダー（タスクランナー）。

(macOS 14.4.1 / node v21.7.3 / Yarn v4.1.1 検証済み)

- pug -> html
- typescript -> js
- sass -> css

## yarn パッケージをインストール

プロジェクトのディレクトリに移動して実行

```
$ yarn install
```

## gulp の監視

```
$ yarn start
```

## 開発用ファイル生成

開発用のファイル一式を生成

```
$ yarn dev
```

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
├─ convertImage.mjs
├─ gulpfile.mjs
├─ package.json
├─ README.md
├─ tsconfig.json
├─ webpack.development.js
└─ webpack.production.js
```

## 再インストール

`yarn` まわりでエラーが出た場合は node_modules の再インストールをしてください。

```
$ rm -rf node_modules
$ yarn cache clean
$ yarn install
```

## 参考 <!-- Reference -->
