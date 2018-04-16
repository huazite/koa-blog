/*
 * @Author: huazi 
 * @Date: 2018-03-12 09:38:04 
 * @Last Modified by: huazi
 * @Last Modified time: 2018-03-15 09:04:15
 * =============前台主页界面就是代码=============
 */
$(function(){
    window.onblur = function(){
        document.title = '我游离在你的视线外，不动声色，却是心情暗沉...';
    }
    window.onfocus = function(){
        document.title = '探索灵魂的方向，有我陪你在路上...';
    }

    //右侧固定位置
    var nowLeft = $('#main .right').offset().left;
    window.onresize = function(){
        nowLeft = $('#main .right').offset().left;
    }
    $('body').scroll(function(e){
        var y = $('.left').offset().top;
        if( y > 0){
            $('.right').removeClass('fixed'); 
            $('.right').css('left',nowLeft)
        }else{
            $('.right').addClass('fixed'); 
        }
        
    })
    $('#getMore').on('click',function(){
        var nowId = $('.list:last').data('id');       
        $.get('/getMoreArticles?id='+nowId,function(result){
           

            for(let a of result.data){
                var htmlStr = `
                    <div class="list clearfix" data-id="${a.id}">
                        <div class="title">
                            <a href="/articles/${a.id}"><h1>${a.title}</h1></a>
                        </div>
                        <div class="article-body">
                            <div class="info fl">
                                <a class="blur" href="/categories/${a.category_id}"><div class="class">${a.Category.category_name}</div></a>
                                <div class="publish">${a.save_time}</div>
                            </div>
                            <div class="article fl">
                                ${imgExist(a)}
                                <div class="article-scrap">
                                    ${a.intro}
                                </div>
                            </div>
                        </div>
                    </div>`
                $('.list:last').after(htmlStr);
            }

            function imgExist(a){
                if(a.intro_img){
                    return `
                    <div class="imgBox">
                        <img src="${a.intro_img}" alt="">
                    </div>
                    `
                }else{
                    return ''
                }
            }
        });
    });
})