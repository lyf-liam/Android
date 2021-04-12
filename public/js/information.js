$(document).ready(()=>{
    //返回
    $("#backBtn").on('click',function(event){
        //获取url中的id
        var query = window.location.search;
        var a = query.split("=");
        var id = a[1];
        window.location.href = `/administor/showStudent`;
    });

});