/*
 * The asterisks in the key are equivalent to the
 * schedule setting in crontab, i.e.
 * minute hour day month day-of-week year
 * so in the example below it will run every minute
 */

var applicationsConnect = require('../crontab/applications-connect.js')

module.exports.crontab = [
  {
    cronTime: '*/3 * * * * *',
    onTick: applicationsConnect,
    start: true
  }
];