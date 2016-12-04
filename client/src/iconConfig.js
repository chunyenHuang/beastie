function iconConfig ($mdIconProvider) {
    'ngInject';
    // https://materialdesignicons.com/
    $mdIconProvider
        .icon('beastie', '/assets/svg/beastie.svg')
        .defaultIconSet('/assets/svg/mdi.svg')
        .defaultViewBoxSize(16);
        
        
    $mdIconProvider
        .icon('dog-saint-bernard', '/assets/svg/dog-saint-bernard.svg');
}

export default iconConfig;
