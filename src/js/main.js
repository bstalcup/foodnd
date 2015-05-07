$(document).ready(function(){
  $(".button-collapse").sideNav();
  $('.search').autocomplete({
    serviceUrl: '/api/search/software/',
    onSelect: function (suggestion) {
        window.location.replace(suggestion.data);
        //console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);
    },
    formatResult: function(suggestion, currentValue) {
        var htmlSafeString = suggestion.value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');

        var pattern = '(' + $.Autocomplete.utils.escapeRegExChars(currentValue) + ')';

        text = htmlSafeString.replace(new RegExp(pattern, 'gi'), '<strong>$1<\/strong>');
        return '<div class="card-panel" style="margin:0">' + text + '</div>';
        },
     beforeRender: function(container) {
       var i = 0;
       var autocompleteDisplayNumber = 5
       container.find('.autocomplete-suggestion').each(function(){
         i += 1;
         if(i> autocompleteDisplayNumber) {
           $(this).remove();
         }
       });
     },
     showNoSuggestionNotice: true,
     noSuggestionNotice: '<div class="card-panel" style="margin:0">No results</div>'
  });
  $('#comment-button').on('click', function(){
    $('#modal').openModal();
  });
  $('#negative-comment').on('click', function(){
    console.log('8j')
    var comment = $('#comment-text');
    $.post('/api/comments/', {software_id: parseInt(comment.attr('software-id')), rank: -1, text: comment.val()}).done(function(data){
       if ( data.status == 'success' ) {
          Materialize.toast('Comment created', 3000);
          $('#modal').closeModal();
       } else {
          Materialize.toast(data.message, 4000);
       }
    });
  });
  $('#positive-comment').on('click', function(){
    console.log('8j')
    var comment = $('#comment-text');
    $.post('/api/comments/', {software_id: parseInt(comment.attr('software-id')), rank: 1, text: comment.val()}).done(function(data){
       if ( data.status == 'success' ) {
          Materialize.toast('Comment created', 3000);
          $('#modal').closeModal();
       } else {
          Materialize.toast(data.message, 4000);
       }
    });
  });
  $('.vote').each(function(e,i){
    i = $(i)
    var com_id = i.parent().parent().parent().attr('comment-data');
    i.on('click', function(){
      if ( i.hasClass('voted') ) {
        $.ajax({url: '/api/comments/' + com_id + '/vote', method: 'delete'}).done(function(data){
          Materialize.toast(data.message,3000)
          i.removeClass('voted');
          i.find('i').removeClass('red-text').removeClass('blue-text').removeClass('text-accent-1');
          i.parent().find('.score').html('<b class="black-text">' + data.total + '</b>')
        });
      } else if ( i.parent().find('.voted').length != 0) {
        var classes = "text-accent-1 ";
        var rank = 0;
        if (i.hasClass('up')) {
          classes += "blue-text";
          rank = 1;
        } else {
          classes += "red-text";
          rank = -1;
        }
        $.post('/api/comments/' + com_id + '/vote', { "rank" : rank} )
        .done(function(data){
          i.parent().find('.voted').removeClass('voted').find('i').removeClass('text-accent-1').removeClass('blue-text').removeClass('red-text');
          i.addClass('voted').find('i').addClass(classes);
          Materialize.toast(data.message, 3000);
          i.parent().find('.score').html('<b class="black-text">' + data.total + '</b>');
        });
      } else {
        var rank = 0
        var classes = 'text-accent-1 ';
        if (i.hasClass('up'))  {
          rank = 1
          classes += 'blue-text';
        } else {
          rank = -1
          classes += 'red-text';
        }
        $.post('/api/comments/' + com_id + '/vote', { "rank" : rank} )
        .done(function(data){
          Materialize.toast(data.message, 3000);
          i.addClass('voted');
          i.find('i').addClass(classes);
          i.parent().find('.score').html('<b class="black-text">' + data.total + '</b>')
       });
      }
    });
  });
/*  $('.vote.up').on('click', function(){
    com_id = $(this).parent().parent().parent().attr('comment-data');
    if($(this).hasClass('voted')){
    } else {
    }
  });*/
});
