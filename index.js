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

app.get("/", (req, res)=>{
    
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

app.get("/req", (req, res)=>{
    connection.query('SELECT * FROM `diaryid` WHERE `username`="jdoe" AND `password`="jdoe"'), function(err, results, fields){
        console.log(results);
        console.log(fields);
    }
});

app.listen(PORT, ()=>{
    console.log(`app started and listening on port ${PORT}`);
});


