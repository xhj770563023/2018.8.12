const Router = require('koa-router');
const { findTV, repeatTV, addTV, delTV, changeTV, changeTVDesc } = require("../../../controller/Tv")
const fs = require('fs');
const koaBody = require('koa-body');
const interfaces = require('os').networkInterfaces();
const router = new Router();
//查找导航全部信息
router.post('/v1/app/findTV', async ctx => {
    let result = await findTV();
    ctx.body = {
        status: 0,
        msg: result,
    }
});
//增加电视信息
router.post('/v1/app/addTV',
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
        const { TVdesc, TVTitle, price, Activeprice } = ctx.request.body
        let TVPicUrl = ctx.request.files.TVPicUrl;
        let rStream = fs.createReadStream(TVPicUrl.path);
        let basisPath = '/upPic/' + Math.floor(Math.random() * 1000) + TVPicUrl.name;
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
        let result1 = await repeatTV({
            TVPic: `http://${IPAdress}:3005${basisPath}`,
            TVDesc: TVdesc,
            TVTitle: TVTitle,
            price: price===''?0:price,
            Activeprice: Activeprice,
        });
        if (result1.length === 0) {
            let result = await addTV({
                TVPic: `http://${IPAdress}:3005${basisPath}`,
                TVDesc: TVdesc,
                TVTitle: TVTitle,
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
//增加电视信息
// router.post('/v1/app/addTV', async ctx => {
//     const { TVPicUrl, TVdesc, TVTitle, price, Activeprice } = ctx.request.body
//     let result1 = await repeatTV({
//         TVPic: TVPicUrl,
//         TVDesc: TVdesc,
//         TVTitle: TVTitle,
//         price: price===''?0:price,
//         Activeprice: Activeprice,
//     });
//     if (result1.length === 0) {
//         let result = await addTV({
//             TVPic: TVPicUrl,
//             TVDesc: TVdesc,
//             TVTitle: TVTitle,
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
//删除TV信息
router.post('/v1/app/delTV', async ctx => {
    const { TVId } = ctx.request.body;
    let result = await delTV({
        id: TVId,
    });
    if (result === 0) {
        2
        ctx.body = {
            status: 0,
            msg: '删除成功',
        }
    }
});
//修改TV信息
router.post('/v1/app/changeTV',
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
        const { TVId, TVdesc, TVTitle, price, Activeprice } = ctx.request.body
        let TVPicUrl = ctx.request.files.TVPicUrl;
        if (TVPicUrl.size === 0) {
            let result = await changeTVDesc({
                id: TVId,
                TVDesc: TVdesc,
                TVTitle: TVTitle,
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
            let rStream = fs.createReadStream(TVPicUrl.path);
            let basisPath = '/upPic/' + Math.floor(Math.random() * 1000) + TVPicUrl.name;
            let wStream = fs.createWriteStream('./public' + basisPath);
            rStream.pipe(wStream);
            let result = await changeTV({
                id: TVId,
                TVPic: `http://${IPAdress}:3005${basisPath}`,
                TVDesc: TVdesc,
                TVTitle: TVTitle,
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
//修改TV信息
// router.post('/v1/app/changeTV', async ctx => {
//     const { TVId, TVPicUrl, TVdesc, TVTitle, price, Activeprice } = ctx.request.body
//     let result = await changeTV({
//         id: TVId,
//         TVPic: TVPicUrl,
//         TVDesc: TVdesc,
//         TVTitle: TVTitle,
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