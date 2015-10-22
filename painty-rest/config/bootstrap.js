var CronJob = require('cron').CronJob;

/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  // add the lines from here

  sails.config.crontab.forEach(function(crontab) {
    try {
      new CronJob(crontab);
    } catch(error) {
      console.log(error)
    }
  });
  // add the lines until here

  var users = [
    {
      id: 1,
      login: 34363467,
      level: 1
    },
    {
      id: 2,
      login: 2123123,
      level: 3
    },
    {
      id: 3,
      login: 211323,
      level: 4
    },
    {
      id: 4,
      login: 12123,
      level: 0
    },
    {
      id: 5,
      login: 675675,
      level: 10
    },
    {
      id: 6,
      login: 6755,
      level: 10
    }
  ]

  User.create(users).then(function(users) {
    cb();
  }, function() {
    cb()
  })
};
