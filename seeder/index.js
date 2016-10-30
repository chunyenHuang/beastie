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
const routePath = path.join(__dirname, '/seeds');
fs.readdirSync(routePath).forEach((file) => {
    const filename = file.split('.')[0];
    const route = path.join(routePath, file);
    initDatas[filename] = require(route);
});

for(var prop in initDatas) {
    const collection = prop;
    dbClient.connect(dbUrl, (err, db) => {
        db.collection(collection).remove({}, (err, results) => {
            if (!err) {
                initDatas[collection].forEach((data)=>{
                    db.collection(collection).insert(data, (err, results) => {
                        db.close();
                        console.log('Init Data is inserted into ' + collection);
                    });
                });
            }
        });
    });
}
