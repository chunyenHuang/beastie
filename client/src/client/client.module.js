import clientComponent from './client.component';
import clientService from './services/client.service';
import customersCheckInComponent from './customersCheckIn';
import customersFormComponent from './customersForm';
import petsFormComponent from './petsForm';
import dashboardComponent from './dashboard';
import signature from './signature';
import selfServiceForm from './selfServiceForm';

const clientModule = angular
    .module('beastie.client', [
        // customers,
        signature
    ])
    .component('client', clientComponent)
    .component('clientDashboard', dashboardComponent)
    .component('clientCustomersCheckIn', customersCheckInComponent)
    .component('clientCustomersForm', customersFormComponent)
    .component('clientPetsForm', petsFormComponent)
    .component('clientSelfServiceForm', selfServiceForm)
    .service('Client', clientService)
    .config(($stateProvider) => {
        'ngInject';
        $stateProvider
            .state('client', {
                url: '/client',
                template: '<client layout="column" flex></client>'
            })
            .state('client.dashboard', {
                url: '/dashboard?customer_id',
                template: '<client-dashboard flex layout="column"></client-dashboard>'
            })
            .state('client.customersCheckIn', {
                url: '/customersCheckIn',
                template: `
                    <client-customers-check-in layout="column"flex></client-customers-check-in>
                `
            })
            .state('client.customersForm', {
                url: '/customersForm?customer_id&phoneNumber',
                template: '<client-customers-form layout="column" flex></client-customers-form>'
            })
            .state('client.petsForm', {
                url: '/petsForm?pet_id&customer_id',
                template: '<client-pets-form flex layout="column"></client-pets-form>'
            })
            .state('client.selfServiceForm', {
                url: '/selfServiceForm?customer_id',
                template: `
                <client-self-service-form flex layout="column"></client-self-service-form>
                `
            })


        ;
    })
    .config(($translatePartialLoaderProvider) => {
        'ngInject';
        $translatePartialLoaderProvider.addPart('client');
    })

.name;

export default clientModule;
