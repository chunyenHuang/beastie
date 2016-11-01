const dotenv = require('dotenv');
dotenv.load({
    path: '.env.file'
});
const path = require('path');
const fs = require('fs');
const mongodb = require('mongodb');
const dbClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;
const dbUrl = process.env.MONGODB_URI || process.env.MONGOLAB_URI;

// Load Datas
const initDatas = {};
const routes = [];
const routePath = path.join(__dirname, '/seeds');
fs.readdirSync(routePath).forEach((file) => {
    const filename = file.split('.')[0];
    const route = path.join(routePath, file);
    initDatas[filename] = require(route);
    routes.push(filename);
});
console.log(routes);

dbClient.connect(dbUrl, (err, db) => {
    (function insert(index){
        if(index==routes.length){
            return db.close();
        }
        const collection = routes[index];
        console.log(collection)
        var count=0;
        db.collection(collection).remove({}, (err) => {
            if (!err) {
                initDatas[collection].forEach((data) => {
                    if (data._id) {
                        data._id = ObjectId(data._id);
                    }
                    db.collection(collection).update(data,data,{upsert:true}, (err) => {
                        count++;
                        if(err){
                            console.log(err);
                        }
                        
                        if(count == initDatas[collection].length){
                            index++
                            insert(index);
                        }              
                    });
                });
            } else {
                console.log(err);
            }
        });
    })(0);
});
