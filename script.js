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

function onButtonJAN(){
    var isbn = document.getElementById("jancode").value;
    getBookData(isbn);
    postToServer(isbn);
}

function postToServer(isbn){
    var json = {
        "username": "",
        "event": "", // borrow か returnが入る
        "isbn": ""
    };
    for(var i=0;i<document.property.username.length;i++){
        if(document.property.username[i].checked){
            json.username = document.property.username[i].value;
        }
    }
    for(var i=0;i<document.property.event.length;i++){
        if(document.property.event[i].checked){
            json.event = document.property.event[i].value;
        }
    }
    json.isbn = isbn;
    console.log(json);
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
        getBookData(r);
        postToServer(isbn);
    }
},false);

// データ取得
function getBookData(isbn){
    const url = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn;
    $.getJSON(url, function(data) {
        if(!data.totalItems) {
            $("#isbn").val("");
            $("#BookTitle").text("");
            $("#BookAuthor").text("");
            $("#isbn10").text("");
            $("#isbn13").text("");
            $("#PublishedDate").text("");
            $("#BookThumbnail").text("");
            $("#BookDescription").text("");
            $("#BookMemo").val("");
            $("#message").html('<p class="bg-warning" id="warning">該当する書籍がありません。</p>');
            $('#message > p').fadeOut(3000);
        }else{
            $("#BookTitle").html(data.items[0].volumeInfo.title);
            $("#isbn13").html(data.items[0].volumeInfo.industryIdentifiers[0].identifier);
            $("#isbn10").html(data.items[0].volumeInfo.industryIdentifiers[1].identifier);
            $("#BookAuthor").html(data.items[0].volumeInfo.authors[0]);
            $("#PublishedDate").html(data.items[0].volumeInfo.publishedDate);
            $("#BookDescription").html(data.items[0].volumeInfo.description);
            $("#BookThumbnail").html('<img src=\"' + data.items[0].volumeInfo.imageLinks.smallThumbnail + '\" />');
        }
    });
};