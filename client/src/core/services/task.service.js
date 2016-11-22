/* @ngInject */
class taskService {
    static get $inject() {
        return ['$mdToast'];
    }
    constructor($mdToast) {
        const on = (msg)=>{
            msg = msg || 'Loading...';
            $mdToast.show(
                $mdToast.simple()
                        .textContent(msg)
                        .position('right top')
            );
        }
        const off = ()=>{
            $mdToast.hide();
        }
        return {
            on,
            off
        };
    }
}

export default taskService;
