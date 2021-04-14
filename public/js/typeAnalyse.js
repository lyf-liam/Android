$(document).ready(function (event) {
    $("#submitBtn").on('click',(event)=>{
        event.preventDefault();
        var query = window.location.search;
        var a = query.split("=");
        var id = a[1];
        var gysk=0;
        var gsyx=0;
        var tsnz=0;
        var yxnt=0;
        var yylx=0;
        var str="";
        var str1="";
        var total=0;
        var last=[];
        let data=$("#fm").serializeArray();       
        if(Object.values(data[0])[0]=='a1'&&Object.values(data[0])[1]==1){
            gysk++;
            last[1]=1;
        }else if(Object.values(data[0])[0]=='a1'&&Object.values(data[0])[1]==0){
            last[1]=1;
        }else{
            last[1]=0;
        }
        if(Object.values(data[1])[0]=='a2'&&Object.values(data[1])[1]==1){
            gysk++;
            last[2]=1;
        }else if(Object.values(data[1])[0]=='a2'&&Object.values(data[1])[1]==0){
            last[2]=1;
        }else{
            last[2]=0;
        }
        if(Object.values(data[2])[0]=='a3'&&Object.values(data[2])[1]==1){
            gysk++;
            last[3]=1;
        }else if(Object.values(data[2])[0]=='a3'&&Object.values(data[2])[1]==0){
            last[3]=1;
        }else{
            last[3]=0;
        }
        if(Object.values(data[3])[0]=='a4'&&Object.values(data[3])[1]==1){
            gsyx++;
            last[4]=1;
        }else if(Object.values(data[3])[0]=='a4'&&Object.values(data[3])[1]==0){
            last[4]=1;
        }else{
            last[4]=0;
        }
        if(Object.values(data[4])[0]=='a5'&&Object.values(data[4])[1]==1){
            gsyx++;
            last[5]=1;
        }else if(Object.values(data[4])[0]=='a5'&&Object.values(data[4])[1]==0){
            last[5]=1;
        }else{
            last[5]=0;
        }
        if(Object.values(data[5])[0]=='a6'&&Object.values(data[5])[1]==1){
            tsnz++;
            last[6]=1;
        }else if(Object.values(data[5])[0]=='a6'&&Object.values(data[5])[1]==0){
            last[6]=1;
        }else{
            last[6]=0;
        }
        if(Object.values(data[6])[0]=='a7'&&Object.values(data[6])[1]==1){
            tsnz++;
            last[7]=1;
        }else if(Object.values(data[6])[0]=='a7'&&Object.values(data[6])[1]==0){
            last[7]=1;
        }else{
            last[7]=0;
        }
        if(Object.values(data[7])[0]=='a8'&&Object.values(data[7])[1]==1){
            tsnz++;
            last[8]=1;
        }else if(Object.values(data[7])[0]=='a8'&&Object.values(data[7])[1]==0){
            last[8]=1;
        }else{
            last[8]=0;
        }
        if(Object.values(data[8])[0]=='a9'&&Object.values(data[8])[1]==1){
            tsnz++;
            last[9]=1;
        }else if(Object.values(data[8])[0]=='a9'&&Object.values(data[8])[1]==0){
            last[9]=1;
        }else{
            last[9]=0;
        }
        if(Object.values(data[9])[0]=='a10'&&Object.values(data[9])[1]==1){
            yxnt++;
            last[10]=1;
        }else if(Object.values(data[9])[0]=='a10'&&Object.values(data[9])[1]==0){
            last[10]=1;
        }else{
            last[10]=0;
        }
        if(Object.values(data[10])[0]=='a11'&&Object.values(data[10])[1]==1){
            yxnt++;
            last[11]=1;
        }else if(Object.values(data[10])[0]=='a11'&&Object.values(data[10])[1]==0){
            last[11]=1;
        }else{
            last[11]=0;
        }
        if(Object.values(data[11])[0]=='a12'&&Object.values(data[11])[1]==1){
            yylx++;
            last[12]=1;
        }else if(Object.values(data[11])[0]=='a12'&&Object.values(data[11])[1]==0){
            last[12]=1; 
        }else{
            last[12]=0;
        }
        if(Object.values(data[12])[0]=='a13'&&Object.values(data[12])[1]==1){
            yylx++;
            last[13]=1;
        }else if(Object.values(data[12])[0]=='a13'&&Object.values(data[12])[1]==0){
            last[13]=1;   
        }else{
            last[13]=0;
        }
        if(Object.values(data[13])[0]=='a14'&&Object.values(data[13])[1]==1){
            yylx++;
            last[14]=1;
        }else if(Object.values(data[13])[0]=='a14'&&Object.values(data[13])[1]==0){
            last[14]=1;
        }else{
            last[14]=0;
        }
        if(Object.values(data[14])[0]=='a15'&&Object.values(data[14])[1]==1){
            yylx++;
            last[15]=1;
        }else if(Object.values(data[14])[0]=='a15'&&Object.values(data[14])[1]==0){
            last[15]=1;
            
        }else{
            last[15]=0;
        }
        for(var i=1;i<=15;i++){
            if (last[i]==0) {
                var a="第"+i+"题";
                str1+=a;
            }
            total+=last[i];
        }
        console.log(gysk,gsyx,tsnz,yxnt,yylx);
        gysk=gysk/3;
        gsyx=gsyx/2;
        tsnz=tsnz/4;
        yxnt=yxnt/2;
        yylx=yylx/4;
        console.log(gysk/3,gsyx/2,tsnz/4,yxnt/2,yylx/4);
        if (gysk>gsyx&&gysk>tsnz&&gysk>yxnt&&gysk>yylx) {
            str+="肝阳上亢 ";
        }if (gsyx>gysk&&gsyx>tsnz&&gsyx>yxnt&&gsyx>yylx) {
            str+="肝肾阴虚 ";
        }if (tsnz>gysk&&tsnz>gsyx&&tsnz>yxnt&&tsnz>yylx) {
            str+="痰湿内阻 ";
        }if (yxnt>gysk&&yxnt>gsyx&&yxnt>tsnz&&yxnt>yylx) {
            str+="瘀血内停 ";
        }if (yylx>gysk&&yylx>gsyx&&yylx>tsnz&&yylx>yxnt) {
            str+="阴阳两虚 ";
        } 
        var list={
            str:str,
            str1:str1,
            total:total,
            id:id
        }
        console.log(str,str1,total)
        $.ajax({
            url: '/zxpd',
            method: 'post',
            data: list,
            success: function(res) {
                if (res.code == 200) {
                    alert(res.msg);
                    window.location.href = `/intervention?id=${id}`
                } else {
                    alert(res.msg);
                }
            },
            error: function(err) {
                console.log(err);
            }
        });

        
    });
    
})