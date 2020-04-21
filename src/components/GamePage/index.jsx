import React from 'react'
import "./style.css"
import "./mobile.css"
import socketIOClient from "socket.io-client";
import ProgressBar from "../ProgressBar.jsx";
import Responsive from 'react-responsive-decorator';


var socket = socketIOClient("https://contact-server.herokuapp.com",{
    transports: ['websocket'],
    upgrade: false
});
//var socket = socketIOClient("localhost:5000");


const User = props => (
    <div className="UserList">
      <div className="userName">{props.userName}</div>
      <div className="userScore">{props.userScore}</div>
    </div>
  )
  
  const Message = props => (
    <div className="MessageList">
      <div className="messageValue">{props.message}</div>
    </div>
  )


class HomePage extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            currentUser: "",
            currentWord: "",
            currentGuess: "",
            revealedWord: "",
            wordLen: 0,
            currentQuestion: "",
            currentAnswer: "",
            thinker: "none",
            questionSetter: "",
            message:  "",
            messageBoard: [],
            users : [
                    /*{username: "sukalyan", state:"wordmaker", points: 25},
                    {username: "souradb", state: "questionmaker", points: 100},
                    {username: "srijan", state: "questionmaker", points: 250},
                    {username: "manos", state: "questionmaker", points: 200},
                    {username: "ishika", state: "questionmaker", points: 300},
                    {username: "saptarshi", state: "questionmaker", points: 350},
                    {username: "anixd", state: "questionmaker", points: 400},*/
                    ],
            isMobile: false,
            response: false,
            gameStarted: false,
            loginDisplay: "block",
            startPage: "none",
            homePageDisplay: "none",
            lockButtonDisplay: "none",
            contactViewDisplay: "none",
            questionViewDisplay: "none",
            showLeaderBoard: "none",
            addQuestionDisplay: "none",
            wordEntryDisplay: "block",
            guessViewDisplay: "none",
            messageBoxDisplay: "none",
            lockButtonDisabled: false,
            time: 0,
            timerInProgress: false,
            animDuration: 0,
            endpoint: "http://127.0.0.1:3001"
        };
        this.handleAddUser = this.handleAddUser.bind(this);
        this.handleAddWord = this.handleAddWord.bind(this);
        this.handleAddQuestion = this.handleAddQuestion.bind(this);
        this.handleAddAnswer = this.handleAddAnswer.bind(this);
        this.handleMessageInput = this.handleMessageInput.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }


    compareSecondColumn(a, b) {
       return -(a[1]-b[1]);
    }

    componentDidMount(){


        this.props.media({ minWidth: 480 }, () => {
            this.setState({isMobile: false});
        });
       
        this.props.media({ maxWidth: 480 }, () => {
            this.setState({ isMobile: true});
        });

        const endpt = this.state.endpoint;
        //socket = socketIOClient(endpt);
        //On getting game started event change to game page
        socket.on("game started", thinkerName => {
            this.setState({startPage: "none"});
            
            //To handle not show home page contents in login page if someone clicks start
            if(this.state.loginDisplay === "none"){
               this.setState({homePageDisplay: "block"});
               this.setState({messageBoxDisplay: "block"}); 
            }
            console.log(thinkerName);    
            this.setState({thinker: thinkerName});
            this.setState({wordEntryDisplay: "block"});
            this.setState({addQuestionDisplay: "none"});
            this.setState({questionViewDisplay: "none"});
            this.setState({guessViewDisplay: "none"});
            this.setState({lockButtonDisplay: "none"});
            this.setState({currentWord: ""});
            this.setState({revealedWord: ""});
           // this.setState({gameStarted: true});
           // console.log(this.state.gameStarted);
        });

        //Change page
        socket.on("login successful", (gameSession, qLocked, currQues, word) => {
            
            //Set boolean whether gamestarted or not
            this.setState({gameStarted: gameSession})
            console.log(this.state.gameStarted);
            
            this.setState({loginDisplay: "none"});
            this.setState({homePageDisplay: "block"});
            this.setState({messageBoxDisplay: "block"}); 

            if(this.state.gameStarted === false)
                this.setState({startPage:"block"});
            else {
                this.setState({homePageDisplay: "block"});
                this.setState({messageBoxDisplay: "block"}); 
            }
            this.setState({showLeaderBoard: "block"});

            this.setState({revealedWord: word});

            if(gameSession == true && word != ""){
                this.setState({guessViewDisplay: "block"});
                if(qLocked === ""){
                    this.setState({lockButtonDisplay: "block"});
                    this.setState({addQuestionDisplay: "none"});
                    this.setState({wordEntryDisplay: "none"});
                    this.setState({contactViewDisplay: "none"});                   
                }
                else{
                    if(currQues !== ""){
                        this.setState({addQuestionDisplay: "none"});
                        this.setState({currentQuestion: currQues});
                        this.setState({questionViewDisplay: "block"});
                        this.setState({contactViewDisplay: "block"});  
                    }
                    else{
                        this.setState({addQuestionDisplay: "none"});
                        this.setState({questionViewDisplay: "block"});
                    }
                }
        }
            
        });

        //Refresh user data in other pages
        socket.on("refresh data", (users) => {
            
            const userList = [];
            users.sort(this.compareSecondColumn);
            console.log("REFRESH DATA"  + users);
            
            for(var i = 0; i<users.length;i++)
            {
                //3rd element checks if user has left
                if(users[i][2]!=""){
                    console.log("User i:" + users[i]);
                    var user={username: users[i][0], score: users[i][1]};
                    userList.push(user);
                }
            }
            
            console.log(userList);
            this.setState({users: userList});
        });

        socket.on("ask question", () => {
            console.log("Ask QUESTION");
            this.setState({addQuestionDisplay: "block"});
        });

        socket.on("disable question", () => {
            this.setState({lockButtonDisplay: "none"});
        });
        
        socket.on("enable question", () => {
            this.setState({lockButtonDisplay: "block"});
            this.setState({addQuestionDisplay: "none"});
            this.setState({wordEntryDisplay: "none"});
            this.setState({contactViewDisplay: "none"});
            this.setState({questionViewDisplay: "none"});
            this.setState({guessViewDisplay: "block"});
        });

        socket.on("question added", (user, question) => {
            this.setState({addQuestionDisplay: "none"});
            this.setState({currentQuestion: question});
            this.setState({questionViewDisplay: "block"});
            if(user !== this.state.currentUser)
                this.setState({contactViewDisplay: "block"});
            console.log("QUESTION : " + user + question);
            
            this.setState({time: 90});
            clearInterval(this.timer);
            this.setState({timerInProgress: true});
            this.setState({animDuration: this.state.time +'s'})
            this.timer = setInterval(() => {
                const timeLeft = this.state.time;
                if (timeLeft > 0) {
                    this.setState({time:timeLeft-1});
                }

                if (timeLeft == 0) {
                    clearInterval(this.timer);
                    this.setState({timerInProgress: false})
                }
            }, 1000)
        });

        socket.on("update score", leaderboard => {
            this.setState({time: 0});
            clearInterval(this.timer);
            this.setState({timerInProgress: false});
            const userList = this.state.users;

            for( var i = 0; i<leaderboard.length; i++)
            {
                var user = { username: leaderboard[i][0], score: leaderboard[i][1]};
                userList[i]=user;
            }

            this.setState({users: userList});
        });

        socket.on("round end", () => {
            alert("ROUND HAS ENDED. WAIT FOR NEXT ROUND TO START");
            socket.emit("start");    
        });

        socket.on("reveal word", (word, len) => {
            this.setState({revealedWord: word});
            this.setState({wordLen: len});
        });

        socket.on("disconnect", () => {
            alert("You have been disconnected. Wait trying to reconnect..");
            socket.connect();
            socket.emit("add user", this.state.currentUser);
        })

        socket.on("chat message", (msg) => {
            var messageList = this.state.messageBoard;
            console.log("CHAT MESSAGE");
            if(messageList.length == 10){
                messageList.shift();
                messageList.push(msg);
            }
            else
                messageList.push(msg);
            this.setState({messageBoard: messageList});
        });

        console.log("HIT ENDPOINT");
    }


    handleAddWord(e){
        this.setState({currentWord: e.target.value});
    }

    handleAddUser(e){
        console.log("ADD USER");
        this.setState({currentUser: e.target.value});
    }

    handleAddQuestion(e){
        this.setState({currentQuestion: e.target.value});
    }

    handleGuess(e){
        this.setState({currentGuess: e.target.value});

    }
    
    handleAddAnswer(e){
        this.setState({currentAnswer: e.target.value});
    }

    handleMessageInput(e){
        this.setState({message: e.target.value});
    }

    handleKeyPress(event){
        var code = event.keyCode || event.which;
        if(code==13){
            socket.emit("send message", this.state.currentUser, this.state.message);
            this.setState({message:""});
        }
    }
    sendUserData(){
        socket.emit("add user", this.state.currentUser);
    }

    //Start game instance on Start Game Button click
    startButtonClicked(){
        socket.emit("start","");
    }


    //On submitting word
    addWord(){
        socket.emit("add word", this.state.currentUser, this.state.currentWord);
    }

    onMouseDown() {
        console.log("Mouse Down event");
        socket.emit("add word", this.state.currentUser, this.state.currentWord);
    }

    //Function to render Wordmaker
    renderWordMaker(){
        if(this.state.currentUser === this.state.thinker){
            return(
            <div className = "centralItem wordSubmit" style = {{display: this.state.wordEntryDisplay}}>
                <input placeholder = "Enter the word you're thinking" onFocus = {this.onFocus.bind(this)} onBlur = {this.onBlur.bind(this)} className = "wordEntryText" onChange = {this.handleAddWord} type = "text"></input>
                <button onMouseDown = {this.addWord.bind(this)} onMouseDown = {this.onMouseDown.bind(this)} className = "submitWord">Submit Word</button>
            </div>
            )
        }
    }

    renderWord(){
        var remWord = this.state.currentWord.substr(this.state.revealedWord.length,this.state.currentWord.length);
        var blanks = "";

        for(var i = 0; i < this.state.wordLen; i++)
        {
            blanks +=  " _";
        }

        console.log("BLANKS"+blanks);

        if( this.state.currentUser === this.state.thinker && this.state.currentWord){
            return(
                <div className = "word">
                <p class = "revealedColor">{this.state.revealedWord} <span class = "remainingColor">{remWord}</span></p>
                </div>
            )
        }
        else{
            return(
                <div className = "word">
                <p> <span class = "revealedColor">{this.state.revealedWord}</span> <span class = "remainingColor">{blanks}</span></p>
                </div>
            )
        }
    }

    onClickLock(){
        console.log("CLICK");
        socket.emit("lock question", this.state.currentUser);
    }

    onClickAsk(){
        socket.emit("handle qa", this.state.currentUser, this.state.currentQuestion, this.state.currentAnswer);
    }

    onClickCancel(){
        socket.emit("unlock question", this.state.currentUser);
    }

    onClickPassByThinker(){
        socket.emit("handle answer", this.state.currentUser, "");
    }

    onClickPass(){
        socket.emit("handle pass", this.state.currentUser);
    }

    onClickContact() {
        socket.emit("handle contact", this.state.currentUser, this.state.currentAnswer);
    }

    onClickAnswer() {
        socket.emit("handle answer", this.state.currentUser, this.state.currentAnswer);
    }

    onClickGuess() {
        socket.emit("word guess", this.state.currentUser, this.state.currentGuess);
    }

    onFocus(){
        if(this.state.isMobile == true) {
        this.setState({showLeaderBoard: "none"});
        this.setState({messageBoxDisplay: "none"});
        }
    }

    onBlur() {
        this.setState({showLeaderBoard: "block"});
        this.setState({messageBoxDisplay: "block"});
    }

    sendMessageClicked(){
        socket.emit("send message", this.state.currentUser, this.state.message);
        this.setState({message:""});
    }

    //Render Question Interface
    renderQuestionInterface(){

        return(
            <div className = "centralItem questionDiv twoButtonsCombinedView" style = {{display: this.state.addQuestionDisplay}}>
                <input className = "QuestionEntryText" onFocus = {this.onFocus.bind(this)} onBlur = {this.onBlur.bind(this)} onChange = {this.handleAddQuestion} placeholder = "Add Question" type = "text"></input>
                <input className = "AnswerEntryText" onFocus = {this.onFocus.bind(this)} onBlur = {this.onBlur.bind(this)} onChange = {this.handleAddAnswer} placeholder = "Add Answer" type = "text"></input>
                <button onMouseDown = {this.onClickAsk.bind(this)} className = "AskQuestion">Ask</button> 
                <button onMouseDown = {this.onClickCancel.bind(this)} className = "CancelAskQuestion">Cancel</button>
            </div>
        )
    }

    //Function to render Ask Question button that locks
    renderAskQuestionButton(){
        if(this.state.currentUser !== this.state.thinker){
        return(
            <div className = "centralItem lockButton" style = {{display: this.state.lockButtonDisplay}}>
                <button onClick = {this.onClickLock.bind(this)} className = "lockToAskButton">Ask Question</button>
            </div>
        )}
    }

    //Function to render Ask Question button that locks
    renderContactView(){
        if(this.state.currentUser !== this.state.thinker){
        return(
            <div className = "centralItem contactView twoButtonsCombinedView" style = {{display: this.state.contactViewDisplay}}>
                <input onFocus = {this.onFocus.bind(this)} onBlur = {this.onBlur.bind(this)} className = "contactEntryText" onChange = {this.handleAddAnswer} placeholder = "Answer" type = "text"></input>
                <button onMouseDown = {this.onClickContact.bind(this)} className = "Contact">Contact</button>
                <button onMouseDown = {this.onClickPass.bind(this)} className = "passAnswer">Pass</button>
            </div>
        )} else {
        return(
            <div className = "centralItem answerView twoButtonsCombinedView" style = {{display: this.state.contactViewDisplay}}>
                <input onFocus = {this.onFocus.bind(this)} onBlur = {this.onBlur.bind(this)} className ="contactEntryText" onChange = {this.handleAddAnswer} placeholder = "Answer" type = "text"></input>
                <button onMouseDown = {this.onClickAnswer.bind(this)} className = "submitAnswer">Answer</button>
                <button onMouseDown = {this.onClickPassByThinker.bind(this)} className = "passAnswer">Pass</button>
            </div>
        ) 
        }
    }

    renderHintView(){

    }

    renderGuessView(){
        if(this.state.currentUser !== this.state.thinker){
            return(
                <div className = "centralItem guessView" style = {{display: this.state.guessViewDisplay}}>
                    <input className = "guessEntryText" onFocus = {this.onFocus.bind(this)} onBlur = {this.onBlur.bind(this)} onChange = {this.handleGuess.bind(this)} placeholder = "Type your Guess here" type = "text"></input>
                    <button onMouseDown = {this.onClickGuess.bind(this)} className = "Guess">Guess</button>
                </div>
            )}
    }

    renderQuestionView() {
        return(
            <div className = "centralItem QuestionView" style = {{display: this.state.questionViewDisplay}}>
                Q:   {this.state.currentQuestion}
            </div>
        )    
    }

    renderMessageBoard(){
        
        console.log("MESSAGE BOARD");
        const messages = this.state.messageBoard;

        console.log(messages);
        const msgList = messages.map((message, index) =>(
            <div className="messageBoardEntry">
            <Message
            message={message}
          />
      </div>
        ));

        return(
            <>
            <div className = "messageHeader">
                <div className={this.state.timerInProgress ? "timer countingDown" : "timer"}>
                    <p>{this.state.time}</p>
                        <svg>
                            <circle r="18" cx="20" cy="20" style={{animationDuration: this.state.animDuration}}></circle>
                        </svg>
                </div>
            </div>
            <div className = "message">
                {msgList}
            </div>
</>            
        );
    
    }

    //Function to render LeaderBoard
    renderLeaderBoard(){
        
        console.log("LEADERBOARD");
        const users = this.state.users;

        console.log(users);
        const userList = users.map((user, index) =>(
            <div className="leaderboardEntry">
            <User
            userName={user.username}
            userScore={user.score}
          />
          <div
          style={{
              backgroundColor: "pink",
              width:  '100%'
          }}
          className="bar"
      />
      </div>
        ));

        return(
            <>
            <div className = "messageHeader">
            <h1 className = "ko9taktHeader">KO9TAKT</h1>
            </div>
            <div className = "leader">
                {userList}
            </div>
            </>
        );
    }

    render(){

        return(
            <body>
            <div className = "fullPage">
                {/*Login Component*/}
        
                <div className = "loginWrapper" style={{display:this.state.loginDisplay}}>
                    <h1>ko9takt</h1><br/>
                    <div class = "loginForm">
                        <input class ="loginText" placeholder = "Enter username" type = "text" onChange={this.handleAddUser}></input><br/>
                        <button class = "loginButton" onClick={this.sendUserData.bind(this)}>Enter Game</button>
                    </div>
                </div>
                
                <div className = "leaderBoard" style = {{display: this.state.showLeaderBoard}}>
                    {this.renderLeaderBoard()}
                </div>
        
                {/*Homepage Component*/}
            
                <div className = "homePageWrapper" style={{display:this.state.homePageDisplay}}>
                    
                    { /*This will be based on user state */ } 
                        
                        <div className="centralItem startGamePage" style={{display:this.state.startPage}}>
                            <button className = "startButton" onClick = {this.startButtonClicked.bind(this)}>Start Game</button>
                        </div>
                            {this.renderWord()}

                            <ProgressBar percentage = {this.state.time}/>

                            {this.renderWordMaker()}

                            {this.renderQuestionView()}

                            {this.renderAskQuestionButton()}
                        
                            {this.renderContactView()}

                            {this.renderQuestionInterface()}

                            {this.renderGuessView()}

                </div>

                <div className = "messageBoard" style={{display:this.state.messageBoxDisplay}}>
                    {this.renderMessageBoard()}
                    <input value = {this.state.message} onKeyDown={this.handleKeyPress} onChange = {this.handleMessageInput} placeholder = "Write message" type = "text" className = "messageInput"></input>
                    <button  onClick = {this.sendMessageClicked.bind(this)} className = "sendMessage">Send</button>
                </div>
            </div>
            </body>
        );
    }
}

export default Responsive(HomePage)
