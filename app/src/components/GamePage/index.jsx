import React from 'react'
import "./style.css"
import socketIOClient from "socket.io-client";


var socket = socketIOClient("http://127.0.0.1:3001");


class HomePage extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            currentUser: "none",
            thinker: "none",
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
            showLeaderBoard: "none",
            endpoint: "http://127.0.0.1:3001"
        };
        this.handleAddUser = this.handleAddUser.bind(this);
    }


    componentDidMount(){
        const endpt = this.state.endpoint;
        //socket = socketIOClient(endpt);
        //On getting game started event change to game page
        socket.on("game started", thinkerName => {
            this.setState({startPage: "none"});
            if(this.state.loginDisplay == "none")
               this.setState({homePageDisplay: "block"});
            console.log(thinkerName);    
            this.setState({thinker: thinkerName});
            this.setState({gameStarted: true});
        });

        socket.on("login successful", users => {
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
        console.log("HIT ENDPOINT");
    }


    handleAddUser(e){
        console.log("ADD USER");
        this.setState({currentUser: e.target.value});
    }

    sendUserData(){
        socket.emit("add user", this.state.currentUser);
        this.setState({loginDisplay: "none"});
        if(this.state.gameStarted == false)
            this.setState({startPage:"block"});
        else
            this.setState({homePageDisplay: "block"});
        this.setState({showLeaderBoard: "block"});
    }

    //Start game instance on Start Game Button click
    startButtonClicked(){
        socket.emit("start","");
    }

    
    //Function to render Wordmaker
    renderWordMaker(){
        if(this.state.currentUser == this.state.thinker){
            return(
            <div className = "wordSubmit">
                <h1>Enter word</h1>
                <input type = "text"></input>
                <input type = "submit"></input>
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

    //Function to render Ask Question button that locks
    renderAskQuestionButton(){
        if(this.state.currentUser != this.state.thinker){
        return(
            <div className = "lockButton">
                <input type = "submit"></input>
            </div>
        )}
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

                <div className = "leaderBoard" style = {{display: this.state.showLeaderBoard}}>
                        {this.renderLeaderBoard()}
                    </div>

                <div className="startGamePage" style={{display:this.state.startPage}}>
                    <button className = "startButton" onClick = {this.startButtonClicked.bind(this)}>Start Game</button>
                </div>
                {/*Homepage Component*/}
            
                <div className = "homePageWrapper" style={{display:this.state.homePageDisplay}}>
                    
                    { /*This will be based on user state */ } 
                    <div className = "centralComponent">
                        
                        <div className = "wordMaker">
                            {this.renderWordMaker()}
                        </div>

                        <div className = "questionAsk">
                            {this.renderAskQuestionButton()}
                        </div>
                    </div>
                </div>
            </div>
            </body>
        );
    }
}

export default HomePage