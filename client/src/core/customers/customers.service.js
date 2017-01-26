/* @ngInject */
class customersService {
    static get $inject() {
        return ['$resource'];
    }
    constructor($resource) {
        const service = $resource('/customers/:id', {
            id: '@id'
        }, {
            getWithPets: {
                method: 'GET',
                url: '/customers/:id/pets',
                params: {
                    id: '@id'
                }
            },
            checkIn: {
                method: 'GET',
                url: '/customerCheckIn/:phone',
                isArray: true,
                params: {
                    phone: '@phone'
                }
            }
        });
        for(let prop in service) {
            this[prop] = service[prop];
        }
    }

    getCache(){
        if(!this.customers){
            return new Promise((resolve)=>{
                this.query({}, (customers)=>{
                    this.customers = customers;
                    resolve(this.customers);
                });
            });
        } else {
            return new Promise((resolve)=>{
                resolve(this.customers);
            });
        }
    }

}

export default customersService;
