function iconConfig ($mdIconProvider) {
    'ngInject';
    $mdIconProvider
        .defaultIconSet('/assets/svg/mdi.svg')
        .defaultViewBoxSize(16);
}

export default iconConfig;
