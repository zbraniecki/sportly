var redis = require('redis');
var publisherClient = redis.createClient();

module.exports = function(app, passport){
  app.get("/", function(req, res){ 
    res.render("home", { user : null});
  });
  app.get("/client", function(req, res){ 
    res.render("client", { user : null});
  });
  app.get('/update-stream', function(req, res) {
    // let request last as long as possible
    req.socket.setTimeout(Infinity);

    var messageCount = 0;
    var subscriber = redis.createClient();

    subscriber.subscribe("updates");

    // In case we encounter an error...print it out to the console
    subscriber.on("error", function(err) {
      console.log("Redis Error: " + err);
    });

    // When we receive a message from the redis connection
    subscriber.on("message", function(channel, message) {
      messageCount++; // Increment our message count

      res.write('event: weborm-db-update\n');
      res.write('id: ' + messageCount + '\n');
      res.write("data: " + message + '\n\n'); // Note the extra newline
    });

    //send headers for event-stream connection
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write('\n');

    // The 'close' event is fired when a user closes their browser window.
    // In that situation we want to make sure our redis channel subscription
    // is properly shut down to prevent memory leaks...and incorrect subscriber
    // counts to the channel.
    req.on("close", function() {
      subscriber.unsubscribe();
      subscriber.quit();
    });
  });
  app.get('/fire-event/:event_name', function(req, res) {
    publisherClient.publish( 'updates', ('"' + req.params.event_name + '" page visited') );
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('All clients have received "' + req.params.event_name + '"');
    res.end();
  });
}
