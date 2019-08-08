const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

router.post('/authenticate/login', (req, res, next) => {
    passport.authenticate('local-login', (err, user, info) => {
        if(err) {
            res.status(500).json({
                message: 'Something went wrong authenticating user'
            })
        }

        if (!user) {
            res.status(401).json(info);
        }

        req.login(user, (err) => {
            if (err) {
                res.status(500).json({ message: 'Session save went bad.' });
                return;
            }

            res.status(200).json({ok: true, user});
        });
    })(req, res, next)
})

router.post('/authenticate/signup', (req, res, next) => {
    passport.authenticate('local-signup', (err, user, info) => {
        if(err) {
            console.log(err)
            res.status(500).json({
                message: 'Something went wrong authenticating user'
            })
        }

        if (!user) {
            res.status(401).json(info);
        }

        req.login(user, (err) => {
            if (err) {
                res.status(500).json({ message: 'Session save went bad.' });
                return;
            }

            res.status(200).json({ok: true, user});
        });
    })(req, res, next)
});

router.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/auth/github/callback', passport.authenticate('github', {
    successRedirect: "/feed",
    failureRedirect: '/'
}));

// router.get('/auth/github/callback', (req, res, next) => {
//     passport.authenticate('github', (err, user, info) => {
//         if(err) {
//             res.status(500).json({
//                 message: 'Something went wrong authenticating user'
//             })
//         }

//         if (!user) {
//             res.status(401).json(info);
//         }

//         req.login(user, (err) => {
//             if (err) {
//                 res.status(500).json({ message: 'Session save went bad.' });
//                 return;
//             }

//             res.status(200).json({ok: true, user});
//         });
//     })(req, res, next)
// })

router.post('/authenticate/logout', (req, res, next) => {
    req.logout();
    res.status(200).json({ message: 'Log out success!' });
});

router.get('/authenticate/getcurrentuser', async (req, res, next) => {
    if(req.user) {
        const user = await User.findById(req.user._id).populate({path: 'friends.incomingRequests', select: 'name'}).populate({path: 'friends.friendsList'})
        const friendsIDs =  await User.findById(req.user._id).select('friends.friendsList')
        console.log('friends', friendsIDs)
    
        return res.json({
            ok: true,
            user,
            friendsIDs: friendsIDs.friends.friendsList
        })
    } else {
        return res.json({
            ok: false,
            user: ''
        })
    }
})

router.get('/authenticate/getuser/:id', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)

        return res.status(200).json({
            ok: true,
            user
        })
    } catch(err) {
        return res.status(500).json({
            ok: false,
            err
        })
    }
})

router.put('/authenticate/updateuser/', async (req, res, next) => {
    const { name, username, email } =  req.body;
    try {
        await User.findByIdAndUpdate(req.user._id, {name, username, email})

        return res.status(200).json({
            ok: true,
            message: 'User updated succesfully'
        })
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            ok: false,
            err
        })
    }
})

module.exports = router