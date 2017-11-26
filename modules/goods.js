var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var productSchema = new Schema({
  "productId":String,
  "productName":String,
  "salePrice":Number,
  "productImage":String,
  "productNum":Number,
  "checked":String
})

module.exports = mongoose.model('Good',productSchema,'goods')
//如果不加第三个参数，Good默认关联的文档为goods,加了之后就为指定的文档
