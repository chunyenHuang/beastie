const appFilters = angular
    .module('beastie.core.filters', [])
    .filter('tel', function () {
        return function (tel) {
            if (!tel) {
                return '';
            }

            const value = tel.toString().trim().replace(/^\+/, '');
            if (value.match(/[^0-9]/)) {
                return tel;
            }
            let country = '',
                city = value.slice(0, 3),
                number = value.slice(3);
            number = number.slice(0, 3) + '-' + number.slice(3);
            return (country + ' (' + city + ') ' + number).trim();
        };
    })
    .name;

export default appFilters;
