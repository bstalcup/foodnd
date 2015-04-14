$(function(){
  $('#login-form').on('submit', function(){
    formInfo = {}
    formInfo['username'] = $(this).find('#username').val();
    formInfo['password'] = $(this).find('#password').val();
    $.ajax({url: '/api/users/login', type: 'post', data: formInfo}).done(function(data){
      var msg = ''
      if(data.status == 'error')
      {
        msg = '<div class="card-panel red darken-1"><span class="white-text">' + data.message + '</span></div>';
        $('#login-form input').addClass('invalid');
      } else {
        msg = '<div class="card-panel green darken-1"><span class="white-text">' + data.message + '</span></div>';
        window.location.replace('/home')
      }
      $('#login-form #message').html(msg);
    });
    return false;
  });
  
  $('#signup-form').on('submit', function(){
    formInfo = {}
    formInfo['username'] = $(this).find('#signup-username').val();
    formInfo['password'] = $(this).find('#signup-password').val();
    formInfo['confirm'] = $(this).find('#signup-confirm').val();
    if (formInfo.password == formInfo.confirm) {
    $.ajax({url: '/api/users/validate', type: 'post', data: formInfo}).done(function(data){
      var msg = ''
      if(data.status == 'error')
      {
        msg = '<div class="card-panel red darken-1"><span class="white-text">' + data.message + '</span></div>';
        $('#login-form input').addClass('invalid');
      } else {
        msg = '<div class="card-panel green darken-1"><span class="white-text">' + data.message + '</span></div>';
        window.location.replace('/home');
      }
      $('#signup-form #message').html(msg);
    });
  } else {
    $('#signup-form #message').html('<div class="card-panel red darken-1"><span class="white-text>Passwords don\'t match!')
    $('#signup-form #signup-password').addClass('invalid');
    $('#signup-form #signup-confirm').addClass('invalid');
  }
    return false;
  });

});
