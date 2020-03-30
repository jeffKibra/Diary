//const mysql = require("mysql");

/*const pool=mysql.createPool({
    //host: 'finitecreations.co.ke',
     
    host: '69.16.239.18',
    user: 'finitecr_jeffkibra',
    password: 'king.kin@keen',
    database: 'finitecr_contacted',
    waitForConnections: true,
    connectionLimit: 300,
    queueLimit: 0
});*/

/*const pool=mysql.createPool({
    host: 'localhost',
    user: 'finitecr_jeffkibra',
    password: 'king.kin@keen',
    database: 'diary',
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
});*/
/*const connection=mysql.createConnection({
    host: '69.16.239.18',
    user: 'finitecr_jeffkibra',
    password: 'king.kin@keen',
    database: 'finitecr_contacted',
});*/


app.post("/userlogin", (req, res)=>{
    var enct1="ki!*^90";
    var enct2="63&%&of";  
    var logedin={
        username: req.body.username,
        password: sha1(enct1+req.body.password+enct2)
    };
    console.log(logedin);
    var validated=validateLogin(logedin);
    if(validated!==""){
        res.send(validated);
    }
    
    

    /*var loginsql="SELECT * FROM diaryid WHERE username = ? AND password = ?";
    //[logedin.username, logedin.password]
    pool.query(loginsql, [logedin.username, logedin.password], (err, results)=>{
       if(err) throw err;
        //console.log(results);
        if(results.length>0){
            var resid={
                id: results[0].id,
                username: results[0].username,
                password: results[0].password
            };
            
            //console.log(resid);
            
            res.send(resid);
        }
        
        if(results.length<=0){
            resid={
                value: "no"
            };
            //console.log("invalid username or password");
            res.send(resid);
        }
            
        
        //res.send(JSON.stringify(resid));
    
    });*/
    
});

app.post("/diaryinput", (req, res)=>{
    var userinput={
        id: req.body.id,
        date: req.body.date,
        time: req.body.time,
        subject: req.body.subject,
        mywrite: req.body.message
    };
    var validated=validateEntry(userinput);
    if(validated!==""){
        res.send(validated);
    }
    var loginsql="INSERT INTO mydiary(id, date, time, subject, mywrite) values(?,?,?,?,?)";
    
    pool.query(loginsql, [userinput.id, userinput.date, userinput.time, userinput.subject, userinput.mywrite], (err, results)=>{
       if(err) throw err;
        console.log(results);
        
        if(results.length<=0){
            resid={
                value: "no"
            };
            console.log("invalid username or password");
           
        }else{
            resid={
                value: "yes"
            };   
        }
        res.send(JSON.stringify(resid));
    });
    
});

app.post("/usersignup", (req, res)=>{
    var signup={
        firstname: req.body.firstname,
        surname: req.body.surname,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cpassword: req.body.cpassword  
    };
    
    var enct1="ki!*^90";
    var enct2="63&%&of";
    
    var validated=validateSignup(signup);
    if(validated!==""){
        res.send(validated);
    }
    
    var names={
        firstname: req.body.firstname,
        surname: req.body.surname
    };
    
    var sql="INSERT INTO diaryusers SET ?"
    pool.query(sql, names, (err, results)=>{
        if(err) throw err;
        var insert=results.insertId;
        inUsers(insert, req.body.username, sha1(enct1+req.body.password+enct2));
        inEmail(insert, req.body.email);
        console.log(results);
        console.log(names);
    });
    
    console.log(req.body);
     console.log(signup);
    //res.send("completed");
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
    
    function inUsers(myid, myusername, mypassword){
        var users={
            id: myid,
            username: myusername,
            password: mypassword
        };
        console.log(users);
        
        var sql2="INSERT INTO diaryid SET ?";
        pool.query(sql2, users, (err, results)=>{
            if(err) throw err;
            console.log(results);
        });
    }
    function inEmail(myid, myemail){
        var email={
            id: myid,
            email: myemail
        };
        console.log(email);
        var sql3="INSERT INTO emails SET ?";
        pool.query(sql3, email, (err, results)=>{
            if(err) throw err;
           console.log(results);
        });

    }

/*app.get("/checkusername/:username", (req, res)=>{
    var username=req.params.username;
    var testsql="SELECT * FROM diaryid WHERE username = ?";
    pool.getConnection((err, connection)=>{
        if(err) throw err;
        connection.query(testsql, [username], (error, result)=>{
            if(error) throw error;
            if(result.length<=0) {res.send("yes");}
            connection.destroy();
            console.log(result.length);
            res.send("no");
        });
    });
    /*pool.query(testsql, [username], (err, result)=>{
        if(err) throw err;
        if(result.length<=0) {res.send("yes");}
        console.log(result.length);
        res.send("no");
    });
    
});*/

app.post("/onlineread", (req, res)=>{
    var sql="SELECT * FROM mydiary WHERE id = ?";
    var id=req.body.id;
    var username = req.body.username; 
    //var sql1="SELECT `id` FROM diaryid WHERE `username` = ?";
    pool.query(sql, [id], (err, results)=>{
        if(err) throw err;
        console.log(results);
        var data=JSON.stringify(results);
        res.send(results);
    });
    //var data=JSON.stringify(dat);
    //res.send(data);
});
    

/*app.get("/req", (req, res)=>{
    connection.query('SELECT * FROM `diaryid` WHERE `username`="jdoe" AND `password`="jdoe"'), function(err, results, fields){
        console.log(results);
        console.log(fields);
    }
});*/