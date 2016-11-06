/* @ngInject */
class settingsService {
    static get $inject() {
        return ['$resource'];
    }
    constructor($resource) {
        const Settings = $resource('/settings/:id', {id:'@id'});
        return Settings;
    }
}

export default settingsService;
