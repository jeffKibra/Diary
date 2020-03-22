function allReader(mystore){
			var db=null, customer=[],
			request=window.indexedDB.open("fcrDiary", 2);
			request.onsuccess=function(event){
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
				btn.setAttribute("id", data[i].title);
				
				btn.innerHTML="read";
				bdata.appendChild(btn);
				nodeToAdd.appendChild(bdata);
				console.log(objectval);
				document.getElementById("tableBodyOff").appendChild(nodeToAdd);
				btn.onclick=offreader;
			}
			
		}

		function dbWriter(mystore1, mystore2, payload1, payload2){
			var db=null,
			request=window.indexedDB.open("fcrDiary", 2);

			request.onsuccess=function(event){
				//console.log(event);
				db=event.target.result;

				console.log(payload1, payload2);
				//add data
				var transaction=db.transaction([mystore1, mystore2], "readwrite");
				transaction.oncomplete=function(){
					console.log("all done!");
				}
				transaction.onerror=function(){
					console.error("an error has occurred when opening the store: "+transaction.error);
				}
				//get the store
				var store1=transaction.objectStore(mystore1);
				var store2=transaction.objectStore(mystore2);
				//add data
		
				var request1=store1.add(payload1);
				request1.onsuccess=function(event){
					console.log("data1 added successfully");
				}
				var request2=store2.add(payload2);
				request2.onsuccess=function(event){
					console.log("data2 added successfully");
				}
			}

			request.onupgradeneeded=function(event){
				db=event.target.result;
				//console.log(event);
				if(event.oldVersion<1){
					//didnt exist 
					var store1=db.createObjectStore(mystore1, {keyPath:"title"});
					var store2=db.createObjectStore(mystore2, {keyPath:"title"});
				}
				//if it exists and version less than 2
				if(event.oldVersion<2){
					var store1=request.transaction.objectStore(mystore1);
					//var store2=request.transaction.objectStore(mystore2);
					store1.createIndex("by_date", "date");
					//store1.createIndex("by_email", "email");
					//store2.createIndex("by_name", "name");
					//store2.createIndex("by_email", "email");
				}
			};

			request.onerror=function(){
				console.error("an error has occurred: ");
			}
		}



			function dbReader(mystore, payload){
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
		}
		

		request.onerror=function(){
			console.error("an error has occurred: ");
		}
			}