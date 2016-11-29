import baseController from '../prototypes/listItemsBase.controller';
import template from './listItemsVaccinations.html';
import './listItemsVaccinations.styl';

const listItemsVaccinationsComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class ListItemsVaccinationsController extends baseController {
        $onInit() {
            this.type = 'vaccinations';
            this.getListItem();
            // console.log(this.listItem);
        }

        getTemplate() {
            return {
                name: null,
                description: null,
                zhName: null,
                zhDescription: null,
                rejectOrderWithinDays: 21,
                rejectOrderIfIsExpired: true,
                remindCustomerWithinDays: 60,
                isActivated: true,
                isDeleted: false
            };
        }
    }
};
export default listItemsVaccinationsComponent;
