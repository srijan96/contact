# Ko9takt

![Landing Page](https://github.com/srijan96/contact/blob/master/public/Screenshot%20from%202021-02-25%2022-46-15.png)
## Description

Ko9takt is an interesting twist on the regular trivia games which you can enjoy with your friends.Currently a basic prototype of the game is live at http://ko9takt.herokuapp.com

The server side code is available in [this](https://github.com/srijan96/contact-server) repository.

Let me go through the basic rules of the game to get you started with
* **Basic Rules**
  * The game has 3 roles, one **wordsetter**, one **qmaster**, and **guessers** (need to come up with better names)
  * The wordsetter thinks of a word and their aim is to stop the guessers from unveiling it. The role of the wordsetter rotates after each round.
  * The game starts with the first letter of the word being unveiled.
  * All the other players are guessers including the qmaster and their aim is to unveil the word set by the wordsetter. So how do they do that?
  * Any one of the guessers (qmaster) asks a trivia question (whose answer starts with the unveiled letters) to all while the other players including the wordsetter try to answer it
  * If the wordsetter answers correctly the next letter of the word doesnt get unveiled.
  * However if the wordsetter fails to answer and one of the guessers answers the question correctly a new letter is unveiled.
  * The round ends when the whole word is unveiled
  * Meanwhile any of the guessers can guess the word and the round ends, however guessing the word wrongly leads to huge penalty

Some future goals we have thought of are described below. We aim to add more features and are looking for ideas from other contributors 
## Future Goals
  * Add multiple game room feature
  * Create a database of trivia questions
  * Create a database of players

## Tech Stack

* ReactJS
* Javascript
* HTML
* CSS
* Database Technology like MongoDB (yet to be finalized)
