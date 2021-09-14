var express = require('express'),
    aws = require('aws-sdk'),
    multer = require('multer'),
    multerS3 = require('multer-s3');
var mongoose = require("mongoose");
const {ObjectId} = require('mongodb');
const bodyParser = require('body-parser')

const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded({extended: true})); 
app.use(express.json());   
// parse application/json
app.use(bodyParser.json())
mongoose.connect('mongodb+srv://dfhunt:dfhunt@cluster0.kqsgz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{ useNewUrlParser: true })
//uP3URjwCI8HTlzYtMNriqyEnhacpABvsXd12KZ75gGSe9O6LmkyYQ1tPj9dWek3bRrza0psU56nfTNIJ
var unirest = require("unirest");
var User = require('./user');
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

//mongoose.connect("mongodburl");
aws.config.update({
    secretAccessKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    accessKeyId: 'XXXXXXXXXXXXXXX',
    region: 'us-east-1'
});

 var   s3 = new aws.S3();

   

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'bucket-name',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname); //use Date.now() for unique file keys
        }
    })
});

//open in browser to see upload form
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');//index.html is inside node-cheat
});
app.post('/register', function (req, res) {
    console.log("jjkxk--",req.body,new ObjectId());
   req.body['otp']=Math.floor(100000 + Math.random() * 900000);
   console.log("lo--",req.body);
   req.body['_id']= new ObjectId();
    User.create([req.body],(err,data)=>{
        if(err){
            console.log("oop--",err)
            return res.json({status:506,msg:"internal error"})
        }else{
            fast2Smscall(req.body)

   return res.json({status:200,msg:data});   
        }
    })
});
app.post('/addorder', function (req, res) {
  Order.create([req.body],(err,data)=>{
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

//use by upload form
app.post('/upload', upload.array('upl',1), function (req, res, next) {
    res.send("Uploaded!");
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});