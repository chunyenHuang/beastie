/* @ngInject */
class SharedUtil {
    static get $inject() {
        return [];
    }

    constructor() {

    }

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

    _parseDate(dateString) {
        const newDateString = new Date(dateString);
        dateString = new Date(
            newDateString.getFullYear(),
            newDateString.getMonth(),
            newDateString.getDate()
        );
        return dateString;
    }

    isWithinToday(dateString) {
        const target = new Date(dateString).getTime();
        const today = new Date();
        const todayStartAt = this._parseDate(today).getTime();
        const todayEndAt = this._parseDate(new Date(today.getTime() + 24 * 60 * 60 * 1000)).getTime();
        if (
            target > todayStartAt &&
            target < todayEndAt
        ) {
            return true;
        } else {
            return false;
        }
    }

    daysBetweenParsedDate(d1, d2) {
        d2 = d2 || new Date();
        let diff = this._parseDate(d1).valueOf() - this._parseDate(d2).valueOf();
        return diff / 8.64e+7;
    }

    // daysBetween(pastDate, otherDate) {
    //     // 1 day = 8.64e+7 milliseconds
    //     if (otherDate) {
    //         let diff = pastDate.valueOf() - otherDate.valueOf();
    //         return diff / 8.64e+7;
    //     } else {
    //         let diffNow = pastDate.valueOf() - Date.now();
    //         return diffNow / 8.64e+7;
    //     }
    // }

    daysBetween(from, to) {
        const oneDay = 24 * 60 * 60 * 1000;
        from = new Date(from);
        to = to || new Date();
        const diff = Math.round((from.getTime() - to.getTime()) / (oneDay));
        return diff;
    }

    isToday(date) {
        if (date) {
            return (new Date(date).toDateString() === new Date().toDateString());
        } else {
            return false;
        }
    }
    capitalizeStr(str) {
        let strArr = str.split(' ');
        let capStrArr = [];
        for (let i=0, j=strArr.length; i<j; i++) {
            let capStr = strArr[i].charAt(0).toUpperCase() + strArr[i].slice(1).toLowerCase();
            capStrArr.push(capStr);
        }
        return capStrArr.join(' ');
    }
}

export default SharedUtil;
