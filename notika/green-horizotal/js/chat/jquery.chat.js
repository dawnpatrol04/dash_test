/**
* Theme: Notika Template
* Author: Kalam
* Chat application 
*/

!function($) {
    "use strict";

    var ChatApp = function() {
        this.$body = $("body"),
        this.$chatInput = $('.chat-input'),
        this.$chatList = $('.conversation-list'),
        this.$chatSendBtn = $('.chat-send .btn')
    };

 
    ChatApp.prototype.save = function() {
        var chatText = this.$chatInput.val();
        var chatTime = moment().format("h:mm");
    
        if (chatText === "") {
            console.log("You forgot to enter your chat message");
            this.$chatInput.focus();
        } else {
            // Append the user's message immediately
            this.appendMessage("You", chatText, chatTime);
    
            fetch('http://0.0.0.0:9090/chat/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input_text: chatText }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error, status = ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Append the bot's response when it arrives
                // Make sure you're correctly targeting the bot's response from your data structure
                if (data.length > 0 && data[0].agent_outcome && data[0].agent_outcome.log) {
                    this.appendMessage("Bot", data[0].agent_outcome.log, moment().format("h:mm"));
                } else {
                    console.error('Received data from the API in an unexpected format:', data);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    
            this.$chatInput.val('');
            this.$chatInput.focus();
        }
    };
    

    


    
    ChatApp.prototype.appendMessage = function(sender, message, time) {
        var $newMessage = $('<li class="clearfix"><div class="chat-avatar"><img src="img/post/1.jpg" alt="male"><i>' + time + '</i></div><div class="conversation-text"><div class="ctext-wrap"><i>' + sender + '</i><p>' + message + '</p></div></div></li>');
        $newMessage.appendTo('.conversation-list');
        this.$chatList.scrollTop(this.$chatList.prop("scrollHeight"));
    };
    

    ChatApp.prototype.init = function () {
        var $this = this;
        //binding keypress event on chat input box - on enter we are adding the chat into chat list - 
        $this.$chatInput.keypress(function (ev) {
            var p = ev.which;
            if (p == 13) {
                $this.save();
                return false;
            }
        });


        //binding send button click
        $this.$chatSendBtn.click(function (ev) {
           $this.save();
           return false;
        });
    },
    //init ChatApp
    $.ChatApp = new ChatApp, $.ChatApp.Constructor = ChatApp
    
}(window.jQuery),

//initializing main application module
function($) {
    "use strict";
    $.ChatApp.init();
}(window.jQuery);