### Ko9takt

## Description

Ko9takt is an interesting twist on the regular trivia games which you can enjoy with your friends.Currently a basic prototype of the game is live at http://ko9takt.herokuapp.com

Let me go through the basic rules of the game to get you started with
* **Basic Rules**
  * The game has 3 roles, one wordsetter, one qmaster, and guessers (need to come up with better names)
  * The wordsetter thinks of a word and their aim is to stop the guessers from unveiling it. The role of the wordsetter rotates after each round.
  * The game starts with the fist letter of the word being unveiled.
  * All the other players are guessers including the qmaster and their aim is to unveil the word set by the wordsetter. So how do they do that?
  * Any one of the guessers asks a trivia question to all while the other players including the wordsetter try to answer it
  * If the wordsetter answers correctly the next letter of the word doesnt get unveiled.
  * However if the wordsetter fails to answer and one of the guessers answers the question correctly a new letter is unveiled.
  * The round ends when the whole word is unveiled
  * Meanwhile any of the guessers can guess the word and the round ends, however guessing the word wrongly leads to huge penalty

Some future goals we have thought of are described below
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
