const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const dotenv = require('dotenv');
dotenv.load({
    path: '.env.file'
});
const mongodb = require('mongodb');
const dbClient = mongodb.MongoClient;
const dbUrl = process.env.MONGODB_URI || process.env.MONGOLAB_URI;
// const ObjectId = mongodb.ObjectId;

const root = path.join(__dirname, '../');
const seedsPath = path.join(root, 'seeds');
/*
    use dropbox path for backups
*/
const files = process.env.BACKUP_PATH || path.join(root, 'files');
const mongoDBPath = path.join(files, 'mongoDB');

const uploads = path.join(root, 'files/uploads');
const images = path.join(root, 'files/images');
const inhouseOrders = path.join(images, 'inhouseOrders');
const orders = path.join(images, 'orders');
const pets = path.join(images, 'pets');
const customers = path.join(images, 'customers');

/*
    files and paths
*/
const DirPaths = [
    files,
    mongoDBPath,
    uploads, images, inhouseOrders, orders, pets, customers
];

const Backup = (callback) => {
    DirPaths.forEach((dirPath) => {
        fs.access(dirPath, (err) => {
            if (err) {
                mkdirp(dirPath, (err) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log('created: ' + dirPath);
                    }
                });
            }
        });
    });
    /*
        mongodb
    */
    let db;
    dbClient.connect(dbUrl, (err, database) => {
        db = database;
        db.listCollections().toArray((err, dbCollections)=>{
            console.log(dbCollections);
            const collections = [];
            for (var i = 0; i < dbCollections.length; i++) {
                collections.push(dbCollections[i].name);
            }
            console.log(collections);
            // throw 'stop';
            const today = new Date();
            let formatName = today.toLocaleString();
            formatName = formatName.split('/').join('-');
            const backupLocation = mongoDBPath + '/' + formatName;
            mkdirp(backupLocation, (err) => {
                if (err) {
                    return console.log(err);
                }
                (function writeDBtoFile(index) {
                    console.log(index, collections.length);
                    if (index == collections.length) {
                        console.log('DB backup is finished.');
                        if (callback) {
                            return callback();
                        }
                        return;
                        // return process.exit();
                    }
                    db.collection(collections[index]).find({}).toArray((err, results) => {
                        if (err) {
                            return console.log(err);
                        } else {
                            const filename = collections[index] + '.json';
                            const filePath = path.join(backupLocation, filename);
                            index += 1;
                            fs.writeFile(filePath, JSON.stringify(results), (err) => {
                                if (err) {
                                    return console.log(err);
                                }
                                if (!err) {
                                    console.log('Complete backup: ' + collections[index]);
                                    return writeDBtoFile(index);
                                }
                            });
                        }
                    });
                })(0);
            });
        });
    });
    // fs.readdirSync(seedsPath).forEach((file) => {
    //     let collection = file.split('.');
    //     collection = collection[0];
    //     collections.push(collection);
    // });
};
// Backup();
module.exports = Backup;
