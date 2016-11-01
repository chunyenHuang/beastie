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
            cache: true,
            transformResponse
        },
        delete: {
            method: 'DELETE',
            transformResponse
        },
        save: {
            method: 'POST',
            transformResponse
        },
        update: {
            method: 'PUT',
            transformResponse
        }
    };

    function transformResponse(data) {
        return;
    }
}

export default resourceConfig;
