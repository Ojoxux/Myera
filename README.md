# 明日のごみ収集予定をAlexaに話させたい

## コマンド

```bash
yarn install
yarn build
yarn deploy
```

## デプロイ

### Lambda

`yarn deploy`で作成したzipファイルをLambda`trash-alert`にアップロード

### Alexa Skill

Skill package/interaction modelを更新したときだけ実行

```bash
ask deploy
```
