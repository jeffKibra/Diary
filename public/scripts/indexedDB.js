function allReader(mystore){//recieves name of the store
			var db=null,
			request=window.indexedDB.open("fcrDiary", 2);
			request.onsuccess=function(event){
				db=event.target.result;

				//select the store for reading
				var transaction=db.transaction([mystore]);
				transaction.oncomplete=function(){
					console.log("all done!");
				}
				transaction.onerror=function(){
					console.error("an error has occurred: "+transaction.error);
				}
				//get the store
				var store=transaction.objectStore(mystore);
				//retrieve data
				var customers=[];
				store.openCursor().onsuccess=function(event){
					var cursor=event.target.result;
					if(cursor){
						//console.log(cursor.value);
						customers.push(cursor.value);
						cursor.continue();
					}
					else{
						createTable(customers);
						console.log(customers);
					}
					
				}
				
			}
		
			request.onerror=function(){
				console.error("an error has occurred: ");
			}
		
		}

		function createTable(data){
			console.log(data);
            document.getElementById("tableBodyOff").innerHTML="";
			//document.getElementById("tableBody").innerHTML=data[0].title;
			for(var i=0;i<data.length; i++){
				var nodeToAdd=document.createElement("tr");
				var objectval=Object.values(data[i]);
				objectval.forEach(element => {
					var tdata=document.createElement("td");
					var ttext=document.createTextNode(element);
					tdata.appendChild(ttext);
					nodeToAdd.appendChild(tdata);
				});
				var bdata=document.createElement("td");
				var btn=document.createElement("button");
				btn.setAttribute("class", "btn btn-primary readoff");
				btn.setAttribute("id", data[i].subject);
				
				btn.innerHTML="read";
				bdata.appendChild(btn);
				nodeToAdd.appendChild(bdata);
				console.log(objectval);
				document.getElementById("tableBodyOff").appendChild(nodeToAdd);
				btn.onclick=offreader;
			}
			
		}

		function dbWriter(subject, entries){
			var db=null,
			request=window.indexedDB.open("fcrDiary", 2);

			request.onsuccess=function(event){
				//console.log(event);
				db=event.target.result;

				console.log(subject, entries);
				//select stores for read and write
				var transaction=db.transaction(["subject", "entries"], "readwrite");
				transaction.oncomplete=function(){
					console.log("all done!");
				}
				transaction.onerror=function(){
					console.error("an error has occurred when opening the store: "+transaction.error);
				}
				//get the store
				var subjectStore=transaction.objectStore("subject");
				var entriesStore=transaction.objectStore("entries");
				//add data
		
				var subjectRequest=subjectStore.add(subject);
				subjectRequest.onsuccess=function(event){
                    var msg="the subject has been saved locally";
                    document.getElementById("displayMessage").innerHTML=msg;
					console.log();
				}
                subjectRequest.onerror=function(e){
                    var errorMsg="subject not saved".e.target.error.name;
                    document.getElementById("displayError").innerHTML=errorMsg;
                    console.log(errorMsg);
                }
				var entriesRequest=entriesStore.add(entries);
				entriesRequest.onsuccess=function(event){
                    msg="Your entries have been saved locally \n please ensure you go online and save to the server for permanent storage";
                    document.getElementById("displayMessage").innerHTML=msg;
					console.log();
				}
                entriesRequest.onerror=function(e){
                    errorMsg="subject not saved".e.target.error.name;
                    document.getElementById("displayError").innerHTML=errorMsg;
                    console.log(errorMsg);
                }
			}

			request.onupgradeneeded=function(event){
				db=event.target.result;
				//console.log(event);
				if(event.oldVersion<1){
					//didnt exist 
					var subjectStore=db.createObjectStore("subject", {autoIncrement:true});//offline subject store
					var entriesStore=db.createObjectStore("entries", {autoIncrement:true});//offline entries store
                    db.createObjectStore("onlineSubject", { autoIncrement: true });//online subject store
                    db.createObjectStore("onlineEntries", { autoIncrement: true });//online entries store
                    db.createObjectStore("sessionUser", { keyPath: "username" });//session data for the user
                    db.createObjectStore("permanentUser", { keyPath: "username" });//permanent user details for logging in and out.
				}
				//if it exists and version less than 2
				if(event.oldVersion<2){
					var subjectStore=request.transaction.objectStore("subject");
					var entriesStore=request.transaction.objectStore("entries");
                    var onlinesubject=request.transaction.objectStore("onlineSubject");
                    var onlineentry=request.transaction.objectStore("onlineEntries");
					subjectStore.createIndex("date", "date", {unique:false});
                    subjectStore.createIndex("subject", "subject", {unique:false});
                    
					entriesStore.createIndex("subject", "subject", {unique:false});
                    entriesStore.createIndex("date", "date", {unique:false});
                    
                    onlinesubject.createIndex("date", "date", {unique: false});
                    onlinesubject.createIndex("subject", "subject", {unique: false});
                    
                    onlineentry.createIndex("date", "date", {unique: false});
                    onlineentry.createIndex("subject", "subject", {unique: false});
                    
                    //entriesStore.createIndex("by_email", "email");
					//store2.createIndex("by_name", "name");
					//store2.createIndex("by_email", "email");
				}
			};

			request.onerror=function(){
				console.error("an error has occurred: ");
			}
		}

function permanentWriter(details){
			var db=null,
			request=window.indexedDB.open("fcrDiary", 2);

			request.onsuccess=function(event){
				//console.log(event);
				db=event.target.result;

				console.log(details);
				//select stores for read and write
				var transaction=db.transaction(["permanentUser"], "readwrite");
				transaction.oncomplete=function(){
					console.log("all done!");
				}
				transaction.onerror=function(){
					console.error("an error has occurred when opening the store: "+transaction.error);
				}
				//get the store
				var usedStore=transaction.objectStore("permanentUser");
		
				var usedRequest=usedStore.add(details);
				usedRequest.onsuccess=function(event){
                    var msg="You can now login when offline";
                    document.getElementById("loginmessage").innerHTML=msg;
					console.log();
				}
                usedRequest.onerror=function(e){
                    var errorMsg="details not saved locally"+ e.target.error.name;
                    document.getElementById("loginmessage").innerHTML=errorMsg;
                    console.log(errorMsg);
                }
				
			}

			request.onupgradeneeded=function(event){
				db=event.target.result;
				//console.log(event);
				if(event.oldVersion<1){
					//didnt exist 
					var subjectStore=db.createObjectStore("subject", {autoIncrement:true});//offline subject store
					var entriesStore=db.createObjectStore("entries", {autoIncrement:true});//offline entries store
                    db.createObjectStore("onlineSubject", { autoIncrement: true });//online subject store
                    db.createObjectStore("onlineEntries", { autoIncrement: true });//online entries store
                    db.createObjectStore("sessionUser", { keyPath: "username" });//session data for the user
                    db.createObjectStore("permanentUser", { keyPath: "username" });//permanent user details for logging in and out.
				}
				//if it exists and version less than 2
				if(event.oldVersion<2){
					var subjectStore=request.transaction.objectStore("subject");
					var entriesStore=request.transaction.objectStore("entries");
                    var onlinesubject=request.transaction.objectStore("onlineSubject");
                    var onlineentry=request.transaction.objectStore("onlineEntries");
					subjectStore.createIndex("date", "date", {unique:false});
                    subjectStore.createIndex("subject", "subject", {unique:false});
                    
					entriesStore.createIndex("subject", "subject", {unique:false});
                    entriesStore.createIndex("date", "date", {unique:false});
                    
                    onlinesubject.createIndex("date", "date", {unique: false});
                    onlinesubject.createIndex("subject", "subject", {unique: false});
                    
                    onlineentry.createIndex("date", "date", {unique: false});
                    onlineentry.createIndex("subject", "subject", {unique: false});
                    
                    //entriesStore.createIndex("by_email", "email");
					//store2.createIndex("by_name", "name");
					//store2.createIndex("by_email", "email");
				}
			};

			request.onerror=function(){
				console.error("an error has occurred: ");
			}
		}

function sessionWriter(details){
			var db=null,
			request=window.indexedDB.open("fcrDiary", 2);

			request.onsuccess=function(event){
				//console.log(event);
				db=event.target.result;

				console.log(details);
				//select stores for read and write
				var transaction=db.transaction(["sessionUser"], "readwrite");
				transaction.oncomplete=function(){
					console.log("all done!");
				}
				transaction.onerror=function(){
					console.error("an error has occurred when opening the store: "+transaction.error);
				}
				//get the store
				var usedStore=transaction.objectStore("sessionUser");
		
				var usedRequest=usedStore.add(details);
				usedRequest.onsuccess=function(event){
                    var msg="login successful";
                    document.getElementById("loginmessage").innerHTML=msg;
					console.log();
                    sessionReader()
				}
                usedRequest.onerror=function(e){
                    var errorMsg="invalid username or password"+ e.target.error.name;
                    document.getElementById("loginmessage").innerHTML=errorMsg;
                    console.log(errorMsg);
                }
				
			}
            
			request.onerror=function(){
				console.error("an error has occurred: ");
			}
		}


function sessionReader(details, storeToUse){
	var db=null,
    request=window.indexedDB.open("fcrDiary", 2);
    request.onsuccess=function(event){
        //console.log(event);
	   db=event.target.result;
        
	   //add data
	   var transaction=db.transaction([storeToUse]);
	   transaction.oncomplete=function(){
           console.log("all done!");
       }
	   transaction.onerror=function(){
           console.error("an error has occurred: "+transaction.error);
	   }
    
	   //get the store
	   var store=transaction.objectStore(storeToUse);
	   //read data
	   var readrequest=store.get(details.username);//add the key for reading data
        
	   readrequest.onsuccess=function(event){
           var userdetails = event.target.result;
           if(userdetails == undefined){
               document.getElementById("loginmessage").innerHTML="invalid username or password";
           }else if(userdetails.username !== "" && userdetails.id !== "" && userdetails.password !== ""){
               if(details.username === userdetails.username && details.password === userdetails.password){
                    document.getElementById("loginmessage").innerHTML="login successful. redirecting...";
                    //document.getElementById("identified").innerHTML= userdetails.id;
                    //document.getElementById("username1").innerHTML= userdetails.username;
                    localStorage.setItem('id', userdetails.id);
                    localStorage.setItem('username', userdetails.username);
                    //target="/diary"
                    //sessionWriter(userdetails);
               }
               else{
                   document.getElementById("loginmessage").innerHTML="invalid username or password";
               }
               
           }
           //console.log(event.target);
	   }
    }
		
    request.onerror=function(){
		console.error("an error has occurred: ");
	}

}

function relocate(value){
    console.log(value);
    window.location.href(value);
}


function searchItems(mystore, value){
	var db=null,
    request=window.indexedDB.open("fcrDiary", 2);
    request.onsuccess=function(event){
        //console.log(event);
	   db=event.target.result;
        
	   //add data
	   var transaction=db.transaction([mystore]);
	   transaction.oncomplete=function(){
           console.log("all done!");
       }
	   transaction.onerror=function(){
           console.error("an error has occurred: "+transaction.error);
	   }
    
	   //get the store
	   var store=transaction.objectStore(mystore);
        var index=store.index('subject');
        document.getElementById("writtenC").innerHTML="";
            
        //using indes to read
        var customers=[];
        var searchValue=IDBKeyRange.only(value);
        index.openCursor(searchValue).onsuccess=function(event){
            var cursor=event.target.result;
            if(cursor){
                customers.push(cursor.value);
                ccontent="<h3></h3><br/><small>"+cursor.value.date+"</small><br/>"+cursor.value.message+"<br />";
                document.getElementById("writtenC").innerHTML+=ccontent;
                /*if(cursor.value.subject==value){
                    customers.push(cursor.value);
                }*/
                cursor.continue();
            }else{
                
                //createTable(customers);
		      console.log(customers);
            }
        }
        
        /*index.openCursor().onsuccess=function(event){
            var cursor=event.target.result;
            if(cursor){
                if(cursor.value.subject==value){
                    customers.push(cursor.value);
                }
                cursor.continue();
            }else{
                //createTable(customers);
		      console.log(customers);
            }
        }*/
        
	   //read  data
	  /* var request1=store.get(payload);
	   request1.onsuccess=function(event){
           console.log(event.target.result);
	   }*/
        
    }
		

    request.onerror=function(){
		console.error("an error has occurred: ");
	}
}