var title = "";

// バーコードスキャン
function scanJAN(){
    if ((navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf( 'iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0) { // iOS
        var s = 'pic2shop://scan?callback='+encodeURIComponent(location.origin+location.pathname+'?r=EAN')
        document.location = s
    }else if(navigator.userAgent.indexOf('Android') > 0){ // Android
        // getBookData(取得したISBNの番号)とすれば、書籍情報の表示ができる
    }else{ // PC

    }
};

// ISBN手打ち時の処理
function onButtonJAN(){
    var isbn = document.getElementById("jancode").value;
    postToServer(isbn);
}

// バーコードから番号を読み取る
window.addEventListener('DOMContentLoaded',function(){
    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    var r = getParameterByName('r')
    if(r){
        document.getElementById('jancode').innerHTML = r;
        document.getElementById("jancode").value = r;
        getBookData(r);
    }
},false);

// 選択されたユーザー名を返す
function getUserName(){
    var selectName = document.forms.property.username;
    var index = selectName.selectedIndex;
    return selectName.options[index].text;
}

// 選択されたラジオボタンの値を読み取る
function getProperty(){
    var nowEvent = "";
    for(var i=0;i<document.property.event.length;i++){
        if(document.property.event[i].checked){
            nowEvent = document.property.event[i].value;
        }
    }
    return nowEvent;
}

// 現在のディレクトリを返す
function getCurrentDir(){
    function getDir(place, n) {
        return place.pathname.replace(new RegExp("(?:\\\/+[^\\\/]*){0," + ((n || 0) + 1) + "}$"), "/");
    }
    var local = window.location;
	var url = local.origin;
    return url + getDir(local); // 現在のディレクトリ
}

// サーバーにPOST
function postToServer(isbn){
    var nowUserName = getUserName();
    var nowEvent = getProperty();
    var data = {
            username: nowUserName,
            event: nowEvent,
            isbn: isbn
    };
    console.log(JSON.stringify(data));
    var hostURL = ""; // サーバーのURL
    var current = getCurrentDir();
    var dialog = "";
    if(nowEvent == "borrow"){
        dialog = "\nを借りてもよろしいですか？"
    }else if (nowEvent == "return"){
        dialog = "\nを返却してもよろしいですか？"
    }
    var result = confirm(title + dialog);
    if(result){
        $.ajax({
            url: hostURL,
            type: "POST",
            data: JSON.stringify(data),
            timeout: 10000,
            success: function(){
                window.location.href = current + "result.html";
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
                window.location.href = current + "result.html";
            }
        });
    }
}

// データ取得
function getBookData(isbn){
    const url = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn;
    $.getJSON(url, function(data) {
        if(!data.totalItems) { // 書籍が見つからないとき
            $("#BookTitle").text("");
            $("#BookAuthor").text("");
            $("#PublishedDate").text("");
            $("#BookThumbnail").text("");
            $("#Publisher").text("");
            document.getElementById("property").style.display = "none";
            alert("書籍が見つかりませんでした。\nISBNを確認するか、書籍情報を入力してください。");
        }else{ // 書籍が見つかったとき
            title = data.items[0].volumeInfo.title;
            $("#BookTitle").html(data.items[0].volumeInfo.title);
            $("#BookTitle").val(data.items[0].volumeInfo.title);
            $("#BookAuthor").html(data.items[0].volumeInfo.authors[0]);
            $("#BookAuthor").val(data.items[0].volumeInfo.authors[0]);
            $("#PublishedDate").html(data.items[0].volumeInfo.publishedDate);
            $("#PublishedDate").val(data.items[0].volumeInfo.publishedDate);
            $("#Publisher").html(data.items[0].volumeInfo.publisher);
            $("#Publisher").val(data.items[0].volumeInfo.publisher);
            $("#BookThumbnail").html('<img src=\"' + data.items[0].volumeInfo.imageLinks.smallThumbnail + '\" />');
            document.getElementById("property").style.display = "block";
        }
    });
};

// 書籍のタイトルを取得する
function getBookTitle(isbn){
    const url = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn;
    var title = "";
    $.getJSON(url, function(data) {
        if(!data.totalItems) {
            title = "";
        }else{
            title = data.items[0].volumeInfo.title;
        }
    });
}

// 入力されたISBNをチェックする
function checkNumber(obj){
    var num = obj.value;
    if(num.match(/[^0-9]/g)){
        alert ("半角数値で入力して下さい");
        return false;
    }else{
        getBookData(num);
    }
}

// プルダウンメニューにメンバーをセット
function memberSet(){
    var memberName = [[]];
    var current = getCurrentDir();
    const url = current + "static/data/member.json";
    $.getJSON(url, function(json) {
        for(var i=0;i<7;i++){
            var tmp = $.map(json[i], function(value, index) {
                return value;
            });
             memberName.push(tmp);
        }
        console.log(memberName);
        var selectGrade = document.forms.property.grade;
        var selectName = document.forms.property.username;
        selectName.options.length = 0;
        function setIndex(array){
            for(var i=0;i<array.length;i++){
                selectName.options[i] = new Option(array[i]);
            }
        }
        var selected = selectGrade.selectedIndex;
        switch(selected){
            case 0: selectName.options.length = 0; break;
            default: setIndex(memberName[selected]);
        }
    });
}

// ユーザー名、貸借が選択されているかチェック
function checkProperty(){
    var selectName = document.forms.property.username;
    var index = selectName.selectedIndex;
    var nowEvent = getProperty();
    if(index != -1 && nowEvent != ""){ // 選択されていれば実行ボタンを有効化
        document.getElementById("runbutton").disabled = false;
    }
}

// 冊数を足す
function addValue(){
    var nowValue = document.getElementById("booknum").value;
    document.getElementById("booknum").value = parseInt(nowValue, 10) + 1;
}

// 冊数を引く
function subValue(){
    var nowValue = document.getElementById("booknum").value;
    if(nowValue != "0"){
        document.getElementById("booknum").value = parseInt(nowValue, 10) - 1;
    }
}

// 本を登録する
function registerBook(){
    var nowIsbn = document.getElementById("jancode").value;
    var nowTitle = document.getElementById("BookTitle").value;
    var nowAuthor = document.getElementById("BookAuthor").value;
    var nowPublishedDate = document.getElementById("PublishedDate").value;
    var nowPublisher = document.getElementById("Publisher").value;
    var nowBookValue = document.getElementById("booknum").value;
    var data = {
            isbn: nowIsbn,
            title: nowTitle,
            author: nowAuthor,
            publisheddate: nowPublishedDate,
            publisher: nowPublisher,
            bookvalue: nowBookValue
    };

    console.log(JSON.stringify(data));
    var hostURL = ""; // サーバーのURL
    var current = getCurrentDir();
    var dialog = "";
    var result = confirm(nowTitle + "\n" + nowAuthor + "\n" + "を登録してもよろしいですか？");
    if(result){
        $.ajax({
            url: hostURL,
            type: "POST",
            data: JSON.stringify(data),
            timeout: 10000,
            success: function(){
                window.location.href = current + "result.html";
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
                window.location.href = current + "result.html";
            }
        });
    }
}

// jsonをテーブルに変換する
$(document).ready(function() {
    function setJsonFile(url, tableID){
        $.getJSON(url, function(json) {
            $(tableID).columns({
                data:json
            });
        });
    }
    var nowURL = location.href;
    var current = getCurrentDir();
    if(nowURL.indexOf("borrow-list.html") != -1){
        const url = current + "static/data/borrow-list.json";
        setJsonFile(url, "#borrow-list");
    }
    if(nowURL.indexOf("history.html") != -1){
        const url = current + "static/data/history.json";
        setJsonFile(url, "#history");
    }
    if(nowURL.indexOf("book-list.html") != -1){
        const url = current + "static/data/book-list.json";
        setJsonFile(url, "#book-list");
    }
});

function debugtest(){

}