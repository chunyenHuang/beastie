const dotenv = require('dotenv');
dotenv.load({
    path: '.env.file'
});
const path = require('path');
const mongodb = require('mongodb');
const dbClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;
const dbUrl = process.env.MONGODB_URI || process.env.MONGOLAB_URI;
const getTemplate = (customer_id, pet_id, scheduleAt) =>{
    return {
        customer_id: customer_id,
        pet_id: pet_id,
        scheduleAt: scheduleAt,
        notes: null,
        isCanceled: false,
        notShowup: false,
        checkInAt: null,
        checkInNumber: null, // 1, 2
        isRush: false,
        services: null,
        total: null,
        inhouseOrders: null,
        isPaid: null,
        checkOutAt: null,
        isDeleted: false
    };   
};


dbClient.connect(dbUrl, (err, db) => {
    const query = db.collection('customers').aggregate([
            {
                $match: {}
            },
            {
                $lookup: {
                    from: 'pets',
                    localField: '_id',
                    foreignField: 'customer_id',
                    as: 'pets'
                }
            }
        ]
    );
    query.toArray((err, results) => {
        if (!err) {
            if (results.length > 0) {
                // console.log(results.length);
                // console.log(results[0]);
                db.collection('orders').remove({}, (err) => {
                    if(!err){
                        insertFakeOrders(results, db);
                    }
                });
            }
        }
    });
});

const total = 200;
const today = new Date();
// console.log(today.toTimeString());
// console.log(today.toLocaleTimeString());
const dateRange = [-5, 5];
const hourRange = [10, 20];
// const timeZone = today.getTimezoneOffset()/60;
const skips = [/*2*/];

const getRandomDate = () => {
    const day = today.getDate() + dateRange[0] + parseInt(Math.random()*(dateRange[1]-dateRange[0]));
    const hour = hourRange[0] + parseInt(Math.random()*(hourRange[1]-hourRange[0]));
    const date = new Date(
　      today.getFullYear(),
　      today.getMonth(),
        day,
        hour
　  );    
　  
　  for(var i=0; i<skips.length; i++){
　      if(date.getDay()==skips[i]){
            return getRandomDate(); 
        }
　  }
    
    // console.log(date.toTimeString());
    return date;
};


const insertFakeOrders = (customers, db) => {
    let checked = 0;
    let inserted = 0;

    for(var i=0; i < total; i++){
        const randomNum = parseInt(Math.random()*(customers.length - 1));
        const randomDate = getRandomDate();
        if(customers[randomNum].pets.length>0){
            checked++;
            const order = getTemplate(
                customers[randomNum]._id,
                customers[randomNum].pets[0]._id,
                randomDate
            );
            db.collection('orders').insert(order, (err, results)=>{
                if(!err){
                    inserted++;
                    if(checked==inserted){
                        console.log('inserted: ' + inserted + '/' + total);
                    }
                }; 
            });
        }
    }
};
d