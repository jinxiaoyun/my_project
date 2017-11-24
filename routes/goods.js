var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var Goods = require('../modules/goods.js')

mongoose.connect('mongodb://127.0.0.1:27017/user')

mongoose.connection.on('connected',function(){
  console.log('MongoDB connected success!')
})
mongoose.connection.on('error',function(){
  console.log('MongoDB connected fail!')
})
mongoose.connection.on('disconnected',function(){
  console.log('MongoDB connected disconnected!')
})

router.get('/list',function(req,res,next){
  let params = {}
  let page = parseInt(req.param('page')),pageSize =parseInt(req.param('pageSize'))
  let priceLevel = req.param('priceLevel')
  let priceGt = '', priceLte = ''
  let sort = req.param('sort')
  let skip = (page-1)*pageSize
  if(priceLevel !='all'){
    switch(priceLevel){
      case '0': priceGt = 0; priceLte = 100;break;
      case '1': priceGt = 100; priceLte = 500;break;
      case '2': priceGt = 500; priceLte = 1000;break;
      case '3': priceGt = 1000; priceLte = 5000;break;
    }
    params = {
      salePrice:{
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }
  //console.log(page,pageSize,sort,skip)
  let goodsModel= Goods.find(params).skip(skip).limit(pageSize)
  goodsModel.sort({'salePrice':sort})
  goodsModel.exec({},function(err,doc){
    //console.log(err,doc)
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:{
          count:doc.length,
          list:doc
        }
      })
    }
  })
})

router.post('/addCart',function(req,res){
  var userId = '100000077',productId =req.body.productId;
  var User = require('../modules/user')
  User.findOne({userId:userId},function(err,userDoc){
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else{
      console.log("userDoc:" + userDoc)
      if(userDoc){
        let goodsItem= ''
        userDoc.cartList.forEach((item)=>{
          if(item.productId == productId){
            goodsItem = item
            item.productNum ++
          }
        })
        if(goodsItem){
          userDoc.save(function(err2,doc2){
            if(err2){
              res.json({
                status:'1',
                msg:err2.message
              })
            }else{
              res.json({
                status:0,
                msg:'加入购物车成功！',
                result:'success'
              })
            }
          })
        }else{
          Goods.findOne({productId:productId},function(err1,doc1){
            if(err1){
              res.json({
                status:'1',
                msg:err1.message
              })
            }else{
              if(doc1){
                doc1.productNum = 1
                doc1.checked = 1

                userDoc.cartList.push(doc1)

                userDoc.save(function(err2,doc2){
                  if(err2){
                    res.json({
                      status:'1',
                      msg:err2.message
                    })
                  }else{
                    res.json({
                      status:0,
                      msg:'加入购物车成功！',
                      result:'success'
                    })
                  }
                })
              }
            }
          })
        }
      }
    }
  })
})

module.exports = router;
