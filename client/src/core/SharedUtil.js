/* @ngInject */
class SharedUtil {
    static get $inject() {
        return [];
    }

    constructor() {}

    getDayName(date) {
        if (!date) {
            return;
        }
        if (!date.getDay) {
            return;
        }
        const dayNum = date.getDay();
        switch (dayNum) {
            case 0:
                return 'Sunday';
            case 1:
                return 'Monday';
            case 2:
                return 'Tuesday';
            case 3:
                return 'Wednesday';
            case 4:
                return 'Thursday';
            case 5:
                return 'Friday';
            case 6:
                return 'Saturday';
            default:
        }
    }
}

export default SharedUtil;
