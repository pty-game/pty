/*
 * The asterisks in the key are equivalent to the
 * schedule setting in crontab, i.e.
 * minute hour day month day-of-week year
 * so in the example below it will run every minute
 */

module.exports.crontab = [
  {
    cronTime: '*/3 * * * * *',
    onTick: function() {
      require('../crontab/applications-connect.js').run();
    },
    start: true
  }
];