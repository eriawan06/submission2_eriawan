const dbPromise = idb.open("topliga",1,function(upgradedb){
    switch(upgradedb.oldVersion){
        case 1 :    
            if (!upgradedb.objectStoreNames.contains("teams")){
                upgradedb.createObjectStore("teams",{keyPath:"teamId"});
            }
        case 2 :
            if (!upgradedb.objectStoreNames.contains("news")){
                var newsOS = upgradedb.createObjectStore(
                    "news",{
                        keyPath:"newsId",
                        autoIncrement:true,
                    }
                );
            }
    }
});

const dbInsertNews = function(news_data) {
    return new Promise(function(resolve,reject){
        dbPromise.then(function(db) {
            const transaction = db.transaction("news",`readwrite`);
            transaction.objectStore("news").put(news_data);
            return transaction;
        }).then(function(transaction) {
            if(transaction.complete) {
                resolve(true);
            }else {
                reject(new Error(transaction.onerror));
            }
        })
    })
};

const dbGetAllNews = function() {
    return new Promise(function(resolve,reject){
        dbPromise.then(function(db){
            const transaction = db.transaction("news",`readonly`);
            return transaction.objectStore("news").getAll();
        }).then(function(data){
            if(data !== undefined) {
                resolve(data);
            }else {
                reject(new Error('News not found'));
            }
        })
    })
};

const dbGetSingleNews = function(newsId) {
    return new Promise(function(resolve,reject){
        dbPromise.then(function(db){
            const transaction = db.transaction("news",`readonly`);
            return transaction.objectStore("news").get(newsId);
        }).then(function(data){
            if(data !== undefined) {
                resolve(data);
            }else {
                reject(new Error('News not found'));
            }
        })
    })
};

const dbDeleteNews = function(newsId) {
    return new Promise(function(resolve,reject) {
        dbPromise.then(function(db) {
            const transaction = db.transaction("news",`readwrite`);
            transaction.objectStore("news").delete(newsId);
            return transaction;
        }).then(function(transaction) {
            if(transaction.complete) {
                resolve(true);
            }else {
                reject(new Error(transaction.onerror));
            }
        })
    })
}

const dbInsertTeam = function(team) {
    return new Promise(function(resolve,reject){
        dbPromise.then(function(db){
            const transaction = db.transaction("teams",`readwrite`);
            transaction.objectStore("teams").put(team);
            return transaction;
        }).then(function(transaction){
            if(transaction.complete) {
                resolve(true);
            }else {
                reject(new Error(transaction.onerror));
            }
        })
    })
};

const dbGetTeam = function(teamId) {
    return new Promise(function(resolve,reject){
        dbPromise.then(function(db){
            const transaction = db.transaction("teams",`readonly`);
            return transaction.objectStore("teams").get(teamId);
        }).then(function(data){
            if(data !== undefined) {
                resolve(data);
            }else {
                reject(new Error('Team not found'));
            }
        })
    })
};