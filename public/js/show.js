$(document).ready(()=>{
    $("#changeBtn").on('click',function(event){
        //获取url中的id
        var query = window.location.search;
        var a = query.split("=");
        var id = a[1];
        
        event.preventDefault();
        let tele=$("#tele").val();
        console.log(tele);
        let username=$("#username").val();
        console.log(username);
        let password=$("#password").val();
        console.log(password);
        let surePassword=$("#surePassword").val();
        console.log(surePassword);
        let info={
            tele:tele,
            password:password,
            username:username,
            surePassword:surePassword
        }
        console.log("=============================================");
        console.log(info);
        if((password == surePassword)&&(username!='')){
            $.ajax({
                url:'/change',
                method:'post',
                data: info,
                success: function(res) {
                    if (res.code == 200) {
                        alert(res.msg);
                        window.location.href = "/home"
                    } else {
                        alert(res.msg);
                    }
                },
                error: function(err) {
                    console.log(err);
                }
            });
        }else if(surePassword==''){
            alert("您未进行修改^.^");
            window.location.href = `/knowledge?id=${id}`;
        }else{
            alert("两次密码不一样！！>_<");
        }
    });

    //返回
    $("#backBtn").on('click',function(event){
        //获取url中的id
        var query = window.location.search;
        var a = query.split("=");
        var id = a[1];
        alert("您未进行修改^.^");
        window.location.href = `/knowledge?id=${id}`;
    });

});