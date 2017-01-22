function themeConfig($mdThemingProvider, $mdInkRippleProvider) {
    'ngInject';
    $mdInkRippleProvider.disableInkRipple();

    const customMap = $mdThemingProvider.extendPalette('brown', {
        'contrastDefaultColor': 'light',
        'contrastDarkColors': ['50'],
        '50': 'ffffff'
    });
    const customWhiteMap = $mdThemingProvider.extendPalette('grey', {
        'contrastDefaultColor': 'light',
        'contrastDarkColors': ['50'],
        '50': 'ffffff'
    });

    $mdThemingProvider.definePalette('custom', customMap);
    $mdThemingProvider.definePalette('white', customWhiteMap);
    $mdThemingProvider.theme('default')
        .backgroundPalette('white')
        .primaryPalette('custom', {
            'default': '700',
            'hue-1': '300',
            'hue-2': '500'

        })
        .accentPalette('green', {
            'default': '500',
            'hue-1': '100',
            'hue-3': '700'
        });
    $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey');
    $mdThemingProvider.theme('altTheme')
        .primaryPalette('grey', {
            'default': '600',
            'hue-2': '800'
        });

}
export default themeConfig;
