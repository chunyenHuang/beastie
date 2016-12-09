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
                name: null,
                description: null,
                zhName: null,
                zhDescription: null,
                price: 0,
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

        addNewItem(type) {
            for (var i = 0; i < this.list.items.length; i++) {
                if (this.list.items[i].type == type) {
                    this.list.items[i].subItems;
                    if (!this.list.items[i].subItems[0].name &&
                        !this.list.items[i].subItems[0].zhName
                    ) {
                        return;
                    }
                    this.list.items[i].subItems.unshift(this.getTemplate());
                }
            }
        }
    }
};
export default listItemsSelfServicesComponent;
