var express = require('express'),
    AWS = require('aws-sdk'),
    multer = require('multer');
    var mongoose = require("mongoose");
const {ObjectId} = require('mongodb');
const bodyParser = require('body-parser')
const s3Client = new AWS.S3({
    accessKeyId: 'AKIAVFAHRU2I42GN3L5S',
    secretAccessKey: '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',
    region :'us-east-2'
});
var Request = require("request");
const app = express();
var fs = require('fs');

var http = require("http");
var server = http.createServer(app);
const uploadParams = {
         Bucket: 'testdrivefordkm', 
         Key: '', // pass key
         Body: null, // pass file body
         ContentType: '', ACL: 'public-read'
};


function test(){
  Request('http://www.google.com', function (error, response, body) {
  console.error('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});
};
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(multer({ dest: './public/documents/'}).any());

var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
      cb(null, '../../public/documents/')
  },
  rename:  function (fieldname, filename, req, res) {
      console.log('ici');
  },
  filename: function (req, file, cb) {
crypto.pseudoRandomBytes(16, function (err, raw) {
cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
});}
});
// default options, immediately start reading from the request stream and
// parsing

// any valid Busboy options can be passed in also

 

var upload = multer({ storage: storage }).single('file');


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function(err, req, res, next) {
        res.header("Access-Control-Allow-Origin", "https://www.sandbox.paypal.com");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next(err);
    });
mongoose.connect('mongodb+srv://dfhunt:dfhunt@cluster0.kqsgz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{ useNewUrlParser: true })
//uP3URjwCI8HTlzYtMNriqyEnhacpABvsXd12KZ75gGSe9O6LmkyYQ1tPj9dWek3bRrza0psU56nfTNIJ
var unirest = require("unirest");
var User = require('./user');
var DairyUser = require('./dairyuser');
var Seller = require('./seller');
var News = require('./news');

var Order = require('./order');
var Address = require('./address');
var Product = require('./product');
var fast2sms = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");

function fast2Smscall(bodyObj){
    fast2sms.query({
    "authorization": "uP3URjwCI8HTlzYtMNriqyEnhacpABvsXd12KZ75gGSe9O6LmkyYQ1tPj9dWek3bRrza0psU56nfTNIJ",
    "variables_values":bodyObj['otp'] ,
    "route": "otp",
    "numbers": bodyObj['phone']
  });
  
  fast2sms.headers({
    "cache-control": "no-cache"
  });
  fast2sms.end(function (res) {
    if (res.error) throw new Error(res.error);
  
    console.log(res.body);
  });
}


app.get('/newsall',(req,res)=>{
  News.find({},(err,data)=>{
    if (err) {
      res.status(500).json({error:"Error -> " + err});
  }
  res.status(200).json({status:200,msg:data});
   })
 })

   app.post('/news',(req,res)=>{
    Request('https://newsapi.in/newsapi/news.php?key=05t00FVJ5AUMTycgVMstSqxLv4Z4dc&category=tamil', function (error, response, body) {
      console.error('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('body:', JSON.parse(body)); 
      let x = JSON.parse(body);// Print the HTML for the Google homepage.
      if(x){
          let objectData = x.News.filter((ele)=>ele.published_date == '2021-11-20');
             News.insertMany(objectData,(err,data)=>{
              if (err) {
                res.status(500).json({error:"Error -> " + err});
            }
            res.send( "success").status(200);
             })

      }
    });
   })

app.post('/api/file/upload',(req,res) => {
  console.log("123",req.files);

  const params = uploadParams;
console.log("log",req.file,req.files);
  uploadParams.Key = req.files[0].originalname;
  uploadParams.ContentType = req.files[0].mimetype;
var file = req.files[0];
  fs.readFile(file.path, function (err, data) {
    uploadParams.Body =data;
  s3Client.upload(params, (err, data) => {
      if (err) {
          res.status(500).json({error:"Error -> " + err});
      }
      res.send( data.Location).status(200);
  });
})
});

//open in browser to see upload form
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');//index.html is inside node-cheat
});
app.post('/register', function (req, res) {
    console.log("jjkxk--",req.body,new ObjectId());
   req.body['otp']=Math.floor(100000 + Math.random() * 900000);
  
   req.body['_id']= new ObjectId();
   console.log("lo--",req.body);
    User.create([req.body],(err,data)=>{
        if(err){
            console.log("oop--",err)
            return res.json({status:506,msg:"internal error"})
        }else{
            fast2Smscall(req.body)

   return res.json({status:200,id:req.body._id});   
        }
    })
});


app.post('/dairyregister', function (req, res) {
  console.log("jjkxk--",req.body,new ObjectId());
 req.body['otp']=Math.floor(100000 + Math.random() * 900000);

 req.body['_id']= new ObjectId();
 console.log("lo--",req.body);
 DairyUser.create([req.body],(err,data)=>{
      if(err){
          console.log("oop--",err)
          return res.json({status:506,msg:"internal error"})
      }else{
          fast2Smscall(req.body)

 return res.json({status:200,id:req.body._id});   
      }
  })
});

app.post('/registerseller', function (req, res) {
  console.log("jjkxk--",req.body,new ObjectId());
 req.body['otp']=Math.floor(100000 + Math.random() * 900000);
 console.log("lo--",req.body);
 req.body['_id']= new ObjectId();
  Seller.create([req.body],(err,data)=>{
      if(err){
          console.log("oop--",err)
          return res.json({status:506,msg:"internal error"})
      }else{
          fast2Smscall(req.body)

 return res.json({status:200,id:req.body._id});   
      }
  })
});
app.post('/addorder', function (req, res) {
  console.log("p00");
  req.body.created_on = new Date();
  Order.create([req.body],(err,data)=>{
      if(err){
        console.log(err);
        return res.json({status:506,msg:"internal error"})
      }else{
        return res.json({status:200,msg:'ordered successfully'}); 
      }
  })
});
app.post('/addaddress', function (req, res) {
  Address.create([req.body],(err,data)=>{
      if(err){
        return res.json({status:506,msg:"internal error"})
      }else{
        return res.json({status:200,msg:'ordered successfully'}); 
      }
  })
});

app.get('/getorder', function (req, res) {
    Order.find({_id:req.params.userid},(err,data)=>{
        if(err){
          return res.json({status:506,msg:"internal error"})
        }else{
          return res.json({status:200,msg:data}); 
        }
    })
  });

  app.get('/getorder:id', function (req, res) {
    Order.find({_id:req.params.id},(err,data)=>{
        if(err){
          return res.json({status:506,msg:"internal error"})
        }else{
          return res.json({status:200,msg:data}); 
        }
    })
  });
  app.get('/getproduct', function (req, res) {
    Product.find({},(err,data)=>{
        if(err){
          return res.json({status:506,msg:"internal error"})
        }else{
          return res.json({status:200,msg:data}); 
        }
    })
  });
app.post('/addproduct', function (req, res) {
    Product.create([req.body],(err,data)=>{
        if(err){
          return res.json({status:506,msg:"internal error"})
        }else{
          return res.json({status:200,msg:'ordered successfully'}); 
        }
    })
  });
app.post('/login', function (req, res) {
   
    User.find({phone:req.body.phone,password:req.body.password},(err,data)=>{
        if(err){
            console.log("oop--",err)
            return res.json({status:506,msg:"internal error"})
        }else{
            if(data.length > 0){
                return res.json({status:200,msg:data}); 
            }else{
                return res.json({status:204,msg:"invalid name/pwd"}); 
            }

     
        }
    })
});

app.post('/dairylogin', function (req, res) {
   
  DairyUser.find({phone:req.body.phone,password:req.body.password,verify:true},(err,data)=>{
      if(err){
          console.log("oop--",err)
          return res.json({status:506,msg:"internal error"})
      }else{
          if(data.length > 0){
              return res.json({status:200,msg:data}); 
          }else{
              return res.json({status:204,msg:"invalid name/pwd"}); 
          }

   
      }
  })
});

app.post('/loginseller', function (req, res) {
   
  Seller.find({phone:req.body.phone,password:req.body.password},(err,data)=>{
      if(err){
          console.log("oop--",err)
          return res.json({status:506,msg:"internal error"})
      }else{
          if(data.length > 0){
              return res.json({status:200,msg:data}); 
          }else{
              return res.json({status:204,msg:"invalid name/pwd"}); 
          }

   
      }
  })
});
app.post('/verifyotp',  function (req, res) {
    console.log("jjkxk--",req.body);
 
    User.find({otp:req.body.otp,_id:req.body.id},async (err,data)=>{
        if(err){
            console.log("lll",err)
 return res.json({status:506,msg:"internal error"})
        }else{
           if(data.length > 0){
         let result = await User.updateOne({_id:req.body.id},{ $set: { verify: true, }});
            return res.json({status:200,msg:"verified"});
           }else{
            return res.json({status:204,msg:"wrong"});
           }


        }
    })
});


app.post('/dairyverifyotp',  function (req, res) {
  console.log("jjkxk--",req.body);

  DairyUser.find({otp:req.body.otp,_id:req.body.id},async (err,data)=>{
      if(err){
          console.log("lll",err)
return res.json({status:506,msg:"internal error"})
      }else{
         if(data.length > 0){
       let result = await DairyUser.updateOne({_id:req.body.id},{ $set: { verify: true, }});
          return res.json({status:200,msg:"verified"});
         }else{
          return res.json({status:204,msg:"wrong"});
         }


      }
  })
});

app.post('/verifyotpseller',  function (req, res) {
  console.log("jjkxk--",req.body);

  Seller.find({otp:req.body.otp,_id:req.body.id},async (err,data)=>{
      if(err){
          console.log("lll",err)
return res.json({status:506,msg:"internal error"})
      }else{
         if(data.length > 0){
       let result = await Seller.updateOne({_id:req.body.id},{ $set: { verify: true, }});
          return res.json({status:200,msg:"verified"});
         }else{
          return res.json({status:204,msg:"wrong"});
         }


      }
  })
});


server.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});