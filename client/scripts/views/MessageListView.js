
var MessageListView=Backbone.View.extend({
  className: 'messageList',
  render: function(){
    return this.$el.append(this.collection.map(function(message){
      new MessageView({model: message}).$el}));
  }
});
