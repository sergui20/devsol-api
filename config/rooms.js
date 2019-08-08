class ActiveRooms {
    constructor(){
        this.users = []
        this.rooms = []
    }

    addRoom(emitter, receiver){
        // const isAdded = this.checkIfAdded(emitter, receiver)

        // if(!isAdded) {
        // const activeEmitter = {
        //     ...emitter,
        //     room: `${emitter._id}-${receiver._id}`
        // }
        this.rooms.push(`${emitter._id}-${receiver._id}`)
        // this.users.push(activeEmitter)

        return this.rooms;
        // }

        // return this.rooms;
    }

    checkIfAdded(emitter, receiver) {
        return this.rooms.includes(`${emitter._id}-${receiver._id}`) || this.rooms.includes(`${receiver._id}-${emitter._id}`)
        // return this.usersID.includes(id)
    }

    getRoom(emitter, receiver) {
        let room = this.rooms.filter( room =>{
            return room === `${emitter._id}-${receiver._id}` || room === `${receiver._id}-${emitter._id}`
        })[0];  

        return room;
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
    ActiveRooms
}