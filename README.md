passport-infusionsoft
==============

[Passport](https://github.com/jaredhanson/passport) Authentication Strategy for [Infusionsoft's API](https://developer.infusionsoft.com/) using OAuth2



## Installation

    $ npm install @pirateandfox/passport-infusionsoft

## Usage

#### Authorization (the much more likely use case)


#### Authentication Configuration Strategy

The Infusionsoft authentication strategy authenticates users using an Infusionsoft account and
OAuth tokens.  The strategy requires a `verify` callback, which accepts these
credentials and calls `done` providing a user, as well as `options` specifying a
client id , client secret, and callback URL.

    passport.use(new InfusionsoftStrategy({
        clientID: '1234567890123',
        clientSecret: '5ddf23ae77cbe6bff02430f8f37c4900'
        callbackURL: 'https://www.example.com/auth/infusionsoft/callback'
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ userId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));


#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'Infusionsoft'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/infusionsoft',
      passport.authenticate('Infusionsoft'),
      function(req, res){
        // The request will be redirected to infusionsoft.com for authentication, so this
        // function will not be called.
      });

    app.get('/auth/infusionsoft/callback',
      passport.authenticate('Infusionsoft', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Credits
  - Forked from [andrewgbliss/passport-infusionsoft](https://github.com/andrewgbliss/passport-infusionsoft)

## Thanks
  - [Jared Hanson](https://github.com/jaredhanson)
