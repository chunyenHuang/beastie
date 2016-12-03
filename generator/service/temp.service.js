/* @ngInject */
class <%= upCaseName %>Service {
    static get $inject() {
        return ['$resource', '$cacheFactory', 'apiConstants'];
    }
    constructor($resource, $cacheFactory, apiConstants) {
        this.name = '<%= name %>';
        this.cacheName = 'eplanCache-<%= name %>';
        this.CacheFactory = $cacheFactory.get(this.cacheName) ?
            $cacheFactory.get(this.cacheName) :
            $cacheFactory(this.cacheName);
        const transformResponseAndUpdateCache = (response) => {
            response = angular.fromJson(response);
            const responseData = response.data;
            if (!response.success) {
                return responseData;
            }
            const datas = this.CacheFactory.get(this.cacheName);
            let updated = false;
            let deletePos = -1;
            for (var i = 0; i < datas.length; i++) {
                if (datas[i].id == responseData.id) {
                    if (responseData.deletedAt) {
                        deletePos = i;
                    } else {
                        Object.assign(datas[i], responseData);
                    }
                    updated = true;
                    break;
                }
            }
            // create
            if (!updated) {
                datas.push(responseData);
            }
            // delete
            if (deletePos >= 0) {
                datas.splice(deletePos, 1);
            }
            this.CacheFactory.put(this.cacheName, datas);
            return responseData;
        };

        const url = apiConstants.resourceApi + '<%= name %>/:id';
        const service = $resource(url, {
            id: '@id'
        }, {
            save: {
                method: 'POST',
                transformResponse: transformResponseAndUpdateCache

            },
            update: {
                method: 'PUT',
                transformResponse: transformResponseAndUpdateCache

            },
            delete: {
                method: 'DELETE',
                transformResponse: transformResponseAndUpdateCache
            }
        });
        // load into service
        service.$cacheFactory = $cacheFactory;
        for (let prop in service) {
            this[prop] = service[prop];
        }
    }
    /*
        this.Service.getCache().then(()=>{}, ()=>{});
    */
    getCache(force) {
        if (!this.CacheFactory.get(this.cacheName) || force) {
            return this._setCache();
        } else {
            return this.CacheFactory.get(this.cacheName).$promise;
        }
    }

    _setCache() {
        return new Promise((resolve) => {
            this.query().$promise.then((data) => {
                this.CacheFactory.put(this.cacheName, data);
                resolve(this.CacheFactory.get(this.cacheName));
            });
        });
    }
}

export default <%= upCaseName %>Service;
