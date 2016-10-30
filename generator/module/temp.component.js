import template from './<%= name %>.html';
import './<%= name %>.styl';

const <%= name %>Component = {
    template,
    bindings: {

    },
    controller: /* @ngInject */ class <%= upCaseName %>Controller {
        static get $inject() {
            return ['$log', '$timeout', '<%= upCaseName %>'];
        }
        constructor($log, $timeout, <%= upCaseName %>) {
            this.$log = $log;
            this.$timeout = $timeout;
            this.<%= upCaseName %> = <%= upCaseName %>;
        }
    }
};
export default <%= name %>Component;
