class OnlineUsers {
    constructor(){
        this.users = [];
        this.usersID = [];
    }

    addUser(socketID, id, name, username, img){
        const isAdded = this.checkIfAdded(id)

        if(!isAdded) {
            let user = {
                socketID,
                id,
                name,
                username,
                img
            }
    
            this.users.push(user);
            this.usersID.push(id)
    
            return this.users;
        }

        return this.users;
    }

    checkIfAdded(id) {
        return this.usersID.includes(id)
    }

    getUser(id) {
        let user = this.users.filter( el =>{
            return el.id === id
        })[0];  

        return user;
    }

    getAllUsers(){
        return this.users
    }

    getAllUsersIds() {
        return this.usersID
    }

    // getUsersByGroup(sala){
    //     let roomUsers = this.users.filter(user => {
    //         return user.room === sala
    //     })

    //     return roomUsers
    // }

    removeUser(id){

        let offlineUser = this.getUser(id);

        this.users = this.users.filter( user => {
            return user.id != id
        })

        this.usersID = this.usersID.filter( userID => {
            return userID != id
        })

        return this.users;
    }
}

module.exports = {
    OnlineUsers
}