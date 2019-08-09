const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const Answer = require('../models/Answer');

router.get('/serch/results/:data', async (req, res, next) => {
    const data = req.params.data;
    console.log(data)
    try {
        const users = await User.find({$or: [{name: {$regex: data, $options: "gi"}}, {username: {$regex: data, $options: "gi"}}]});
        const questions = await Post.find({$or: [{title: {$regex: new RegExp(data, 'gi')}}, {content: {$regex: data, $options: "gi"}}]});
        return res.status(200).json({
            ok: true,
            users,
            questions
        })
    } catch(err) {
        return res.status(500).json({
            ok: false,
            err
        })
    }
})

router.get('/authenticate/getuseractivity/:id', async(req, res, next) => {
    const id = req.params.id;
    try {
        const posts = await Post.find({owner: id}).sort({createdAt: -1})
        const answers = await Answer.find({owner: id}).sort({createdAt: -1})

        return res.status(200).json({
            ok: true,
            activity: {
                posts,
                answers
            }
        })
    } catch(err) {
        return res.status(500).json({
            ok: false,
            err
        })
    }
})

router.get('/posts/feed', async (req, res, next) => {
    try {
        // const posts = [];
        // req.user.friends.friendsList.forEach( async (friendID) => {
        //     console.log(friendID)
        //     const post = await Post.findById(`${friendID}`)
        //     posts.push(post)
        // });
        // const query = `{owner: {$in: ${[...req.user.friends.friendsList]}}`
        // const posts = await Post.find({owner: {$in: [req.user.friends.friendsList]}}).sort({createdAt: -1}).populate({path: 'answers', populate: {path: 'owner'}}).populate('owner')
        // const posts = await Post.find({owner: {$in: friendsID}}).sort({createdAt: -1}).populate({path: 'answers', populate: {path: 'owner'}}).populate('owner')
        // const posts = await Post.find({owner: {$in: friendsID}});
        // const posts = await Post.find({}).where('owner').in(friendsID)
        // const user = await User.findById(req.user._id).select('friends')
        // const posts = await Post.find({'owner': user.friends.friendsList})
        // console.log('pooosts', posts)

        const posts = await Post.find().sort({createdAt: -1}).populate({path: 'answers', populate: {path: 'owner'}}).populate('owner')
        console.log(posts)
        return res.status(200).json({
            ok: true,
            posts
        })
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            ok: false,
            err
        })
    }
})

router.get('/posts/public', async (req, res, next) => {
    try {
        const posts = await Post.find().sort({createdAt: -1}).populate({path: 'answers', populate: {path: 'owner'}}).populate('owner')
        return res.status(200).json({
            ok: true,
            posts
        })
    } catch(err) {
        return res.status(500).json({
            ok: false,
            err
        })
    }   
})

router.post('/post/create', async (req, res, next) => {
    const { title, content } = req.body;
    try {
        await Post.create({
            owner: req.user._id,
            title,
            content
        })

        return res.json({
            ok: true,
            message: 'Post succesfully created'
        })
    } catch(err) {
        return res.status(500).json({
            ok: false,
            err
        })
    }
})

router.put('/post/update', async (req, res, next) => {
    const { id, title, content } = req.body;
    try {
        await Post.findByIdAndUpdate(id, {title, content})
        res.json({
            ok: true,
            message: 'Post updated'
        })
    } catch(err) {
        res.status(500).json({
            ok: false,
            err
        })
    }
})

router.delete('/post/delete/:id', async (req, res, next) => {
    const id = req.params.id;

    try {
        await Post.findByIdAndRemove(id)
        return res.json({
            ok: true,
            message: 'Post deleted'
        })
    } catch(err) {
        return res.status(500).json({
            ok: false,
            err
        })
    }    
})

router.get('/answers/:postID', async (req, res, next) => {
    const postID = req.params.postID;
    try {
        const answers = await Answer.find({post: postID}).populate('owner')

        return res.status(200).json({
            ok: true,
            answers
        })
    } catch(err) {
        return res.status(500).json({
            ok: false,
            err
        })
    }
})

router.post('/answer/create', async (req, res, next) => {
    const { post, content } = req.body;
    try {
        const answer = await Answer.create({
            owner: req.user._id,
            post,
            content
        });

        await Post.findByIdAndUpdate(post, {$push: {answers: answer._id}})

        return res.status(200).json({
            ok: true,
            message: 'Answer created'
        })
    } catch(err) {
        return res.status(500).json({
            ok: false,
            err
        })
    }
})

router.delete('/answer/delete/:id', async (req, res, next) => {
    const id = req.params.id;
    
    try {
        const answer = await Answer.findByIdAndRemove(id)
        console.log(answer)
        await Post.findByIdAndUpdate(answer.post, {$pull: {answers: answer._id}})
    
        return res.status(200).json({
            ok: true,
            message: 'Answer deleted'
        })
    } catch(err) {
        return res.status(500).json({
            ok: false,
            err
        })
    }
})

router.get('/post/:id', async (req, res, next) => {
    const id = req.params.id;

    try {
        const post = await Post.findById(id).populate('owner').populate({path: 'answers', populate: {path: 'owner'}})

        return res.json({
            ok: true,
            post
        })
    } catch(err) {
        return res.status(500).json({
            ok: false,
            err
        })
    }
})

router.post('/friend/add/:id', async (req, res, next) => {
    const friendID = req.params.id
    try {
        await User.findByIdAndUpdate(req.user._id, {$push: {'friends.outcomingRequests': friendID}});
        await User.findByIdAndUpdate(friendID, {$push: {'friends.incomingRequests': req.user._id}});

        return res.status(200).json({
            ok: true,
            message: 'Friend added'
        })
    } catch(err) {
        return res.status(500).json({
            ok: false,
            err
        })
    }
});

router.post('/friend/remove/:id', async (req, res, next) => {
    const friendID = req.params.id;
    console.log('get the friend id', friendID)
    try {
        await User.findByIdAndUpdate(req.user._id, {$pull: {'friends.outcomingRequests': friendID}});
        await User.findByIdAndUpdate(req.user._id, {$pull: {'friends.friendsList': friendID}});
        await User.findByIdAndUpdate(friendID, {$pull: {'friends.incomingRequests': req.user._id}});
        await User.findByIdAndUpdate(friendID, {$pull: {'friends.friendsList': req.user._id}});


        // await User.findByIdAndUpdate(req.user._id, {$pull: {'friends.friendsList': friendID}});
        // await User.findByIdAndUpdate(friendID, {$pull: {'friends.friendsList': req.user._id}});

        return res.status(200).json({
            ok: true,
            message: 'Friend removed'
        })

    } catch(err) {
        return res.status(500).json({
            ok: false,
            err
        })
    }
});

router.post('/friend/accept/:id', async (req, res, next) => {
    const friendID = req.params.id;
    try {
        await User.findByIdAndUpdate(req.user._id, {$pull: {'friends.incomingRequests': friendID}, $push: {'friends.friendsList': friendID}})
        await User.findByIdAndUpdate(friendID, {$pull: {'friends.outcomingRequests': req.user._id}, $push: {'friends.friendsList': req.user._id}})

        return res.status(200).json({
            ok: true,
            message: 'Friend added'
        })
    } catch(err) {
        return res.status(500).json({
            ok: false,
            err
        })
    }
})

router.post('/friend/denied/:id', async (req, res, next) => {
    const friendID = req.params.id;
    try {
        await User.findByIdAndUpdate(req.user._id, {$pull: {'friends.incomingRequests': friendID}})
        await User.findByIdAndUpdate(friendID, {$pull: {'friends.outcomingRequests': req.user._id}})

        return res.status(200).json({
            ok: true,
            message: 'Friend dont added'
        })
    } catch(err) {
        return res.status(500).json({
            ok: false,
            err
        })
    }
})

module.exports = router;
