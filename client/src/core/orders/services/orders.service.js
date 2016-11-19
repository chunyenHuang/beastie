/* @ngInject */
class ordersService {
    static get $inject() {
        return ['$resource'];
    }
    constructor($resource) {
        const Orders = $resource('/orders/:id', {
            id: '@id'
        }, {
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
