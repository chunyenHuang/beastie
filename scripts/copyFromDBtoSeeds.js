const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.load({
    path: '.env.file'
});
const mongodb = require('mongodb');
const dbClient = mongodb.MongoClient;
const dbUrl = process.env.MONGODB_URI || process.env.MONGOLAB_URI;
const root = path.join(__dirname, '../');
const seedPath = path.join(root, 'seeds');
const collections = [
    'customers', 'listItems', 'settings', 'users'
];
fs.readdirSync(seedPath).forEach((file) => {
    const filename = file.split('.')[0];
    if (collections.indexOf(filename) == -1) {
        collections.push(filename);
    }
});

(function writeDBtoFile(index) {
    if (index == collections.length) {
        console.log('Finished writeDBtoFile.');
        return process.exit();
    }
    dbClient.connect(dbUrl, (err, db) => {
        db.collection(collections[index]).find({}).toArray((err, results) => {
            if (err) {
                return console.log(err)
            };
            if (!err) {
                const filename = collections[index] + '.json';
                const filePath = path.join(seedPath, filename);

                index += 1;
                fs.writeFile(filePath, JSON.stringify(results), (err) => {
                    if (err) return console.log(err);
                    if (!err) {
                        console.log('Copy collection from MongoDB: ' + collections[index]);
                        return writeDBtoFile(index);
                    }
                });
            }
        });
    });
})(0);
