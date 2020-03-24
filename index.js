const path = require("path");
const express = require("express");
const mysql=require("mysql2");

const connection=mysql.createConnection({
    host: 'localhost',
    user: 'finitecr_jeffkibra',
    password: 'king.kin@keen',
    database: 'diary'
});


const app=express();

const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());//handle json data
app.use(express.urlencoded({extended:false}));//handle form data

app.get("/insert", (req, res)=>{
    connection.query('INSERT INTO "diaryid" (username, password) values("jdoe", "jdoe")', (err, results, fields)=>{
        
        console.log(results);
        console.log("fields");
        console.log(fields);
        
    });
    res.send("table operation");
    //res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/", (req, res)=>{
    
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/onlineread", (req, res)=>{
    var dat={
        name: "john",
        occupation: "teacher"
    };
    var data=JSON.stringify(dat);
    res.send(data);
});

app.get("/webversion", (req, res)=>{
    
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/diary", (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'diary.html'));
});

app.get("/login", (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get("/signup", (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.post("/userlogin", (req, res)=>{
    
    res.send(JSON.stringify(req.body.username));
});

app.post("/usersignup", (req, res)=>{
    //res.send(req.body.email);
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

/*app.get("/req", (req, res)=>{
    connection.query('SELECT * FROM `diaryid` WHERE `username`="jdoe" AND `password`="jdoe"'), function(err, results, fields){
        console.log(results);
        console.log(fields);
    }
});*/

app.listen(PORT, ()=>{
    console.log(`app started and listening on port ${PORT}`);
});


