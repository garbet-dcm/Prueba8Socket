var params = new URLSearchParams(window.location.search);
var sala = params.get('sala');
var nombre = params.get('nombre');

function renderizarUsuarios(personas) {
    var html = '';
    html += '<li>';
    html += '<a href="javascript:void(0)" class="active"> Chat de <span> ' + sala + '</span></a>';
    html += '</li>'

    for (var i = 0; i < personas.length; i++) {
        html += '<li>';
        html += '<a data-id="' + personas[i].id + ' " href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    //jQuery
    var divUsuarios = $('#divUsuarios');
    divUsuarios.html(html);
    divUsuarios.on('click', 'a', function() {
        var id = $(this).data('id'); //La nomenclarura para usarlo es data-id
        if (id) {

        }
    });
}

var divChatbox = $('#divChatbox');

function rendereizarMensajes(data, yo) {
    console.log(data);
    var fecha = new Date(data.fecha);
    var hora = fecha.getHours() + ":" + fecha.getMinutes();
    var adminClass = 'info';
    if (data.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    var html = '';
    if (yo) {
        html += '<li class="reverse">';
        html += '<div class="chat-content">';
        html += '<h5>' + data.nombre + '</h5>';
        html += '<div class="box bg-light-inverse">' + data.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li>';
    } else {
        html += '<li class="animated fadeIn">';
        if (data.nombre !== 'Administrador') {
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '<div class="chat-content">';
        html += '<h5>' + data.nombre + '</h5>';
        html += '<div class="box bg-light-' + adminClass + '">' + data.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-time">' + hora + '</div>';
    }

    divChatbox.append(html);
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

$('#formEnviar').on('submit', function(e) {
    e.preventDefault(); //Para evitar que se vaya a una nueva pag

    var txtMensaje = $('#txtMensaje');
    if (txtMensaje.val().trim().length !== 0) {
        socket.emit('crearMensaje', {
            nombre,
            mensaje: txtMensaje.val()
        }, function(data) {
            txtMensaje.val('').focus();
            rendereizarMensajes(data, true);
            scrollBottom();
        });
    }
});