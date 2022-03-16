const { query } = require('express');
var express = require('express');
var router = express.Router();

// model, import
var Item = require('../models/item');

// 물품등록
// 127.0.0.1:3000/item/insert
// {"code1":"101", "code2":"011", "code3":"001","name":"가","price":1,"quantity":2}
router.post('/insert', async function(req, res, next) {
    try {
        var item = new Item();
        item.code1 = req.body.code1;
        item.code2 = req.body.code2;
        item.code3 = req.body.code3;
        item.name = req.body.name;
        item.price = Number(req.body.price);
        item['quantity'] = Number(req.body.quantity);

        const result = await item.save();
        console.log(result);
        if(result._id !== ''){
            return res.send({status:200});
        }
        return res.send({status:0});    
        
    } catch (e) {
        console.error(e);
        return res.send({status:-1});
    }

});

// 물품목록
// 127.0.0.1:3000/item/select
router.get('/select', async function(req, res, next) {
    try {

        const query = {};
        const result = await Item.find(query).sort({"_id":-1});
        return res.send({status:200, result:result});
       
    } catch (e) {
        console.error(e);
        return res.send({status:-1});
    }

});

// 대분류별 등록물품 개수
// 127.0.0.1:3000/item/groupcode1
router.get('/groupcode1', async function(req, res, next) {
    try {
        
        const result = await Item.aggregate([
            {
                $project : {
                    code1 : 1,
                    price : 1,
                    quantity : 1,
                }
            },
            {
                $group : {
                    _id : '$code1', // 그룹기준
                    count : {$sum : 1},
                    pricetotal : {$sum : '$price'},
                    quantitytotal : {$sum : '$quantity'}
                }
            }

        ]);
        return res.send({status:200, result:result});
       
    } catch (e) {
        console.error(e);
        return res.send({status:-1});
    }

});

// 127.0.0.1:3000/item/groupcode2?code=2
router.get('/groupcode2', async function(req, res, next) {
    try {
       
        const result = await Item.aggregate([
           
            {
                $project : {
                    code2 : 1,
                    price : 1,
                    quantity : 1,
                }
            },
            {
                $group : {
                    _id : '$code2', // 그룹기준
                    count : {$sum : 1},
                    pricetotal : {$sum : '$price'},
                    quantitytotal : {$sum : '$quantity'}
                }
            }

        ]);
        return res.send({status:200, result:result});
       
    } catch (e) {
        console.error(e);
        return res.send({status:-1});
    }

});

// 127.0.0.1:3000/item/groupcode3?code=3
router.get('/groupcode3', async function(req, res, next) {
    try {
       
        const result = await Item.aggregate([
           
            {
                $project : {
                    code3 : 1,
                    price : 1,
                    quantity : 1,
                }
            },
            {
                $group : {
                    _id : '$code3', // 그룹기준
                    count : {$sum : 1},
                    pricetotal : {$sum : '$price'},
                    quantitytotal : {$sum : '$quantity'}
                }
            }

        ]);
        return res.send({status:200, result:result});
       
    } catch (e) {
        console.error(e);
        return res.send({status:-1});
    }

});


module.exports = router;
