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
					var subjectStore=db.createObjectStore("subject", {autoIncrement:true});
					var entriesStore=db.createObjectStore("entries", {autoIncrement:true});
				}
				//if it exists and version less than 2
				if(event.oldVersion<2){
					var subjectStore=request.transaction.objectStore("subject");
					var entriesStore=request.transaction.objectStore("entries");
					subjectStore.createIndex("date", "date", {unique:false});
                    subjectStore.createIndex("subject", "subject", {unique:false});
                    
					entriesStore.createIndex("subject", "subject", {unique:false});
                    entriesStore.createIndex("date", "date", {unique:false});
                    //entriesStore.createIndex("by_email", "email");
					//store2.createIndex("by_name", "name");
					//store2.createIndex("by_email", "email");
				}
			};

			request.onerror=function(){
				console.error("an error has occurred: ");
			}
		}


function dbReader(mystore){
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
	   //add data
	   var request1=store.get(payload);
	   request1.onsuccess=function(event){
           console.log(event.target.result);
	   }
        
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