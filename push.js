var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BLiyKuHQmxOy4697UICQ3fjG4NLEn5YnyVZ_tETztL4GZWwA15cAjlLjzRsKpf8sm7Dsz3OSZdRfEHJHRcXCOpU",
   "privateKey": "asSJf-XSWHG0TfIoKrSGVCrf9avbFUiKOEPGrHAHtX8"
};
 
 
webPush.setVapidDetails(
   'mailto:eriawanhidayatt@gmail.com',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/fmfR-n9Nmyg:APA91bFPiVycK1gQe6W2ndzzim3WBuXTjVzqpYtGe-hp5QfqeEu1xhJO6bmtcpRKQUM_1lR6a9enQZmBw2GhB5mWiFTVVKg_lkH9b3b7B8ZCZsYb4rIBtEMBxDn5E4Wu4YWu7AY1kew5",
   "keys": {
       "p256dh": "BJbyGpSVKWz3ednkVuRR1ySGHT6IgOEREXWYGfdBIrUSmjqwAq9XHWy07WD5/ORkwTgFGm3bc1tlWZV0uhBIMzM=",
       "auth": "CjBZS9F1TTzzRaTloKZS/A=="
   }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
var options = {
   gcmAPIKey: '657518201338',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
).catch(function(err){
    console.log(err);
});