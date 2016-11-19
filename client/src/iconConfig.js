function iconConfig ($mdIconProvider) {
    'ngInject';
    // https://materialdesignicons.com/
    $mdIconProvider
        .icon('beastie', '/assets/svg/beastie.svg')
        .defaultIconSet('/assets/svg/mdi.svg')
        .defaultViewBoxSize(16);
}

export default iconConfig;
