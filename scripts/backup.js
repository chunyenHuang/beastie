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
const backups = process.env.BACKUP_PATH || path.join(root, 'files/backups');
const backupImages = path.join(backups, 'images');
const backupDB = path.join(backups, 'db');
const backupFiles = path.join(backups, 'files');

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
    backups, backupImages, backupDB, backupFiles,
    uploads, images, inhouseOrders, orders, pets, customers
];

const Backup = ()=>{
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
    const collections = [];
    fs.readdirSync(seedsPath).forEach((file) => {
        let collection = file.split('.');
        collection = collection[0];
        collections.push(collection);
    });
    // console.log(collections);

    const today = new Date();
    const timestamp = today.getTime();
    const backupLocation = path.join(backupDB, timestamp.toString());
    mkdirp(backupLocation, (err) => {
        if (err) {
            return console.log(err);
        }
        (function writeDBtoFile(index) {
            if (index == collections.length) {
                return console.log('DB backup is finished.');
                // return process.exit();
            }
            dbClient.connect(dbUrl, (err, db) => {
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
            });
        })(0);
    });
};
// Backup();
module.exports = Backup;
