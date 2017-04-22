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
    var nowTitle = document.getElementById("BookTitle").value;
    var data = {
            username: nowUserName,
            event: nowEvent,
            isbn: isbn,
            title: nowTitle
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
    var title = document.getElementById("BookTitle").value;
    var result = confirm(title + dialog);
    if(result && nowUserName != "選択"){
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
    }else{
        alert("エラー：項目を確認してください");
    }
}

// データ取得
function getBookData(isbn){
    // 国会図書館からXML形式でデータを受け取る
    var hostURL = "http://iss.ndl.go.jp/api/opensearch?isbn=" + isbn;
    $.ajax({
        url: hostURL,
        type: "GET",
        dataType: "xml",
        timeout: 10000,
        error:function(errorThrown) {
            alert("エラー");
        },
        success:function(xml){
            var xmlText = xml.responseText;
            var xmlDoc = $.parseXML(xmlText);
            var item = $(xmlDoc).find("item");
            var newItem = item[item.length-1];
            var title = $(newItem).find("title").text();
            var titleMid = title.length/2;
            var titleRight = title.slice(0,titleMid);
            var titleLeft = title.slice(titleMid);
            if(titleRight == titleLeft){
                title = titleRight;
            }
            var author = $(newItem).find("creator, dc\\:creator").text().replace("著","").replace("監修","");
            var publisher = $(newItem).find("publisher, dc\\:publisher").text();
            var pubDate = $(newItem).find("pubDate").text();
            var date = new Date(pubDate);
            var year = String(date.getFullYear());
            var month = date.getMonth() + 1;
            var newDate = date.getDate();
            function checkDate(num){
                if(num < 10){
                    return "0" + String(num);
                }
                return String(num);
            }
            var newPubDate = year + "-" + checkDate(month) + "-" + checkDate(newDate);
            if(isNaN(year)){
                newPubDate = "";
            }
            console.log(title + author + newPubDate + publisher);
            $("#BookTitle").html(title);
            $("#BookTitle").val(title);
            $("#BookAuthor").html(author);
            $("#BookAuthor").val(author);
            $("#PublishedDate").html(newPubDate);
            $("#PublishedDate").val(newPubDate);
            $("#Publisher").html(publisher);
            $("#Publisher").val(publisher);
            //$("#BookThumbnail").html('<img src=\"' + data.items[0].volumeInfo.imageLinks.smallThumbnail + '\" />');
            document.getElementById("property").style.display = "block";
        }
    });
};

// JSONから書籍情報を取得する(貸出・返却、削除で使用)
function getBookDataJson(isbn){
    var json = getJsonFromHtml();
    var count = 0;
    var newJson = json.filter(function(item, index){
        if(item.ISBN == isbn){
            count++;
            return true;
        }else{
            return false;
        }
    });
    if(count == 0){
        alert("該当する書籍が見つかりません");
        $("#BookTitle").html("");
        $("#BookTitle").val("");
        $("#BookAuthor").html("");
        $("#BookAuthor").val("");
        $("#PublishedDate").html("");
        $("#PublishedDate").val("");
        $("#Publisher").html("");
        $("#Publisher").val("");
        $("#BookValue").html("");
        $("#BookValue").val("");
    }
    if(newJson.length != 0){
        var title = newJson[0]["タイトル"];
        var author = newJson[0]["著者名"];
        var pubDate = newJson[0]["出版日"];
        var publisher = newJson[0]["出版社"];
        var bookvalue = newJson[0]["冊数"];
        $("#BookTitle").html(title);
        $("#BookTitle").val(title);
        $("#BookAuthor").html(author);
        $("#BookAuthor").val(author);
        $("#PublishedDate").html(pubDate);
        $("#PublishedDate").val(pubDate);
        $("#Publisher").html(publisher);
        $("#Publisher").val(publisher);
        $("#BookValue").html(bookvalue);
        $("#BookValue").val(bookvalue);
        document.getElementById("property").style.display = "block";
    }
}

// 入力されたISBNをチェックする
function checkNumber(obj){
    var num = obj.value;
    if(num.match(/[^0-9]/g)){
        alert ("半角数値で入力して下さい");
        return false;
    }else{
        var nowURL = location.href;
        if(num != ""){
            if(nowURL.indexOf("borrow-return.html") != -1 || nowURL.indexOf("book-delete.html") != -1){
                getBookDataJson(num);
            }else{
                getBookData(num);
            }
        }
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
    if(index != -1 && index != 0 && nowEvent != ""){ // 選択されていれば実行ボタンを有効化
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
    if(nowValue != "1"){ // 1未満にならないようにする
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
    if(nowIsbn == "" || nowTitle == "" || nowAuthor == "" || nowPublishedDate == "" || nowPublisher == ""){
        alert("入力されていない項目があります。");
    }else{
        var result = confirm(nowTitle + "\n" + nowAuthor + "\n" + "を登録してもよろしいですか？");
    }
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

// Jsonをテーブルに変換する
$(document).ready(function() {
    $.ajaxSetup({ cache: false });
    var nowURL = location.href;
    if(nowURL.indexOf("borrow-list.html") != -1){
        var jsonFile = getJsonFromHtml();
        $("#borrow-list").bootstrapTable({
            data: jsonFile,
            cache: false,
            rowStyle: "checkOver",
            columns: [
                {field: "貸出先", title: "貸出先", sortable: "true"},
                {field: "タイトル", title: "タイトル", sortable: "true"},
                {field: "出版社", title: "出版社", sortable: "true"},
                {field: "ISBN", title: "ISBN", sortable: "true", width:"110px"},
                {field: "貸出日", title: "貸出日", sortable: "true", width:"110px"},
                {field: "貸出日数", title: "貸出日数", sortable: "true", width:"100px"}
            ]
        });
    }
    if(nowURL.indexOf("history.html") != -1){
        var jsonFile = getJsonFromHtml();
        $("#history").bootstrapTable({
            data: jsonFile,
            cache: false,
            columns: [
                {field: "名前", title: "名前", sortable: "true"},
                {field: "日付", title: "日付", sortable: "true"},
                {field: "タイトル", title: "タイトル", sortable: "true"},
                {field: "貸出/返却", title: "貸出/返却", sortable: "true"}
            ]
        });
    }
    if(nowURL.indexOf("book-list.html") != -1){
        var jsonFile = getJsonFromHtml();
        $("#book-list").bootstrapTable({
            data: jsonFile,
            cache: false,
            columns: [
                {field: "タイトル", title: "タイトル", sortable: "true"},
                {field: "著者名", title: "著者名", sortable: "true"},
                {field: "出版社", title: "出版社", sortable: "true"},
                {field: "出版日", title: "出版日", sortable: "true", width:"110px"},
                {field: "ISBN", title: "ISBN", sortable: "true", width:"110px"},
                {field: "冊数", title: "冊数", sortable: "true", width:"110px"},
                {field: "状態", title: "状態", sortable: "true"}
            ]
        });
    }
});

// HTMLからJsonを取得
function getJsonFromHtml(){
    var json = $(".jsondata").text();
    json = JSON.parse(json);
    return json;
}

// 貸出日数が14日を超える場合、貸出リストを赤く表示
function checkOver(row, index){
    var num = parseInt(row.貸出日数,10);
    if(num >= 14){
        return {classes: "warning"};
    }else{
        return {};
    }
}

// 全削除か冊数を指定して削除かを検知
function checkDelete(){
    var nowEvent = getProperty();
    if(nowEvent == "alldelete"){
        document.getElementById("specify").style.display = "none";
    }else if(nowEvent == "delete"){
        document.getElementById("specify").style.display = "block";
    }
}

// 本を削除する
function deleteBook(){
    var nowEvent = getProperty();
    var nowTitle = document.getElementById("BookTitle").value;
    var bookMaxValue = document.getElementById("BookValue").value;
    var sendValue = bookMaxValue;
    var checkValue = false;
    if(nowEvent == "delete"){
        var selectedValue = document.getElementById("booknum").value;
        if(parseInt(selectedValue,10) > parseInt(bookMaxValue,10)){
            alert("正しい冊数を入力してください");
        }else{
            sendValue = selectedValue;
            checkValue = true;
        }
    }else{
        checkValue = true;
    }
    if(checkValue && nowTitle != ""){
        var isbn = document.getElementById("jancode").value;
        var title = document.getElementById("BookTitle").value;
        var data = {
            isbn: isbn,
            title: nowTitle,
            event: nowEvent,
            bookvalue: sendValue
        };
        console.log(JSON.stringify(data));
        var hostURL = "";
        var current = getCurrentDir();
        var result = confirm(title + "\nを" + " " + sendValue + " 冊削除します。" + "\nよろしいですか？");
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
}

function debugtest(){
}