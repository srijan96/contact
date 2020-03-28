var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var current_word = "zebra";
var revealed_length = 1;
var current_question = "";
var current_answer = "";
var contacts = [];
var leaderBoard = [];
var lockState = "";

function logState() {
	console.log("========================");
	console.log("Word = " + current_word);
	console.log("Revealed = " + current_word.substring(0,revealed_length) + " , length : ", revealed_length);
	console.log("Question = " + current_question);
	console.log("Answer = " + current_answer);
	console.log("LockState = " + lockState);
	console.log("Contacts = " + contacts);
	console.log("leaderBoard = " + leaderBoard);
}

io.on('connection', function(socket){
  //Handle Add User
  socket.on('add user', function(user){
  	leaderBoard.push([user,0]);
    io.emit('chat message', "add user" + user);
    logState();
  });
  //Handle Add Word
  socket.on('add word', function(user, word){
  	current_word = word;
    io.emit('chat message', "add word by " + user + " " + word);
    logState();
  });
  //Handle Lock
  socket.on('lock question', function(user){
    if(lockState == "") {
    	lockState = user;
    	io.emit('chat message', "locked by " + user);
    } else {
    	io.emit('chat message', "Already locked by " + lockState);
    }
    logState();
  });
  //Handle Unlock
  socket.on('unlock question', function(user){
    
    if(lockState == user) {
		io.emit('chat message', "unlocked by " + user);
		lockState = "";
		current_question = "";
		current_answer = "";
    } else {
		io.emit('chat message', "Unlock Failed. Not locked by " + user);
    }
    logState();
  });
  //Handle QA
  socket.on('handle qa', function(user, question, ans){
  	if(lockState != user) {
  		io.emit('chat message', "add qa failed, not locked by " + user);
  	}
  	else if(current_question != "") {
  		io.emit('chat message', "add qa failed, question already exists " + current_question);
  	}
  	else {
	  	current_question = question;
	  	current_answer = ans;
	  	contacts = [];
	    io.emit('chat message', "added question by " + user + " " + question);
	    socket.emit('chat message', "added question " + question + " " + ans);
	} 
	logState();
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
