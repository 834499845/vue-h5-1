import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import store from './store/'
import routerMap from './router'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
// supports both of Vue 1.0 and Vue 2.0 
import VueLazyload from 'vue-lazyload'


import base from './base'
Vue.use(base)


Vue.use(VueLazyload)
Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(MintUI)
Vue.http.options.emulateJSON = true
// 并且配置路由规则  history hash
var router = new VueRouter({
    mode: 'hash',
    base: __dirname,
    routes: routerMap
})


// with options 
Vue.use(VueLazyload, {
    preLoad: 1,
    error: '/static/img/1：1@3x.png',
    loading: '/static/img/1：1@3x.png',
    attempt: 1
})
// 请求拦截
Vue.http.interceptors.push((request, next) => {
    var AccessTokenStr = ''
    if (sessionStorage.getItem('accessToken')) {
        AccessTokenStr = sessionStorage.getItem('accessToken')
    }
    request.headers.set('Authorization', 'Bearer ' + AccessTokenStr)
    next((response) => {
        return response
    })
})

// 路由器会创建一个 App 实例，并且挂载到选择符 #app 匹配的元素上。
var app = new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app')


router.afterEach((to, from, next) => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0
});