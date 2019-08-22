const Router = require('koa-router');
const { findMenu, repeatMenu, addMenu, delMenu, changeMenu,changeMenuDesc } = require("../../../controller/menu")
const fs = require('fs');
const koaBody = require('koa-body');
const interfaces = require('os').networkInterfaces();
const router = new Router();
//查找导航全部信息
router.post('/v1/app/findMenu', async ctx => {
    let result = await findMenu();
    ctx.body = {
        status: 0,
        msg: result,
    }
});
//增加导航信息
router.post('/v1/app/addMenu',
    koaBody(
        {
            multipart: true,
            fromidable: {
                maxFileSize: 200 * 1024 * 1024
            }
        }
    ),
    async (ctx, next) => {
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
        // console.log(ctx.request.body,123)
        // console.log(ctx.request.files,456)
        const { Menudesc } = ctx.request.body;

        let MenuPicUrl = ctx.request.files.MenuPicUrl;
        let rStream = fs.createReadStream(MenuPicUrl.path);
        let basisPath = '/upPic/' + Math.floor(Math.random() * 1000) + MenuPicUrl.name;
        let wStream = fs.createWriteStream('./public' + basisPath);
        rStream.pipe(wStream);

        let result1 = await repeatMenu({
            menuPic: `http://${IPAdress}:3005${basisPath}`,
            menuDesc: Menudesc,
        });
        if (result1.length === 0) {
            let result = await addMenu({
                MenuPicUrl: `http://${IPAdress}:3005${basisPath}`,
                Menudesc: Menudesc,
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
//增加导航信息
// router.post('/v1/app/addMenu', async ctx => {
//     const { MenuPicUrl,Menudesc } = ctx.request.body
//     let result1 = await repeatMenu({
//         menuPic: MenuPicUrl,
//         menuDesc:Menudesc,
//     });
//     if (result1.length === 0) {
//         let result = await addMenu({
//             MenuPicUrl: MenuPicUrl,
//             Menudesc:Menudesc,
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
//删除Menu信息
router.post('/v1/app/delMenu', async ctx => {
    const { MenuId } = ctx.request.body;
    let result = await delMenu({
        id: MenuId,
    });
    if (result === 0) {
        2
        ctx.body = {
            status: 0,
            msg: '删除成功',
        }
    }
});
//修改Menu信息
router.post('/v1/app/changeMenu',
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
        const { MenuId, Menudesc } = ctx.request.body;
        let MenuPicUrl = ctx.request.files.MenuPicUrl;
        if (MenuPicUrl.size === 0) {
            let result = await changeMenuDesc({
                id: MenuId,
                menuDesc: Menudesc,
            });
            if (result === 0) {
                ctx.body = {
                    status: 0,
                    msg: '修改成功',
                }
            }
        } else {
            let rStream = fs.createReadStream(MenuPicUrl.path);
            let basisPath = '/upPic/' + Math.floor(Math.random() * 1000) + MenuPicUrl.name;
            let wStream = fs.createWriteStream('./public' + basisPath);
            rStream.pipe(wStream);

            let result = await changeMenu({
                id: MenuId,
                menuPic: `http://${IPAdress}:3005${basisPath}`,
                menuDesc: Menudesc,
            });
            if (result === 0) {
                ctx.body = {
                    status: 0,
                    msg: '修改成功',
                }
            }
        }

    });
//修改Menu信息
// router.post('/v1/app/changeMenu', async ctx => {
//     const { MenuId,MenuPicUrl,Menudesc } = ctx.request.body;
//     let result = await changeMenu({
//         id:MenuId,
//         menuPic: MenuPicUrl,
//         menuDesc:Menudesc,
//     });
//     if (result === 0) {
//         ctx.body = {
//             status: 0,
//             msg: '修改成功',
//         }
//     }
// });
module.exports = router