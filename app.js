var express = require('express'),
    AWS = require('aws-sdk'),
    multer = require('multer');
    var mongoose = require("mongoose");
const {ObjectId} = require('mongodb');
const bodyParser = require('body-parser')
const s3Client = new AWS.S3({
    accessKeyId: 'AKIAZFFOFJWZVZ2J7JGU',
    secretAccessKey: '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',
    region :'us-east-2'
});
const app = express();
var fs = require('fs');

var http = require("http");
var server = http.createServer(app);
const uploadParams = {
         Bucket: 's2cbazaar', 
         Key: '', // pass key
         Body: null, // pass file body
         ContentType: '', ACL: 'public-read'
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
var Seller = require('./seller');

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
      res.json({message: 'File uploaded successfully'
      , 'location': data.Location});
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