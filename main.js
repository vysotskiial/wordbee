const outerCell = document.querySelectorAll('[data-cell]')
const innerCell = document.querySelector('[data-cell-center]')
const hexagon = document.querySelectorAll('.hexagon')
const letter = document.querySelectorAll('.letter')
const letterInput = document.querySelector('#letter-input')
const deleteButton = document.getElementById("delete-button")
const enterButton = document.getElementById('enter-button')
const warningMessage = document.getElementById('warning-message')

let words_from_file = ''


//LOAD LETTERS ON PAGE LOAD

let gameLetters;

async function prepare() {
	await fetch_file()
	gameLetters = MakeLetters()

	outerCell.forEach((element,index)=>{
		element.innerText = gameLetters.outer[index]
	})
	innerCell.innerText = gameLetters.inner
}
prepare()

function randLetter() {
	let alphabet = {
'А':0.11374635257277062,
'О':0.20478524660166536,
'Е':0.28350740160842647,
'И':0.3607394491495267,
'К':0.4280567219414988,
'Р':0.4926962493772685,
'Н':0.5570288591559319,
'Т':0.6134349868336773,
'С':0.657430965767561,
'Л':0.7012935022418333,
'П':0.7339201836168244,
'В':0.7620409579389368,
'М':0.789209842715821,
'Д':0.815044302896591,
'У':0.8392463169881148,
'Б':0.8576524802505161,
'З':0.8748176286385312,
'Г':0.8919382962066758,
'Я':0.9061766066472138,
'Ч':0.919676535477902,
'Ь':0.9330430218489787,
'Ш':0.9436739377980214,
'Ц':0.953348516119849,
'Ф':0.9613061347946764,
'Х':0.9689835243043199,
'Ж':0.9761226958935306,
'Й':0.9829816383175574,
'Ы':0.989257882001281,
'Щ':0.9935947619386519,
'Ю':0.996717315493559,
'Э':0.9993772685218132,
'Ъ':0.9999999999999998,
	}
	let p = Math.random(0, 1);
	for (let letter in alphabet) {
		if (alphabet[letter] > p) {
			return letter;
		}
	}
	return 'Ъ'
}

function randInt(max, min = 0) {
	return Math.floor(Math.random() * max + min);
}

//GAME LETTERS AND SOLUTIONS
function MakeLetters() {
	letters = []
	while (letters.length < 7) {
		let letter = randLetter();
		if (!letters.includes(letter)) letters.push(letter);
	}

	let inner_idx = randInt(7);
	let center = letters.splice(inner_idx, 1);
	let result = Solution(center[0], letters);
	console.log(result)

	return {
		inner: center,
		outer: letters,
		solution: result
	};
}

function LengthTable(words) {
	const table = {};
	const longest = Math.max(...words.map(word => word.length));
	for (word of words) {
		if (!(word[0] in table)) {
			table[word[0]] = {};
			for (let length = 4; length <= longest; length++) {
				table[word[0]][length] = 0;
			}
		}
		table[word[0]][word.length] = table[word[0]][word.length] + 1;
	}
	return table;
}

function StartsTable(words) {
	const table = {};
	const longest = words.length;
	for (word of words) {
		const start = word.slice(0, 2);
		if (!(start in table)) {
			table[start] = 0;
		}
		table[start] = table[start] + 1;
	}
	return table;
}

function Solution(inner, outer) {
	const words = words_from_file.split("\n");
	const possible = [...outer, inner];
  console.log(possible);
	let result=[];
	let acceptable = 1
	for (let word of words){
		if (!(word.includes(inner))){
			continue;
		}
		for (let letter of word){
			acceptable=1;
			if (!(possible.includes(letter))){
				acceptable=0;
				break;
			}
		}
		if (acceptable==1){
			result.push(word);
		}
	}
	return result;
}

async function fetch_file(){
	words_from_file = await(await(fetch("filtered_words.txt"))).text();
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
	 //console.log(gameLetters.solution)
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



