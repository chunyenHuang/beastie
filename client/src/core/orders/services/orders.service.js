/* @ngInject */
class ordersService {
    static get $inject() {
        return ['$resource'];
    }
    constructor($resource) {
        const Orders = $resource('/orders/:id', {
            id: '@id'
        }, {
            update: {
                method: 'PUT',
                url: '/orders/:id',
                parmas: {
                    id: '@id'  
                },
                transformRequest: (data) => {
                    console.log(data)
                    const cpData = Object.assign({}, data);
                    if (cpData.customers) {
                        delete cpData.customers;
                    }
                    if (cpData.pets) {
                        delete cpData.pets;
                    }
                    // {
                    //     _id: data._id,
                    //     customer_id: data.
                    //     asdasdj: (data.isActive != null ) ? data.isActive : null,
                    // });
                    console.log(cpData);
                    return angular.toJson(cpData);
                }
            },
            getByDate: {
                method: 'GET',
                url: '/ordersByDate',
                isArray: true,
                cache: false
                    // params:{
                    //     from: 'from',
                    //     to: 'to'
                    // },
            },
            getPicturesPath: {
                method: 'GET',
                url: '/orders/:id/pictures',
                isArray: true,
                cache: false,
                params: {
                    id: '@id'
                }
            },
            uploadPicture: {
                method: 'PUT',
                url: '/orders/:id/uploads',
                params: {
                    id: '@id'
                },
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: (data) => {
                    const formData = new FormData();
                    for(let prop in data){
                        formData.append(prop, data[prop]);
                    }
                    console.log(data);
                    return formData;
                }
            }

        });
        return Orders;
    }
}

export default ordersService;
