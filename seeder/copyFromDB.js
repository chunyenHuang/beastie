// npm install mkdirp
const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.load({
    path: '.env.file'
});
const mongodb = require('mongodb');
const dbClient = mongodb.MongoClient;
// const ObjectId = mongodb.ObjectId;
const dbUrl = process.env.MONGODB_URI || process.env.MONGOLAB_URI;

const seedPath = path.join(__dirname, '/seeds');
const collections = [];
fs.readdirSync(seedPath).forEach((file) => {
    const filename = file.split('.')[0];
    collections.push(filename);
});

(function writeDBtoFile(index) {
    if (index == collections.length) {
        return console.log('finished.');
    }
    dbClient.connect(dbUrl, (err, db) => {
        db.collection(collections[index]).find({}).toArray((err, results) => {
            if (err) {return console.log(err)};
            if (!err) {
                const filename = __dirname + '/seeds/' + collections[index] + '.json';
                index += 1;
                console.log(filename);
                fs.writeFile(filename, JSON.stringify(results), (err) => {
                    if (err) return console.log(err);
                    if (!err) {
                        return writeDBtoFile(index);
                    }
                });
            }
        });
    });
})(0);
