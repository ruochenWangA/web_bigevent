// 每次调用$.get()或$.post()或$.ajax()的时候
//会先调用ajaxPrefilter这个函数
//在这个函数中可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options) {

    // 再发起真正的ajax请求之前同意拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
        // console.log(options.url);

    //只有url以  /my开头的才是需要权限的
    if (options.url.indexOf('/my') !== -1) {
        //统一为有权限的接口设置 headers 请求头
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    //全局统一挂载 complete 回调函数
    options.complete = function(res) {
        // 可以使用responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //强制情况token
            localStorage.removeItem('token')
                // 强制跳转到登陆页面
            location.href = '/login.html'
        }
    }

})