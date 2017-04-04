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

function debugtest(){
    var selectName = document.forms.property.username;
    console.log(selectName.selectedIndex);
}

function getUserName(){
    var selectName = document.forms.property.username;
    var index = selectName.selectedIndex;
    return selectName.options[index].text;
}

function getCurrentDir(){
    function getDir(place, n) {
        return place.pathname.replace(new RegExp("(?:\\\/+[^\\\/]*){0," + ((n || 0) + 1) + "}$"), "/");
    }
    var local = window.location;
	var url = local.origin;
    return url + getDir(local); // 現在のディレクトリ
    //url + getDir(local,1);
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
        dialog = "　を借りてもいいですか？"
    }else if (nowEvent == "return"){
        dialog = "　を返却してもいいですか？"
    }
    $.ajax({
        url: hostURL,
        type: "POST",
        data: JSON.stringify(data),
        timeout: 10000,
        success: function(){
            var result = confirm(title + dialog);
            if(result){
                window.location.href = current + "borrow-return.html";
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            var result = confirm(title + dialog);
            if(result){
                window.location.href = current + "borrow-return.html";
            }
        }
    });
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

// データ取得
function getBookData(isbn){
    const url = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn;
    $.getJSON(url, function(data) {
        if(!data.totalItems) { // 書籍が見つからないとき
            $("#BookTitle").text("");
            $("#BookAuthor").text("");
            $("#PublishedDate").text("");
            $("#BookThumbnail").text("");
            alert("書籍が見つかりませんでした。\nISBNを確認してください。")
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

function checkNumber(obj){
    var num = obj.value;
    if(num.match(/[^0-9]/g)){
        alert ("半角数値で入力して下さい");
        return false;
    }else{
        getBookData(num);
    }
}

function memberSet(){
    var nameStaff = [
        "staff_1", "staff_2"
    ];

    var nameM0 = [
        "M0_1", "M0_2", "M0_3", "M0_4"
    ];
    
    var nameB4 = [
        "B4_1", "B4_2", "B4_3"
    ];

    var nameB3 = [
        "B3_1", "B3_2", "B3_3"
    ];

    var selectGrade = document.forms.property.grade;
    var selectName = document.forms.property.username;
    selectName.options.length = 0;

    function setIndex(array){
        for(var i=0;i<array.length;i++){
            selectName.options[i] = new Option(array[i]);
        }
    }
    switch(selectGrade.selectedIndex){
        case 0: selectName.options.length = 0; break;
        case 1: setIndex(nameStaff); break;
        case 2: setIndex(nameM0); break;
        case 3: setIndex(nameB4); break;
        case 4: setIndex(nameB3); break;
    }
}

function checkProperty(){
    var selectName = document.forms.property.username;
    var index = selectName.selectedIndex;
    var nowEvent = getProperty();
    if(index != -1 && nowEvent != ""){
        document.getElementById("runbutton").disabled = false;
    }
}

function addValue(){
    var nowValue = document.getElementById("booknum").value;
    document.getElementById("booknum").value = parseInt(nowValue, 10) + 1;
}

function subValue(){
    var nowValue = document.getElementById("booknum").value;
    if(nowValue != "0"){
        document.getElementById("booknum").value = parseInt(nowValue, 10) - 1;
    }
}

function registerBook(){
    var isbn = document.getElementById("jancode").value;

}