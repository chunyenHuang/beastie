const dotenv = require('dotenv');
dotenv.load({
    path: '.env.file'
});
const path = require('path');
const mongodb = require('mongodb');
const dbClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;
const dbUrl = process.env.MONGODB_URI || process.env.MONGOLAB_URI;

let test = [];
const selfServiceArr = [];
const orderArr = [];
const creditArr = [];

const totals = {
    selfServices: 400,
    orders: 400,
    credits: 400
}
const arrs = {
    selfServices: [],
    orders: [],
    credits: [],
}



const insertFakeData = ( collection, data) => {
    _insertFakeData( collection, data)
    .then((result) => {
        let resultReady = genTransactions(result);
      
        db.collection('transactions').insert(resultReady, (err, results) => {
            if(err){
                return console.log(err);
            }
            arrs[collection].push(results.ops[0].total);
            if (arrs[collection].length == totals[collection]) {
                // console.log(collection + ": " + arr.length);
                console.log(arrs);
            }
        });
    }).catch((err)=>{
        console.log(err);
    });
}
const _insertFakeData = ( collection, data) => {
    return new Promise((resolve, reject)=>{
        db.collection(collection).insert(data, (err, results) => {
            if(!err){
                resolve(data);
            } else {
                reject(err);
            }
        });
    })
}
let paymentTransactionsNumber = 1;
const genTransactions = (data) => {
    let randomNum = Math.random();
    let transactionTemp = {
        credit_id: null,
        selfService_id: null,
        order_id: null,
        customer_id: data.customer_id,
        total: null,
        isTaxIncluded: false,
        paymentTransactionsNumber: null,
        note: null,
        isVoidedAt: null,
        createdAt: null,
        updatedAt: null,
        isDeleted: false
    };
    // selfServices
    if (data.addons) {
        transactionTemp.selfService_id = data._id;
        transactionTemp.total = data.total;
        transactionTemp.createdAt = data.updatedAt;
    }
    // orders
    if (data.scheduleAt) {
        transactionTemp.order_id = data._id;
        transactionTemp.total = data.total;
        transactionTemp.createdAt = data.scheduleAt;
    }
    // credits
    if (data.purchased) {
        transactionTemp.credit_id = data._id;
        transactionTemp.total = data.purchased[0].total;
        transactionTemp.createdAt = data.updatedAt;
    }
    if (randomNum > 0.5) {
        transactionTemp.paymentTransactionsNumber = paymentTransactionsNumber;
        paymentTransactionsNumber++;
    }
    return transactionTemp;
}

// const selfServiceTotal = 4;
// const orderTotal = 0;
// const creditTotal = 0;
// const selfServiceArr = [];
// const orderArr = [];
// const creditArr = [];

const collections = [
    'transactions',
    'orders',
    'selfServices',
    'credits'
];

let db;

const init = (db)=>{
    const removePromises = [];
    const dbRemovePromise = (collection) => {
        return new Promise((resolve, reject)=>{
            db.collection(collection).remove({}, (err)=>{
                if(!err){
                    resolve(); 
                } else{
                    reject();
                }
            });
        });
    }
    for(var i=0; i<collections.length; i++){
        removePromises.push(dbRemovePromise(collections[i]));
    }
    Promise.all(removePromises).then(()=>{
        insertToDB();
    }).catch((err)=>{
        console.log(err);
    });
};

// (function recursive(item, array, index){
//     if(array.length == index){
//         return;
//     }
//     // data anaylysis
//     recursive(item, array, index);
// })(item, array, index); // data here

const insertToDB = () => {
    for (let i=0; i<totals.selfServices; i++) {
        let selfService = {
            customer_id: null,
            // package: null,
            services: [],
            addons: [],
            total: parseInt(Math.random()*100),
            isPaid: true,
            checkOutAt: null,
            updatedAt: getRandomDate(),
            isDeleted: false
        };
        insertFakeData('selfServices', selfService);
    }
    for (let j=0; j<totals.orders; j++) {
        let order = {
            customer_id: null,
            pet_id: null,
            scheduleAt: getRandomDate(),
            notes: null,
            isCanceled: false,
            notShowup: false,
            checkInAt: null,
            checkInNumber: null, // 1, 2
            isRush: false,
            services: null,
            total: parseInt(Math.random()*200),
            inhouseOrders: null,
            isPaid: false,
            checkOutAt: null,
            isDeleted: false
        }
        insertFakeData('orders', order);
    }
    for (let k=0; k<totals.credits; k++) {
        let credit = {
            customer_id: null,
            pinPasswords: null,
            purchased: [
                {
                    name: null,
                    total: parseInt(Math.random()*500),
                    credit: null
                }
            ],
            // used: [],
            balance: 0,
            credit: 0,
            creditUsed: [],
            updatedAt: getRandomDate(),
            isDeleted: false
            
        }
        insertFakeData('credits', credit);
    }
}

if(db){
    init(db);
} else {
    dbClient.connect(dbUrl, (err, DB) => {
        if(err){
            return console.log(err);
        }
        db = DB;
        init(db);
    });
}

const today = new Date();
const dateRange = [-370, 30];
const hourRange = [10, 20];
// const timeZone = today.getTimezoneOffset()/60;
const skips = [ 2 ];

const getRandomDate = () => {
    const day = today.getDate() + dateRange[0] +
        parseInt(Math.random() * (dateRange[1] - dateRange[0]));
    const hour = hourRange[0] + parseInt(Math.random() * (hourRange[1] - hourRange[0]));
    const date = new Date(　today.getFullYear(), 　today.getMonth(),
        day,
        hour　);　　
    for (var i = 0; i < skips.length; i++) {　
        if (date.getDay() == skips[i]) {
            return getRandomDate();
        }　
    }

    // console.log(date.toTimeString());
    return date;
};



// const renameProp = (obj, oldName, newName) => {
//     if (oldName == newName) {
//         return obj;
//     }
//     if (obj.hasOwnProperty(oldName)) {
//         obj[newName] = obj[oldName];
//         delete obj[oldName];
//     }
//     return obj;
// }

// const insertFakeOrders = (customers, db) => {
//     let checked = 0;
//     let inserted = 0;

//     for (var i = 0; i < total; i++) {
//         const randomNum = parseInt(Math.random() * (customers.length - 1));
//         const randomDate = getRandomDate();
//         if (customers[randomNum].pets.length > 0) {
//             checked++;
//             const order = getTemplate(
//                 customers[randomNum]._id,
//                 customers[randomNum].pets[0]._id,
//                 randomDate
//             );
//             db.collection('orders').insert(order, (err, results) => {
//                 if (!err) {
//                     inserted++;
//                     if (checked == inserted) {
//                         console.log('inserted: ' + inserted + '/' + total);
//                     }
//                 };
//             });
//         }
//     }
// };
