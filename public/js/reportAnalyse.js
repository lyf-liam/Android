function ciyun(arr,ids){
var symbolUrl = 'data:image/png;base64,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';
var data = arr
var maskImage = new Image();
maskImage.onload = function() {
    ids.setOption({
        tooltip: {
            show: false
        },
        grid: {
            left: 0,
            bottom: 0,
            top: 0,
            right: 0,
        },
        xAxis: {
            type: "category",
            show: false
        },
        yAxis: {
            max: 100,
            show: false
        },
        series: [{
            type: 'wordCloud',
            sizeRange: [8, 60],
            rotationRange: [-30, 30],
            maskImage: maskImage,
            textPadding: 0,
            gridSize: 5,
            width: '60%',
            height: '65%',
            left: 'center',
            top: 'center',
            drawOutOfBound: false,
            textStyle: {
                normal: {
                    color: function() {
                        return 'rgb(' + [
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160)
                        ].join(',') + ')';
                    }
                },
            },
            data: data
        }, ]
    });
};
maskImage.src = symbolUrl;
}

$(document).ready(()=>{
    $('#chooseImage').on('change',function(){
        var filePath = $(this).val();         //获取到input的value，里面是文件的路径
        var fileFormat = filePath.substring(filePath.lastIndexOf(".")).toLowerCase();
        // 检查是否是图片
        if( !fileFormat.match(/.png|.jpg|.jpeg/) ) {
            // error_prompt_alert('上传错误,文件格式必须为：png/jpg/jpeg');
            alert('上传错误,文件格式必须为：png/jpg/jpeg');
            return;  
        }
        var src = window.URL.createObjectURL(this.files[0]); //转成可以在本地预览的格式
        $('#reportImg').attr('src',src);
    });
    $("#imgBtn").on('click',(event)=>{
        event.preventDefault();
        //获取url中的id
        var query = window.location.search;
        var a = query.split("=");
        var id = a[1];
        // let info=$('#showImgfm').serialize();
        let info=$('#chooseImage').val();
        console.log(info);
        let file = new FormData();
        file.append('file', document.getElementById('chooseImage').files[0])
        $.ajax({
            url: 'http://localhost:8082/file/upload',
            method: 'post',
            data: file,
            cache: false,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.code == 200) {

                    console.log(res)
                    var myChartFour = echarts.init(document.getElementById('right'));
                    ciyun(res.data,myChartFour)

                } else {
                    alert("err")
                    console.log(res)
                }
            },
            error: function (err) {
                console.log(err)
            }
        })
    })

})

