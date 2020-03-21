var btn=document.getElementById("btn-save");
        var savedPrompt;
        window.addEventListener("beforeinstallprompt", function(event){
            btn.removeAttribute("disabled");
            savedPrompt=event;
        });
        
        btn.addEventListener('click', function(){
            if(savedPrompt!==undefined){
                savedPrompt.prompt();
                savedPrompt.userChoice.then(function(result){
                    if(result.outcome=='dismissed'){
                        console.log("the user dismissed the request");
                    }else{
                        console.log("user accepted requested");
                    }
                })
            }
        })
    
    
        
        btn.addEventListener('click', function(){
            if(savedPrompt!==undefined){
                savedPrompt.prompt();
                savedPrompt.userChoice.then(function(result){
                    if(result.outcome=='dismissed'){
                        console.log("the user dismissed the request");
                    }else{
                        console.log("user accepted requested");
                    }
                })
            }
        })