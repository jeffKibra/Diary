        function allReader(mystore){//recieves name of the store
			var db=null,
			request=window.indexedDB.open("fcrDiary", 3);
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
						createTable(customers, "tableBodyOff");
						console.log(customers);
					}
					
				}
				
			}
		
			request.onerror=function(){
				console.error("an error has occurred: ");
			}
		
		}

        function onlineSaver(){
            var db=null,
                request=window.indexedDB.open("fcrDiary", 3);
            request.onsuccess=function(event){
                db=event.target.result;
                //select a store in a transaction
                var transaction=db.transaction("entries");
                transaction.oncomplete=function(){
                    console.log("transaction complete");
                }
                transaction.onerror=function(){
                    console.log("an error occured", transaction.onerror);
                }
                //get the store for using
                var store = transaction.objectStore("entries");
                //read data
                var customers=[];
				store.openCursor().onsuccess=function(event){
					var cursor=event.target.result;
					if(cursor){
						//var cursorValue=cursor.value;
						customers.push(cursor.value);
						cursor.continue();
					}else{
                        console.log(customers);
                        customers.forEach(arrayValue=>{
                            console.log(arrayValue);
                            fetch("https://finitecreations.co.ke/api/", {
                                method: 'POST',
                                headers: new Headers({'content-type': "application/json"}),
                                body: JSON.stringify(arrayValue)
                            }).then(res=>{
                                if(res.status!==200){
                                    throw "error from the server";
                                }
                                return res.json();
                            }).then(response=>{
                                //console.log(response.value);
                                console.log(response);
                                if(response.value=="yes"){
                                   console.log(response.value); document.getElementById("displayMessage").innerHTML="entries successfully saved in the server";
                                    deleteValues(arrayValue.timed);
                                }else{
                                    document.getElementById("displayError").innerHTML="Entries not saved. please try again later";
                                }
                            }).catch(err=>{
                                console.log(err);
                                document.getElementById("displayError").innerHTML="Entries not saved. please try again later";
                
                            });
                        });
                        
						console.log(customers);
                    }
				}
            }
            request.onerror=function(){
				console.error("an error has occurred: ");
			}
		
        }
    
        function deleteValues(value) {//takes in values of index to be searched
            var db=null,
			request=window.indexedDB.open("fcrDiary", 3);
			request.onsuccess=function(event){
				db=event.target.result;

				//select the store for reading
				var transaction=db.transaction(["entries", "subject"], 'readwrite');
				transaction.oncomplete=function(){
					console.log("all done!");
				}
				transaction.onerror=function(){
					console.error("an error has occurred: "+transaction.error);
				}
				//get the store
				var subjectstore=transaction.objectStore("subject");
                var entrystore=transaction.objectStore("entries");
                
                var subjectindex=subjectstore.index('timed');
                var entryindex=entrystore.index('timed');
				//retrieve data
				
                var searchValue=IDBKeyRange.only(value);
                //delete from the subject store
                subjectindex.openCursor(searchValue).onsuccess=function(event){
                    var subjectcursor=event.target.result;
                    if(subjectcursor){
                        var deleteRequest=subjectcursor.delete();
                        console.log("value deleted");
                        /*if(cursor.value.subject==value){
                        customers.push(cursor.value);
                        }*/
                        subjectcursor.continue();
                    }else{
                        console.log("done111");
                
                    }
                }
                //delete from the entries store
                entryindex.openCursor(searchValue).onsuccess=function(event){
                    var entrycursor=event.target.result;
                    if(entrycursor){
                        var deleteRequest=entrycursor.delete();
                        console.log("value deleted");
                        /*if(cursor.value.subject==value){
                        customers.push(cursor.value);
                        }*/
                        entrycursor.continue();
                    }else{
                        console.log("done111");
                
                    }
                }
                
				
			}
		
			request.onerror=function(){
				console.error("an error has occurred: ");
			}
        }

		function createTable(data, id){
			console.log(data);
            document.getElementById(id).innerHTML="";
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
				btn.setAttribute("id", data[i].timed);
				
				btn.innerHTML="read";
				bdata.appendChild(btn);
				nodeToAdd.appendChild(bdata);
				console.log(objectval);
				document.getElementById(id).appendChild(nodeToAdd);
				btn.onclick=offreader;
			}
			
		}

		function ondbWriter(subject, entries){
			var db=null,
			request=window.indexedDB.open("fcrDiary", 3);

			request.onsuccess=function(event){
				//console.log(event);
				db=event.target.result;

				//console.log(subject, entries);
				//select stores for read and write
				var transaction=db.transaction(["onlineSubject", "onlineEntries"], "readwrite");
				transaction.oncomplete=function(){
					console.log("all done!");
				}
				transaction.onerror=function(){
					console.error("an error has occurred when opening the store: "+transaction.error);
				}
                
				//get the store
				var subjectStore=transaction.objectStore("onlineSubject");
				var entriesStore=transaction.objectStore("onlineEntries");
                    
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
                    msg="Your entries have been saved locally ";
                    document.getElementById("displayMessage").innerHTML=msg;
					console.log();
				}
                entriesRequest.onerror=function(e){
                    errorMsg="entries not saved".e.target.error.name;
                    document.getElementById("displayError").innerHTML=errorMsg;
                    console.log(errorMsg);
                }
			}
			
			request.onerror=function(){
				console.error("an error has occurred: ");
			}
		}

        function onReader(mystore){//function to read stored data from the server recieves name of the store
			var db=null,
			request=window.indexedDB.open("fcrDiary", 3);
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
				var customers=[];//array to hold values
				store.openCursor().onsuccess=function(event){
					var cursor=event.target.result;
					if(cursor){
						//console.log(cursor.value);
						customers.push(cursor.value);
						cursor.continue();
					}
					else{
						createTableOn(customers, "tableBodyOn");
						console.log(customers);
					}
				}
			}
		
			request.onerror=function(){
				console.error("an error has occurred: ");
			}
		}

        function createTableOn(data, id){
			console.log(data);
            document.getElementById(id).innerHTML="";
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
				btn.setAttribute("id", data[i].timed);
				
				btn.innerHTML="read";
				bdata.appendChild(btn);
				nodeToAdd.appendChild(bdata);
				console.log(objectval);
				document.getElementById(id).appendChild(nodeToAdd);
				btn.onclick=serverreader;
			}
			
		}

        function ondbClear(substore, entstore){//function clear data in stores to avoid duplication
			var db=null,
			request=window.indexedDB.open("fcrDiary", 3);

			request.onsuccess=function(event){
				//console.log(event);
				db=event.target.result;
                
				//select stores for read and write
				var transaction=db.transaction([substore, entstore], "readwrite");
				transaction.oncomplete=function(){
					console.log("all done!");
				}
				transaction.onerror=function(){
					console.error("an error has occurred when opening the store: "+transaction.error);
				}
                
				//get the store
				var subjectStore=transaction.objectStore(substore);
				var entriesStore=transaction.objectStore(entstore);
                
                //delete added data before writing
                var clearSubject=subjectStore.clear();
                var clearEntries=entriesStore.clear();
                
                clearSubject.onsuccess=function(event){
                    console.log("delete data in subjects success");
                }
                 clearSubject.onerror=function(event){
                    console.log("delete data in subjects failed");
                }
                  clearEntries.onsuccess=function(event){
                    console.log("delete data in entries success");
                }
                   clearEntries.onerror=function(event){
                    console.log("delete data in entries failed");
                }
			}
			
			request.onerror=function(){
				console.error("an error has occurred: ");
			}
		}
        
        function dbWriter(subject, entries){//function to write data not saved online
			var db=null,
			request=window.indexedDB.open("fcrDiary", 3);

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
                    msg="Your entries have been saved locally ";
                    document.getElementById("displayMessage").innerHTML=msg;
					console.log();
				}
                entriesRequest.onerror=function(e){
                    errorMsg="subject not saved".e.target.error.name;
                    document.getElementById("displayError").innerHTML=errorMsg;
                    console.log(errorMsg);
                }
			}

			request.onerror=function(){
				console.error("an error has occurred: ");
			}
		}


        function permanentWriter(details){//function to store the users details locally
			var db=null,
			request=window.indexedDB.open("fcrDiary", 3);

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
                    localStorage.setItem('permanentUsername', details.username);
                    localStorage.setItem('permanentId', details.id);
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
					subjectStore.createIndex("dated", "dated", {unique:false});
                    subjectStore.createIndex("timed", "timed", {unique:true});
                    subjectStore.createIndex("subject", "subject", {unique:false});
                    
					entriesStore.createIndex("subject", "subject", {unique:false});
                    entriesStore.createIndex("dated", "dated", {unique:false});
                    entriesStore.createIndex("timed", "timed", {unique:true});
                    
                    onlinesubject.createIndex("dated", "dated", {unique: false});
                    onlinesubject.createIndex("subject", "subject", {unique: false});
                    
                    onlineentry.createIndex("dated", "dated", {unique: false});
                    onlineentry.createIndex("subject", "subject", {unique: false});
                    onlineentry.createIndex("timed", "timed", {unique: true});
                    
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
			request=window.indexedDB.open("fcrDiary", 3);

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
    request=window.indexedDB.open("fcrDiary", 3);
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


function searchItems(mystore, value){//reads value at a time
	var db=null,
    request=window.indexedDB.open("fcrDiary", 3);
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
        var index=store.index('timed');
        document.getElementById("writtenC").innerHTML="";
            
        //using indes to read
        var customers=[];
        var searchValue=IDBKeyRange.only(value);
        index.openCursor(searchValue).onsuccess=function(event){
            var cursor=event.target.result;
            if(cursor){
                customers.push(cursor.value);
                /*if(cursor.value.subject==value){
                    customers.push(cursor.value);
                }*/
                cursor.continue();
            }else{
                //createTable(customers);
                customers.forEach(value=>{
                    ccontent="<h4>"+value.subject+"</h4><br/><small>"+value.dated+ ":" + value.timed+"</small><br/>"+value.mywrite+"<br />";
                    document.getElementById("writtenC").innerHTML+=ccontent; 
                });
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