module.exports = (name, message)=>{
    return {
        nombre: name,
        mensaje: message,
        fecha: new Date().getTime()
    }
}