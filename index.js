const path = require("path");
const express = require("express");
//const sha1 = require("sha1");
//const webpush = require("web-push");
//import validator script
const {validateSignup, validateLogin, validateEntry}=require("./mymodules/validator");

const app=express();
const PORT = process.env.PORT || 5050;

//generate only once
//const vapidKeys=webpush.generateVAPIDKeys();
//console.log(vapidKeys);

/*webpush.setGCMAPIKey('109628012376');

webpush.setVapidDetails(
    'mailto:solutions@finitecreations.co.ke',
    'BLdo0yM-vR1PGOQSShGNuZtg2VAbFWWjfQuuGzOuvMuePxusEcoDQ8DQMAyZuSobRFkQIOLXvq7rcBTuCPpYCzA',
    '97lNijPEGIsejFlcWdkP87FnJTXVoG2EPx5V2Nmskh8'
);*/

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());//handle json data
app.use(express.urlencoded({extended:false}));//handle form data

app.get("/", (req, res)=>{
    
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


/*app.post('/register', function (req, res) {//web push registration
    var endpoint = req.body.endpoint;
    console.log("subscription");
   
    const pushSubscription = {
        endpoint: req.body.endpoint,
        keys: {
            auth: req.body.authSecret,
            p256dh: req.body.key
        }
    };
    
     saveRegistrationDetails(pushSubscription);
    console.log(pushSubscription);
    var body = 'Thank you for registering';
    var iconUrl = './public/favicon/android-icon-36x36.png';
    webpush.sendNotification(pushSubscription, JSON.stringify({
        msg: body,
        url: `http://localhost:${PORT}/`,
        icon: iconUrl
    }))
        .then(result => res.sendStatus(201))
        .catch(err => { console.log(err); });
});*/

function saveRegistrationDetails(pushSubscription){
    var query= "INSERT INTO subscribed(endpoint, auth, p256dh) values(?,?,?)"
    
    pool.query(query, [pushSubscription.endpoint, pushSubscription.keys.auth, pushSubscriptio.keys.p256dh ], (err, results)=>{
       if(err) throw err;
        console.log(results);
    });
}

app.get("/webversion", (req, res)=>{
    res.redirect("https://finitecreations.co.ke/diary");
});

app.get("/diary", (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'diary.html'));
});

app.get("/logout", (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'logout.html'));
});

app.get("/onlinelogin", (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'onlinelogin.html'));
});

app.get("/login", (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get("/signup", (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
    //res.redirect("https://finitecreations.co.ke/diary/signup.php");
});



app.listen(PORT, ()=>{
    console.log(`app started and listening on port ${PORT}`);
});


