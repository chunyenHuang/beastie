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
    daysBetween(pastDate, otherDate ){
        // 1 day = 8.64e+7 milliseconds
        if(otherDate) {
            let diff = pastDate.valueOf() - otherDate.valueOf();
            return diff/8.64e+7;
        } else {
            let diffNow = pastDate.valueOf() - Date.now();
            return diffNow/8.64e+7;
        }
    }
}

export default SharedUtil;
