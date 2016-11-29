import template from './listItemsInhouseOrders.html';
import './listItemsInhouseOrders.styl';

const listItemsInhouseOrdersComponent = {
    template,
    bindings: {},
    controller: /* @ngInject */ class ListItemsInhouseOrdersController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams',
                'ListItems'];
        }
        constructor(
            $log, $timeout, $state, $stateParams,
            ListItems
        ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.ListItems = ListItems;
        }
        $onInit() {
            this.getListItem();
        }

        getListItem() {
            this.ListItems.query({
                type: 'inhouseOrders'
            }, (listItems) => {
                this.listItem = listItems[0];
            });
        }

        reset() {
            this.getListItem();
        }

        addNewItem() {
            if (!this.listItem.items[0].name &&
                !this.listItem.items[0].zhName
            ) {
                return;
            }

            this.listItem.items.unshift(this.getItemTemp());
        }

        getItemTemp() {
            return {
                type: 'cut',
                multiple: false,
                name: ' ',
                zhName: null,
                subItems: []
            };
        }

        addNewSubItem() {
            const pos = this.listItem.items.indexOf(this.selectedItem);
            if (
                this.listItem.items[pos].subItems.length != 0 &&
                !this.listItem.items[pos].subItems[0].name &&
                !this.listItem.items[pos].subItems[0].zhName
            ) {
                return;
            }
            this.listItem.items[pos].subItems.unshift(this.getSubItemTemp());
            // console.log(pos);
        }

        getSubItemTemp() {
            return {
                name: ' ',
                zhName: null,
                isActivated: true,
                isDeleted: false
            };
        }

        update() {
            this.listItem.$update({
                id: this.listItem._id
            }, (res) => {
                console.log(res);
            });
        }
    }
};
export default listItemsInhouseOrdersComponent;
