var cacheName = "finiteCreations-v1.06";

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

self.addEventListener('push', function (event) {
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
});

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
    if (event.tag === 'contacts') {
        event.waitUntil(
        allReader().then(value =>{
            console.log(value);
            return fetch('/sendMessage', {
                method: 'POST',
                headers: new Headers({ 'content-type': 'application/json' }),
                body: JSON.stringify(value)
                })
            }
        ));
    //delete
    }
});

