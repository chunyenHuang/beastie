function themeConfig($mdThemingProvider) {
    'ngInject';
    var customBlueMap = $mdThemingProvider.extendPalette('blue', {
        'contrastDefaultColor': 'light',
        'contrastDarkColors': ['50'],
        '50': 'ffffff'
    });
    var customWhiteMap = $mdThemingProvider.extendPalette('grey', {
        'contrastDefaultColor': 'light',
        'contrastDarkColors': ['50'],
        '50': 'ffffff'
    });

    $mdThemingProvider.definePalette('customBlue', customBlueMap);
    $mdThemingProvider.definePalette('white', customWhiteMap);
    $mdThemingProvider.theme('default')
        .backgroundPalette('white')
        .primaryPalette('customBlue', {
            'default': '500',
            'hue-1': '50'
        })
        .accentPalette('green', {
            'default': '500',
            'hue-3': '700'
        });
    $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey');

}
export default themeConfig;
