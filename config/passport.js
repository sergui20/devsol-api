const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/User');
const GitHubStrategy = require('passport-github').Strategy
// const nodemailer = require('./nodemailer');

passport.serializeUser(function (user, done) {
    console.log('User serialize: ', user)
    done(null, user.id)
})

passport.deserializeUser(function (id, done) {
    console.log('ID deserialize: ', id)
    User.findById(id, function (err, user) {
        done(err, user)
    });
});

// For Signup
passport.use('local-signup', new LocalStrategy({
    passReqToCallback: true
}, async function(req, username, password, done){
    const { name, email } = req.body;

    try {
        const userDB = await User.findOne({$or: [{email}, {username}]})
    
        if(userDB) {
            if(userDB.username === username && userDB.email === email) {
                done(null, false, { message: 'Email and usernaname already taken' })
            } else if(userDB.username === username) {
                done(null, false, { message: 'Username already taken' })
            } else if(userDB.email === email) {
                done(null, false, { message: 'Email already taken' })
            }
        } else {
    
            let newUser = new User()
            newUser.name = name;
            newUser.username = username;
            newUser.email = email;
            newUser.password = newUser.generateHash(password);
            
            await newUser.save();
            done(null, newUser)

            // nodemailer.sendMail({
            //     from: 'Newsify DONOTREPLY',
            //     to: newUser.email,
            //     subject: 'Your email has been used to signup to Newsify',
            //     html: `<div><h2>Welcome to Newsify</h2><p>Thank you ${newUser.name}. Enjoy seeing news !</div>`
            // })
            // .then(res => {
            //     console.log(res)
            //     return done(null, newUser)
            // })
            // .catch(err => {
            //     console.log(err)
            // })
        }
    
    } catch(err) {
        done(err)
    }
}))

// For Login
passport.use('local-login', new LocalStrategy(async function(username, password, done) {
    try {
        const userDB = await User.findOne({$or: [{email: username}, {username}]}).populate({path: 'friends.incomingRequests', select: 'name'})

        if(!userDB) {
            return done(null, false, {message: 'User not found. Please Signup'})
        }

        if(!userDB.validatePassword(password)) {
            return done(null, false, {message: 'Incorrect email or password'})
        }

        return done(null, userDB)
    } catch(err) {
        done(err)
    }
}))

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
    }, async function(accessToken, refreshToken, profile, done) {
        const email = profile._json.email;
        const id = profile.id
        try {
            const userDB = await User.findOne({'github.id': id });
            if(userDB) {
                done(null, userDB)
            } else {
                const newUser = new User();
                newUser.name = profile._json.name;
                if(email) {
                    newUser.email = email;
                }
                newUser.username = profile.username
                newUser.img = profile.photos[0].value
                newUser.github.id = id
                newUser.github.authenticated = true;

                await newUser.save();
                return done(null, newUser)

                // nodemailer.sendMail({
                //     from: 'Newsify DONOTREPLY',
                //     to: newUser.email,
                //     subject: 'Your email has been used to signup to Newsify',
                //     html: `<div><h2>Welcome to Newsify</h2><p>Thank you ${newUser.name}. Enjoy seeing news !</div>`
                // })

                // await newUser.save()

                // .then(res => {
                //     console.log(res)
                //     return done(null, newUser)
                // })
                // .catch(err => {
                //     console.log(err)
                // })
            }
        } catch(err) {
            done(err)
        }
    }
));

// Linkedin OAuth
// passport.use(new LinkedInStrategy({
//     clientID: process.env.LINKEDIN_KEY,
//     clientSecret: process.env.LINKEDIN_SECRET,
//     callbackURL: "/auth/linkedin/callback",
//     scope: ['r_emailaddress', 'r_liteprofile'],
// }, async function(accessToken, refreshToken, profile, done) {
    // console.log(profile)
    // const email = profile.emails[0].value;
    // try {
    //     const userDB = await User.findOne({email});

    //     if(userDB) {
    //         done(null, userDB)
    //     } else {
    //         console.log(profile._json.profilePicture)
    //         const newUser = new User();
    //         newUser.name = profile.displayName;
    //         newUser.email = email;
    //         newUser.img = profile.photos[0].value
    //         newUser.linkedin = true;

    //         // nodemailer.sendMail({
    //         //     from: 'Newsify DONOTREPLY',
    //         //     to: newUser.email,
    //         //     subject: 'Your email has been used to signup to Newsify',
    //         //     html: `<div><h2>Welcome to Newsify</h2><p>Thank you ${newUser.name}. Enjoy seeing news !</div>`
    //         // })

    //         // await newUser.save()

    //         // .then(res => {
    //         //     console.log(res)
    //         //     return done(null, newUser)
    //         // })
    //         // .catch(err => {
    //         //     console.log(err)
    //         // })
    //     }

    // } catch(err) {
    //     done(err)
    // }
// }));