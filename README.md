# book-view
蔵書システムのフロントエンド部分

## ディレクトリ

```
|--book-delete.html：蔵書削除
|--book-list.html：蔵書リスト
|--borrow-list.html：貸出リスト
|--borrow-return.html：貸出・返却
|--history.html：貸出履歴
|--index.html：トップページ
|--registration.html：蔵書登録
|--result.html：結果画面
|--static
| |--css
| | |--bootstrap-table.min.css：テーブル用
| | |--bootstrap.min.css
| | |--main.css：主にnavbarの設定
| |--data
| | |--book-list.json：蔵書リスト
| | |--borrow-list.json：貸出リスト
| | |--history.json：貸出履歴
| | |--member.json：メンバー
| |--fonts
| |--js
| | |--bootstrap-table-mobile.js：リストのモバイル表示用
| | |--bootstrap-table.min.js：リスト用
| | |--bootstrap.min.js
| | |--design.js：navbarの高さ変更
| | |--jquery-3.2.0.min.js
| | |--jquery.xdomainajax.js：クロスドメイン制約回避用
| | |--script.js：メインスクリプト
```

## 送信JSONフォーマット

### 書籍登録

```
[
    {
        isbn: nowIsbn, // ISBN
        title: nowTitle, // タイトル
        author: nowAuthor, // 著者名
        publisheddate: nowPublishedDate, // 出版日
        publisher: nowPublisher, // 出版社
        bookvalue: nowBookValue // 登録冊数
    }
]
```

### 書籍削除

```
[
    {
        isbn: isbn, // ISBN
        event: nowEvent, // "alldelete"(全削除) or "delete"(削除)
        bookvalue: sendValue // 削除する冊数
    }
]
```

### 貸出・返却

```
[
    {
        username: nowUserName, // ユーザー名
        event: nowEvent, // "borrow"(貸出) or "return"(返却)
        isbn: isbn // ISBN
    }
]
```

## 読み込みJSONフォーマット

### メンバー

member.json  
必ず選択は先頭に入れる。

```
[
    {
        "Staff":["選択","staff_0","staff_1"]
    },
    {
        "D":["選択"]
    },
    {
        "M2":["選択"]
    },
    {
        "M1":["選択"]
    },
    {
        "M0":["選択","M0_0","M0_1","M0_2","M0_3"]
    },
    {
        "B4":["選択","B4_0","B4_1","B4_2"]
    },
    {
        "B3":["選択","B3_0","B3_1","B3_2"]
    }
]
```

### 蔵書リスト

book-list.json

```
[
    {
        "タイトル": "C言語入門",
        "著者名": "山田太郎",
        "出版社": "ABC社",
        "出版日": "2017-04-01",
        "ISBN": "1234567890",
        "蔵書数": 2,
        "貸出先": ["M0_1", "B4_0"]
    }
]
```

### 貸出リスト

borrow-list.json

```
[
    {
        "貸出先": "M0_1",
        "タイトル": "C言語入門",
        "出版社": "ABC社",
        "ISBN": "1234567890",
        "貸出日": "2017-04-01",
        "貸出日数": "8"
    }
]
```

### 貸出履歴

history.json  
下に行くほど古い  

```
[
    {
        "貸出履歴": "M0_1 が 2017-04-01 に C言語入門 を借りました"
    },
    {
        "貸出履歴": "B4_0 が 2017-03-30 に C言語入門 を返却しました"
    }
]
```

## Chromeでのデバッグコマンド(Mac)

デフォルトだとローカルの.jsonを取ってこれない  
コマンドで起動したChrome上でデバッグを行う  

```
sudo /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args -allow-file-access-from-files
```
