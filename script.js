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
        var isbn = convertISBN(r)
        document.getElementById('jancode').innerHTML = isbn
    }
},false);

function convertISBN(id){
  'use strict';
  var a, b, c, i;
  if (id.length === 13) {
    a = 0;
    b = 0;
    for (i = 0; i < 6; i = i + 1) {
      a += Number(id.charAt(i * 2));
      b += Number(id.charAt(i * 2 + 1));
    }
    c = (a + b * 3) % 10;
    if (c === 10) {
      c = 0;
    }
    if (c === Number(id.charAt(12))) {
      c = 0;
      id = id.slice(3, 12);
      for (i = 0; i < 10; i = i + 1) {
        c += Number(id.charAt(i)) * (10 - i);
      }
      c = 11 - c % 11;
      if (c === 10) {
        c = 'X';
      } else {
        if (c === 11) {
          c = 0;
        } 
      }
      id = id + String(c);
      return String('http://www.amazon.co.jp/dp/' + id + '/');
    }
    return false;
  }
  return false;
};