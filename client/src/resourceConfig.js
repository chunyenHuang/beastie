function resourceConfig(
    $resourceProvider
) {
    'ngInject';
    // Configure default resource actions.
    // $resourceProvider.defaults.stripTrailingSlashes = true;
    $resourceProvider.defaults.actions = {
        get: {
            method: 'GET'
        },
        query: {
            method: 'GET',
            isArray: true
        },
        delete: {
            method: 'DELETE'
        },
        save: {
            method: 'POST'
        },
        update: {
            method: 'PUT'
        }
    };
}

export default resourceConfig;
