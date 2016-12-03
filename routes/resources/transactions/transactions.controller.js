const AbstractController = require('../../abstract/AbstractController.js');
class TransactionsController extends AbstractController {
    constructor(){
        super();
        this.get = this.get.bind(this);
        this._payOrder = this._payOrder.bind(this);
    }
    getTemplate(req, res) {
        const template = {
            selfService_id: null,
            order_id: null,
            note: null,
            customer_id: null,
            total: null,
            paidByCash: false,
            createdAt: null
        };
        res.send(template);
    }
    
    checkout(req, res){
        if(!req.body.customer_id){
            res.json({
                message: 'no customer_id'
            });
            return;
        }
        if(!req.body.order_id && !req.body.selfService_id){
            res.json({
                message: 'no order_id or selfService_id'
            });
            return;
        }
        if(!req.body.total){
            res.json({
                message: 'no total'
            });
            return;
        }
        Object.assign(req.body,{
            paidByCash: req.body.paidByCash || true,
            isDeleted: false,
            createdAt: new Date(),
            createdBy: ((req.currentUser) ? req.currentUser._id : 'dev-test')
        });

        req.collection.update({
           order_id: req.body.order_id,
           selfService_id: req.body.selfService_id
        }, req.body, {
          upsert: true  
        }, (err) => {
            if (!err) {
                if(req.body.order_id){
                    this._payOrder(req, res);
                // } else if(req.body.selfService_id){
                //     this._paySelfService(req, res);
                } else {
                    res.statusCode = 201;
                    res.send();
                }
            } else {
                console.log(err);
                res.send({
                    message: 'fail to checkout'
                });
            }
        });
    }
    
    _payOrder(req, res){
        req.params.id = req.body.order_id;
        req.collection = req.db.collection('orders');
        req.collection.update({
            _id: req.body.order_id
        }, {
            $set: {
                isPaid: true,
                checkOutAt: new Date()
            }
        }, (err)=>{
           if(!err){
               req.lookup = {
                    from: 'transactions',
                    localField: '_id',
                    foreignField: 'order_id',
                    as: 'transactions'
                };
               this.get(req, res);
           } else {
              res.sendStatus(400);
           }
        });
    }
    
    _paySelfService(req, res){
        
    }
    
    get(req, res) {
        req.lookup = req.lookup || {};
        const query = req.collection.aggregate([
            {
                $match: {
                    _id: req.params.id,
                    isDeleted: false
                }
            },
            {
                $lookup: {
                    from: 'customers',
                    localField: 'customer_id',
                    foreignField: '_id',
                    as: 'customers'
                }
            },
            {
                $lookup: {
                    from: 'orders',
                    localField: 'order_id',
                    foreignField: '_id',
                    as: 'orders'
                }
            },
            {
                $lookup: req.lookup
            }
        ]);

        query.toArray((err, results) => {
            if (!err) {
                if (results.length > 0) {
                    res.statusCode = 200;
                    res.json(results[0]);
                } else {
                    res.sendStatus(404);
                }
            } else {
                res.sendStatus(500);
            }
        });
    }
    
}

module.exports = TransactionsController;
