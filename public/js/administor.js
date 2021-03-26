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

$(document).ready(function () {
    $('#createNewsBtn').on('click', function (event) {
        event.preventDefault();
        let newsInfo = {
            title: $('#newsTitle').val(),
            type: $('#type').val(),
            datetime: timeFormat(new Date().getTime()),
            status: 2
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
                    window.location.href = '/administor/showStudent'
                } else {
                    alert(res.msg)
                }
            },
            error: function (err) {
                console.log(err)
            }
        })
    })
})