
/*
 * Schedule Backup
 * '* * * * * *'
 * You will see this message every second
 *
 * '00 30 11 * * 1-5'
 * Runs every weekday (Monday through Friday)
 * at 11:30:00 AM. It does not run on Saturday
 * or Sunday.
 */
const ScheduleBackup = ()=>{
    const path = require('path');
    const CronJob = require('cron').CronJob;

    const backupTime = [
        // '* * * * * *',
        '00 00 10 * * 0-7',
        '00 00 11 * * 0-7',
        '00 05 11 * * 0-7',
        '00 00 12 * * 0-7',
        '00 00 13 * * 0-7',
        '00 00 14 * * 0-7',
        '00 00 15 * * 0-7',
        '00 00 20 * * 0-7'
    ];
    const Backup = require(path.join(__dirname, '../scripts/backup'));
    for (var i = 0; i < backupTime.length; i++) {
        const job = new CronJob({
            cronTime: backupTime[i],
            onTick: () => {
                const today = new Date();
                console.log('----------------------------')
                console.log(today);
                console.log('----------------------------')
                Backup();
            },
            start: false,
            timeZone: 'America/Los_Angeles'
        });
        job.start();
    }
};
module.exports = ScheduleBackup;
