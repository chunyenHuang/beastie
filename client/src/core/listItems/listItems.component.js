import template from './listItems.html';
import './listItems.styl';

const listItemsComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class ListItemsController {
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

        $onInit(){
            this.ListItems.query({}, (listItems)=>{
                this.listItems = listItems;
                console.log(this.listItems);
            });
        }

        save(list){
            list.$update({
                id: list._id
            }, (res)=>{
                console.log(res);
            });
        }
    }
};
export default listItemsComponent;
