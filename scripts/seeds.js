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


const source = 'seeds-12042016';
// Load Datas
const initDatas = {};
const routes = [];
const root = path.join(__dirname, '../');
const routePath = path.join(root, source);
fs.readdirSync(routePath).forEach((file) => {
    const filename = file.split('.')[0];
    const route = path.join(routePath, file);
    initDatas[filename] = require(route);
    routes.push(filename);
});

dbClient.connect(dbUrl, (err, db) => {
    (function insert(index) {
        if (index == routes.length) {
            db.close();
            return process.exit();
        }
        const collection = routes[index];
        var count = 0;
        db.collection(collection).remove({}, (err) => {
            console.log();
            if (!err && initDatas[collection].length === 0) {
                index++;
                return insert(index);
            } else if (!err) {
                initDatas[collection].forEach((data) => {
                    // if (data._id) {
                    //     data._id = ObjectId(data._id);
                    // }
                    for (let prop in data) {
                        if (prop.indexOf('_id') > -1) {
                            data[prop] = ObjectId(data[prop]);
                        }
                        if (prop.search(/At$/) > -1) {
                            if (data[prop]) {
                                // console.log(prop);
                                // console.log(data[prop]);
                                data[prop] = new Date(data[prop]);
                            }
                        }
                    }

                    db.collection(collection).update(data, data, {
                        upsert: true
                    }, (err) => {
                        count++;
                        if (err) {
                            console.log(err);
                        }

                        if (count == initDatas[collection].length) {
                            console.log('Inserted Collection: ' + collection);
                            index++;
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
