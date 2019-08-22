const koa = require('koa');

const Router = require('koa-router');

const bodyparser = require('koa-bodyparser');

const path = require('path');

const koaStatic = require('koa-static');

const requireDirectory = require('require-directory');

const app = new koa();

const config = require('./config');
//跨域
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin',config.ip)
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Credentials', true);
    await next();
});
//读cms
app.use(koaStatic(path.join(process.cwd(), './public')));
//读前端页面
app.use(koaStatic(path.join(process.cwd(), './static')));
app.use(bodyparser());
requireDirectory(module, './router', {
    visit: function (modulR) {
        // console.log(modulR)
        if (modulR instanceof Router) {
            app.use(modulR.routes());
        }
    }
});


app.listen(config.port, function () {
    console.log(config.port);
});