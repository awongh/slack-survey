$.ready(function(){
  $("#token").click(function(){
    $.ajax({
      method: "get",
      url: "/gettoken"
    })
    .done(function( msg ) {
      alert( "Data Saved: " + msg );
    });

  });
});
