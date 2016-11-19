/* @ngInject */
class petsService {
    static get $inject() {
        return ['$resource'];
    }
    constructor($resource) {
        const Pets = $resource('/pets/:id', {
            id: '@id'
        }, {
            save: {
                method: 'POST',
                url: '/pets',
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: (data) => {
                    console.log(data);
                    const formData = new FormData();
                    for (let prop in data) {
                        if (
                            prop.indexOf('$') == -1 &&
                            prop != 'toJSON'
                        ) {
                            formData.append(prop, data[prop]);
                        }
                    }
                    return formData;
                }
            },
            update: {
                method: 'PUT',
                url: '/pets/:id',
                params: {
                    id: '@id'
                },
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: (data) => {
                    console.log(data);
                    const formData = new FormData();
                    for (let prop in data) {
                        if (
                            prop.indexOf('$') == -1 &&
                            prop != 'toJSON'
                        ) {
                            formData.append(prop, data[prop]);
                        }
                    }
                    return formData;
                }
            }

        });
        return Pets;
    }
}

export default petsService;
