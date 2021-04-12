var errArray = [
    "手机号不能为空",
    "手机号格式不正确",
    "用户名不能为空",
    "用户名只能是英文、数字、下划线、减号的组合",
    "用户名长度必须在6-16个字符之间",
    "密码不能为空",
    "密码只能是英文、数字、下划线、减号的组合",
    "密码长度必须在6-16个字符之间",
    "验证码不能为空",
    "验证码不正确"
]

var accessToSubmit = [0,0,0,0]

var telePattern = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/;

var pattern = /^[a-zA-Z0-9_\-]+$/;

var lockTime = 0;

function LockBtn(btn) {
    if (lockTime == 0) {
        btn.removeAttribute("disabled");
        btn.innerHTML = "Get Code";
    } else {
        lockTime--;
        btn.setAttribute("disabled", true);
        btn.innerHTML = "(" + lockTime + ")";
        // 每隔一秒重新调用
        setTimeout(() => {
            LockBtn(btn);
        }, 1000);
    }
}

$(document).ready(() => {

    $('#tele').blur(function() {
        let userTele = $(this).val();
        if (userTele == "") {
            $('#teleMsg').html(errArray[0]).css('color', 'red');
            $(this).removeClass('is-valid').addClass('is-invalid');
            accessToSubmit[0] = 0;
        } else if (!telePattern.test(userTele)) {
            $('#teleMsg').html(errArray[1]).css('color', 'red');
            $(this).removeClass('is-valid').addClass('is-invalid');
            accessToSubmit[0] = 0;
        } else {
            $('#teleMsg').html('&nbsp');
            $(this).removeClass('is-invalid').addClass('is-valid');
            accessToSubmit[0] = 1;
        }
    })
    
    $('#username').blur(function() {
        let userName = $(this).val();
        if (userName == "") {
            $('#usernameMsg').html(errArray[2]).css('color', 'red');
            $(this).removeClass('is-valid').addClass('is-invalid');
            accessToSubmit[1] = 0;
        } else if(!pattern.test(userName)) {
            $('#usernameMsg').html(errArray[3]).css('color', 'red');
            $(this).removeClass('is-valid').addClass('is-invalid');
            accessToSubmit[1] = 0;
        } else if(userName.length < 6 || userName.length > 16) {
            $('#usernameMsg').html(errArray[4]).css('color', 'red');
            $(this).removeClass('is-valid').addClass('is-invalid');
            accessToSubmit[1] = 0;
        } else {
            $('#usernameMsg').html('&nbsp');
            $(this).removeClass('is-invalid').addClass('is-valid');
            accessToSubmit[1] = 1;
        }
    })
    
    $('#password').blur(function() {
        let pwd = $(this).val();
        if (pwd == "") {
            $('#passwordMsg').html(errArray[5]).css('color', 'red');
            $(this).removeClass('is-valid').addClass('is-invalid');
            accessToSubmit[2] = 0;
        } else if (!pattern.test(pwd)) {
            $('#passwordMsg').html(errArray[6]).css('color', 'red');
            $(this).removeClass('is-valid').addClass('is-invalid');
            accessToSubmit[2] = 0;
        } else if (pwd.length < 6 || pwd.length > 16) {
            $('#passwordMsg').html(errArray[7]).css('color', 'red');
            $(this).removeClass('is-valid').addClass('is-invalid');
            accessToSubmit[2] = 0;
        } else {
            $('#passwordMsg').html('&nbsp');
            $(this).removeClass('is-invalid').addClass('is-valid');
            accessToSubmit[2] = 1;
        }
    })
    
    $('#code').blur(function() {
        let code = $(this).val();
        if (code == "") {
            $('#codeMsg').html(errArray[5]).css('color', 'red');
            $(this).removeClass('is-valid').addClass('is-invalid');
            accessToSubmit[3] = 0;
        } else {
            $('#codeMsg').html('&nbsp');
            $(this).removeClass('is-invalid').addClass('is-valid');
            accessToSubmit[3] = 1;
        }
    })

    /**
     * 发送验证码，校验验证码
     */

    $('#sendBtn').on('click', (event) => {
        event.preventDefault();
        let userTele = $('#tele').val();
        if (accessToSubmit[0] == 0) {
            $('#codeMsg').html("手机号有误").css('color', 'red');
            accessToSubmit[3] = 0;
        } else if (accessToSubmit[0] == 1) {
            lockTime = 180;
            btn = document.getElementById('sendBtn')
            LockBtn(btn);
            $.get('/sendCode/' + userTele, (res) => {
                if (res.code == 500) {
                    alert(res.msg);                    
                } else if (res.code == 200) {
                    alert(res.msg)
                }
            })
        }
    })

    /**
     * 用户注册
     */
    $('#signupBtn').on('click', (event) => {
        event.preventDefault();
        // 可以提交了
        if (accessToSubmit[0] && accessToSubmit[1] && accessToSubmit[2] ) {  //暂时除去验证码&& accessToSubmit[3]
            let info = $('#fm').serialize();
            console.log(info);
            $.ajax({
                url: '/register',
                method: 'post',
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
        }
    })

})