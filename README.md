# book-view
蔵書システムのフロントエンド部分

## 必要な画面
- トップ(index.html)
- 貸出・返却(borrow-return.html)
- 現在貸出しているリスト(borrow-list.html)
- 貸出履歴(history.html)
- 書籍登録(registration.html)
- (ユーザ名登録等の設定)
- (貸出ランキング？)

## スキャン部分
- UAでOSごとにスキャン部分変更(iOS：pic2shop, Android：HTML5の機能？)
- iOSでは、pic2shop(外部アプリ)を用いてバーコードをスキャン->ISBN取得

## ISBN読み込み時の処理
- 取得したISBNをJSを用いてGoogleAPIから書籍情報を取得(JSON形式)
- ISBNとユーザー名をサーバーに送る(予定)

## 貸出・返却時の画面
- スキャン後、「(書籍名)を貸出(返却)しますか？」アラートを出す

## オプション機能


## JSONフォーマット

### 蔵書リスト

```:book-list.json
[
    {
        "タイトル": "C言語入門",
        "著者名": "山田太郎",
        "出版社": "ABC社",
        "出版日": "2017-04-01",
        "ISBN": "1234567890",
        "貸出先": ["M0_1", "B4_0"]
    }
]
```

