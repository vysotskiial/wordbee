const outerCell = document.querySelectorAll('[data-cell]')
const innerCell = document.querySelector('[data-cell-center]')
const hexagon = document.querySelectorAll('.hexagon')
const letter = document.querySelectorAll('.letter')
const letterInput = document.querySelector('#letter-input')
const deleteButton = document.getElementById("delete-button")
const enterButton = document.getElementById('enter-button')
const warningMessage = document.getElementById('warning-message')


//LOAD LETTERS ON PAGE LOAD
document.body.onload = function() {
    outerCell.forEach((element,index)=>{
      element.innerText = gameLetters.outer[index]
    })
    innerCell.innerText = gameLetters.inner
}

let gameLetters = MakeLetters()

function randInt(max, min = 0) {
	return Math.floor(Math.random()*(max - min) + min)
}

//GAME LETTERS AND SOLUTIONS
function MakeLetters() {
	let alphabet = [..."АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"];
	let letters = [];

	while (letters.length < 7) {
		let letter = alphabet[randInt(alphabet.length)];
		if (!letters.includes(letter)) letters.push(letter);
	}

	let inner_idx = randInt(7)
	let center = letters.splice(inner_idx, 1)

	return {
		inner: center,
		outer: letters,
		solution: Solution(center[0], letters) 
	}
}

async function Solution(inner, outer){
	const response=await fetch("words.txt");
	const text = await response.text();
	const words = text.split("\n");
	const possible = [...outer, inner];
	inner=inner.toLowerCase();
	for (let i=0; i<possible.length; i++){
		possible[i]=possible[i].toLowerCase();
	}

  console.log(possible);
	let result=[];
	console.log(words.length);
	console.log(inner)
	console.log(inner.includes(words[0]))
	let acceptable = 1
	for (let word of words){
		if (!(word.includes(inner))){
			continue;
		}
		for (let letter of word){
			acceptable=1;
			if (!(possible.includes(letter))){
				//console.log(letter, possible)
				acceptable=0;
				break;
			}
		}
		if (acceptable==1){
			console.log('Add word');
			result.push(word);
		}
	}
  console.log(result);
	return result;
}

//SHUFFLE THE OUTER LETTERS AROUND THE CENTER LETTER
const shuffleButton = document.getElementById("shuffle-button")
shuffleButton.addEventListener('click', shuffle)

function shuffle(array) {
    array = gameLetters.outer

    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]];
    } //Fisher-Yates algo

    outerCell.forEach((element,index)=>{
        element.innerText = array[index]
      })
}

//ADD EVENT LISTENER TO EVERY LETTER
function selectLetter(){
    letter.forEach(letter => {
        letter.addEventListener('click', handleClick)  
    })
}
selectLetter()
    
//TAKE SELECTED LETTER AND ADD TO INPUT
function handleClick(e){
    e = e;
    let target = e.target;
    let text = target.textContent
    letterInput.innerText += text
    warningMessage.textContent = ""
}

//DELETE BUTTON + BACKSPACE INPUT
deleteButton.addEventListener('click', deleteLetter)
function deleteLetter(){
    letterInput.textContent = letterInput.textContent.substring(0, letterInput.textContent.length - 1);
}

//ENTER BUTTON + CHECKWORD
enterButton.addEventListener('click', checkWord)

function checkWord(){
   let word =  letterInput.textContent
   let centerLetter = document.querySelector('.center-letter').textContent
   if (word.length < 4){
        warningMessage.innerText = 'Too short! Must use at least 4 letters!'
       letterInput.textContent = ""
   } else if (word.includes(centerLetter) !== true){
        warningMessage.innerText = 'Must include center letter!'
    letterInput.textContent = ""
   } else if (gameLetters.solution.includes(word) !== true)  {
        warningMessage.innerText = 'Word not in list, please try again!'
        letterInput.textContent = ""
   } else if (gameLetters.solution.includes(word)){
        warningMessage.innerText = 'Great job!'
        letterInput.textContent = ""

        let ul = document.getElementById('word-list')
        let li = document.createElement('li')
        li.appendChild(document.createTextNode(word))
        ul.appendChild(li)
   }
}
//need a function to check if ALL words have been found/when last word has been found
//need a 5 minute timer - show the words that have not been found



