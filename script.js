// バーコードスキャン
function scanJAN(){
    var s = 'pic2shop://scan?callback='+encodeURIComponent(location.origin+location.pathname+'?r=EAN')
    document.location = s
};

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
        //document.getElementById('jancode').innerHTML = r
        document.getElementById('jancode').innerHTML = r;
        getBookData(r);
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
            $("#BookTitle").text(data.items[0].volumeInfo.title);
            $("#isbn13").text(data.items[0].volumeInfo.industryIdentifiers[0].identifier);
            $("#isbn10").text(data.items[0].volumeInfo.industryIdentifiers[1].identifier);
            $("#BookAuthor").text(data.items[0].volumeInfo.authors[0]);
            $("#PublishedDate").text(data.items[0].volumeInfo.publishedDate);
            $("#BookDescription").text(data.items[0].volumeInfo.description);
            $("#BookThumbnail").html('<img src=\"' + data.items[0].volumeInfo.imageLinks.smallThumbnail + '\" />');
        }
    });
};