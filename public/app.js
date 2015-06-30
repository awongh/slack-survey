$.ready(function(){
  $("#messages").click(function(){
    $.ajax({
      method: "get",
      url: "/"
    })
    .done(function( response ) {
      console.log( response );
    });

  });
});
