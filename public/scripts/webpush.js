        var endpoint;
        var key;
        var authSecret;
        var vapidPublicKey = 'BLdo0yM-vR1PGOQSShGNuZtg2VAbFWWjfQuuGzOuvMuePxusEcoDQ8DQMAyZuSobRFkQIOLXvq7rcBTuCPpYCzA';
            
        function urlBase64ToUint8Array(base64String) {
            const padding = '='.repeat((4 - base64String.length % 4) % 4);
            const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);
            
            for (let i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
        }

        var options={
            userVisibleOnly: true, 
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
        };

        function initialiseState(){
            //check if desktop notifications are supported.
            if(!('showNotification' in ServiceWorkerRegistration.prototype)){
                console.log("notifications are not supported");
                return;
            }

            //check if user has disabled notifications
            if(Notification.permission === 'denied'){
                console.warn("the user has blocked notifications");
                return;
            }
            //check if push api is supported
            if(!('PushManager' in window)){
                console.warn("push notifications not supported");
                return;
            }
            console.log("initializing...");

            navigator.serviceWorker.ready.then(function(serviceWorkerRegistration){
                console.log(serviceWorkerRegistration);
                //get the push notification subscription object
                serviceWorkerRegistration.pushManager.getSubscription().then(function(subscription){
                    console.log(subscription);
                    //if user is visiting for the first time... subscribe them
                    if(!subscription){
                        console.log("registering");
                        subscribe();
                        return;
                    }
                    //update server state with new subscription
                    console.log("sending");
                    sendSubscriptionToServer(subscription);
                }).catch(function(err){
                    //handle the error by showing a notification
                    console.warn(`error during getSubscription()`, err);
                });
            });
        }

        function subscribe(){
            navigator.serviceWorker.ready.then(function(serviceWorkerRegistration){
                console.log("subscribe1");
                serviceWorkerRegistration.pushManager.subscribe(options).then(function(subscription){
                    //update server with new subscription
                    console.log("sending details to the server");
                    return sendSubscriptionToServer(subscription);
                }).catch(e=>{
                    if(Notification.permission === 'denied'){
                        console.warn('permision for notifications was denied');
                    }else{
                        console.error("unable to subscribe to push", e);
                    }
                });
            });
        }

        function sendSubscriptionToServer(subscription){//sends info to the server
            //get key and auth from subscription object
            console.log("subscribed1");
            var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
                        console.log("subscribed2");
            key = rawKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) : '';
                        console.log("subscribed2");
            var rawAuthSecret = subscription.getKey ?  subscription.getKey('auth') : '';
                        console.log("subscribed3");
            authSecret = rawAuthSecret ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) : '';
                        console.log("subscribed4");
            endpoint = subscription.endpoint;
                        console.log("subscribed");

            return fetch('./register', {
                method: 'post',
                headers: new Headers({'content-type': 'application/json'}),
                body: JSON.stringify({
                    endpoint: subscription.endpoint,
                    key: key,
                    authSecret: authSecret,
                })
            });
        }