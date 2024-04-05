const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

// Passport configuration
passport.use(
    new GitHubStrategy(
        {
            clientID: '51d8d95ce67c50238175',
            clientSecret: '40bff363fe4ef261b45a33639b178f8d6265b428',
            callbackURL: "http://127.0.0.1:3000/auth/github/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
            const user = await User.findOne({ oauthId: profile.id });
            if (user) {
                return done(null, user);
            } else {
                const newUser = new User({
                    username: profile.username,
                    oauthId: profile.id,
                    oauthProvider: "Github",
                    created: Date.now(),
                });
                const savedUser = await newUser.save();
                return done(null, savedUser);
            }
        }
    )
);

module.exports = passport;
