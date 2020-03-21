/* var myMainBody;
(function(){
    myMainBody=document.getElementById("content").innerHTML;
})();
    
function contacts(){
    document.getElementById("content").innerHTML="";
    var contacts=window.location+"sections/contact.html";
    console.log(contacts);
    fetch(contacts).then(response=>response.text()).then(text=>{
            document.getElementById("content").innerHTML=text;
            
    }) ;
    
}

function articles(article){
    document.getElementById("content").innerHTML="";
    var url;
    if(article.id=="serviceworkers"){
        url=window.location+"sections/serviceworkers.html"
    }
    else if(article.id=="lifecycles"){
        url=window.location+"sections/serviceworkerlifecycle.html"
    }
    else if(article.id=="webapp1"){
        url=window.location+"sections/progressivewebapps.html"
    }
    else{
        url=window.location;
    }
    fetch(url).then(response=>response.text()).then(text=>{
        document.getElementById("content").innerHTML=text;
    });
    
}

function navigator(navigate){
    var url;
    if(navigate.id=="home"){
        document.getElementById("content").innerHTML=myMainBody;
    }
    else if(navigate.id=="articles"){
        url=window.location+"sections/article.html";
        fetch(url).then(response=>response.text()).then(text=>{
            document.getElementById("content").innerHTML=text;
        });
    }
    else if(navigate.id=="accessories"){
         url=window.location+"sections/accessories.html";
        fetch(url).then(response=>response.text()).then(text=>{
            document.getElementById("content").innerHTML=text;
        });
    }
    else{
        url=window.location;
        fetch(url).then(response=>response.text()).then(text=>{
            document.getElementById("content").innerHTML=text;
        });
    }
    
}
*/