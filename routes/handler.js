var express = require('express');

var router = express.Router();
var spawn = require("child_process").spawn; 

var path = require('path');
//var queries = require(path.join(__dirname,'../model/queries'));
// const mime = require('mime');
//var multer = require('multer');
var request = require('request');
//var query = require('.././model/queries');

router.get('/',(req,res)=>{
    console.log("here?");
   res.render('packages',{layout : 'packages.handlebars'});

});

router.get('/basics',(req,res)=>{
    console.log("here?");
   res.render('basics',{layout : 'basics.handlebars'});

});

router.get('/banks',(req,res)=>{
    console.log("here?");
   res.render('banks',{layout : 'banks.handlebars'});

});

router.get('/loans',(req,res)=>{
    console.log("here?");
   res.render('loans',{layout : 'loans.handlebars'});

});


// Function callName() is executed whenever  
// url is of the form localhost:3000/name 
router.get('/ip',(req,res)=>{

    // Use child_process.spawn method from  
    // child_process module and assign it 
    // to variable spawn       
    // Parameters passed in spawn - 
    // 1. type_of_script 
    // 2. list containing Path of the script 
    //    and arguments for the script  
      
    // E.g : http://localhost:3000/ip?q1=1&q2=1&q3=1&q4=1&q5=1&q6=1&q7=1&q8=1&q9=1 
    // so, first name = Mike and last name = Will 
    var process = spawn('python',["./user_class.py", 
                            req.query.q1, 
                            req.query.q2,
                            req.query.q3,
                            req.query.q4,
                            req.query.q5,
                            req.query.q6,
                            req.query.q7,
                            req.query.q8,
                            req.query.q9] ); 
  
    // Takes stdout data from script which executed 
    // with arguments and send this data to res object 
    process.stdout.on('data', function(data) { 
        console.log(data.toString());
        res.send(data);
    } )
});

// To run the fuzzy script
router.get('/fuzzy',(req,res) => {
    console.log(req.query.score);
    console.log(req.query.cl);
    var process = spawn('python',["./finlit_fuzzy.py", 
                            req.query.score, 
                            req.query.cl] );
  
    // Takes stdout data from script which executed 
    // with arguments and send this data to res object 
    process.stdout.on('data', function(data) { 
        console.log(data.toString());
        res.send(data);
    }) 
});


router.get('/updateusercat',(req,res)=>{

    console.log("hi");
    var obj = {
        table: []
     };
    var fs = require('fs');
    console.log('req.body');
    console.log(req.query.uc);
    var uc = req.query.uc;
    console.log('working1')
    console.log(obj)
    u_c = JSON.stringify(uc);
    obj.table.push({id: 9, category : u_c}); //add some data
    console.log('working2')
    console.log(obj)

    fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj.table.push({id: 9, category : uc}); //add some data
        json = JSON.stringify(obj); //convert it back to json
        fs.writeFile('myjsonfile.json', json, 'utf8', function(err, data) {
   
            // Write the data read from readeMe.txt
            // to a file writeMe.txt
            if( !err )
                fs.writeFile('myjsonfile.json', json, (err)=>{
                    if( err ) {
                        throw err;
                    }
                });
            else
                throw err;
        }); // write it back
    }});

    process.stdout.on('data', function(data) { 
        console.log(data+'');
        res.send(data);
    } ) 
  
});
  
// save code as start.js 


module.exports=router;