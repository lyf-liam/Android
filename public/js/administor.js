function timeFormat(time) {
    var datetime = new Date();
    datetime.setTime(time);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
    var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}

var accessToSubmit = [0]

var telePattern = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/;

var errArray = [
    "手机号不能为空",
    "手机号格式不正确"
]

$(document).ready(function () {
    
    $('#createNewsBtn').on('click', function (event) {
        event.preventDefault();
        let newsInfo = {
            title: $('#newsTitle').val(),
            type: $('#type').val(),
            datetime: timeFormat(new Date().getTime()),
            content : $('#content').val()
        }
        $.ajax({
            url: '/administor/newsCreate',
            method: 'post',
            data: newsInfo,
            success: function (res) {
                if (res.code == 200) {
                    alert(res.msg);
                    window.location.href = '/administor/showNews'
                } else if (res.code == 500) {
                    alert(res.msg);
                    window.location.href = '/administor/showNews'
                }
            },
            error: function (err) {
                console.log(err)
            }
        })
    });

    $('#createWaysBtn').on('click', function (event) {
        event.preventDefault();
        let waysInfo = {
            waysname: $('#waysTitle').val(),
            typeid: $('#waystype').val(),
            typename: $('#typename').val(),
            content : $('#wayscontent').val()
        }
        $.ajax({
            url: '/administor/waysCreate',
            method: 'post',
            data: waysInfo,
            success: function (res) {
                if (res.code == 200) {
                    alert(res.msg);
                    window.location.href = '/administor/showWays'
                } else if (res.code == 500) {
                    alert(res.msg);
                    window.location.href = '/administor/showWays'
                }
            },
            error: function (err) {
                console.log(err)
            }
        })
    });

    $('.newsItem').each(function (i) {
        if ($(this).children('.newsStatus').hasClass('1')) {
            $(this).attr({ class: "newsItem table-success" })
        } else if ($(this).children('.newsStatus').hasClass('2')) {
            $(this).attr({ class: "newsItem table-warning" })
        } else if ($(this).children('.newsStatus').hasClass('3')) {
            $(this).attr({ class: "newsItem table-danger" })
        }
    });

    $('#addBatchBtn').on('click', function (event) {
        event.preventDefault();
        //获取url中的id
        var query = window.location.search;
        var a = query.split("=");
        var id = a[1];
        let file = new FormData();
        file.append('file', document.getElementById('userexcel').files[0])
        $.ajax({
            url: '/administor/addUsersByBatch',
            method: 'post',
            data: file,
            cache: false,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.code == 200) {
                    alert(res.msg)
                    window.location.href = `/administor/showStudent?id=${id}`
                } else {
                    alert(res.msg)
                }
            },
            error: function (err) {
                console.log(err)
            }
        })
    })
    $('#usertele').blur(function() {
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
    $('#addSingleBtn').on('click', function (event) {
        event.preventDefault();
        //获取url中的id
        var query = window.location.search;
        var a = query.split("=");
        var id = a[1];
        let info = $('#singlefm').serialize()
        console.log(info)
        if (accessToSubmit[0]==1) {
            $.ajax({
                url: '/administor/addUsersBySingle',
                method: 'post',
                data: info,
                success: function (res) {
                    if (res.code == 200) {
                        alert(res.msg)
                        window.location.href = `/administor/showStudent?id=${id}`
                    } else {
                        alert(res.msg)
                    }
                },
                error: function (err) {
                    console.log(err)
                }
            })
        } 
        
    })
})

