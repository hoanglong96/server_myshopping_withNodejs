var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var phoneCategorySchema = new Schema({
    imageCategory: String,
    type: String,
  }
);
var phoneCategoryModel = mongoose.model("PhoneCategory", phoneCategorySchema);

module.exports = phoneCategoryModel;
