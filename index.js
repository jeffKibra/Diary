const path = require("path");
const express = require("express");


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

app.listen(PORT, ()=>{
    console.log(`app started and listening on port ${PORT}`);
});


