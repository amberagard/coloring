/* jshint unused:false */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('.register').click(register);
    $('.login').click(login);
  }

  function register(e) {
      $('#registration').css('display', 'block');
      e.preventDefault();
  }

  function login(e) {
      $('#login').modal();
      e.preventDefault();
  }

})();


function ajax(url, type, data={}, success=r=>console.log(r), dataType='json'){
  'use strict';
  $.ajax({url:url, type:type, dataType:dataType, data:data, success:success});
}
