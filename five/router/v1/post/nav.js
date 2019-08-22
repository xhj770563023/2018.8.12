const Router = require('koa-router');
const { findNav, repeatNav, addNav, delNav, changeNav, searchNav} = require("../../../controller/db")
const koaBody = require('koa-body');
const router = new Router();
//查找导航全部信息
router.post('/v1/app/allNav', async ctx => {
    let result = await findNav();
    ctx.body = {
        status: 0,
        msg: result,
    }
});
router.post('/v1/app/addNav',
    koaBody(
        {
            multipart: true,
            fromidable: {
                maxFileSize: 200 * 1024 * 1024
            }
        }
    ),
    async (ctx, next) => {
        const { title } = ctx.request.body
            let result1 = await repeatNav({
                title: title,
            });
            if (result1.length === 0) {
                let result = await addNav({
                    title: title,
                });
                if (result === 0) {
                    ctx.body = {
                        status: 0,
                        msg: '添加成功',
                    }
                }
            }else{
                ctx.body = {
                    status: 1,
                    msg: '重复添加',
                }
            }
    });

//增加导航信息
// router.post('/v1/app/addNav', async ctx => {
//     const { title } = ctx.request.body
//     let result1 = await repeatNav({
//         title: title,
//     });
//     if (result1.length === 0) {
//         let result = await addNav({
//             title: title,
//         });
//         if (result === 0) {
//             ctx.body = {
//                 status: 0,
//                 msg: '添加成功',
//             }
//         }
//     }else{
//         ctx.body = {
//             status: 1,
//             msg: '重复添加',
//         }
//     }

// });
//删除导航信息
router.post('/v1/app/delNav', async ctx => {
    const { navId } = ctx.request.body
    let result = await delNav({
        id: navId,
    });
    if (result === 0) {
        ctx.body = {
            status: 0,
            msg: '删除成功',
        }
    }
});
//修改导航信息
router.post('/v1/app/changeNav',
    koaBody(
        {
            multipart: true,
            fromidable: {
                maxFileSize: 200 * 1024 * 1024
            }
        }
    ),
    async (ctx, next) => {
        const { id, title } = ctx.request.body;
        let result = await changeNav({
            id, id,
            title: title,
        });
        if (result === 0) {
            ctx.body = {
                status: 0,
                msg: '修改成功',
            }
        }
    });
//修改导航信息
// router.post('/v1/app/changeNav', async ctx => {
//     const { id, title } = ctx.request.body;
//     let result = await changeNav({
//         id, id,
//         title: title,
//     });
//     if (result === 0) {
//         ctx.body = {
//             status: 0,
//             msg: '修改成功',
//         }
//     }
// });
//查找导航信息
router.post('/v1/app/searchNav', async ctx => {
    const { title } = ctx.request.body;
    let result = await searchNav({
        title: title,

    });

    ctx.body = {
        status: 0,
        msg: result,
    }
});
module.exports = router