class Notifications {
    constructor(){
        this.notifications = [];
    }

    addNotification(type, userEmitter, userReceiver){
        // All are ids
        let notification = {
            type,
            userEmitter,
            userReceiver
        }

        this.notifications.push(notification);

        return this.notifications;
    }

    getNotification(id) {
        let notification = this.notifications.filter( el =>{
            return el.id === id
        })[0];  

        return notification;
    }

    getAllNotifications(){
        return this.notifications
    }

    // getNotificationsByUser(id) {

    // }

    // getUsersByGroup(sala){
    //     let roomUsers = this.users.filter(user => {
    //         return user.room === sala
    //     })

    //     return roomUsers
    // }

    removeNotification(userID, friendID){

        // let removedNotification = this.getNotification(id);

        this.notifications = this.notifications.filter( notificaton =>{
            return notificaton.userEmitter != userID && notificaton.userReceiver != friendID
        })

        return this.notifications
        // return removedNotification;
    }
}

module.exports = {
    Notifications
}