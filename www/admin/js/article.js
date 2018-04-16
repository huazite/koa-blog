/*
 * @Author: huazi 
 * @Date: 2018-03-07 10:15:56 
 * @Last Modified by: huazi
 * @Last Modified time: 2018-03-09 17:13:21
 * ===============后台文章管理js==============
 */
$(function(){
    layui.use(['layer','form'], function(){
        var layer = layui.layer;
        var form = layui.form;

        //allArticle页面判断是否发布开关
        form.on('switch(isPublish)', function(data){
            //console.log(data.elem.checked); //开关是否开启，true或者false
            if(!data.elem.checked){
                document.location="/allArticles?publish=0"; 
            }else{
                document.location="/allArticles";
            }
        });  

        //newArticle、showArticle页面，新增分类按钮
        $('#addCategory').on('click',function(e){
            e.preventDefault();
            //prompt层
            layer.prompt({title: '请输入新的分类', formType: 0}, function(pass, index){
                layer.close(index);
                $('#select').append('<option value="-1">'+ pass +'</option>');
                $('#select').find("option[text='"+ pass +"']").attr("selected",true);
                form.render('select');
            });
            $(this).attr('disabled','true').addClass('layui-btn-disabled');
        });

    });

   //删除按钮点击
   $('.delete-btn').on('click',function(){
       var articleId = $(this).data('id');
        $.ajax({
            url:'/articles/'+articleId,
            type:'delete',
            success:function(result){
                layer.open({
                    content: result.msg,
                    btn: ['确定'],
                    yes: function(index, layero){
                        document.location="/allArticles";
                    },
                    cancel: function(){ 
                        document.location="/allArticles";
                    }
                });
            }
        });
       
   });
    
   //修改按钮点击，新建框架，展示文章信息
   $('.edit-btn').on('click',function(){
        var articleId = $(this).data('id'),
            articleTitle = $(this).data('title');

        var index = layer.open({
            type: 2,
            title:articleTitle,
            content: '/articles/'+articleId,
            area: ['100%', '100%'],
        });
    
    });


    $('#new_publish').on('click',function(e){
        e.preventDefault();  
        postArticle(1,'已成功发布文章!!')
   });
   $('#new_save').on('click',function(e){
        e.preventDefault();  
        postArticle(0,'已成功保存文章!!')
   });

   $('#mod_publish').on('click',function(e){
        e.preventDefault();  
        modifyArticle(1,'已成功修改并发布文章!!')
    });
    $('#mod_save').on('click',function(e){
        e.preventDefault();  
        modifyArticle(0,'已成功修改并保存文章!!')
    });



    //文章修改函数
  function modifyArticle(publish,sucText){
    var mdContent = $('#editormd-markdown-doc').val();
    var htmlContent = $('.editormd-html-textarea').val();
    var intro =  $('.editormd-preview-container')[0].innerText.substr(0,220).replace('\n','')+'...';
    
    var article_list;
    
    //判断是否存在目录
    if($('.editormd-preview-container .editormd-markdown-toc').length != 0){
        article_list = $('.editormd-preview-container .editormd-markdown-toc')[0].innerHTML;
        
    }else{
        article_list = null;
    }

    //console.log($('#is_stick').is(':checked'));
    
    //文章没有内容，不可以提交
    if(!mdContent){
        return false;
    }
    $.ajax({
        type:'patch',
        url: '/articles/'+$('#id').data('id'),
        data:{
            category:$('#select').val(),
            category_name:$("#select option:selected").text(),
            title:$('#title').val(),
            intro:intro,
            intro_img:$('#intro_img').val(),
            keyword:$('#keyword').val(),
            publish:publish,
            article_formd:mdContent,
            article_forhtml:htmlContent,
            article_list:article_list,
            is_stick:$('#is_stick').is(':checked') ? 1: 0
        },
        success :function(result){
            if(result.retCode == '1'){
                layer.open({
                    content: sucText,
                    btn: ['确定'],
                    yes: function(index, layero){
                        layer.close(index);
                    },
                    cancel: function(){ 
                        
                    }
                });
            }
        
        }
    });
  }

  //文章推送函数
  function postArticle(publish,sucText){
    var mdContent = $('#editormd-markdown-doc').val();
    var htmlContent = $('.editormd-html-textarea').val();
    var intro =  $('.editormd-preview-container')[0].innerText.substr(0,220).replace('\n','')+'...';
    //判断是否存在目录
    if($('.editormd-preview-container .editormd-markdown-toc').length != 0){
        var article_list = $('.editormd-preview-container .editormd-markdown-toc')[0].innerHTML;
    }else{
        var article_list = null;
    }

    if(!mdContent){
        return false;
    }
    $.post('/articles',{
    category:$('#select').val(),
    category_name:$("#select option:selected").text(),
    title:$('#title').val(),
    intro:intro,
    intro_img:$('#intro_img').val(),
    keyword:$('#keyword').val(),
    publish:publish,
    article_formd:mdContent,
    article_forhtml:htmlContent,
    article_list:article_list,
    is_stick:$('#is_stick').is(':checked') ? 1: 0
    },function(result){
        if(result.retCode == '1'){
            layer.open({
                content: sucText,
                btn: ['确定'],
                yes: function(index, layero){
                    layer.close(index);
                },
                cancel: function(){ 
                    
                }
            });
        }
        
    }) 
  }








})