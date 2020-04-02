import React from 'react'
import "./style.css"
import socketIOClient from "socket.io-client";
var os = require( 'os' );


var socket = socketIOClient("http://192.168.137.4:3001");


class HomePage extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            currentUser: "",
            currentWord: "",
            revealedWord: "",
            currentQuestion: "",
            currentAnswer: "",
            thinker: "",
            questionSetter: "",
            users : [
                    /*{username: "sukalyan", state:"wordmaker", points: 25},
                    {username: "souradb", state: "questionmaker", points: 100},
                    {username: "srijan", state: "questionmaker", points: 250},
                    {username: "manos", state: "questionmaker", points: 200},
                    {username: "ishika", state: "questionmaker", points: 300},
                    {username: "saptarshi", state: "questionmaker", points: 350},
                    {username: "anixd", state: "questionmaker", points: 400},*/
                    ],
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
            lockButtonDisabled: false,
            endpoint: "http://127.0.0.1:3001"
        };
        this.handleAddUser = this.handleAddUser.bind(this);
        this.handleAddWord = this.handleAddWord.bind(this);
        this.handleAddQuestion = this.handleAddQuestion.bind(this);
        this.handleAddAnswer = this.handleAddAnswer.bind(this);
    }


    renderHomeorStartPage(){
            
    }

    componentDidMount(){
        const endpt = this.state.endpoint;
        
        //socket = socketIOClient(endpt);
        //On getting game started event change to game page
        socket.on("game started", thinkerName => {
            this.setState({startPage: "none"});
            
            //To handle not show home page contents in login page if someone clicks start
            if(this.state.loginDisplay == "none")
               this.setState({homePageDisplay: "block"});

            console.log(thinkerName);    
            this.setState({thinker: thinkerName});
           // this.setState({gameStarted: true});
           // console.log(this.state.gameStarted);
        });

        //Change page
        socket.on("login successful", (gameSession) => {
            
            //Set boolean whether gamestarted or not
            this.setState({gameStarted: gameSession})
            console.log(this.state.gameStarted);
            
            this.setState({loginDisplay: "none"});
        
            if(this.state.gameStarted == false)
                this.setState({startPage:"block"});
            else
                this.setState({homePageDisplay: "block"});
            this.setState({showLeaderBoard: "block"});
        });

        //Refresh user data in other pages
        socket.on("refresh data", (users) => {
            
            const userList = this.state.users;
            console.log(users);
            for(var i = 0; i<users.length;i++)
            {
                var user={username: users[i][0]};
                userList[i]=user;
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
        });

        socket.on("question added", (user, question) => {
            this.setState({addQuestionDisplay: "none"});
            this.setState({currentQuestion: question});
            this.setState({questionViewDisplay: "block"});
            if(user != this.state.currentUser)
                this.setState({contactViewDisplay: "block"});
            console.log("QUESTION : " + user + question);
        });

        socket.on("reveal word", (word) => {
            this.setState({revealedWord: word});
        })
        socket.on("chat message", (msg) => {
            console.log(msg);
        })
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

    handleAddAnswer(e){
        this.setState({currentAnswer: e.target.value});
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

    //Function to render Wordmaker
    renderWordMaker(){
        if(this.state.currentUser == this.state.thinker){
            return(
            <div className = "wordSubmit" style = {{display: this.state.wordEntryDisplay}}>
                <h1>Enter word</h1>
                <input onChange = {this.handleAddWord} type = "text"></input>
                <button onClick = {this.addWord.bind(this)} className = "submitWord">Submit Word</button>
            </div>
            )
        }
    }

    //Function to render question maker
    renderQuestionMaker()
    {

    }

    //Function to render Contact UI
    renderContactPage()
    {

    }

    renderWord(){
        if( this.state.currentUser == this.state.thinker){
            return(
                <h1>{this.state.currentWord}</h1>
            )
        }
        else{
            return(
                <h1>{this.state.revealedWord}</h1>
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

    onClickContact() {
        socket.emit("handle contact", this.state.currentUser, this.state.currentAnswer);
    }

    onClickAnswer() {
        socket.emit("handle answer", this.state.currentUser, this.state.currentAnswer);
    }

    //Render Question Interface
    renderQuestionInterface(){

        return(
            <div className = "questionDiv" style = {{display: this.state.addQuestionDisplay}}>
                <input onChange = {this.handleAddQuestion} placeholder = "AddQuestion" type = "text"></input>
                <input onChange = {this.handleAddAnswer} placeholder = "AddAnswer" type = "text"></input>
                <button onClick = {this.onClickAsk.bind(this)} className = "AskQuestion">Ask</button>
                <button onClick = {this.onClickCancel.bind(this)} className = "CancelAskQuestion">Cancel</button>
            </div>
        )
    }

    //Function to render Ask Question button that locks
    renderAskQuestionButton(){
        if(this.state.currentUser != this.state.thinker){
        return(
            <div className = "lockButton" style = {{display: this.state.lockButtonDisplay}}>
                <button onClick = {this.onClickLock.bind(this)} className = "lockToAskButton">Ask Question</button>
            </div>
        )}
    }

    //Function to render Ask Question button that locks
    renderContactView(){
        if(this.state.currentUser != this.state.thinker){
        return(
            <div className = "contactView" style = {{display: this.state.contactViewDisplay}}>
                <input onChange = {this.handleAddAnswer} placeholder = "Answer" type = "text"></input>
                <button onClick = {this.onClickContact.bind(this)} className = "Contact">Contact</button>
            </div>
        )} else {
        return(
            <div className = "contactView" style = {{display: this.state.contactViewDisplay}}>
                <input onChange = {this.handleAddAnswer} placeholder = "Answer" type = "text"></input>
                <button onClick = {this.onClickAnswer.bind(this)} className = "Submit Answer">Answer</button>
            </div>
        ) 
        }
    }

    renderQuestionView() {
        return(
            <div className = "QuestionView" style = {{display: this.state.questionViewDisplay}}>
                Current Question : {this.state.currentQuestion}
            </div>
        )    
    }

    //Function to render LeaderBoard
    renderLeaderBoard(){
        
        console.log("LEADERBOARD");
        const users = this.state.users;

        console.log(users);
        const userList = users.map((user, index) =>(
            <li key={index}>
                <h1>{user.username}</h1>
            </li>
        ));

        return(
            <ul className = "leader">
                {userList}
            </ul>
        );
    }

    render(){

        return(
            <body>
            <div className = "fullPage">
                {/*Login Component*/}

                <div className = "loginWrapper" style={{display:this.state.loginDisplay}}>
                    <div class = "loginForm">
                        <input class ="loginText" placeholder = "Enter username" type = "text" onChange={this.handleAddUser}></input><br/>
                        <button class = "loginButton" onClick={this.sendUserData.bind(this)}>Enter Game</button>
                    </div>
                </div>

                
                <div className="startGamePage" style={{display:this.state.startPage}}>
                    <button className = "startButton" onClick = {this.startButtonClicked.bind(this)}>Start Game</button>
                </div>
                
                <div className = "leaderBoard" style = {{display: this.state.showLeaderBoard}}>
                    {this.renderLeaderBoard()}
                </div>
        
                {/*Homepage Component*/}
            
                <div className = "homePageWrapper" style={{display:this.state.homePageDisplay}}>
                    
                    { /*This will be based on user state */ } 
                    <div className = "centralComponent">
                        
                        <div className = "word">
                            {this.renderWord()}
                        </div>

                        <div className = "wordMaker">
                            {this.renderWordMaker()}
                        </div>

                        <div className = "questionAsk">
                            {this.renderAskQuestionButton()}
                        </div>

                        <div className = "questionView">
                            {this.renderQuestionView()}
                        </div>
                        
                        <div className = "contactView">
                            {this.renderContactView()}
                        </div>

                        {this.renderQuestionInterface()}

                    </div>
                </div>
            </div>
            </body>
        );
    }
}

export default HomePage