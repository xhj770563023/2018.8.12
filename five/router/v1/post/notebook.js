const Router = require('koa-router');
const { findNotebook, repeatNotebook, addNotebook, delNotebook, changeNotebook, changeNotebookDesc } = require("../../../controller/Notebook")
const fs = require('fs');
const koaBody = require('koa-body');
const interfaces = require('os').networkInterfaces();
const router = new Router();
//查找导航全部信息
router.post('/v1/app/findNotebook', async ctx => {
    let result = await findNotebook();
    ctx.body = {
        status: 0,
        msg: result,
    }
});
//增加笔记本信息
router.post('/v1/app/addNotebook',
    koaBody(
        {
            multipart: true,
            fromidable: {
                maxFileSize: 200 * 1024 * 1024
            }
        }
    ),
    async (ctx, next) => {
        // console.log(ctx.request.body,123)
        // console.log(ctx.request.files,456)
        const { Notebookdesc, NotebookTitle, price, Activeprice } = ctx.request.body
        let NotebookPicUrl = ctx.request.files.NotebookPicUrl;
        let rStream = fs.createReadStream(NotebookPicUrl.path);
        let basisPath = '/upPic/' + Math.floor(Math.random() * 1000) + NotebookPicUrl.name;
        let wStream = fs.createWriteStream('./public' + basisPath);
        rStream.pipe(wStream);
        //写路径
        let IPAdress = '';
        for (var devName in interfaces) {
            var iface = interfaces[devName];
            for (var i = 0; i < iface.length; i++) {
                var alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    IPAdress = alias.address;
                }
            }
        }
        let result1 = await repeatNotebook({
            NotebookPic: `http://${IPAdress}:3005${basisPath}`,
            NotebookDesc: Notebookdesc,
            NotebookTitle: NotebookTitle,
            price: price===''?0:price,
            Activeprice: Activeprice,
        });
        if (result1.length === 0) {
            let result = await addNotebook({
                NotebookPic: `http://${IPAdress}:3005${basisPath}`,
                NotebookDesc: Notebookdesc,
                NotebookTitle: NotebookTitle,
                price: price===''?0:price,
                Activeprice: Activeprice,
            });
            if (result === 0) {
                ctx.body = {
                    status: 0,
                    msg: '添加成功',
                }
            }
        } else {
            ctx.body = {
                status: 1,
                msg: '重复添加',
            }
        }

    });
//增加笔记本信息
// router.post('/v1/app/addNotebook', async ctx => {
//     const { NotebookPicUrl, Notebookdesc, NotebookTitle, price, Activeprice } = ctx.request.body
//     let result1 = await repeatNotebook({
//         NotebookPic: NotebookPicUrl,
//         NotebookDesc: Notebookdesc,
//         NotebookTitle: NotebookTitle,
//         price: price===''?0:price,
//         Activeprice: Activeprice,
//     });
//     if (result1.length === 0) {
//         let result = await addNotebook({
//             NotebookPic: NotebookPicUrl,
//             NotebookDesc: Notebookdesc,
//             NotebookTitle: NotebookTitle,
//             price: price===''?0:price,
//             Activeprice: Activeprice,
//         });
//         if (result === 0) {
//             ctx.body = {
//                 status: 0,
//                 msg: '添加成功',
//             }
//         }
//     } else {
//         ctx.body = {
//             status: 1,
//             msg: '重复添加',
//         }
//     }
// });
//删除Notebook信息
router.post('/v1/app/delNotebook', async ctx => {
    const { NotebookId } = ctx.request.body;
    let result = await delNotebook({
        id: NotebookId,
    });
    if (result === 0) {
        2
        ctx.body = {
            status: 0,
            msg: '删除成功',
        }
    }
});
//修改Notebook信息
router.post('/v1/app/changeNotebook',
    koaBody(
        {
            multipart: true,
            fromidable: {
                maxFileSize: 200 * 1024 * 1024
            }
        }
    ),
    async (ctx, next) => {
        //当前ip路径
        let IPAdress = '';
        for (var devName in interfaces) {
            var iface = interfaces[devName];
            for (var i = 0; i < iface.length; i++) {
                var alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    IPAdress = alias.address;
                }
            }
        }
        // console.log(ctx.request.body,123)
        // console.log(ctx.request.files,456)
        const { NotebookId, Notebookdesc, NotebookTitle, price, Activeprice } = ctx.request.body
        let NotebookPicUrl = ctx.request.files.NotebookPicUrl;
        if (NotebookPicUrl.size === 0) {
            let result = await changeNotebookDesc({
                id: NotebookId,
                NotebookDesc: Notebookdesc,
                NotebookTitle: NotebookTitle,
                price: price===''?0:price,
                Activeprice: Activeprice,
            });
            if (result === 0) {
                ctx.body = {
                    status: 0,
                    msg: '修改成功',
                }
            }
        } else {
            let rStream = fs.createReadStream(NotebookPicUrl.path);
            let basisPath = '/upPic/' + Math.floor(Math.random() * 1000) + NotebookPicUrl.name;
            let wStream = fs.createWriteStream('./public' + basisPath);
            rStream.pipe(wStream);

            let result = await changeNotebook({
                id: NotebookId,
                NotebookPic: `http://${IPAdress}:3005${basisPath}`,
                NotebookDesc: Notebookdesc,
                NotebookTitle: NotebookTitle,
                price: price===''?0:price,
                Activeprice: Activeprice,
            });
            if (result === 0) {
                ctx.body = {
                    status: 0,
                    msg: '修改成功',
                }
            }
        }

    });
//修改Notebook信息
// router.post('/v1/app/changeNotebook', async ctx => {
//     const { NotebookId, NotebookPicUrl, Notebookdesc, NotebookTitle, price, Activeprice } = ctx.request.body
//     let result = await changeNotebook({
//         id: NotebookId,
//         NotebookPic: NotebookPicUrl,
//         NotebookDesc: Notebookdesc,
//         NotebookTitle: NotebookTitle,
//         price: price===''?0:price,
//         Activeprice: Activeprice,
//     });
//     if (result === 0) {
//         ctx.body = {
//             status: 0,
//             msg: '修改成功',
//         }
//     }
// });
module.exports = router