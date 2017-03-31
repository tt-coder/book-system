function scanJAN(){
    var s = 'pic2shop://scan?callback='+encodeURIComponent(location.origin+location.pathname+'?r=EAN')
    document.location = s
}

window.addEventListener('DOMContentLoaded',function(){
    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    var r = getParameterByName('r')
    if(r) document.getElementById('jancode').innerHTML = r
},false)