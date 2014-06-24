/* global io */
/* jshint unused:false */

(function(){
  'use strict';

  $(document).ready(initialize);

  var socket;

  function initialize(){
    initializeSocketIo();
    $('#send').click(send);
  }

  function send() {
    var message = $('#message').val();
    $('#message').val('');
    socket.emit('send-message', {message:message});
  }

  function receiveMessage(data) {
    $('#chat').prepend(`<li>${data.message}</li>`);
  }

  function initializeSocketIo(){
    socket = io.connect('/app');
    socket.on('online', online);
    socket.on('receive-message', receiveMessage);
  }

  function online(data) {
    console.log(data);
    //$('#chat').append(`<li>'${#messages}'</li>`);
  }
})();
