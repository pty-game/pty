/*
 * The asterisks in the key are equivalent to the
 * schedule setting in crontab, i.e.
 * minute hour day month day-of-week year
 * so in the example below it will run every minute
 */

var applicationsConnect = require('../crontab/applications-connect.js')

module.exports.crontab = [
  function(sails) {
    return {
      cronTime: '*/' + sails.config.constants.GAME_APPLICATION_CRONTAB_TIMEOUT + ' * * * * *',
      onTick: applicationsConnect.bind(this, sails),
      start: true
    }
  }
];