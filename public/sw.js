importScripts('./package/build/importScripts/sw-offline-google-analytics.prod.v0.0.25.js');
importScripts('./scripts/indexedDB.js');

goog.offlineGoogleAnalytics.initialize();

var cacheName = "finiteCreations-v1.07";

self.addEventListener("install", event=>{
    self.skipWaiting();
    event.waitUntil(caches.open(cacheName).then(function(cache){
        cache.addAll([]);
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
//    console.log(event);
    if(event.request.method==='POST'){
            return fetch(event.request).then(function(response){
                return response;
            }).catch(error=>{
                console.log("you are currently offline");
                console.log(error);
            });
        }

    event.respondWith(caches.match(event.request, {ignoreSearch:true}).then(function(response){
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
    }));
});


self.addEventListener('sync', (event) => {
    console.log("background sync hapening");
    syncReader("entries", event);
    
});


        function syncReader(mystore, event){//recieves name of the store
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
						console.log(customers);
                        synchronized(customers, event);           
					}
				}
            }
			request.onerror=function(){
				console.error("an error has occurred: ");
			}
		}

function synchronized(myarray, event){
    myarray.forEach(arrayvalue=>{
        if (event.tag === arrayvalue.timed) {
            event.waitUntil(
                console.log(arrayvalue);
                fetch("https://finitecreations.co.ke/api/", {
                    method: 'POST',
                    headers: new Headers({'content-type': "application/json"}),
                    body: JSON.stringify(arrayValue)
                })
            )
            deleteValues(myarray.timed);
        }
    //delete
    });
    
}












