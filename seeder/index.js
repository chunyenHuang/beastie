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

for (var prop in initDatas) {
    const collection = prop;
    dbClient.connect(dbUrl, (err, db) => {
        db.collection(collection).remove({}, (err) => {
            if (!err) {
                initDatas[collection].forEach((data) => {
                    if (data._id) {
                        data._id = ObjectId(data._id);
                    }
                    db.collection(collection).insert(data, (err) => {
                        if(!err){
                            db.close();
                            console.log('Init Data is inserted into ' + collection);
                        } else {
                            console.log(err);
                        }
                    });
                });
            } else {
                console.log(err);
            }
        });
    });
}
