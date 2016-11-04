function resourceConfig(
    $resourceProvider
) {
    'ngInject';
    // Configure default resource actions.
    $resourceProvider.defaults.stripTrailingSlashes = true;
    $resourceProvider.defaults.actions = {
        get: {
            method: 'GET',
            transformResponse
        },
        query: {
            method: 'GET',
            isArray: true,
            cache: false,
            transformResponse
        },
        delete: {
            method: 'DELETE',
            transformResponse
        },
        save: {
            method: 'POST',
            transformSend
        },
        update: {
            method: 'PUT',
            transformSend
        }
    };

    function transformSend(data){
        return angular.toJson(data);
    }

    function transformResponse(data) {
        return angular.fromJson(data);
    }
}

export default resourceConfig;
