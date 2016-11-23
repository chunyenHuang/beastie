import baseController from '../prototypes/listItemsBase.controller';

import template from './listItemsServices.html';
import './listItemsServices.styl';

const listItemsServicesComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class ListItemsServicesController extends baseController {

        $onInit() {
            this.type = 'services';
            this.getListItem();
            // console.log(this.listItem);
        }

        getTemplate() {
            return {
                name: ' ',
                description: null,
                zhName: null,
                zhDescription: null,
                price: null,
                estimatedHours: 1,
                isActivated: true,
                isDeleted: false
            };
        }
    }
};
export default listItemsServicesComponent;
