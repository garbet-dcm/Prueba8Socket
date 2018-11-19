var socket = io();

//http://localhost:3000/chat.html?nombre=CualquierNombre
var params = new URLSearchParams(window.location.search);
if ((!params.has('nombre')) || (params.get('nombre') === "") ||
    (!params.has('sala')) || (params.get('sala') === "")) {
    alert('El nombre y sala son necesarios');
    window.location = 'index.html';
}
var data_usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

// Protocolo de conexión
socket.on('connect', function() {
    console.log('Conectado al servidor');

    //((1)) - Se reciben usuarios conectados en ese momento
    socket.emit('entrarChat', data_usuario, (res) => {
        console.log('Usuarios conectados:', res);
    });
});

// Protocolo desconexión
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});


//((2))
socket.on('crearMensaje', function(mensaje) {
    console.log('Servidor:', mensaje);
});

//((3)) - Se reciben usuarios conectados en ese momento
socket.on('listaPersona', function(personas) {
    console.log('Servidor (listaPersonasPorSala):', personas);
});


//((5)) - Mensaje privado
socket.on('mensajePrivado', (data) => {
    console.log('Mensaje privado:', data);
});

//((4))
/*socket.emit('enviarMensaje', {

}, () => {

});*/