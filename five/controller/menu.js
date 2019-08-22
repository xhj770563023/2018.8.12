const mysql = require('mysql');
const config = require('../config');
const connection = mysql.createConnection(
    config.database
);

connection.connect((err) => {
    err && console.log(err);
    console.log('menu数据库连接成功')
});
//查找menu总列表
async function findMenu() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM Menu', (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    })
};
//添加时判断menu是否重复
async function repeatMenu(opt) {
    let sql = 'SELECT * FROM `Menu` WHERE ' + Object.keys(opt).map(k => {
        return `${k} LIKE '${opt[k]}'`
    }).join('AND ');
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    })
};
//添加menu
async function addMenu(opt) {
    
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO Menu (menuPic,menuDesc) VALUES (?,?)`, [opt.MenuPicUrl,opt.Menudesc], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(0);
            }
        });
    })
};
//删除menu
async function delMenu(opt) {
    
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM Menu WHERE (id='${opt.id}')`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(0);
            }
        });
    })
};
//修改menu
//UPDATE Menu SET MenuPicUrl='2', Menudesc='2' WHERE (id='11')
async function changeMenu(opt) {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE Menu SET menuPic='${opt.menuPic}', menuDesc='${opt.menuDesc}' WHERE (id='${opt.id}')`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(0);
            }
        });
    })
};
//修改menu描述信息
async function changeMenuDesc(opt) {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE Menu SET  menuDesc='${opt.menuDesc}' WHERE (id='${opt.id}')`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(0);
            }
        });
    })
};
// //查找menu单个数据
// async function searchMenu(opt) {
//     return new Promise((resolve, reject) => {
//         connection.query(`SELECT * FROM Menu  WHERE (title='${opt.title}')`, (err, result) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(result);
//             }
//         });
//     })
// };
module.exports = {
    findMenu,
    repeatMenu,
    addMenu,
    delMenu,
    changeMenu,
    changeMenuDesc
}