const Router = require('koa-router');
const { findHome, repeatHome, addHome, delHome, changeHome, changeHomeDesc } = require("../../../controller/Home")
const fs = require('fs');
const koaBody = require('koa-body');
const interfaces = require('os').networkInterfaces();
const router = new Router();
//查找导航全部信息
router.post('/v1/app/findHome', async ctx => {
    let result = await findHome();
    ctx.body = {
        status: 0,
        msg: result,
    }
});
//增加家具信息
router.post('/v1/app/addHome',
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
        const { Homedesc, HomeTitle, price, Activeprice } = ctx.request.body
        let HomePicUrl = ctx.request.files.HomePicUrl;
        let rStream = fs.createReadStream(HomePicUrl.path);
        let basisPath = '/upPic/' + Math.floor(Math.random() * 1000) + HomePicUrl.name;
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
        let result1 = await repeatHome({
            HomePic: `http://${IPAdress}:3005${basisPath}`,
            HomeDesc: Homedesc,
            HomeTitle: HomeTitle,
            price: price===''?0:price,
            Activeprice: Activeprice,
        });
        if (result1.length === 0) {
            let result = await addHome({
                HomePic: `http://${IPAdress}:3005${basisPath}`,
                HomeDesc: Homedesc,
                HomeTitle: HomeTitle,
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
//增加家具信息
// router.post('/v1/app/addHome', async ctx => {
//     const { HomePicUrl, Homedesc, HomeTitle, price, Activeprice } = ctx.request.body
//     let result1 = await repeatHome({
//         HomePic: HomePicUrl,
//         HomeDesc: Homedesc,
//         HomeTitle: HomeTitle,
//         price: price,
//         Activeprice: Activeprice,
//     });
//     if (result1.length === 0) {
//         let result = await addHome({
//             HomePic: HomePicUrl,
//             HomeDesc: Homedesc,
//             HomeTitle: HomeTitle,
//             price: price,
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
//删除Home信息
router.post('/v1/app/delHome', async ctx => {
    const { HomeId } = ctx.request.body;
    let result = await delHome({
        id: HomeId,
    });
    if (result === 0) {
        2
        ctx.body = {
            status: 0,
            msg: '删除成功',
        }
    }
});
//修改Home信息
router.post('/v1/app/changeHome',
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
        const { HomeId, Homedesc, HomeTitle, price, Activeprice } = ctx.request.body
        let HomePicUrl = ctx.request.files.HomePicUrl;
        if (HomePicUrl.size === 0) {
            let result = await changeHomeDesc({
                id: HomeId,
                HomeDesc: Homedesc,
                HomeTitle: HomeTitle,
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
            let rStream = fs.createReadStream(HomePicUrl.path);
            let basisPath = '/upPic/' + Math.floor(Math.random() * 1000) + HomePicUrl.name;
            let wStream = fs.createWriteStream('./public' + basisPath);
            rStream.pipe(wStream);
            let result = await changeHome({
                id: HomeId,
                HomePic: `http://${IPAdress}:3005${basisPath}`,
                HomeDesc: Homedesc,
                HomeTitle: HomeTitle,
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
//修改Home信息
// router.post('/v1/app/changeHome', async ctx => {
//     const { HomeId, HomePicUrl, Homedesc, HomeTitle, price, Activeprice } = ctx.request.body
//     let result = await changeHome({
//         id: HomeId,
//         HomePic: HomePicUrl,
//         HomeDesc: Homedesc,
//         HomeTitle: HomeTitle,
//         price: price,
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