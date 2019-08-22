const mysql = require('mysql');
const config = require('../config');
const connection = mysql.createConnection(
    config.database
);

connection.connect((err) => {
    err && console.log(err);
    console.log('Home数据库连接成功')
});
//查找Home总列表
async function findHome() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM Home', (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    })
};
//添加时判断Home是否重复
async function repeatHome(opt) {
    let sql = 'SELECT * FROM Home WHERE ' + Object.keys(opt).map(k => {
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
//添加Home
async function addHome(opt) {
    let { HomePic, HomeDesc, HomeTitle, price, Activeprice } = opt
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO Home (HomePic,HomeDesc,HomeTitle,price,Activeprice) VALUES (?,?,?,?,?)`, [HomePic, HomeDesc, HomeTitle, price, Activeprice], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(0);
            }
        });
    })
};
//删除Home
async function delHome(opt) {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM Home WHERE (id='${opt.id}')`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(0);
            }
        });
    })
};
//修改Home
//UPDATE Home SET HomePicUrl='2', Homedesc='2' WHERE (id='11')
async function changeHome(opt) {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE Home SET HomePic='${opt.HomePic}', HomeDesc='${opt.HomeDesc}',HomeTitle='${opt.HomeTitle}',price='${opt.price}',Activeprice='${opt.Activeprice}' WHERE (id='${opt.id}')`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(0);
            }
        });
    })
};
//修改HomeDesc
//UPDATE Home SET HomePicUrl='2', Homedesc='2' WHERE (id='11')
async function changeHomeDesc(opt) {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE Home SET  HomeDesc='${opt.HomeDesc}',HomeTitle='${opt.HomeTitle}',price='${opt.price}',Activeprice='${opt.Activeprice}' WHERE (id='${opt.id}')`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(0);
            }
        });
    })
};
module.exports = {
    findHome,
    repeatHome,
    addHome,
    delHome,
    changeHome,
    changeHomeDesc
}