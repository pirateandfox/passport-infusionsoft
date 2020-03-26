/**
 * Module dependencies.
 */
const util = require('util');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy
const InternalOAuthError = require('passport-oauth').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The Infusionsoft authentication strategy authenticates requests by delegating to
 * Infusionsoft using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Infusionsoft application's client id
 *   - `clientSecret`  your Infusionsoft application's client secret
 *   - `callbackURL`   URL to which Infusionsoft will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new InfusionsoftStrategy({
 *         clientID: '1234567890123',
 *         clientSecret: '5ddf23ae77cbe6bff02430f8f37c4900'
 *         callbackURL: 'https://www.example.com/auth/infusionsoft/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         // Find user or create.
 *          return done(null, profile);
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://signin.infusionsoft.com/app/oauth/authorize';
  options.tokenURL = options.tokenURL || 'https://api.infusionsoft.com/token';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'Infusionsoft';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from Infusionsoft.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `id`
 *   - `displayName`
 *   - `emails`
 *
 * Not sure if infusionsoft has this functionality, here is the forum post to check if it does, hopefully someone will answer
 *
 * http://community.infusionsoft.com/showthread.php/16794-How-to-get-logged-in-user-profile
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get(
    'https://api.infusionsoft.com/crm/rest/v1/oauth/connect/userinfo?access_token=' + accessToken,
    accessToken,
    function(err, body, res) {
      if (err) {
        return done(new InternalOAuthError('failed to fetch user profile', err))
      }

      try {
        var json = JSON.parse(body)
        var profile = {
          provider: 'infusionsoft',
          id: json.global_user_id.toString(),
          displayName: [json.given_name, json.middle_name, json.family_name]
            .join(' ')
            .replace('  ', ' '),
          name: {
            familyName: json.family_name,
            givenName: json.given_name,
            middleName: json.middle_name,
          },
          emails: [{ value: json.email }]
        }
        done(null, profile)
      } catch (e) {
        done(e)
      }
    },
  )
}

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
