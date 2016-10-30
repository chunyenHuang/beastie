function iconConfig ($mdIconProvider) {
    'ngInject';
    // https://materialdesignicons.com/
    $mdIconProvider
        .defaultIconSet('/assets/svg/mdi.svg')
        .defaultViewBoxSize(16);
}

export default iconConfig;
