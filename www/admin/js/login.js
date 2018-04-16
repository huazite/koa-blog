$(function(){
    $('#btn').on('click',function(e){
        e.preventDefault();
        $.post('/login',{
            username:$('#username').val(),
            password:$('#password').val(),
            remember:$('#remember').val()
        },function(result){
            //console.log(result);
            
            if(result.retCode == 1){
                var date=new Date(); //获取当前时间
                date.setTime(date+20*24*3600*1000); //格式化为cookie识别的时间
                document.cookie='token=' + result.data.token+';path=/'; //设置cookie
              
                var timeOut = 3;
                $('#infoBox').html('登录成功，'+ timeOut +'秒内后跳转到<a href="/" style="color:#0085d1">首页</a>');
                $('#infoBox').css({
                    'display': 'block',
                    'border-left': '4px solid #0085ba'
                });
                setInterval(()=>{ 
                    $('#infoBox').html('登录成功，'+ timeOut +'秒内后跳转到<a href="/" style="color:#0085d1">首页</a>');
                   
                    if(timeOut == 0){
                        window.location = '/';
                    }
                    timeOut--;
                },1000);


            }else{
                $('#infoBox').html(result.msg);
                $('#infoBox').css({
                    'display': 'block',
                    'border-left': '4px solid #dc3232'
                });
            }
        })
    });

    $('#reg').on('click',function(e){
        e.preventDefault();
       if( !(uEmailBlur() && uNameBlur() && uPswBlur() && rePswBlur())){
            return false;
       }   
       $.post('/register',{
            uEmail: $('#u_email').val(),
            uName:$('#u_name').val(),
            uPsw:$('#u_psw').val(),
            uBlog:$('#u_blog').val()
       },function(result){
            if(result.retCode == 1){
                var timeOut = 3;
                $('#infoBox').css({
                    'display': 'block',
                    'border-left': '4px solid #0085ba'
                });
                setInterval(()=>{ 
                    $('#infoBox').html('注册成功，'+ timeOut +'秒内后跳转到<a href="./login.html" style="color:#0085d1">登录页</a>');
                    if(timeOut == 0){
                        window.location = './login.html';
                    }
                    timeOut--;
                },1000);

            }else{
                $('#infoBox').css('display', 'block');
                $('#infoBox').html(result.msg);
            }
            
       });
    })


    $('#u_email').blur(function(){
        uEmailBlur();
    });
    $('#u_name').blur(function(){
        uNameBlur();
    });
    $('#u_psw').blur(function(){
        uPswBlur();
    });
    $('#re_psw').blur(function(){
        rePswBlur();
    });
    function uEmailBlur(){
        var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        var uEmail = $('#u_email').val();
        if(uEmail == ''){
            $('#infoBox').css('display', 'block');
            $('#infoBox').html("请输入邮箱地址");
            return false;
        }
        if(!re.test(uEmail)){
            $('#infoBox').css('display', 'block');
            $('#infoBox').html('邮件格式不正确！');
            return false;
        }
        return true;
    }


    
    function uNameBlur(){
        var  uName = $('#u_name').val();
        if(uName == ''){
            $('#infoBox').css('display', 'block');
            $('#infoBox').html('请输入用户名');
            return false;
        }
        return true;
    }
 
    function uPswBlur(){
        var  uPsw = $('#u_psw').val();
        if(uPsw == ''){
            $('#infoBox').css('display', 'block');
            $('#infoBox').html('请输入密码');
            return false;
        }else if(uPsw.length < 6){
            $('#infoBox').css('display', 'block');
            $('#infoBox').html('密码必须大于6位数');
            return false;
        }
        return true;
    }

    function rePswBlur(){
        var  uPsw = $('#u_psw').val();
        var  rePsw = $('#re_psw').val();
        //console.log(uPsw,rePsw);
        
        if(rePsw == ''){
            $('#infoBox').css('display', 'block');
            $('#infoBox').html('请确认密码');
            return false;
        }
        if(uPsw != rePsw){
            $('#infoBox').css('display', 'block');
            $('#infoBox').html('两次输入密码不一致！！');
            
            return false;
        }
        return true;
    }

})