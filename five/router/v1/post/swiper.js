const Router = require('koa-router');
const fs = require('fs');
const koaBody = require('koa-body');
const { findSwiper, repeatSwiper, addSwiper, delSwiper, changeSwiper,changeSwiperDesc } = require('../../../controller/swiper');
const router = new Router();
const interfaces = require('os').networkInterfaces(); // 在开发环境中获取局域网中的本机iP地址

//查找swiper全部信息
router.post('/v1/app/findSwiper', async ctx => {
    let result = await findSwiper();
    ctx.body = {
        status: 0,
        msg: result,
    }
});
//上传图片及文字
router.post('/v1/app/addPicText',
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
        const { swiperdesc } = ctx.request.body;

        let swiperPicUrl = ctx.request.files.swiperPicUrl;
        let rStream = fs.createReadStream(swiperPicUrl.path);
        let basisPath = '/upPic/' + Math.floor(Math.random() * 1000) + swiperPicUrl.name;
        let wStream = fs.createWriteStream('./public' + basisPath);
        rStream.pipe(wStream);

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

        let result1 = await repeatSwiper({
            swiperPicUrl: `http://${IPAdress}:3005${basisPath}`,
            swiperdesc: swiperdesc,
        });
        if (result1.length === 0) {
            let result = await addSwiper({
                swiperPicUrl: `http://${IPAdress}:3005${basisPath}`,
                swiperdesc: swiperdesc,
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
//删除swiper信息
router.post('/v1/app/delSwiper', async ctx => {
    const { SwiperId } = ctx.request.body;
    let result = await delSwiper({
        id: SwiperId <= 13 ? 1000 : SwiperId,
    });
    if (result === 0) {
        ctx.body = {
            status: 0,
            msg: '删除成功',
        }
    }
});
//修改swiper信息
router.post('/v1/app/changeSwiper',
    koaBody(
        {
            multipart: true,
            fromidable: {
                maxFileSize: 200 * 1024 * 1024
            }
        }
    ),
    async (ctx, next) => {
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
        const { swiperdesc, SwiperId } = ctx.request.body;
        let swiperPicUrl = ctx.request.files.swiperPicUrl;
        if (swiperPicUrl.size === 0) {
            let result = await changeSwiperDesc({
                id: SwiperId,
                swiperdesc: swiperdesc,
            });
            if (result === 0) {
                ctx.body = {
                    status: 0,
                    msg: '修改成功',
                }
            }
        } else {
            let rStream = fs.createReadStream(swiperPicUrl.path);
            let basisPath = '/upPic/' + Math.floor(Math.random() * 1000) + swiperPicUrl.name;
            let wStream = fs.createWriteStream('./public' + basisPath);
            rStream.pipe(wStream);
            let result = await changeSwiper({
                id: SwiperId,
                swiperPicUrl: `http://${IPAdress}:3005${basisPath}`,
                swiperdesc: swiperdesc,
            });
            if (result === 0) {
                ctx.body = {
                    status: 0,
                    msg: '修改成功',
                }
            }
        }


    });

//修改swiper信息
// router.post('/v1/app/changeSwiper', async ctx => {
//     const { SwiperId,swiperPicUrl,swiperdesc } = ctx.request.body;
//     let result = await changeSwiper({
//         id:SwiperId,
//         swiperPicUrl: swiperPicUrl,
//         swiperdesc:swiperdesc,
//     });
//     if (result === 0) {
//         ctx.body = {
//             status: 0,
//             msg: '修改成功',
//         }
//     }
// });
//查找swiper信息
// router.post('/v1/app/searchSwiper', async ctx => {
//     let result = await searchSwiper();
//     ctx.body = {
//         status: 0,
//         msg: result,
//     }
// });
module.exports = router