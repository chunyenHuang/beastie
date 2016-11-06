import baseController from '../prototypes/listItemsBase.controller';

import template from './listItemsWaivers.html';
import './listItemsWaivers.styl';

const listItemsWaiversComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class ListItemsWaiversController extends baseController {
        $onInit() {
            this.type = 'waivers';
            this.getListItem();
            // console.log(this.listItem);
        }

        getTemplate() {
            return {
                name: null,
                description: null,
                zhName: null,
                zhDescription: null,
                price: null,
                isActivated: true,
                isDeleted: false
            };
        }
    }
};
export default listItemsWaiversComponent;
