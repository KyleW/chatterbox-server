var App = Backbone.Model.extend({
  initialize: function(){
    this.set('messageList') = new (MessageList({model:Message}));
  },
  defaults:{
    userName:'', // grab this from the prompt
    befriended:[],
    currentroom: 'Lobby',
    characterLimit: {
      'objectId': 4,
      'roomname': 30,
      'text':140,
      'updatedAt': 24,
      'username': 50
    }
  }
});

var AppView = Backbone.View.extend({
  
  template: _.template("<div id='heading'><h1>Chatterbox</h1> \
    </div><div id='left'></div> \
      <div id='right'> \
      <form> \
        <span class='subtitle'>Add to the Chatter</span> \
        <textarea class='newMsg' name='userText' value=''></textarea> \
        <button class='submit' type='button'>Chatter</button> \
      </form> \
      <div id='roomLabel'> \
        <span class='subtitle'>Current Room:</span><span class='currentRoom'></span></h3> \
      </div> \
      <div id='friendLabel'> \
        <span class='subtitle'>Befriended:</span> \
        <ul id='friendList'></ul> \
      </div> \
    </div>"),

  initialize:function(){
    this.render();
  },
  
  render: function(){

    this.$el.append(this.template(this.model.attributes))
    return this.$el
  }

});

var Message = Backbone.Model.extend({
  defaults:{
      username:"",
      roomname:"",
      text:"",
      createdAt:"",
      updatedAt:"",
      objectId:""
  }


});

var MessageView = Backbone.View.extend({
    template:_.template("<div class='message'>\
      <div class='username'><%=username%></div>\
      <div class='roomname'><%=roomname%></div>\
      <div class='text'><%=text%></div>\
      <div class='createdAt'><%=createdAt%></div>\
    </div>"),

  render: function(){
    return this.$el.html(this.template(this.model.attributes));
  }
});

var MessageList= Backbone.Collection.extend({});

var MessageListView=Backbone.View.extend({});



$(document).ready(function(){ 
  $('body').html(new AppView({model: new App({})}));
});

///////////////////////////////////////
var Messages = function (){};
Messages.prototype.getMessages = function(options){
  console.log('getting messages');  
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    data: {
      order: options.order
    },
    success: options.success,
    error: function (data) {
      console.error('chatterbox: Failed to get message. Will try again in 2sec');
    }
  });
};

var MessagesView = function(options){
  var messages = options.messages;
  messages.getMessages({
    "order" :"-createdAt",
    success:  function (data) {
      listOfMessages = [];
      _.each(data.results, function(messageJSON){
        renderMessage(messageJSON);
      });
      printMessages(listOfMessages); 
    }
  });  
}


////////////////////////////////////////////////////


var renderMessage = function(messageJSON){
    var $messageNode = $('<div></div>');
    $messageNode.addClass('message');
    _.each(messageFields, function(val, i) {
      var content = messageJSON[messageFields[i]];
      if(content){
        content = content.slice(0,characterLimits[messageFields[i]]);
        if (val.charCodeAt(0) > 150) return;
      }
      $('<div></div>')
        .addClass(messageFields[i])
        .text(content)
        .appendTo($messageNode);
    });
    listOfMessages.push($messageNode);
  };

var printMessages = function(listOfMessages){
  $('.message').remove();
  _.each(listOfMessages, function(msgNode, i) {
      $('#left').append(msgNode);
  });
};



// var Message = Backbone.Model.extend({
//   url: 'https://api.parse.com/1/classes/chatterbox',
//   initialize: function() {},
//   defaults: {
//     username: '',
//     roomname: '',
//     text: '',
//     createdAt: '',
//     updatedAt: '',
//     objectId: ''
//   }

// });

// var MessageCollection = Backbone.Collection.extend({
//   model : Message,
//   add:function(msg){
//     var that = this;
//     var message = new Message();
//     message.save({msg : msg}, {
//       success:function(model, data) {
//         that.trigger("add",message.msg); // !!FIXME!! needs an 'add' method. 
//       }
//     });
//   }

//   returnFriends : function(friendWeClick) {
//     return this.filter( function(message) {
//       return message.get("username") === friendWeClick;
//     });
//     // return all messages from your friend "befriended"
//   }
// });

// var MessageView = Backbone.View.extend({
//   tagName : "div",
//   className: "message",
//   initialize: function(args) {
//     // _.bindAll(this, 'submitMessage');
//     // this.collection.bind()
//   },
//   render: function() {
//     $(this.el)
//       .text(
//         this.model.get('username')+
//         ": "+
//         this.model.get('text')
//       );
//   },
//   clearInput: function(){
//     this.$('input').val('');
//   },
//   events: {
//     'click .username': 'focusFriend',
//     'click .roomname': 'changeRoom'
//   },
//   changeRoom: function(chosenRoom){
//     //call collection of rooms that matches chosenRoom?
//     console.log('change room', chosenRoom);
//   },
//   focusFriend: function(chosenFriend){
//     //call collection of friends that matches chosenFriend?
//     console.log('change friend', chosenFriend);
//   }

// });


//OLD STUFF BELOW HERE

// $(document).ready(function(){

//   $('.submit').on('click', function(){
//     var userMessage = $('input').val().toString();
//     sendMessage(userMessage);
//     $('input').val("  ");
//   });

//   $('.currentRoom').text(currentRoom);
//   $('.userFocus').text(userFocus);
//   getMessages();

//   $('.reset').on('click', function(){
//     getMessages();
//     userFocus= 'All';
//     currentRoom = 'Lobby';
//     $('.currentRoom').text(currentRoom);
//     $('.userFocus').text(userFocus);
//   });


// //Clicking on username
//   $('.container').on('click','.username',function(){
//     userFocus = $(this).text();
//     $('.userFocus').text(userFocus);
//     $friendUser = $( "div.username:contains("+ userFocus +") ").addClass('friend');
//     $friendUser.siblings('.text').addClass('friend');
//     // console.log(userFocus);
//     // $('.')
//   });

// //Clicking on Room Name
//   $('.container').on('click','.roomname',function(){
//     currentRoom = $(this).text();
//     $('.currentRoom').text(currentRoom);
//     $rooms = $( "div.roomname:contains("+ currentRoom +") ").parent().addClass('keep');
//     $('.message').not('.keep').fadeOut();
//     console.log($rooms);
//   });
// });



// //GLOBALS

// var userName=''; // grab this from the prompt
// var userFocus= 'All';
// var currentRoom = 'Lobby';
// var listOfMessages = [];
// var mostRecentUpdate = '';
var characterLimits = {
  'objectId': 24,
  'roomname': 30,
  'text':140,
  'updatedAt': 24,
  'username': 50
};

var messageFields = [
  'username',
  'roomname',
  'text',
  'createdAt',
  'updatedAt',
  'objectId'
];

// // HELPER FUNCTIONS


// //RETRIEVING MESSAGES





// // SUBMITTING MESSAGES

// var composeMessage = function(userText) {
//   var sendJSON = {};
//   userName = window.location.search;
//   userName = userName.split('=')[1];
//   sendJSON.username = userName;
//   sendJSON.text = userText;
//   sendJSON.roomname = currentRoom;
//   return sendJSON;
// };


// var sendMessage = function(input) {
//   var toSend = composeMessage(input);
//   $.ajax({
//     url: 'https://api.parse.com/1/classes/chatterbox',
//     type: 'POST',
//     data: JSON.stringify(toSend),
//     contentType: 'application/json',
//     success: function (data) {
//       console.log('chatterbox: Message sent');
//       setTimeout(getMessages,5000);
//     },
//     error: function (data) {
//       // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//       console.error('chatterbox: Failed to send message');
//       setTimeout(getMessages,5000);
//     }
//   });
// };

// // var changeRoom = function() {
// //   grabUserInput();
  
// //   updateRoomName();
  
// //   getMessagesForRoom();
// // };














// /// XSS /// 

// var evilMessage = function(userText) {
//   var evilJSON = {};
//   userName = window.location.search;
//   userName = userName.split('=')[1];
//   evilJSON.userName = userName;
//   // evilJSON['\<script\>window.location.reload\<\/script\>'] = true;
//   evilJSON.script = "$('body').css('color','white')";
//   evilJSON.style = "font-size=600px;";
//   evilJSON.text = userText;
//   evilJSON.roomname = '4chan';
//   return evilJSON;
// };

// var evilSend = function(input) {
//   var toSend = evilMessage(input);
//   $.ajax({
//     url: 'https://api.parse.com/1/classes/chatterbox',
//     type: 'POST',
//     data: JSON.stringify(toSend),
//     contentType: 'application/json',
//     success: function (data) {
//       console.log('chatterbox: Message sent');
//     },
//     error: function (data) {
//       // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//       console.error('chatterbox: Failed to send message');
//     }
//   });
// };

