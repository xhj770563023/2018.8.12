const mysql = require('mysql');
const config = require('../config');
const connection = mysql.createConnection(
    config.database
);
connection.connect((err) => {
    err && console.log(err);
    console.log('nav数据库连接成功')
});
//查找导航总列表
async function findNav() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM Nav', (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    })
};
//添加时判断导航是否重复
async function repeatNav(opt) {
    let sql = 'SELECT * FROM `Nav` WHERE ' + Object.keys(opt).map(k => {
        return `${k} LIKE '${opt[k]}'`
    }).join('AND ');
    console.log(sql)
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
//添加导航
async function addNav(opt) {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO Nav (title) VALUES (?)`, [opt.title], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(0);
            }
        });
    })
};
//删除导航
async function delNav(opt) {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM Nav WHERE (id='${opt.id}')`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(0);
            }
        });
    })
};
//修改导航
//
async function changeNav(opt) {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE Nav SET title='${opt.title}' WHERE (id='${opt.id}')`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(0);
            }
        });
    })
};
//查找导航单个数据
async function searchNav(opt) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM Nav  WHERE (title='${opt.title}')`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    })
};



module.exports = {
    findNav,
    repeatNav,
    addNav,
    delNav,
    changeNav,
    searchNav,
}





















// async function findAll(opt,bool){
//     if(bool){
//         var sql='SELECT * FROM `shopdata` WHERE '+Object.keys(opt).map(k=>{
//             return `${k} LIKE '${opt[k]}'`
//         }).join('AND ');
//     }else{
//         var sql='SELECT * FROM `userlist` WHERE '+Object.keys(opt).map(k=>{
//             return `${k} LIKE '${opt[k]}'`
//         }).join('AND ');
//     }
//     return new Promise((resolve,reject)=>{
//         connection.query(sql,(err,result)=>{
//             if(err){
//                 reject(err);
//             }else{
//                 resolve(result);
//             }
//         });
//     })
// };
// //UPDATE `userlist` SET `username`='a', `passeord`='a', `email`='a' WHERE (`id`='1')
// async function inseruser(opt){
//     return new Promise((resolve,reject)=>{
//         connection.query(`INSERT INTO userlist (username,password) VALUES (?,?)`,[opt.username,opt.password],(err,result)=>{
//             if(err){
//                 reject(1);
//             }else{
//                 resolve(0);
//             }
//         });
//     })
// };
// //更改user图片
// async function updataPic(opt){
//     let sqlu=`UPDATE userlist SET userpic='${opt.updataPic}' WHERE (id='${opt.userid}')`;
//     console.log(sqlu,123)
//     return new Promise((resolve,reject)=>{
//         connection.query(sqlu,(err,result)=>{
//             if(err){
//                 reject(err);
//             }else{
//                 resolve(0);
//             }
//         });
//     })
// };

// //更改数据
// //UPDATE userlist SET  password='${opt.newPsw}', email='${opt.newEmail}', tel='232' WHERE (id='3');
// async function updataMsg(opt){
// console.log(opt)
//     let sqlM=`UPDATE userlist SET  password='${opt.newPsw}', email='${opt.newEmail}', tel='${opt.newTel}' WHERE (id='${opt.userid}')`;
//     return new Promise((resolve,reject)=>{
//         connection.query(sqlM,(err,result)=>{
//             if(err){
//                 reject(err);
//             }else{
//                 resolve(0);
//             }
//         });
//     })
// };
// //删除数据
// //DELETE FROM userlist WHERE (id='3')
// async function delUser(opt){
//     console.log(opt)
//         return new Promise((resolve,reject)=>{
//             connection.query(`DELETE FROM userlist WHERE (id='${opt.userid}')`,(err,result)=>{
//                 if(err){
//                     reject(err);
//                 }else{
//                     resolve(0);
//                 }
//             });
//         })
//     };


// //add
// //更改shop图片
// //INSERT INTO shopdata (userid, shopName, referral, kind, data, unit, shopPic) VALUES ( ?, ?, ?, ?, ?, ?, ?),[userid,shopName,referral,kind,valid_data,unit,shopPic]
// async function upShopPic(opt){
//     let {userid,shopName,referral,kind,valid_data,unit,shopPic}=opt;
//     console.log(userid,shopName,referral,kind,valid_data,unit,shopPic,'5555')
//     return new Promise((resolve,reject)=>{
//         connection.query(`INSERT INTO shopdata (userid, shopName, referral, kind, data, unit, shopPic) VALUES ( ?, ?, ?, ?, ?, ?, ?)`,[userid,shopName,referral,kind,valid_data,unit,shopPic],(err,result)=>{
//             if(err){
//                 reject(err);
//             }else{
//                 resolve(0);
//             }
//         });
//     })
// };
// //查数据
// async function findShop(){
//     return new Promise((resolve,reject)=>{
//         connection.query('SELECT * FROM `shopdata`',(err,result)=>{
//             if(err){
//                 reject(err);
//             }else{
//                 resolve(result);
//             }
//         });
//     })
// };

// //删除shoplist数据
// async function delshoplist(opt){
//         return new Promise((resolve,reject)=>{
//             connection.query(`DELETE FROM shopdata WHERE (id='${opt.userid}')`,(err,result)=>{
//                 if(err){
//                     reject(err);
//                 }else{
//                     resolve(0);
//                 }
//             });
//         })
//     };
