
$(document).ready(function(){
    $('#changeNewsBtn').on('click', function (event) {
        event.preventDefault();
        console.log($('#newsId').val())
        console.log($('#newscontent').val())

        let newsInfo = {
            id:$('#newsId').val(),
            title: $('#newsTitle').val(),
            content : $('#newscontent').val()
        }
        $.ajax({
            url: '/administor/newsChange',
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

    $('#changeWaysBtn').on('click', function (event) {
        let waysInfo = {
            id:$('#waysId').val(),
            title: $('#waysTitle').val(),
            waystype: $('#waystype').val(),
            typename: $('#typename').val(),
            content : $('#wayscontent').val()
        }
        console.log("++++++++++")
        console.log(waysInfo)
        $.ajax({
            url: '/administor/waysChange',
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
  });

