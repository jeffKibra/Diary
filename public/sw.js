importScripts('./package/build/importScripts/sw-offline-google-analytics.prod.v0.0.25.js');
//importScripts('./scripts/indexedDB.js');

goog.offlineGoogleAnalytics.initialize();

var cacheName = "finiteCreations-v1.09";

self.addEventListener("install", event=>{
    self.skipWaiting();
    event.waitUntil(caches.open(cacheName).then(function(cache){
        cache.addAll([
            './css/actions.css',
            './css/footer.css',
            './css/main.css',
            './css/widgEditor.css',
            './css/widgContent.css',
            './boot/bootstrap.min.css',
            './boot/bootstrap-reboot.min.css',
            './boot/bootstrap-grid.min.css',
            './scripts/indexedDB.js',
            './scripts/jquery.min.js',
            './scripts/sha1encryption.js',
            './scripts/validator.js',
            './scripts/webpush.js',
            './scripts/widgEditor.js',
            'diary.html',
            'login.html',
            'manifest.json',
            'logout.html',
            'offline.html'
        ]);
        console.log("cache populated succesfully");
    }))
})

self.addEventListener("activate", function (event) {
    self.clients.claim();
});

/*self.addEventListener('push', function (event) {
    var payload = event.data ? JSON.parse(event.data.text()) : 'no payload';
    var title = 'Finitecreations diary';
    event.waitUntil(
        self.registration.showNotification(title, {
            body: payload.msg,
            url: payload.url,
            icon: payload.icon,
            actions: [
                { action: 'voteup', title: 'Vote Up' },
                { action: 'votedown', title: 'Vote Down' }],
            vibrate: [300, 100, 400]
        })
    );
});*/

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({
            type: "window"
        })
        .then(function (clientList) {
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url == '/' && 'focus' in client)
                    return client.focus();
            }
            if (clients.openWindow) {
                return clients.openWindow('http://localhost:4001');
            }
        })
    );
});


self.addEventListener('fetch', event=>{
    console.log(event.request);
    if(event.request.method==='POST'){
            return fetch(event.request).then(function(response){
                return response;
            }).catch(error=>{
                console.log("you are currently offline");
                console.log(error);
            });
        }
    
    if(event.request.method === 'GET'){
        var requestToCache=event.request.clone();
            event.respondWith(
            	fetch(event.request).then(res=>{
            		console.log(res);
           			if(!res || res.status !== 200){
        		        throw "invalid response";
        			}
            		var responseToCache=res.clone();
            
            		caches.open(cacheName).then(cache=>{
                		cache.put(requestToCache, responseToCache);
            		});
            
            		return res;
            
       			}).catch(err=>{
            		/*if(/logout/.test(event.request.url)){
            		    return caches.match('logout.html').then(response=>{
            		    	console.log(response);
            		    	if(response) return response;
            		    });
            		    
            		}else if(/login/.test(event.request.url)){
            			return caches.match('login.html').then(response=>{
            		    	console.log(response);
            		    	if(response) return response;
            		    });
            		}else if(/diary/.test(event.request.url)){
            			return caches.match('diary.html').then(response=>{
            		    	console.log(response);
            		    	if(response) return response;
            		    });

            		}else {
            			return caches.match(event.request).then(response=>{
            		    	console.log(response);
                            
            		    	if(response) return response;
            		    	console.log("no cached files");
            		    	return;
            			});	
            		}*/
            		return caches.match(event.request, {ignoreSearch:true}).then(response=>{
            		    	console.log(response);
                            
            		    	if(response) return response;
            		    	console.log("no cached files");
            		    	return caches.match('offline.html').then(res=>{
                                return res;
                            });
                    });	
            		
           			console.log(err); 
        		}));
        
        /*event.respondWith(caches.match(event.request, {ignoreSearch:true}).then(function(response){
        if(response) return response;
        var requestToCache=event.request.clone();

        return fetch(requestToCache).then(function(response){
            if(!response || response.status!==200){
                return response;
            }
            var responseToCache=response.clone();

            caches.open(cacheName).then(function(cache){
                cache.put(requestToCache, responseToCache);
            });

            return response;

        }).catch(error=>{
            if(event.request.method==='GET' && event.request.headers.get('accept').includes('text/html')){
                return caches.match(offlinePage);
            }
        });
    }));*/
        
    }

    
});


self.addEventListener('sync', (syncEvent) => {
    console.log("background sync hapening");
    console.log(syncEvent);
    syncReader("entries", syncEvent);
    
});


        function syncReader(mystore, syncEvent){//recieves name of the store
			var db=null,
			request=indexedDB.open("fcrDiary", 3);
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
						console.log(customers);
                        synchronized(customers, syncEvent);           
					}
				}
            }
			request.onerror=function(){
				console.error("an error has occurred: ");
			}
		}

function synchronized(myarray, syncEvent){
    console.log(syncEvent);
    console.log("synchronization");
    myarray.forEach(arrayvalue=>{
        console.log(arrayvalue.timed);
        if (syncEvent.tag === arrayvalue.timed) {
            console.log("sync value found");
                fetch("https://finitecreations.co.ke/api/index.php", {
                    method: 'POST',
                    headers: new Headers({'content-type': "application/json"}),
                    body: JSON.stringify(arrayvalue)
                });
            console.log("background sync done");
            //deleteValues(arrayvalue.timed);
            deleteValues(arrayvalue.timed);
        }
    //delete
    });
    
}

function deleteValues(value) {//takes in values of index to be searched
            var db=null,
			request=indexedDB.open("fcrDiary", 3);
			request.onsuccess=function(event){
				db=event.target.result;

				//select the store for reading
				var transaction=db.transaction(["entries", "subject"], 'readwrite');
				transaction.oncomplete=function(){
					console.log("deletion all done!");
				}
				transaction.onerror=function(){
					console.error("an error has occurred during deletion: "+transaction.error);
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










