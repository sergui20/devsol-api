// const mongoose = require('mongoose');
const {io} = require('../app');
// const User = require('../models/User');
const { OnlineUsers } = require('../config/users');
const { Notifications } = require('../config/notifications');
const { ActiveRooms } = require('../config/rooms');
const onlineUsers = new OnlineUsers();
const notifications = new Notifications();
const activeRooms = new ActiveRooms();

io.on('connection', (client) => {
    client.on('web:online', (user) => {
        // Add online users and get all the online users
        if(user) {
            const activeUsers = onlineUsers.addUser(client.id, user._id, user.name, user.username, user.img)
            console.log('hey', activeUsers)
            io.emit('loginEvent', activeUsers)
        }
    })

    client.on('newFriendRequest', (users) => {
        const newNotifications = notifications.addNotification('friend', users.user._id, users.friendID)
        // console.log(newNotifications)
        io.emit('friendNotification', newNotifications)
    })

    client.on('acceptFriendRequest', (users) => {
        const newNotifications = notifications.removeNotification(users.user._id, users.friend._id)
        io.emit('friendNotification', newNotifications)

        const activeUsers = onlineUsers.getAllUsers()
        io.emit('loginEvent', activeUsers)
    })

    client.on('removedFriendRequest', (users) => {
        const newNotifications = notifications.removeNotification(users.user._id, users.friend._id)
        io.emit('friendNotification', newNotifications)
    })

    client.on('logoutEvent', (user) => {
        console.log('hey disconnected', user)
        const activeUsers = onlineUsers.removeUser(user._id);
        io.emit('userDisconnect', activeUsers)        
    })

    client.on('chat:online', (users, cb) => {
        if(activeRooms.checkIfAdded(users.emitter, users.receiver)) {
            const room = activeRooms.getRoom(users.emitter, users.receiver)
            console.log('room exists', room)
            client.join(room)
            cb(room)
        } else {
            activeRooms.addRoom(users.emitter, users.receiver)
            const room = activeRooms.getRoom(users.emitter, users.receiver)
            console.log('new room', room)
            client.join(room)
            cb(room)
        }
    })

    // client.on('chat:online', (users) => {
    //     const { emitter, receiver } = users
    //     if(activeRooms.checkIfAdded(emitter, receiver)) {
    //         const room = activeRooms.getRoom(emitter, receiver)
    //         client.join(room)
    //         client.broadcast.to(room).emit('active:user', users.getUsersByGroup(user.sala) )
    //     } else {
    //         activeRooms.addRoom(emitter, receiver)
    //         client.join(`${users.emitter._id}-${users.receiver._id}`)
    //     }
    //     // client.join(`${users.emitter}-${users.receiver}`)
    //     client.broadcast.to(user.sala).emit('loginEvent', users.getUsersByGroup(user.sala) )
    //     client.broadcast.to(user.sala).emit('sendMessage', createMessage('Admin', `${user.nombre} se ha unido`));
    // })
});
