$(document).ready(()=>{
    $("#home").on('click',function(event){
        //获取url中的id
        var query = window.location.search;
        var a = query.split("=");
        var id = a[1];
        
        event.preventDefault();
        window.location.href = "/home";
    });
    //基础知识普及
    $("#introduce").on('click',function(event){
        //获取url中的id
        var query = window.location.search;
        var a = query.split("=");
        var id = a[1];
        event.preventDefault();
        if (!id) {
            alert("请先登录再来找我^0^")
        // window.location.href = `/knowledge`; 
        } else {
            window.location.href = `/knowledge?id=${id}`;
        }
    });
    //中医证型分析
    $("#typeAnalyse").on('click',function(event){
        event.preventDefault();
        //获取url中的id
        var query = window.location.search;
        var a = query.split("=");
        var id = a[1];
        if (!id) {
            alert("请先登录再来找我^0^")
        } else {
            let data={
                id:id
            }
            $.ajax({
                url: '/checking',
                method: 'post',
                data:data,
                success: function(res) {
                    if (res.code == 200) {
                        alert(res.msg);
                        window.location.href = `/typeAnalyse?id=${id}`;
                    } else {
                        alert(res.msg);
                        window.location.href = `/intervention?id=${id}`; 
                    }
                },
                error: function(err) {
                    console.log(err);
                }
            })
        }
        
    })
    //体检报告分析
    $("#reportAnalyse").on('click',function(event){
        event.preventDefault();
        //获取url中的id
        var query = window.location.search;
        var a = query.split("=");
        var id = a[1];

        if (!id) {
            alert("请先登录再来找我^0^")
        } else {
            window.location.href = `/reportAnalyse?id=${id}`;
        }
    });
    //健康干预
    $("#intervention").on('click',function(event){
        event.preventDefault();
        //获取url中的id
        var query = window.location.search;
        var a = query.split("=");
        var id = a[1];

        if (!id) {
            alert("请先登录再来找我^0^")
        } else {
            let data={
                id:id
            }
            $.ajax({
                url: '/checking',
                method: 'post',
                data:data,
                success: function(res) {
                    if (res.code == 200) {
                        alert(res.msg);
                    } else {
                        alert(res.msg);
                        window.location.href = `/intervention?id=${id}`;
                    }
                },
                error: function(err) {
                    console.log(err);
                }
            })
            
        }
    });
    //个人信息
    $("#show").on('click',function(event){
        //获取url中的id
        var query = window.location.search;
        var a = query.split("=");
        var id = a[1];
        event.preventDefault();
        window.location.href = `/show?id=${id}`;
    })
    $("#logout").on('click',function(event){
        event.preventDefault();
        window.location.href = "/logout";
    })
    
});

