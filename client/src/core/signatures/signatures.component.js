import template from './signatures.html';
import './signatures.styl';

const signaturesComponent = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class SignaturesController {
        static get $inject() {
            return [
                '$log', '$timeout', '$state', '$stateParams',
                'ShowSignaturesDialog'
            ];
        }
        constructor(
            $log, $timeout, $state, $stateParams,
            ShowSignaturesDialog
         ) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.ShowSignaturesDialog = ShowSignaturesDialog;
        }
        $onInit(){
            this.ShowSignaturesDialog({
                customer_id: '58152d8bb22d21700cb8d85f',
                order_id: '581fdc340408eb2def1487bc'
            }).then(()=>{

            }, ()=>{

            })
        }
    }
};
export default signaturesComponent;
