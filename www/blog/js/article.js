/*
 * @Author: huazi 
 * @Date: 2018-02-25 11:50:38 
 * @Last Modified by: huazi
 * @Last Modified time: 2018-03-15 09:40:13
 */
 
$(function(){
          //unicode转正常文字
          function htmlDecode(text){
            //1.首先动态创建一个容器标签元素，如DIV
            var temp = document.createElement("div");
            //2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)
            temp.innerHTML = text;
            //3.最后返回这个元素的innerText(ie支持)或者textContent(火狐，google支持)，即得到经过HTML解码的字符串了。
            var output = temp.innerText || temp.textContent;
            temp = null;
            return output;
        }
    
        //生成评论html模板
        function setMessages(messages){
           function replyMsg(replyMsgs){
                if(replyMsgs){            
                  return setMessages(replyMsgs);               
                }
            }
            var str = '';
            for(let message of messages){
                var replyStr = replyMsg(message.replyMessages);
                //输出两次，其中有一次为undefined，通过设置为‘’去除
                if(replyStr == undefined){
                    replyStr = '';
                }
                 str +=  
                 `<div class="list">
                    <div class="main-msg clearfix">
                        <div class="avatar fl">
                            <img src=" ${message.msg_avatar}" alt="">
                        </div>
                        <div class="message fl">
                            <div class="msg-title">
                                <a target="_blank" ${message.msg_blog ? `href=${message.msg_blog}`: null } > ${message.msg_name}:</a> 
                                <span> ${message.save_time}</span>
                                <a data-msgId="${message.id}" class="reply" href="javascript:;">回复</a>
                            </div>
                            <div class="msg-body">
                                <span> ${message.msg}</span>
                            </div>
                        </div>
                    </div>`+ replyStr +
                    `</div>`
            }
            return str;
        }  
    
        //messages数据从article页面初始化
        messages =htmlDecode(messages);
        messages = JSON.parse(messages);
    
       var msgHtml =  setMessages(messages)
        //把生成 的html加载到评论内
        $('.comments .header').after(msgHtml);
    
        
    if($('#main .navList').length != 0){
        var left_offset =  $('#main .navList').offset().left;
        window.onresize = function(){
            left_offset =  $('#main .navList').offset().left;
        }
         //目录导航栏固定
        $('body').scroll(function() {
            if( $('#main .article').offset().top < 0){
                $('#main .navList').addClass('fix');
                $('#main .navList').css('left',left_offset);
            }else{
                $('#main .navList').removeClass('fix');
                $('#main .navList').removeAttr('style');
            }

        });
    }

   
   

        

    //“回复”按钮点击
    $('.comments').on('click','.reply',function(e){
        var replyId = $(this).data('msgid');
        var articleId = $('#main').data('articleid');

        e.stopPropagation();
        //添加表单
        var dom = `
        <form id="commentform"  class="commentform">
            <h1 id="formH1">发表评论</h1>
            <input id="reply_id" name="reply_id" value="${replyId}" type="text" style="display:none">
            <input id="article_id" name="article_id" value="${articleId}" type="text" style="display:none">
            <label for="nicheng">昵称：<input name="msg_name" id="msg_name" type="text"></label>
            <label for="youxiang">邮箱：<input name="msg_email" id="msg_email" type="text"></label>
            <label for="wangzhi">网址：<input name="msg_blog" id="msg_blog" type="text"></label>
            <textarea name="msg" id="msg"  rows="10" placeholder="潺潺流年，侧首以观，抑如亦是，何以不变。"></textarea>
            <div class="subbox">
                <button class="submit" type="submit">提交评论</button> 
                <button class="cancle">我再想想</button>
            </div>
        </form>
        `
        $('#commentform').remove();
        $(this).parents('.comments > .list').append(dom);
    })
    //“forcomment”按钮点击
    $('#forcomment').on('click',function(e){
        var replyId = '0';
        var articleId = $('#main').data('articleid');
        var dom = `
        <form id="commentform"  class="commentform">
            <h1 id="formH1">发表评论</h1>
            <input id="reply_id" name="reply_id" value="0" type="text" style="display:none">
            <input id="article_id" name="article_id" value="${articleId}" type="text" style="display:none">
            <label for="nicheng">昵称：<input name="msg_name" id="msg_name" type="text"></label>
            <label for="youxiang">邮箱：<input name="msg_email" id="msg_email" type="text"></label>
            <label for="wangzhi">网址：<input name="msg_blog" id="msg_blog" type="text"></label>
            <textarea name="msg" id="msg"  rows="10" placeholder="潺潺流年，侧首以观，抑如亦是，何以不变。"></textarea>
            <div class="subbox">
                <button class="submit" type="submit">提交评论</button> 
                <button class="cancle">我再想想</button>
            </div>
        </form>
        `
        $('#commentform').remove();
        $('.forcomment').append(dom);
    })
    //"我在想想"点击=>关闭此表单
    $('.comments').on('click','.cancle',function(e){
        $(this).parents('#commentform').remove();
    })



    //提交按钮点击
    $('.comments').on('click','.submit',function(e){
        var msg_blog = null;
        if($('#msg_blog').val() != ''){
            msg_blog = 'http://'+ $('#msg_blog').val();
        }
        e.preventDefault(); 
        if( !(msgNameBlur() && msgEmailBlur() && msgBlur())){
            return false;
       }  
        $.ajax({
            type:'post',
            url: '/articles/createMsg',
            data:{
                'msg_name':$('#msg_name').val(),
                'msg_email':$('#msg_email').val(),
                'msg_blog':msg_blog,
                'msg':$('#msg').val(),
                'reply_id':$('#reply_id').val(),
                'article_id':$('#article_id').val(),
            },
            success :function(result){
                if(result.retCode == '1'){
                    layer.open({
                        content: result.msg,
                        btn: ['确定'],
                        yes: function(index, layero){
                            layer.close(index);
                            $('#commentform').remove();
                            setTimeout(function(){
                                location.reload();
                            },500);
                        },
                        cancel: function(){ 
                            $('#commentform').remove();
                            setTimeout(function(){
                                location.reload();
                            },500);
                        }
                    });
                }
            
            }
        });
    })


    $('.comments').on('blur','#msg_name',function(e){
        msgNameBlur();
    });
    $('.comments').on('blur','#msg_email',function(e){
        msgEmailBlur();
    });
    $('.comments').on('blur','#msg',function(e){
        msgBlur();
    });
    function msgEmailBlur(){
        var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        var msgEmail = $('#msg_email').val();
        if(msgEmail == ''){
            $('#formH1').html("请输入邮箱地址！");
            return false;
        }
        if(!re.test(msgEmail)){
            $('#formH1').html('邮件格式不正确！');
            return false;
        }
        return true;
    }
    function msgNameBlur(){
        var  msgName = $('#msg_name').val();
        if(msgName == ''){
            $('#formH1').html('请输入昵称！');
            return false;
        }
        return true;
    }
    function msgBlur(){
        var  msg = $('#msg').val();
        if(msg == ''){
            $('#formH1').css('display', 'block');
            $('#formH1').html('请输入评论内容！');
            return false;
        }
        return true;
    }

    
})