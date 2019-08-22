const mysql = require('mysql');
const config = require('../config');
const connection = mysql.createConnection(
    config.database
);

connection.connect((err) => {
    err && console.log(err);
    console.log('Tel数据库连接成功')
});
//查找Tel总列表
async function findTel() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM Tel', (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    })
};
//添加时判断Tel是否重复
async function repeatTel(opt) {
    let sql = 'SELECT * FROM Tel WHERE ' + Object.keys(opt).map(k => {
        return `${k} LIKE '${opt[k]}'`
    }).join(' AND ');
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
//添加Tel
async function addTel(opt) {
    
    let { TelPic, TelDesc, TelTitle, price, Activeprice } = opt
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO Tel (TelPic,TelDesc,TelTitle,price,Activeprice) VALUES (?,?,?,?,?)`, [TelPic, TelDesc, TelTitle, price, Activeprice], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(0);
            }
        });
    })
};
//删除Tel
async function delTel(opt) {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM Tel WHERE (id='${opt.id}')`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(0);
            }
        });
    })
};
//修改Tel
//UPDATE Tel SET TelPicUrl='2', Teldesc='2' WHERE (id='11')
async function changeTel(opt) {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE Tel SET TelPic='${opt.TelPic}', TelDesc='${opt.TelDesc}',TelTitle='${opt.TelTitle}',Activeprice='${opt.Activeprice}',price='${opt.price}' WHERE (id='${opt.id}')`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(0);
            }
        });
    })
};
//修改TelDesc
//UPDATE Tel SET TelPicUrl='2', Teldesc='2' WHERE (id='11')
async function changeTelDesc(opt) {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE Tel SET  TelDesc='${opt.TelDesc}',TelTitle='${opt.TelTitle}',Activeprice='${opt.Activeprice}',price='${opt.price}' WHERE (id='${opt.id}')`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(0);
            }
        });
    })
};
// //查找Tel单个数据
// async function searchTel(opt) {
//     return new Promise((resolve, reject) => {
//         connection.query(`SELECT * FROM Tel  WHERE (title='${opt.title}')`, (err, result) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(result);
//             }
//         });
//     })
// };
module.exports = {
    findTel,
    repeatTel,
    addTel,
    delTel,
    changeTel,
    changeTelDesc
}