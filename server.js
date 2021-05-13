// HTTP Module for Creating Server and Serving Static Files Using Node.js
// Static Files: HTML, CSS, JS, Images
// Get Complete Source Code from Pabbly.com

var http = require('http');
var fs = require('fs');
var path = require('path');
const { parse } = require('querystring');


const sqlite3 = require('sqlite3').verbose();

// open the database connection
let db = new sqlite3.Database('./dbs/testdb.db');

function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}



http.createServer(function(req, res){

    if(req.url === "/"){
        fs.readFile("./public/index.html", "UTF-8", function(err, html){
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(html);
        });
    }else if(req.url === "/Sign_Up_eve"){
            fs.readFile("./public/Sign_Up_eve.html", "UTF-8", function(err, html){
                res.writeHead(200, {"Content-Type": "text/html"});
                res.end(html);
            });
    }else if(req.url === "/login"){
                
                    collectRequestData(req, result => {
                        var aa = result.usn;
                        var bb = result.pass;
                        console.log(aa);
                        console.log(bb);
                        let lan =[aa,bb];
                        let sms ="SELECT usr,pass,nam FROM Users WHERE usr=? and pass=?";
                        let av = 'SELECT AVG(r1) AS AVG,AVG(r2) AS AVG2,AVG(r3) AS AVG3,AVG(r4) AS AVG4,AVG(r5) AS AVG5,AVG(r6) AS AVG6  FROM ratings ';
                    

                            db.get(sms,lan,function(err,row){
                            if (err) {
                                 console.log(err.message);
                              }
                            console.log(row);
                            db.get(av,function(err1,rr){
                                if (err1) {
                                         console.log(err1.message);
                                      }
                
                                      

                                   
                        
                        if(row){
                            fs.readFile("./public/sel_mov.html", "UTF-8", function(err, html){

                                res.writeHead(200, {"Content-Type": "text/html"});
                                html= html.replace('$$name$$',row.nam);
                                if(rr){
                                      console.log(rr.AVG);
                                      console.log(rr.AVG2);
                                      console.log(rr.AVG3);
                                      console.log(rr.AVG4);
                                      console.log(rr.AVG5);
                                      console.log(rr.AVG6);
                                    html= html.replace('$$name1$$',rr.AVG);
                                    html= html.replace('$$name2$$',rr.AVG2);
                                    html= html.replace('$$name3$$',rr.AVG3);
                                    html= html.replace('$$name4$$',rr.AVG4);
                                    html= html.replace('$$name5$$',rr.AVG5);
                                    html= html.replace('$$name6$$',rr.AVG6);
                                }
                                res.end(html);
                            });
                        
                    }
                    else{
                        fs.readFile("./public/index.html", "UTF-8", function(err, html){
                            res.writeHead(200, {"Content-Type": "text/html"});
                            res.end(html);
                        });
                        
                    }

                }); 
            }); 
            }
);  
    }else if(req.url === "/reg"){
        fs.readFile("./public/sel_mov.html", "UTF-8", function(err, html){
            res.writeHead(200, {"Content-Type": "text/html"});
         
            collectRequestData(req, result => {
                var aa = result.nam;
                var bb = result.email;
                var cc = result.usr;
                var dd = result.pass;
                var ee = result.passt;
                console.log(aa);
                console.log(bb);
                console.log(cc);
                console.log(dd);
                console.log(ee);
                res.end(html);
                var db = new sqlite3.Database('./dbs/testdb.db');
            console.log('connected');
            let languages = [aa, bb, cc, dd, ee];
                
// construct the insert statement with multiple placeholders
// based on the number of rows
            let placeholders = languages.map((language) => '?').join(',');
            console.log(placeholders);
            let sql = 'INSERT INTO Users(nam,email,usr,pass,passt) VALUES (' + placeholders+')';
            
            db.run(sql,languages, function(err) {
                console.log('in sqsql');
                if (err) {
                    return console.error(err.message);
                  }
                  console.log(`Rows inserted ${this.changes}`);
                });
            }); 
            
                

         
           });
    }  //    
    else if(req.url === "/sub"){
        fs.readFile("ttt.html", "UTF-8", function(err, html){
            res.writeHead(200, {"Content-Type": "text/html"});
         
            collectRequestData(req, result => {
                var aa = result.r1;
                var bb = result.r2;
                var cc = result.r3;
                var dd = result.r4;
                var ee = result.r5;
                var ff = result.r6;
                console.log(aa);
                console.log(bb);
                console.log(cc);
                console.log(dd);
                console.log(ee);
                console.log(ff);
                res.end(html);
                var db = new sqlite3.Database('./dbs/testdb.db');
            console.log('connected');
            let languages = [aa, bb, cc, dd, ee,ff];

            
2
3
             
// construct the insert statement with multiple placeholders
// based on the number of rows
            let placeholders = languages.map((language) => '?').join(',');
            console.log(placeholders);
            let sql = 'INSERT INTO ratings(r1,r2,r3,r4,r5,r6) VALUES (' + placeholders+')';
            db.run(sql,languages, function(err) {
                console.log('in sqsql');
                if (err) {
                    return console.error(err.message);
                  }
                  console.log(`Rows inserted ${this.changes}`);
                });
            
           
            });
        }); 
    }      
    else if(req.url.match("\.css$")){
        var cssPath = path.join(__dirname, 'public', req.url);
        var fileStream = fs.createReadStream(cssPath, "UTF-8");
        res.writeHead(200, {"Content-Type": "text/css"});
        fileStream.pipe(res);

    }else if(req.url.match("\.jpg$")){
        var imagePath = path.join(__dirname, 'public', req.url);
        var fileStream = fs.createReadStream(imagePath);
        res.writeHead(200, {"Content-Type": "image/jpg"});
        fileStream.pipe(res);

    
    }else{
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end("No Page Found");
    }

}).listen(8050);

//sqlite.exec