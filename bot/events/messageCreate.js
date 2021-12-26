'use strict';

module.exports = async(client, message) => {
  if(message.channel.id === "919724869376159764"){
    if(message.author.bot) return;
    client.myob.send(JSON.stringify({
        message:message.cleanContent,
        user:message.author,
        from:"bot"
    }))
  }
};
