var CronJob = require('cron').CronJob;
var passport = require('passport');
var FacebookTokenStrategy = require('passport-facebook-token');
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
  passport.use(new FacebookTokenStrategy({
      clientID: '936254193109591',
      clientSecret: '259b9ae40c5ae04d5e3d88b02ddf59f5',
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOrCreate({login: profile.id}, {login: profile.id}, function(err, user) {
        done(err, user);
      });
    }
  ));

  sails.config.crontab.forEach(function(crontab) {
    new CronJob(crontab(sails));
  });

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
  ]).then(function() {
    cb()
  }, function(err) {
    cb();
  })
};
