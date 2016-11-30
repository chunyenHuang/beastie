import baseController from '../prototypes/listItemsBase.controller';

import template from './listItemsSelfServices.html';
import './listItemsSelfServices.styl';

const listItemsSelfServicesComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class ListItemsSelfServicesController extends baseController {

        $onInit() {
            this.type = 'selfServices';
            this.getListItem();
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

        getByType(type) {
            if(!this.list){
                return;
            }
            // console.log(this.list.items);
            for (var i = 0; i < this.list.items.length; i++) {
                if (this.list.items[i].type == type) {
                    return this.list.items[i].subItems;
                }
            }
        }
    }
};
export default listItemsSelfServicesComponent;
