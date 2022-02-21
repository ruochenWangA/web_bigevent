$(function() {

    var layer = layui.layer
    var form = layui.form
    var $image = $('#image')


    initCate()


    //定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败!')
                }
                //调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    //一定要记得调用form.render
                form.render()
            }
        })
    }


    var options = {
        aspecRatio: 400 / 200,
        preview: '.img-preview'
    }
    $image.cropper(options)


    //为选择封面的按钮绑定点击事件
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    //监听coverfile的 change事件 ，获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        //获取到文件的列表数组
        var files = e.target.files
        if (files.length === 0) {
            return
        }
        //根据文件， 创建对应的URL地址
        var newImageURL = URL.createObjectURL(files[0])
            //为裁剪区域重新设置图片
        $image
            .cropper('destroy')
            .attr('src', newImageURL)
            .cropper(options)
    })

    // 定义文章的发布状态
    var art_state = '已发布'
        //为存为草稿按钮绑定事件处理函数
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })

    //为表单绑定submit提交事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()
            //快速创建formdata对象
        var fd = new FormData($(this)[0])
            // 将文章的发布状态，存到fd中
        fd.append('state', art_state)

        // 将封面裁剪过后的图片输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                //将canvas画布上的内容，转化为文件对象
                // 将文件对象 存储到fd中
                fd.append('cover_img', blob)
                    //发起ajax请求
                publishArticle(fd)
            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //向服务器提交formdata格式的数据，必须添加以下两个数据项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败!')
                }
                layer.msg('发布文章成功!')
                    //发布文章成功后跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
})