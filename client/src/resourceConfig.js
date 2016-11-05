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
            isArray: true,
            cache: false,
            transformResponse
        },
        delete: {
            method: 'DELETE'
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
        // console.log('transformResponse');
        // console.log(typeof data);
        // console.log(data);
        if (data) {
            return angular.fromJson(data);
        }
        else return;
        // return angular.fromJson(data);
        // return [data];
    }
}

export default resourceConfig;
