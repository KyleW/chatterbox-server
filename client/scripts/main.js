$(document).ready(function(){
  var app = new App({});
  var appView = new AppView({model:app});
  $('body').html(appView.render());
});

