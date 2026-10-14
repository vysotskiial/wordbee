# Queen Bee (Clone of NY Times Spelling Bee)

I love playing the NYTimes Spelling Bee game, so I decided to see if I could replicate it and make a few upgrades! This version of the game will have a 5 minute time limit to try to make all of the possible words in the solution.
## Current Status: In process

**Link to project:** 

![Untitled design (1)](https://user-images.githubusercontent.com/22897756/168183481-b9ff77e9-0eb6-410b-a29a-464b0062d305.gif)

## How It's Made:

**Tech used:** HTML, CSS, JavaScript

HTML5 to layout the basic elements of the game. 

CSS3 to create the design using. Flexbox to position the elements. Originally, I had planned to use pseudo elements to create the hexagon cells from individual divs, but I wanted to have a background color transition on hover which don't work with pseudo elements. Instead, I used a simple svg hexagon shape as the background image for each cell.

Vanilla JavaScript to create the functionality:
 * To load the game letters into the hexagon cells on page load
 * To add a letter to the input when the user clicks the correct hexagon
 * To check if the word submitted by the user is at least 4 letters, includes the center letter and is in the solutions list
 * The shuffle the outer letters of the "hive" around to different cells (this can help the user visualize new words)


## Lessons Learned:
Had to understand the Fisher-Yates alogorithm to make the shuffle button work. 

## To Do List:

This is just the first early draft of the project. Must add:
 * More games/solutions - right now there is only 1 letter array/solutions 
 * Points and scoring
 * 5 minute countdown timer that shows how many words the user got versus the total possible in 5 minutes.
 * Cool animation if the person gets the pangram (a word with all 7 letters). 
 * Improve the UI/UX design 
 * Make sure its mobile responsive
 * Make sure it conforms with OOP practices
 

