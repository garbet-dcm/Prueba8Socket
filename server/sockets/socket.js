const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const crearMensaje = require('../utilidades/mensaje');

const usuarios = new Usuarios();

io.on('connection', (client) => {
    //((1)) - Protocolo de conexion de un usuario:
    client.on('entrarChat', (data, callback) => {
        //Se comprueba si se conecto con un nombre...
        if (!data.nombre || !data.sala) {
            callback({
                err: true,
                mensaje: 'Es necesario el nombre y sala'
            });
        }
        //...si hay nombre, se añade a la base de datos, ...
        let _usuarios = usuarios.addPersona(client.id, data.nombre, data.sala);

        //...se le añade a una sala...
        client.join(data.sala);

        //((3)) ...y se manda a todos los usuarios (de la sala) la lista de usuarios conectados
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));

        //Se mandan usuarios (de la sala) conectados en ese momento
        callback(usuarios.getPersonasPorSala(data.sala));
        //console.log(_usuarios);
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.nombre} entró al chat`));
    });

    //((4)) - Mensaje para todo el mundo
    client.on('crearMensaje', (data, callback) => {
        let _usuario = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(_usuario.nombre, data.mensaje);
        client.broadcast.to(_usuario.sala).emit('crearMensaje', mensaje);
        callback(mensaje);
    });

    //Protocolo de desconexion de un usuario:
    client.on('disconnect', () => {
        //Se borra de la base de datos
        let _usuario = usuarios.deletePersona(client.id);

        //((2)) - Se dice que X persona abandono el chat
        client.broadcast.to(_usuario.sala).emit('crearMensaje', crearMensaje('Administrador', `${_usuario.nombre} abandono el chat`));
        //((3)) - Se mandan usuarios conectados en ese momento
        client.broadcast.to(_usuario.sala).emit('listaPersona', usuarios.getPersonasPorSala(_usuario.sala));
    })

    //((5)) - Mensaje privado
    client.on('mensajePrivado', (data) => {
        let nombre = usuarios.getPersona(client.id).nombre;
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(nombre, data.mensaje));
    });
});