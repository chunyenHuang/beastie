/* @ngInject */
class petsService {
    static get $inject() {
        return ['$resource'];
    }
    constructor($resource) {
        const Pets = $resource('/pets/:id', {
            id: '@id'
        }, {
            get: {
                method: 'GET',
                url: '/pets/:id',
                params: {
                    id: '@id'
                },
                transformResponse: (res) => {
                    res = angular.fromJson(res);
                    res.birthday = new Date(res.birthday);
                    for (var i = 0; i < res.vaccinations.length; i++) {
                        res.vaccinations[i].issuedAt = new Date(res.vaccinations[i].issuedAt);
                        res.vaccinations[i].expiredAt = new Date(res.vaccinations[i].expiredAt);
                    }
                    console.warn(res);
                    return res;
                }
            },
            // save: {
            //     method: 'POST',
            //     url: '/pets',
            //     // headers: {
            //     //     'Content-Type': undefined
            //     // },
            //     // transformRequest: (data) => {
            //     //     console.log(data);
            //     //     const formData = new FormData();
            //     //     for (let prop in data) {
            //     //         if (
            //     //             prop.indexOf('$') == -1 &&
            //     //             prop != 'toJSON'
            //     //         ) {
            //     //             formData.append(prop, data[prop]);
            //     //         }
            //     //     }
            //     //     return formData;
            //     // }
            // },
            // update: {
            //     method: 'PUT',
            //     url: '/pets/:id',
            //     params: {
            //         id: '@id'
            //     },
            //     // headers: {
            //     //     'Content-Type': undefined
            //     // },
            //     transformRequest: (data) => {
            //         // data['vaccinations'] = angular.toJson(data['vaccinations']);
            //         // data['previousHistory'] = angular.toJson(data['previousHistory']);
            //         // data['specialConditions'] = angular.toJson(data['specialConditions']);
            //         // data['additionalInstructions'] = angular.toJson(data['additionalInstructions']);
            //         console.warn(data);
            //         console.warn(angular.toJson(data));
            //         return angular.toJson(data);
            //     }
            // },
            update: {
                method: 'PUT',
                url: '/pets/:id',
                parmas: {
                    id: '@id'
                }
            },
            getPicturesPath: {
                method: 'GET',
                url: '/pets/:id/pictures',
                isArray: true,
                cache: false,
                params: {
                    id: '@id'
                }
            },
            uploadPicture: {
                method: 'PUT',
                url: '/pets/:id/uploads',
                params: {
                    id: '@id'
                },
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: (data) => {
                    const formData = new FormData();
                    for (let prop in data) {
                        formData.append(prop, data[prop]);
                    }
                    console.log(data);
                    return formData;
                }
            }


        });
        return Pets;
    }
}

export default petsService;
