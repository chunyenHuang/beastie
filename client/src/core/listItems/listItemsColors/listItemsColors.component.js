import baseController from '../prototypes/listItemsBase.controller';
import template from './listItemsColors.html';
import './listItemsColors.styl';

const listItemsColorsComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class ListItemsColorsController extends baseController{
        $onInit(){
            this.type = 'colors';
            this.getListItem();
            console.log(this.list);
        }

        getTemplate() {
            return {
                name: null,
                zhName: null,
                value: null,
                isDeleted: false
            };
        }
    }
};
export default listItemsColorsComponent;
