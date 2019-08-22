const mysql = require('mysql');
const config = require('../config');
const connection = mysql.createConnection(
    config.database
);

connection.connect((err) => {
    err && console.log(err);
    console.log('Notebook数据库连接成功')
});
//查找Notebook总列表
async function findNotebook() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM Notebook', (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    })
};
//添加时判断Notebook是否重复
async function repeatNotebook(opt) {
    let sql = 'SELECT * FROM Notebook WHERE ' + Object.keys(opt).map(k => {
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
//添加Notebook
async function addNotebook(opt) {
    let { NotebookPic, NotebookDesc, NotebookTitle, price, Activeprice } = opt
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO Notebook (NotebookPic,NotebookDesc,NotebookTitle,price,Activeprice) VALUES (?,?,?,?,?)`, [NotebookPic, NotebookDesc, NotebookTitle, price, Activeprice], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(0);
            }
        });
    })
};
//删除Notebook
async function delNotebook(opt) {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM Notebook WHERE (id='${opt.id}')`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(0);
            }
        });
    })
};
//修改Notebook
//UPDATE Notebook SET NotebookPicUrl='2', Notebookdesc='2' WHERE (id='11')
async function changeNotebook(opt) {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE Notebook SET NotebookPic='${opt.NotebookPic}', NotebookDesc='${opt.NotebookDesc}',NotebookTitle='${opt.NotebookTitle}',price='${opt.price}',Activeprice='${opt.Activeprice}' WHERE (id='${opt.id}')`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(0);
            }
        });
    })
};
//修改NotebookDesc
//UPDATE Notebook SET NotebookPicUrl='2', Notebookdesc='2' WHERE (id='11')
async function changeNotebookDesc(opt) {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE Notebook SET  NotebookDesc='${opt.NotebookDesc}',NotebookTitle='${opt.NotebookTitle}',price='${opt.price}',Activeprice='${opt.Activeprice}' WHERE (id='${opt.id}')`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(0);
            }
        });
    })
};
module.exports = {
    findNotebook,
    repeatNotebook,
    addNotebook,
    delNotebook,
    changeNotebook,
    changeNotebookDesc
}