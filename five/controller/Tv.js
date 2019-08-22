const mysql = require('mysql');
const config = require('../config');
const connection = mysql.createConnection(
    config.database
);

connection.connect((err) => {
    err && console.log(err);
    console.log('TV数据库连接成功')
});
//查找TV总列表
async function findTV() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM TV', (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    })
};
//添加时判断TV是否重复
async function repeatTV(opt) {
    let sql = 'SELECT * FROM TV WHERE ' + Object.keys(opt).map(k => {
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
//添加TV
async function addTV(opt) {
    let { TVPic, TVDesc, TVTitle, price, Activeprice } = opt
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO TV (TVPic,TVDesc,TVTitle,price,Activeprice) VALUES (?,?,?,?,?)`, [TVPic, TVDesc, TVTitle, price, Activeprice], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(0);
            }
        });
    })
};
//删除TV
async function delTV(opt) {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM TV WHERE (id='${opt.id}')`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(0);
            }
        });
    })
};
//修改TV
//UPDATE TV SET TVPicUrl='2', TVdesc='2' WHERE (id='11')
async function changeTV(opt) {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE TV SET TVPic='${opt.TVPic}', TVDesc='${opt.TVDesc}',TVTitle='${opt.TVTitle}',price='${opt.price}',Activeprice='${opt.Activeprice}' WHERE (id='${opt.id}')`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(0);
            }
        });
    })
};
//修改TVDesc
async function changeTVDesc(opt) {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE TV SET  TVDesc='${opt.TVDesc}',TVTitle='${opt.TVTitle}',price='${opt.price}',Activeprice='${opt.Activeprice}' WHERE (id='${opt.id}')`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(0);
            }
        });
    })
};
// //查找TV单个数据
// async function searchTV(opt) {
//     return new Promise((resolve, reject) => {
//         connection.query(`SELECT * FROM TV  WHERE (title='${opt.title}')`, (err, result) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(result);
//             }
//         });
//     })
// };
module.exports = {
    findTV,
    repeatTV,
    addTV,
    delTV,
    changeTV,
    changeTVDesc
}