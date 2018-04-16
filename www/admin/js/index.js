$(function(){
    var sideFlag = localStorage.getItem('sideFlag'),
    fixWidthFlag = localStorage.getItem('fixWidthFlag'),
        skinFlag = localStorage.getItem('skinFlag');

        if(sideFlag == 'true'){
            $('#side').addClass('hidden');

            //设置开关状态
            $('#toggleSide').prop('checked','true')
            .parent().addClass('on-switch');

        }
        if(fixWidthFlag == 'true'){
            $('#nav').addClass('fix-width');
            $('.warp').addClass('fix-width');

            //设置开关状态
            $('#fixWidth').prop('checked','true')
            .parent().addClass('on-switch');
        }
        switch(skinFlag){
            case '2':
                $('#nav').css('background-color','#ed9e44');
                break;
            case '1':
                $('#nav').css('background-color','#1484c7');
                break;
            default:
                $('#nav').css('background-color','#333744');
                break;
        }
})
$(function(){
    //侧边栏展收
    $('#sideBar').on('click',function(){
        $('#side').toggleClass('hidden');
        
    });
    $('#toggleSide + .switchlabel').on('click',function(){
        $('#side').toggleClass('hidden');
        //展收设置存储本地
        if($('#side').hasClass('hidden')){
            
            localStorage['sideFlag'] = true;//true不显示，false显示
        }else{
            localStorage['sideFlag'] = false;
        }
        
    });
    //设置栏展收
    $('#settingBar').on('click',function(){
        $('#settingBox').toggle('easing');
    });

    //开关切换
    $('.switchlabel').on('click',function (){
        $(this).parent().toggleClass('on-switch');
     });
     //固定宽度效果
     $('#fixWidth + .switchlabel').on('click',function(){
        $('#nav').toggleClass('fix-width');
        $('.warp').toggleClass('fix-width');

         //固定设置存储本地
         if($('#nav').hasClass('fix-width')){
            localStorage['fixWidthFlag'] = true;//true固定，false不固定
        }else{
            localStorage['fixWidthFlag'] = false;
        }
    });

    //皮肤切换
    $('.skin div').on('click',function(){
        var index = $(this).index();
        switch(index){
            case 0:
                $('#nav').css('background-color','#333744');
                localStorage['skinFlag'] = 0;
                break;
            case 1:
                $('#nav').css('background-color','#1484c7');
                localStorage['skinFlag'] = 1;
                break;
            default:
                $('#nav').css('background-color','#ed9e44');
                localStorage['skinFlag'] = 2;
                break;
        }
    });


    //角色信息选项展收
    $('#roleInfo').on('click',function(e){
        $('#roleInfo .roleBox').fadeToggle();
        e.stopPropagation();
    });
    $('body').on('click',function(){
        $('#roleInfo .roleBox').fadeOut();
    })


    //二级菜单展收
    $('.item-a').on('click',function(){
        $(this).next().slideToggle();
        $(this).parents('.item').siblings().find('.item-inner').slideUp();

        $(this).toggleClass('on-show');
        $(this).parents('.item').siblings().find('.item-a').removeClass('on-show');
    });

    //二级菜单点击,展示页面
    $('.item-inner a').on('click',function(e){
        e.preventDefault();
        var link = $(this).attr('href');
        var name = $(this).data('name');
        var filterStr = `#pageTab ul li[data-id='${link}']`;
        
        
        if($(filterStr).length != 0){ //存在此标签页时，返回不添加
            $(filterStr).trigger('click');
            return;
        }

        //向iframeBox添加页面，向ul中添加tab
        var iframeNode = `<iframe id="${link}" class="active" data-id="${link}" src="${link}" frameborder="0"></iframe>`
        $('#iframeBox').children().removeClass('active');


        $('#iframeBox').append(iframeNode);

        var tabNode = `<li data-id="${link}" class="page active"><span class="fl">${name}</span><i class="icon-close fl"></i></li>`
        $('#pageTab ul li').removeClass('active');
        $('#pageTab .homePage').removeClass('active');
        $('#pageTab ul').append(tabNode);
        
    })
    //收缩状态下，点击功能项，自动回复大图标
    $('.items .item .side-hidden').on('click',function(){
        $('#side').removeClass('hidden');

        $(this).prev().find('.item-a').trigger('click');
    })

    //页面栏左右按钮切换
    $('#pageLeft').on('click',function(){
        $('.pageTab-warp').css('margin-left','0');
    });
    $('#pageRight').on('click',function(){
        var allPagesWidth = $('.pageTab-warp ul').width()+60;//60为主页按钮宽度
        var mainRightWidth = $('.main-right').width();
        var pageTabWidth = $('#pageTab').width()-mainRightWidth;
        
        //如果没被遮盖，不需要调整
        if(pageTabWidth > allPagesWidth){
           return;
        }
        //遮盖时，向左调整被遮盖宽度
        $('.pageTab-warp').css('margin-left', pageTabWidth - allPagesWidth+'px');
    });

    //关闭选项效果
    $('#pageClose').on('click',function(){
        $('.closeOption').fadeToggle();
    })
    $('.closeOption div').on('click',function(){
        var index = $(this).index();

        switch(index){
            case 0:
                $('#pageTab ul li.active .icon-close').trigger('click');
                break;
            case 1:
                $('#pageTab ul li.active').siblings().detach();
                $('#iframeBox iframe.active').siblings().not('.pageHome').detach();
                $('#pageTab ul li.active').trigger('click');
                break;
            default:
                $('#pageTab ul li').detach();
                $('#iframeBox iframe').not('.pageHome').detach();
                $('#pageTab .homePage').trigger('click');
                break;
        }
        $('.closeOption').fadeOut();
    })
    //主页按钮点击效果
    $('#pageTab .homePage').on('click',function(){
        $('#pageTab .homePage').addClass('active');
        $('#pageTab ul li').removeClass('active');
        $('#iframeBox iframe').eq(0).addClass('active').siblings().removeClass('active');
    })





    //点击page栏，切换页面、效果
    $('#pageTab ul').on('click','li',function(){
        $(this).addClass('active').siblings().removeClass('active');
        $('#pageTab .homePage').removeClass('active');

        //iframe页面跟着切换
        var index = $(this).index()+1;
        $('#iframeBox iframe').eq(index).addClass('active').siblings().removeClass('active');
        $('#iframeBox iframe').eq(0).removeClass('active');
    });
    //点击关闭按钮，关闭相关页面tab
    $('#pageTab ul').on('click','.icon-close',function(e){
        e.stopPropagation();
        var index =  $(this).parent().index()+1;//iframe比page页面多一个主页面，所以要+1；
        
        
        if( index == 1){
            $('#pageTab .homePage').trigger('click');
        }else{
            $(this).parent().prev().trigger('click');

        }
        
        $('#iframeBox iframe').eq(index).prev().addClass('active');
        $('#iframeBox iframe').eq(index).detach();
        $(this).parent().detach();  

    });


    //用户退出登录：清楚cookie
    $('#logOut').on('click',function(){
        var date = new Date(); //获取当前时间
        date.setTime(date.getTime()-10000); //将date设置为过去的时间
        document.cookie = 'token' + "=v; expires =" +date.toGMTString();//设置cookie
        //弹出提示，并重新刷新
        layer.open({
            content: '您已成功退出！！',
            btn: ['确定'],
            yes: function(index, layero){
                window.location = '/';
            },
            cancel: function(){ 
                window.location = '/';
            }
        });
    });
    
});