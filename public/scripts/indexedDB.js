function allReader(mydb){
			var db=null, customer=[],
			request=window.indexedDB.open(mydb, 2);
			request.onsuccess=function(event){
				db=event.target.result;

				//add data
				
				var transaction=db.transaction(["diary"]);
				transaction.oncomplete=function(){
					console.log("all done!");
				}
				transaction.onerror=function(){
					console.error("an error has occurred: "+transaction.error);
				}
				//get the store
				var store=transaction.objectStore("diary");
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
			var btn1=document.createElement("button");
				btn1.setAttribute("class", "btn btn-primary readnone");
				btn.setAttribute("id", "all");
				btn.innerHTML="test-btn";
				var btn2=document.getElementById("offlineread");
				btn2.appendChild(btn);
		}

		function dbWriter(mydb, payload){
			var db=null,
			request=window.indexedDB.open(mydb, 2);

			request.onsuccess=function(event){
				//console.log(event);
				db=event.target.result;

				console.log(payload);
				//add data
				var transaction=db.transaction(["diary"], "readwrite");
				transaction.oncomplete=function(){
					console.log("all done!");
				}
				transaction.onerror=function(){
					console.error("an error has occurred when opening the store: "+transaction.error);
				}
				//get the store
				var store=transaction.objectStore("diary");
				//add data
		
				var request1=store.add(payload);
				request1.onsuccess=function(event){
					console.log("data added successfully");
				}
			}

			request.onupgradeneeded=function(event){
				db=event.target.result;
				//console.log(event);
				if(event.oldVersion<1){
					//didnt exist 
					var store=db.createObjectStore("diary", {keyPath:"title"});
				}
				//if it exists and version less than 2
				if(event.oldVersion<2){
					var store=request.transaction.objectStore("diary");
					store.createIndex("by_name", "name");
					store.createIndex("by_email", "email");
				}
			};

			request.onerror=function(){
				console.error("an error has occurred: ");
			}
		}



			function dbReader(payload){
				var db=null,
		request=window.indexedDB.open("demo_db", 2);
		request.onsuccess=function(event){
			//console.log(event);
			db=event.target.result;

			//add data
		var transaction=db.transaction(["things"]);
		transaction.oncomplete=function(){
			console.log("all done!");
		}
		transaction.onerror=function(){
			console.error("an error has occurred: "+transaction.error);
		}
		//get the store
		var store=transaction.objectStore("things");
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