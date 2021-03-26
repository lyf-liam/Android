function GetRequest() {  
    var url = location.search; //获取url中"?"符后的字串  
    var theRequest = new Object();  
    if (url.indexOf("?") != -1) {  
       var str = url.substr(1);  
       strs = str.split("&");  
       for(var i = 0; i < strs.length; i ++) {  
          theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);  
       }  
    }  
    return theRequest;  
 }  

$(document).ready(() => {
    $('#saveEditBtn').on('click', function(event) {
        event.preventDefault();
        let param = GetRequest();
        console.log(param['id'])
        let content = $('#content-editormd-markdown-doc').val();
        $.ajax({
            url: '/administor/editNews/save',
            method: 'post',
            data: {
                context: content,
                id: param['id']
            },
            success: function(res) {
                if (res.code == 200) {
                    alert(res.msg);
                    window.location.href = '/administor/showNews'
                } else {
                    alert(res.msg);
                    window.location.href = '/administor/showNews'
                }
            },
            error: function(err) {
                console.log(err.toString())
            }
        })
    })

    $('#cancelEditBtn').on('click', function(event) {
        event.preventDefault();
        window.location.href = '/administor/showNews';
    })
})