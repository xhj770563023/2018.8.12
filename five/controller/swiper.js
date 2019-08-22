const mysql = require('mysql');
const config = require('../config');
const connection = mysql.createConnection(
    config.database
);

connection.connect((err) => {
    err && console.log(err);
    console.log('swiper数据库连接成功')
});
//查找swiper总列表
async function findSwiper() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM Swiper', (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    })
};
//添加时判断图片是否重复
async function repeatSwiper(opt) {
    let sql = 'SELECT * FROM `Swiper` WHERE ' + Object.keys(opt).map(k => {
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
//添加图片
async function addSwiper(opt) {
    
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO Swiper (swiperPicUrl,swiperdesc) VALUES (?,?)`, [opt.swiperPicUrl,opt.swiperdesc], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(0);
            }
        });
    })
};
//删除图片
async function delSwiper(opt) {
    
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM Swiper WHERE (id='${opt.id}')`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(0);
            }
        });
    })
};
//修改图片
//UPDATE Swiper SET swiperPicUrl='2', swiperdesc='2' WHERE (id='11')
async function changeSwiper(opt) {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE Swiper SET swiperPicUrl='${opt.swiperPicUrl}', swiperdesc='${opt.swiperdesc}' WHERE (id='${opt.id}')`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(0);
            }
        });
    })
};
//修改图片注释
//UPDATE Swiper SET swiperPicUrl='2', swiperdesc='2' WHERE (id='11')
async function changeSwiperDesc(opt) {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE Swiper SET  swiperdesc='${opt.swiperdesc}' WHERE (id='${opt.id}')`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(0);
            }
        });
    })
};
//查找图片单个数据
// async function searchSwiper(opt) {
//     return new Promise((resolve, reject) => {
//         connection.query(`SELECT * FROM Swiper  WHERE (title='${opt.title}')`, (err, result) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(result);
//             }
//         });
//     })
// };
module.exports = {
    findSwiper,
    repeatSwiper,
    addSwiper,
    delSwiper,
    changeSwiper,
    changeSwiperDesc
}