import baseController from '../prototypes/listItemsBase.controller';

import template from './listItemsCreditsPackages.html';
import './listItemsCreditsPackages.styl';

const listItemsCreditsPackagesComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class ListItemsCreditsPackagesController extends baseController {

        $onInit() {
            this.type = 'creditsPackages';
            this.getListItem();
            // console.log(this.listItem);
        }

        getTemplate() {
            return {
                name: ' ',
                description: null,
                zhName: null,
                zhDescription: null,
                total: null,
                credit: null,
                isActivated: true,
                isDeleted: false
            };
        }
    }
};
export default listItemsCreditsPackagesComponent;
