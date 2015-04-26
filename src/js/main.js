$(document).ready(function(){
/*  $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrain_width: false, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on click
      alignment: 'left', // Aligns dropdown to left or right edge (works with constrain_width)
      gutter: 0, // Spacing from edge
      belowOrigin: false // Displays dropdown below the button
    }
  );
    $('.collapsible').collapsible({
      accordion : true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
    $('.dish-open').click(function(){
      $('#modal1').openModal();
      $('#order-button').attr('data-id', $(this).attr('data-id'));
    });
    $('#order-button').click(function(){
      console.log($(this).attr('data-id'));
      $.ajax( {url: "http://ec2-54-152-114-24.compute-1.amazonaws.com/api/orders/36d50aa1e8902d42e698/dishes/" + $(this).attr('data-id'), type: "PUT", data: {"qty":4} }).done(function(data){if(data.status === "success"){toast('Dish added to order',4000)} else {toast('Error, could not add dish to order')}});
      $('#modal1').closeModal();
    });*/
  $(".button-collapse").sideNav();
});
