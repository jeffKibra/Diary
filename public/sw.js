//import * as googleAnalytics from 'workbox-offline-ga.prod.js';
//googleAnalytics.initialize();

var cacheName = "finiteCreations-v1.06";


self.addEventListener("install", event=>{
    self.skipWaiting();
    event.waitUntil(caches.open(cacheName).then(function(cache){
        cache.addAll(['./scripts/indexedDB.js',
        './scripts/validator.js',
        './scripts/widgEditor.js',
        'workbox-offline-ga.prod.js',
        './css/actions.css',
        './css/main.css',
        './css/widgContent.css',
        './css/widgEditor.css',
        'diary.php',
        'diaryhandler.php',
        'diaryheader.php',
        'diaryreader.php',
        'diaryserver.php',
        'functions.php',
        'index.php',
        'links.php',
        'links1.php',
        'login.php',
        'validator.php',
        'logout.php',
        'signup.php'
                ]);
        console.log("cache populated succesfully");
    }))
})

self.addEventListener("activate", function (event) {
    self.clients.claim();
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

function allReader(){
    var db=null,
    request=window.indexedDB.open("demo_db", 2);
    request.onsuccess=function(event){
        db=event.target.result;

        //add data
        var customers=[];
        var transaction=db.transaction(["things"], "readwrite");
        transaction.oncomplete=function(){
            console.log("all done!");
        }
        transaction.onerror=function(){
            console.error("an error has occurred: "+transaction.error);
        }
        //get the store
        var store=transaction.objectStore("things");
        //add data
        store.openCursor().onsuccess=function(event){
            var cursor=event.target.result;
            if(cursor){
                //console.log(cursor.value);
                customers.push(cursor.value);
                cursor.continue();
            }
            else{
                console.log(customers);
            }
            return customers;
        }    
    }
        
    request.onerror=function(){
        console.error("an error has occurred: ");
    }    
}







