
$(".head-arrow").velocity({
  translateY: 6
  },

  { duration: 450,
    loop: true,
    //delay: 200,
    easing: "easeInOutSine"
 });



/*$("#modalBtn").hover(function(){
  $(this).html("Recommended").velocity({ width: "2rem" }, 200, "easeOut")
  .velocity("reverse");
});*/


(function() {
  //var $over = false;
  //var black = "#222222"

  $('#modalBtn').hover( function() {
    /*if (!$over) {
       $over = $(this).find("#modalBtn");
    }*/
    $(this).velocity('stop').velocity({ width: "+=2rem", backgroundColor: "#222222" }, 300, "easeInOut")
  }, function() {
     $(this).velocity('stop').velocity("reverse");
  });


})();


/*(function() {
  var $btn = $('#dd-btn'),
      $ul = $btn.next('ul'),
      ogText = $btn.text();

  $btn.on('click', function() {
    var isOpen = $ul.is(':visible'),
        slideDir = isOpen ? 'slideUp' : 'slideDown',
        btnText = isOpen ? ogText : 'Bring It Back Up',
        dur = isOpen ? 200 : 400;
    $ul.velocity(slideDir, {
      easing: 'easeOutQuart',
      duration: dur,
      complete: function() {
        $btn.text(btnText);
      }
    });
  });

})();*/
