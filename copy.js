var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Diacritics = require('diacritic');
var request = require('request');
var cheerio = require('cheerio');
//import model
var Food = require('./models/food');
var User = require('./models/user');
var UserInfo = require('./models/userInfo');
var PhoneCategory = require('./models/PhoneCategory')
var PhoneProduct = require('./models/PhoneProduct')
var TabletProduct = require('./models/TabletProduct')
var NewsFeed = require('./models/NewsFeed')
var Order = require('./models/Order')
var RegisterUser = require('./models/RegisterUser')

//LOGIN
var ObjectID = mongoose.ObjectID
var crypto = require('crypto')

//CREATE FUNCTION TO RANDOM SALT
var genRandomString = function(length){
  return crypto.randomBytes(Math.ceil(length/2))
                .toString('hex'.slice(0,length));
}

var sha512 = function(password,salt){
  var hash = crypto.createHmac('sha512',salt);
  hash.update(password);
  var value = hash.digest('hex');
  return{
    salt:salt,
    passwordHash:value
  }
}

function saltHashPassword(userPassword){
  var salt = genRandomString(16);
  var passwordData = sha512(userPassword,salt);
  return passwordData;
}

function checkHashPassword(userPassword,salt){
  var passwordData = sha512(userPassword,salt)
  return passwordData;
}

var app = express();

//MONGO CLIENT
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://hoanglong96:hoanglong96@ds111618.mlab.com:11618/hoanglongdb', {
  useMongoClient: true
});

//Set port 
app.set('port', (process.env.PORT || 040516));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
  //intervalObj
});

// const intervalObj = setInterval(() => {
//   checkCount();
// }, 1000);

var checkCount = function () {
  console.log("hihi")
}

//crawl category
// var urlCategory = "https://www.thegioididong.com/dtdd";
// request(urlCategory,function(err,res,body){
//   if(!err && res.statusCode == 200){
//     $ = cheerio.load(body)
//     var ds = $(body).find('.manuwrap .manunew a img');
//         ds.each(function(i,e){
//           var phoneCategory = new PhoneCategory({
//             image: 'https:'+$(this).attr('src'),
//             href: $(this).find('href')
//           });

//           // phoneCategory.save(function (err, createdPhoneCategory) {
//           //   if (err) {
//           //     //res.json({ "success": 0, "message": "Could not add record: " + err });
//           //   } else {
//           //     console.log(createdPhoneCategory)
//           //     //res.json(createdPhoneCategory);
//           //   }
//           // });
//     })
//   }
// }) 


//Crawl Category Phu Kien
// var urlCategory = "https://www.thegioididong.com/phu-kien";
// request(urlCategory,function(err,res,body){
//   if(!err && res.statusCode == 200){
//     $ = cheerio.load(body)
//     var ds = $(body).find('.homepage .navaccessories2018 a');
//         ds.each(function(i,e){

//           var phoneCategory = new PhoneCategory({
//             imageCategory: $(this).find('h3').text(),
//             typeCategory:'phu-kien',
//             type:$(this).find('h3').text()
//           });

//           phoneCategory.save(function (err, createdPhoneCategory) {
//             if (err) {
//               console.log('error')
//             } else {
//               console.log('success')
//             }
//           });
//     })
//   }
// }) 

// // //Crawl Trang chu
// var urlHome = "https://www.thegioididong.com/"
// request(urlHome,function(err,response,body){
//   if(!err && response.statusCode == 200){

//     //Variable Object
//     var slideImage = []
//     var objKM = []
//     var objPhone = []
//     var objLaptop = []
//     var objAccessories = []

//     var $ = cheerio.load(body)
//     //Crawl slide image
//     var ds = $(body).find('.homebanner #sync1 .item')
//     ds.each(function(i,e){
//       var image = $(this).find('a img').attr('src')
//       if(image == undefined){
//         image = $(this).find('a img').attr('data-src')
//       }
//       slideImage.push('https:'+image)
//     })

//     //Crawl 13 khuyen mai noi bat
//     var noibat = $(body).find('#owl-promo .item')
//     noibat.each(function(i,e){
//       //href
//       var href = 'https://www.thegioididong.com'+$(this).find('a').attr('href')
//       //image
//       var imageItem = $(this).find('a img').attr('src')
//       if(imageItem == undefined){
//         imageItem = $(this).find('a img').attr('data-original')
//       }
//       //Title
//       var titleItem = $(this).find('h3').text()
//       //Price
//       var newPrice = $(this).find('.price strong').text()
//       //discount
//       var shockprice = $(this).find('.shockprice').text()
//       var discount = $(this).find('.discount').text()
//       var installment = $(this).find('.installment').text()
//       var pre = $(this).find('.per').text()
//       var promoImage = $(this).find('.promo img').attr('data-original')
//       if(promoImage==undefined){
//         promoImage = $(this).find('.promo img').attr('src')
//       }
//       var newItem = $(this).find('.new').text()
//       var promo = $(this).find('.promo p').text()
//       //

//       var obj = new Object()
//       obj.href = href
//       obj.image = imageItem
//       obj.titleItem= titleItem
//       obj.newPrice=newPrice
//       obj.shockprice=shockprice
//       obj.discount =discount
//       obj.installment=installment
//       obj.pre=pre
//       obj.promo = promo
//       obj.imagePromo = promoImage
//       obj.newItem = newItem

//       objKM.push(obj)
//     })

//     //Crawl dien thoai noi bat
//     var homeproduct = $(body).find('.homeproduct li')
//     homeproduct.each(function(i,e){
//       if(i<=7){
//         var href = 'https://www.thegioididong.com/'+$(this).find('a').attr('href')
//         var image = $(this).find('img').attr('data-original')
//         var titlePhone = $(this).find('h3').text()
//         var pricePhone = $(this).find('.price strong').text()
//         var shockprice = $(this).find('.shockprice').text()
//         var discount = $(this).find('.discount').text()
//         var installment = $(this).find('.installment').text()
//         var promo = $(this).find('.promo').text()
//         var imagePromo = $(this).find('.promo img').attr('data-original')

//         var obj = returnPhone()

//         // obj.href = href
//         // obj.image = image
//         // obj.price = pricePhone
//         // obj.shockprice = shockprice
//         // obj.discount = discount
//         // obj.installment = installment
//         // obj.promo = promo
//         // obj.imagePromo = imagePromo
//         // var phoneProduct;
//         // request(href, function (error, res, body) {
//         //   var title1
//         //   if (!error && res.statusCode == 200) {

//         //     var $ = cheerio.load(body)
//         //     var ds = $(body).find('.rowtop')

//         //     //Crawl title
//         //     ds.each(function (i, e) {
//         //       title1 = $(this).find('h1').text()
//         //     })

//         //     phoneProduct = new PhoneProduct({
//         //       title: title1,
//         //     });  
//              objPhone.push(obj)
//         //     }
//         // })
//       }
//     })

//     //Crawl laptop noi bat
//     var homeLaptop = $(body).find('.homeproduct li')
//     homeLaptop.each(function(i,e){
//       if(i>7){
//         var href = 'https://www.thegioididong.com'+$(this).find('a').attr('href')
//         var imageLaptop = $(this).find('img').attr('data-original')
//         var titleLaptop = $(this).find('h3').text()
//         var priceLaptop = $(this).find('.price strong').text()
//         var installmentLaptop = $(this).find('.installment').text()
//         var promoLaptop = $(this).find('.promo').text()
//         var imagePromoLaptop = $(this).find('.promo img').attr('data-original')

//         var obj = new Object()
//         obj.href = href
//         obj.image = imageLaptop
//         obj.title = titleLaptop
//         obj.price = priceLaptop
//         obj.installment = installmentLaptop
//         obj.promo = promoLaptop
//         obj.imagePromo = imagePromoLaptop

//         objLaptop.push(obj)
//       }
//     })

//     //Crawl phu kien noi bat
//     var homeAccess = $(body).find('.owl-carousel .item')
//     homeAccess.each(function(i,e){

//       if(i>14){
//         var href = 'https://www.thegioididong.com'+$(this).find('a').attr('href')
//         var image = $(this).find('a img').attr('src')
//         if(image == undefined){
//           image = $(this).find('a img').attr('data-original')
//         }

//         var title = $(this).find('h3').text()
//         var price = $(this).find('.price strong').text()
//         var per = $(this).find('.per').text()

//         var obj = new Object()
//         obj.image = image
//         obj.href = href
//         obj.title = title
//         obj.price = price
//         obj.per = per

//         objAccessories.push(obj)
//       }
//     })

//     var newsFeed = new NewsFeed({
//       slideImage:slideImage,
//       km : objKM,
//       phone:objPhone,
//       laptop:objLaptop,
//       accessories:objAccessories
//     })

//     newsFeed.save(function (err, createNewsFeed) {
//       if (err) {
//         console.log("error")
//       } else {
//         console.log("success")
//       }
//     })
//   }
// })

//Crawl Laptop
// var urlMobile = "https://www.thegioididong.com/laptop-apple-macbook";
// request(urlMobile, function (err, response, body) {
//   if (!err && response.statusCode == 200) {

//     var ratting
//     var numberRating
//     var deal

//     var $ = cheerio.load(body)
//     var ds = $(body).find('.homeproduct li a')
//     var type = $(body).find('.choosedfilter a h2').text()

//     ds.each(function (i, e) {
//       var linkUrl = 'https://www.thegioididong.com'+$(this).attr('href')
//       ratting = $(this).find('.ratingresult .icontgdd-ystar').length
//       numberRating = $(this).find('.ratingresult').text().replace("            ", '').trim();
//       deal = $(this).find('label').text()
//       var title = $(this).find('h3').text()
//       crawlerItem(linkUrl,title,type,ratting,numberRating,deal)

//     })
//   } else {
//     console.log('error1')
//   }
// })

// async function crawlerItem(linkUrl,titleItem,type,ratting,numberRating,deal){

//   var title;
//   var price;
//   var listKhuyenMai = []
//   var slider = []
//   var listExtra = []
//   var listThongSo = []
//   var characteristics
//   var h2
//   var video
//   var detailContent = []
//   var image
//   var deal

//   request(linkUrl, function (error, res, body) {
//     if (true) {

//       var $ = cheerio.load(body)
//       var ds = $(body).find('.rowtop')

//       //Crawl title
//       ds.each(function (i, e) {
//         title = $(this).find('h1').text()
//       })

//       //Crawl price, sale, 
//       var ds1 = $(body).find('.rowdetail')
//       ds1.each(function (i, e) {
//         image = $(this).find('.picture img').attr('src')
//         price = $(this).find('.price_sale .area_price strong').text()
//         khuyenmai = $(this).find('.price_sale .area_promotion .infopr span').each(function (i, e) {
//           var km = $(this).text()
//           listKhuyenMai.push(km)
//         })
//       })

//       //Sản phẩm đi kèm
//       var ds2 = $(body).find('.accessories ul li')
//       ds2.each(function (i, e) {
//         var priceExtra = $(this).find('a .gs').text()
//         if(priceExtra==""){
//           priceExtra = $(this).find('a strong').text()
//         }
//         var item = $(this).find('a h3').text()
//         var imageItem = $(this).find('a img').attr('data-original')

//         var obj = new Object();
//         obj.imageExtra = imageItem;
//         obj.titleExtra = item;
//         obj.priceExtra = priceExtra
//         listExtra.push(obj)
//       })

//       //Crawl thông số
//       var thongso = $(body).find('.box_content .right_content .tableparameter li')
//       thongso.each(function (i, e) {
//         var titleThongSo = $(this).find('span').text()
//         var titleChiTiet = $(this).find('div').text()

//         var objThongSo = new Object();
//         objThongSo.titlePara = titleThongSo
//         objThongSo.contentPara = titleChiTiet
//         listThongSo.push(objThongSo)
//       })

//       //Content
//       var ds3 = $(body).find('.box_content .left_content');
//       ds3.each(function (i, e) {
//         characteristics = $(this).find('.characteristics h2').text()
//         h2 = $(this).find('.boxArticle .area_article h2').text();
//         video = $(this).find('.boxArticle .area_article .video').attr('src');
//         var image = $(this).find('.boxArticle .area_article').each(function (i, e) {
//           var image = $(this).find('p .preventdefault').attr('href')
//           var p = $(this).find('p').text()
//           var h3 = $(this).find('h3').text()

//           var objDetailContent = new Object();
//           objDetailContent.title = p
//           objDetailContent.image = image
//           objDetailContent.h3 = h3
//           detailContent.push(objDetailContent)
//         })

//         //Slider
//         var item1 = $(this).find('.characteristics #owl-detail .item img').each(function (i, e) {
//           var ee = $(this).attr('data-src')
//           slider.push(ee)
//         })
//       })

//       //Type Category
//       var ty
//       var typeCategory = $(body).find('.breadcrumb li a')
//         typeCategory.each(function(i,e){
//           if(i==1){
//            ty = $(this).text()
//           }
//         })

//       var phoneProduct = new PhoneProduct({
//         typeCategory:ty,
//         type: type,
//         title: titleItem,
//         price: price,
//         deal: deal,
//         image: image,
//         rating: ratting,
//         numberRating: numberRating,
//         listSale: listKhuyenMai,
//         listExtraProduct: listExtra,
//         listParameter: listThongSo,
//         slider: slider,
//         titleH2:h2,
//         titleContent: characteristics,
//         linkVideo: video,
//         detailContent: detailContent
//       });

//       // phoneProduct.save(function (err, createPhoneProduct) {
//       //   if (err) {
//       //     console.log("error")
//       //   } else {
//       //     console.log("success")
//       //   }
//       // })

//     }
// })
// }

//Crawl Phu kien
// var urlMobile = "https://www.thegioididong.com/sac-dtdd";
// request(urlMobile, function (err, response, body) {
//   if (!err && response.statusCode == 200) {
//     var deal
//     var $ = cheerio.load(body)
//     var ds = $(body).find('.cate li')

//     ds.each(function (i, e) {
//       var linkUrl = 'https://www.thegioididong.com'+$(this).find('a').attr('href')
//       deal = $(this).find('.discountpercent').text()
//       var title = $(this).find('h3').text()
//       crawlerItem(linkUrl,title,deal)
//     })
//   } else {
//     console.log('error')
//   }
// })

// async function crawlerItem(linkUrl,titleItem,deal){
//   var price;
//   var hisprice;
//   var listKhuyenMai = []
//   var slider = []
//   var listExtra = []
//   var listCongDung = []
//   var listThongSo = []
//   var rating 
//   var ratingNumber
//   var h2
//   var video
//   var detailContent = []
//   var image
//   var typeCategoryItem
//   var characteristics;

//   request(linkUrl, function (error, res, body) {
//     if (true) {

//       var $ = cheerio.load(body)
//       var ds = $(body).find('.rowdetail')

//       //Crawl price, sale, 
//       ds.each(function (i, e) {
//         image = $(this).find('.picture img').attr('src')
//         price = $(this).find('.price_sale .area_price strong').text()
//         hisprice = $(this).find('.price_sale .area_price .hisprice').text()
//         khuyenmai = $(this).find('.boxdefault .area_promotion .infopr span ul li').each(function (i, e) {
//           var km = $(this).text()
//           listKhuyenMai.push(km)
//         })
//       })

//       var dsRating = $(body).find('.rowtop');
//       dsRating.each(function(i,e){
//         ratingNumber = $(this).find('a').text()
//         rating = $(this).find('span').length
//       })

//       //Cong dung
//       var ds2 = $(body).find('.plcAcc li')
//       ds2.each(function (i, e) {
//         var congdung = $(this).text()
//         listCongDung.push(congdung)
//       })

//       //Crawl thông số
//       var thongso = $(body).find('.box_content .right_content .tableparameter .parameter li')
//       thongso.each(function (i, e) {
//         var titleThongSo = $(this).find('span').text()
//         var titleChiTiet = $(this).find('div').text()

//         var objThongSo = new Object();
//         objThongSo.titlePara = titleThongSo
//         objThongSo.contentPara = titleChiTiet
//         listThongSo.push(objThongSo)
//       })

//       //Content
//       var ds3 = $(body).find('.box_content .left_content');
//       ds3.each(function (i, e) {
//         h2 = $(this).find('.boxArticle .area_article h2 strong').text();
//         var contentDetail = $(this).find('.boxArticle .area_article')
//         contentDetail.each(function (i, e) {

//           var image = $(this).find('p .preventdefault').attr('href')
//           var p = $(this).find('p').text()
//           var h3 = $(this).find('h3').text()

//           var objDetailContent = new Object();
//               objDetailContent.title = p
//               objDetailContent.image = image
//               objDetailContent.h3 = h3

//           detailContent.push(objDetailContent)
//         })
//       })

//       //Slider
//       var item1 = $(body).find('.colorandpic .owl-carousel .item img').each(function(i,e){
//           var slideItem = 'https:'+$(this).attr('src')
//           slider.push(slideItem)
//       })

//       //Type Category
//       var typeCategory = $(body).find('.breadcrumb li a')
//         typeCategory.each(function(i,e){
//           if(i==1){
//             typeCategoryItem = $(this).text()
//           }else if(i==2){
//             type = $(this).text()
//           }
//         })

//       var phoneProduct = new PhoneProduct({
//         typeCategory:typeCategoryItem,
//         type: type,
//         title: titleItem,
//         price: price,
//         hisprice:hisprice,
//         deal: deal,
//         image: image,
//         rating: rating,
//         numberRating: ratingNumber,
//         listSale: listKhuyenMai,
//         listExtraProduct: listExtra,
//         listParameter: listThongSo,
//         listCongDung:listCongDung,
//         slider: slider,
//         titleH2:h2,
//         titleContent: characteristics,
//         linkVideo: video,
//         detailContent: detailContent
//       });

//       phoneProduct.save(function (err, createPhoneProduct) {
//         if (err) {
//           console.log("error")
//         } else {
//           console.log("success")
//         }
//       })

//     }
// })
// }

// var urlCate = "https://www.thegioididong.com/dong-ho-thong-minh";
// request(urlCate, function (err, response, body) {
//  // if (!err && response.statusCode == 200) {
//     var $ = cheerio.load(body)
//     var ds = $(body).find('.manunew a')
//     ds.each(function(i,e){
//       var herf = 'https:'+$(this).attr('href')
//       var img = 'https:'+$(this).find('img').attr('src')

//       if(img!=undefined){
//         funCrawlType(herf,img)
//       }
//     })
//   //}
// })

// async function funCrawlType(href,img){
//   request(href, function (error, response, body) {
//       if(!error){
//         var $ = cheerio.load(body)
//         var type = $(body).find('.choosedfilter a h2').text()
//         console.log(type)
//         var phoneCategory = new PhoneCategory({
//           imageCategory: img,
//           type:type,
//           typeCategory:"Đồng hồ thông minh"
//         })

//         phoneCategory.save(function (err, createCategory) {
//                   if (err) {
//                     console.log("error")
//                   } else {
//                     console.log("success")
//                   }
//                 })
//       }else{
//         console.log('error')
//       }
//   })
// }

//API LOGIN
app.post('/register',(request,response,next)=>{
  var post_data = request.body;
  var plaint_password = post_data.password;
  var hash_data = saltHashPassword(plaint_password);

  var password = hash_data.passwordHash;

  var salt = hash_data.salt;
  var fullname = post_data.fullname;
  var email = post_data.email;
  var sex = post_data.sex;
  var dateJoin = post_data.dateJoin;

  var insertJson = new RegisterUser({
    email:email,
    password:password,
    salt:salt,
    fullname:fullname,
    sex:sex,
    dateJoin: dateJoin
  });

  RegisterUser.find({'email':email}).count(function(err,number){
    if(number!=0){
      response.json({
        statusCode:101,
        message:"Email already exists"
      })
    }else{
      insertJson.save(function(error,res){
        if(error){
          response.json({
            statusCode:104,
            message:"Registrantion error"
          })
        }else{
          response.json(res)
        }
      })
    }
  })

});

app.post('/login',function(request,response,next){
  var body = request.body;
  var email = body.email;
  var userPassword = body.password;

  RegisterUser.find({'email':email}).count(function(err,number){
    if(number==0){
      response.json('Email not exists')
      console.log('Email not exists')
    }else{
      RegisterUser.findOne({'email':email},function(err,user){
        var salt = user.salt;
        var hash_password = checkHashPassword(userPassword,salt).passwordHash;
        var encrypted_password = user.password;
        if(hash_password = encrypted_password){
          response.json(user)
        }
      });
    }
  });
});

app.get('/getUser',function(error,response){
  RegisterUser.find(function (err, userRegister) {
    if (err) {
      response.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      response.send(userRegister);
    }
  })
});
//END API LOGIN

//API HOME
app.get('/getHome/', function (req, res) {
  NewsFeed.find(function (err, newsFeed) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      res.send({
        NewsFeed: newsFeed
      });
    }
  });
})
//END API HOME

//API PRODUCT
app.get('/getPhoneWithType/:type', function (req, res) {
  PhoneProduct.find({
    "type": req.params.type
  }, function (err, phoneProduct) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      res.send({
        PhoneProduct: phoneProduct
      });
    }
  });
})

app.get('/deletePhoneType/:type', function (req, res) {
  PhoneProduct.deleteMany({
    "type": req.params.type
  }, function (err, phoneProduct) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      res.send({
        PhoneProduct: phoneProduct
      });
    }
  });
})

app.get('/getPhoneProduct/:title', function (req, res) {
  PhoneProduct.find({
    "title": req.params.title
  }, function (err, phoneProduct) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      res.send({
        PhoneProduct: phoneProduct
      });
    }
  });
})

app.get('/getPhoneCategory/:typeCategory', function (req, res) {
  PhoneProduct.find({
    "typeCategory": req.params.typeCategory
  }, function (err, phoneProduct) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      res.send({
        PhoneProduct: phoneProduct
      });
    }
  });
})

app.get('/getPhoneProduct/', function (req, res) {
  PhoneProduct.find(function (err, phoneProduct) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      res.send({
        PhoneProduct: phoneProduct
      });
    }
  });
})

app.get('/getTabletProduct/', function (req, res) {
  TabletProduct.find(function (err, tabletProduct) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      res.send({
        TabletProduct: tabletProduct
      });
    }
  });
})

app.post('/createCategoryPhone', function (req, res) {
  var body = req.body;
  var imageValue = body.imageCategory
  var type = body.type

  var category = new PhoneCategory({
    imageCategory: imageValue,
    type: type
  })

  category.save(function (err, createCategory) {
    if (err) {
      res.json({
        "success": 0,
        "message": "Could not add record: " + err
      });
    } else {
      res.json(createCategory);
    }
  });
})

//Get Category with TypeCategory
app.get('/getCategory/:typeCategory', function (req, res) {
  PhoneCategory.find({
    "typeCategory": req.params.typeCategory
  }, function (err, categoryPhones) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      // res.json(foods);
      res.send({
        Category: categoryPhones
      });
    }
  });
});
//API END PRODUCT

//Create Product
app.post('/createProduct', function (req, res) {
  var body = req.body;

  var typeCategoryValue = body.typeCategory;
  var typeValue = body.type;
  var priceValue = body.price;
  var hispriceValue = body.hisprice;
  var dealValue = body.deal;
  var imageValue = body.image;
  var ratingValue = body.rating;
  var titleValue = body.title;
  var numberRatingValue = body.numberRating;
  var listSaleValue = body.listSale;
  var listExtraProductValue = body.listExtraProduct;
  var listParameterValue = body.listParameter;
  var titleH2Value = body.titleH2;
  var titleContentValue = body.titleContent;
  var linkVideoValue = body.linkVideo;
  var topContentPValue = body.topContentP;
  var detailContentValue = body.detailContent;
  var listCongDungValue = body.listCongDung;
  var sliderValue = body.slider;

  var phoneProduct = new PhoneProduct({
    typeCategory:typeCategoryValue,
    type: typeValue,
    price: priceValue,
    hisprice:hispriceValue,
    deal:dealValue,
    image: imageValue,
    rating : ratingValue,
    title: titleValue,
    numberRating: numberRatingValue,
    listSale: listSaleValue,
    listExtraProduct:listExtraProductValue,
    listParameter:listParameterValue,
    titleH2:titleH2Value,
    titleContent:titleContentValue,
    linkVideo: linkVideoValue,
    topContentP:topContentPValue,
    detailContent:detailContentValue,
    listCongDung:listCongDungValue,
    slider:sliderValue
  });


  phoneProduct.save(function (err, createProduct) {
    if (err) {
      res.json({
        "success": 0,
        "message": "Could not add record: " + err
      });
    } else {
      res.json(createProduct);
    }
  });
});

//Create Order
app.post('/createOrder', function (req, res) {
  var body = req.body;

  var idUserValue = body.idUser;
  var typeOrderValue = body.typeOrder;
  var dateOrderValue = body.dateOrder;
  var statusOrderValue = body.statusOrder;
  var addressUserValue = body.addressUserValue;
  var nameUserValue = body.nameUserValue;
  var phoneNumberValue = body.phoneNumber;
  var typePaymentValue = body.typePayment;
  var cartValue = body.cart;

  var order = new Order({
    idUser:idUserValue,
    typeOrder: typeOrderValue,
    dateOrder:dateOrderValue,
    statusOrder:statusOrderValue,
    addressUser: addressUserValue,
    nameUser:nameUserValue,
    phoneNumber:phoneNumberValue,
    typePayment:typePaymentValue,
    cart: cartValue
  });


  order.save(function (err, createOrder) {
    if (err) {
      res.json({
        "success": 0,
        "message": "Could not add record: " + err
      });
    } else {
      res.json(createOrder);
    }
  });
});

//Get All Order
app.get('/getOrder', function (req, res) {
  Order.find(function (err, order) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      res.send({Orders : order});
    }
  });
});

//Get Order with idUser
app.get('/getOrder/:idUser', function (req, res) {
  Order.find({
    "idUser": req.params.idUser
  }, function (err, orderProducts) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      res.send({
        Orders: orderProducts
      });
    }
  });
});

//Update Order
app.put('/updateOrder/:_id', function (req, res) {
  Order.findOne({
    '_id': req.params._id
  }, function (err, order) {
    // Handle any possible database errors
    if (err) {
      res.status(500).send(err);
    } else {
      order.statusOrder = req.body.statusOrder || order.statusOrder

      order.save(function (err, order) {
        if (err) {
          res.status(500).send(err)
        } else {
          res.send(order);
        }
      });
    }
  });
});

//Update Favorites Item with User
app.put('/updateFavorites/:_id', function (req, res) {
  UserInfo.findOne({
    '_id': req.params._id
  }, function (err, user) {
    if (err) {
      res.status(500).send(err);
    } else {
      user.favorites = req.body.favorites || user.favorites;

      // Save the updated document back to the database
      user.save(function (err, user) {
        if (err) {
          res.status(500).send(err)
        } else {
          res.send(user);
        }
      });
    }
  });
});

//Create User
app.post('/create_user', function (req, res) {
  var body = req.body;

  UserInfo.findOne({
    'userName': body.userName
  }, function (err, user) {
    if (err) {
      res.json({
        "success": 0,
        "message": "Could not add record: " + err
      });
    } else {
      if (user) {
        res.json({
          "success": 201,
          "message": "Trung username: " + err
        });
      } else {
        var imageAvatar = body.imageAvatar;
        var fullName = body.fullName;
        var userName = body.userName;
        var email = body.email;
        var password = body.password;
        var sex = body.sex;

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
          dd = '0' + dd
        }

        if (mm < 10) {
          mm = '0' + mm
        }

        var user = new UserInfo({
          // id:idValue,
          imageAvatar: imageAvatar,
          fullName: fullName,
          userName: userName,
          email: email,
          password: password,
          date: dd + '/' + mm + '/' + yyyy,
          sex: sex,
        });
        user.save(function (err, createdUser) {
          if (err) {
            res.json({
              "success": 0,
              "message": "Could not add record: " + err
            });
          } else {
            res.json(createdUser);
          }
        });
      }
    }
  });
});

//Get All User
app.get('/get_all_user', function (req, res) {
  UserInfo.find(function (err, users) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      // res.json(foods);
      res.send(users);
    }
  });
});

//GetProfile User
app.get('/getUserProfile/:_id', function (req, res) {
  UserInfo.findOne({
    '_id': req.params.userId
  }, function (err, user) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      res.send(user);
    }
  });
});

//Update Address User
app.put('/updateAddressUser/:_id', function (req, res) {
  UserInfo.findOne({
    '_id': req.params.userId
  }, function (err, user) {
    if (err) {
      res.status(500).send(err);
    } else {
    
      user.address = req.body.address || user.address;

      // Save the updated document back to the database
      user.save(function (err, user) {
        if (err) {
          res.status(500).send(err)
        } else {
          res.send(user);
        }
      });
    }
  });
});

//Search
app.post('/searching', function (req, res) {
  var body = req.body;
  var keySearchFormat = Diacritics.clean(body.keySearch.toLowerCase());
  Food.find(function (err, foods) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      // res.json(foods);
      var foodsReturn = [];
      foods.forEach(function (value) {
        var nameFormat = Diacritics.clean(value.name.toLowerCase());
        if (nameFormat.indexOf(keySearchFormat) > -1) {
          foodsReturn.push(value);
        }
      });
      res.json({
        food: foodsReturn
      });
    }
  });
});

//GetTopFood
app.get('/getTopFood', function (req, res) {
  var mysort = {
    rating: -1
  };
  Food.find().sort(mysort).exec(function (err, result) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      res.send({
        food: result
      });
    }
  });
});

//Delete Product with ID
app.delete('/deleteProduct/:_id', function (req, res) {
  var productID = req.params._id;

  PhoneProduct.findByIdAndRemove(productID, function (error, product) {
    if (err) {
      res.json({
        "success": 0,
        "message": "Could not delete data from mlab"
      });
    } else {
      res.json({
        "success": 1,
        "message": "Delete succesfully"
      });
    }
  });
});

//GetFood by user
app.get('/getFoodByUser/:userId', function (req, res) {
  var userId = req.params.userId;
  Food.find({
    'author': userId
  }, function (err, foods) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      // res.json(foods);
      res.send({
        food: foods
      });
    }
  });
});

//GetFavorite Food
app.get('/getFoodFavorite/:userId', function (req, res) {

  User.findOne({
    'idFb': req.params.userId
  }).populate('listFavorite').exec(function (err, userFound) {
    if (err)
      console.log('Error in view survey codes function');
    if (!userFound || userFound.listFavorite.length < 1)
      res.send('No favorite are yet added.');
    else
      res.send({
        food: userFound.listFavorite
      });
  });
});