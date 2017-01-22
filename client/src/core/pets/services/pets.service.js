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
                    if (!res || res == 'Not Found') {
                        return;
                    }
                    res = angular.fromJson(res);
                    res.birthday = new Date(res.birthday);
                    for (var i = 0; i < res.vaccinations.length; i++) {
                        res.vaccinations[i].issuedAt = new Date(res.vaccinations[i].issuedAt);
                        res.vaccinations[i].expiredAt = new Date(res.vaccinations[i].expiredAt);
                    }
                    // console.warn(res);
                    return res;
                }
            },
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
                    return formData;
                }
            },
            uploadVaccinationDocuments: {
                method: 'PUT',
                url: '/pets/:id/uploadVaccinationDocuments',
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
                    return formData;
                }
            }
        });
        return Pets;
    }
}

export default petsService;
