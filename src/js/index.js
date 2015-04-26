$(function(){
  options = [{selector: '#introtext', offset: 100, callback: 'Materialize.fadeInImage("#introtext")'}]
  Materialize.scrollFire(options)
  $('#search_field').autocomplete({
    serviceUrl: '/api/search/software/',
    onSelect: function (suggestion) {
        console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);
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
        }
  });
});

