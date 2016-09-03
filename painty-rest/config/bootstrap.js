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
  sails.config.crontab.forEach(function(crontab) {
    try {
      new CronJob(crontab(sails));
    } catch(error) {
      throw error
    }
  });

  var users = [
    {
      id: 1,
      login: 34363467
    },
    {
      id: 2,
      login: 2123123
    },
    {
      id: 3,
      login: 211323
    },
    {
      id: 4,
      login: 12123
    },
    {
      id: 5,
      login: 675675
    },
    {
      id: 6,
      login: 6755
    }
  ];

  var tasks = [
    {
      id: 1,
      name: 'house'
    },
    {
      id: 2,
      name: 'universe'
    },
    {
      id: 3,
      name: 'beard'
    }
  ];

  Promise.all([
    Task.create(tasks),
    User.create(users)
  ]).then(function() {
    cb()
  }, function(err) {
    cb();
  })
};
