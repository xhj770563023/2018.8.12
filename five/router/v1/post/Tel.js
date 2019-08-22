const Router = require('koa-router');
const { findTel, repeatTel, addTel, delTel, changeTel, changeTelDesc } = require("../../../controller/Tel")
const fs = require('fs');
const koaBody = require('koa-body');
const interfaces = require('os').networkInterfaces();
const router = new Router();
//查找导航全部信息
router.post('/v1/app/findTel', async ctx => {
    let result = await findTel();
    ctx.body = {
        status: 0,
        msg: result,
    }
});
//增加电话信息
router.post('/v1/app/addTel',
    koaBody(
        {
            multipart: true,
            fromidable: {
                maxFileSize: 200 * 1024 * 1024
            }
        }
    ),
    async (ctx, next) => {
        console.log(ctx.request.body, 123)
        console.log(ctx.request.files, 456)
        const { Teldesc, TelTitle, price, Activeprice } = ctx.request.body
        let TelPicUrl = ctx.request.files.TelPicUrl;
        let rStream = fs.createReadStream(TelPicUrl.path);
        let basisPath = '/upPic/' + Math.floor(Math.random() * 1000) + TelPicUrl.name;
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
        let result1 = await repeatTel({
            TelPic: `http://${IPAdress}:3005${basisPath}`,
            TelDesc: Teldesc,
            TelTitle: TelTitle,
            price: price===''?0:price,
            Activeprice: Activeprice,
        });
        if (result1.length === 0) {
            let result = await addTel({
                TelPic: `http://${IPAdress}:3005${basisPath}`,
                TelDesc: Teldesc,
                TelTitle: TelTitle,
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

//增加电话信息
// router.post('/v1/app/addTel', async ctx => {
//     const { TelPicUrl, Teldesc, TelTitle, price, Activeprice } = ctx.request.body
//     let result1 = await repeatTel({
//         TelPic: TelPicUrl,
//         TelDesc: Teldesc,
//         TelTitle: TelTitle,
//         price: price===''?0:price,
//         Activeprice: Activeprice,
//     });
//     if (result1.length === 0) {
//         let result = await addTel({
//             TelPic: TelPicUrl,
//             TelDesc: Teldesc,
//             TelTitle: TelTitle,
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
//删除Tel信息
router.post('/v1/app/delTel', async ctx => {
    const { TelId } = ctx.request.body;
    let result = await delTel({
        id: TelId,
    });
    if (result === 0) {
        2
        ctx.body = {
            status: 0,
            msg: '删除成功',
        }
    }
});
//修改Tel信息
router.post('/v1/app/changeTel',
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
        const { TelId, Teldesc, TelTitle, price, Activeprice } = ctx.request.body
        let TelPicUrl = ctx.request.files.TelPicUrl;
        if (TelPicUrl.size === 0) {
            let result = await changeTelDesc({
                id: TelId,
                TelDesc: Teldesc,
                TelTitle: TelTitle,
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
            let rStream = fs.createReadStream(TelPicUrl.path);
            let basisPath = '/upPic/' + Math.floor(Math.random() * 1000) + TelPicUrl.name;
            let wStream = fs.createWriteStream('./public' + basisPath);
            rStream.pipe(wStream);

            let result = await changeTel({
                id: TelId,
                TelPic: `http://${IPAdress}:3005${basisPath}`,
                TelDesc: Teldesc,
                TelTitle: TelTitle,
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
//修改Tel信息
// router.post('/v1/app/changeTel', async ctx => {
//     const { TelId, TelPicUrl, Teldesc, TelTitle, price, Activeprice } = ctx.request.body
//     let result = await changeTel({
//         id: TelId,
//         TelPic: TelPicUrl,
//         TelDesc: Teldesc,
//         TelTitle: TelTitle,
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