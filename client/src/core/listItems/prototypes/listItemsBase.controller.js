export default class ListItemsBaseController {
    static get $inject() {
        return [
            '$log', '$timeout', '$state', '$stateParams',
            'ListItems'
        ];
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

    // $onInit() {
    //     this.getListItem();
    // }

    getListItem(type) {
        type = type || this.type;
        this.ListItems.query({
            type: type
        }, (list) => {
            this.list = list[0];
            console.log(this.list);
            console.log(this.list.items);
        });
    }

    addNewItem() {
        if (!this.list.items[0].name &&
            !this.list.items[0].zhName
        ) {
            return;
        }

        const template = this.getTemplate();
        this.list.items.unshift(template);
    }

    getTemplate() {
        return {
            name: null,
            zhName: null,
            isActivated: true,
            isDeleted: false
        };
    }

    reset() {
        this.getListItem();
    }

    update() {
        this.list.$update({
            id: this.list._id
        }, (res) => {
            console.log(res);
        });
    }
}
