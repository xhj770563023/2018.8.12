const Router = require('koa-router');

const router = new Router();

router.get('/rest', async ctx => {
    ctx.body = '准备重启';
    process.exit(1)
});
module.exports = router;