$(document).ready(function(){
  app = new App({});
  appView = new AppView({model:app});
  $('body').html(appView.render());
});

