const
messenger = require('./messenger'),
  News = require('../apps/news/news.model'),
  User = require('../apps/user/user.model');

module.exports = {
  sendNewsToUsers: sendNewsToUsers,
  sendNewsByTopic: sendNewsByTopic,
  sendStockToUsers: sendStockToUsers,
}

/**
 * Send news to all registered users
 * TODO: send to all the users subscribed for that topic
 */
function sendNewsToUsers(news, callback) {
  console.log("sending news to users ...")
  User.find({}, function(err, users) {
    if(err) return callback(err)
    // TODO: Filter user by keywords
    users.forEach(function(user) {
      console.log("####", user)
      let data = messenger.getNewsMessage(user.chatID, [news]);
      console.log(data)
      messenger.callSendAPI(data, callback);
    });
  });
}


function sendStockToUsers(stock, callback) {
  console.log("sending stock to users ...")
  callback = callback || (() => {})
  User.find({}, function(err, users) {
    if(err) return callback(err)
    users.forEach(function(user) {
      // messenger.sendTextMessage(user.chatID, stock.company + ' : ' + stock.current);
      messenger.sendTextMessage(user.chatID, 
        stock.company + ' changed from ' + stock.prevClose + ' to ' + stock.current + ' by ' + stock.change + '(' + stock.changePercent + '%)' );
    });
  });

}

function sendNewsByTopic(recipientId, topic, callback) {
  console.log('#####')
  callback = callback || (() => {})
  News.find({summary: {'$regex' : topic, '$options' : 'i'}}, function(err, result){
    // News.find({summary: {$regex: topic}}, function(err, result){
    if(err) {
      console.log(error)
      return
    }
    console.log(result);
    let data = messenger.getNewsMessage(recipientId, result);
    messenger.callSendAPI(data, callback);
  });
}

