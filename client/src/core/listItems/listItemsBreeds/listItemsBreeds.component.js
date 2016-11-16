import baseController from '../prototypes/listItemsBase.controller';

import template from './listItemsBreeds.html';
import './listItemsBreeds.styl';

const listItemsBreedsComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class ListItemsBreedsController extends baseController {
        $onInit(){
            this.type = 'breeds';
            this.getListItem();
            console.log(this.list);
        }

        getTemplate() {
            return {
                name: null,
                zhName: null,
                zhDescription: null,
                img: null,
                isDeleted: false
            };
        }

    }
};
export default listItemsBreedsComponent;
