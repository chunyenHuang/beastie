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
    var newOrangeMap = $mdThemingProvider.extendPalette('orange', {
        '500': '#FF9800',
        'contrastDefaultColor': 'light'
    });
    $mdThemingProvider.definePalette('newOrange', newOrangeMap);
    $mdThemingProvider.definePalette('customBlue', customBlueMap);
    $mdThemingProvider.definePalette('white', customWhiteMap);
    $mdThemingProvider.theme('default')
        .backgroundPalette('white')
        .primaryPalette('teal', {
            'default': '500',
            'hue-1': '100',
            'hue-2': '700'
        })
        .accentPalette('newOrange', {
            'default': '500',
            'hue-3': '700'
        })
        .warnPalette('deep-orange', {
            'default': '500'
        })
    // $mdThemingProvider.theme('input', 'default')
    //     .primaryPalette('grey');

}
export default themeConfig;
