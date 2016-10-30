function languageConfig($translateProvider, $translatePartialLoaderProvider) {
    'ngInject';
    $translatePartialLoaderProvider.addPart('beastie');
    $translateProvider
        .useSanitizeValueStrategy('sanitize')
        .useLoader('$translatePartialLoader', {
            urlTemplate: '/assets/lang/{part}.lang_{lang}.json'
        })
        .preferredLanguage('en');
}

export default languageConfig;
