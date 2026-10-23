const outerCell = document.querySelectorAll('[data-cell]')
const innerCell = document.querySelector('[data-cell-center]')
const hexagon = document.querySelectorAll('.hexagon')
const letter = document.querySelectorAll('.letter')
const deleteButton = document.getElementById("delete-button")
const enterButton = document.getElementById('enter-button')
const letterInput = document.querySelector('#letter-input')
const maxScore = document.getElementById("maxscore")
const maxWords = document.getElementById("maxwords")
const numFound = document.getElementById("numfound")
const currScore = document.getElementById("score")
const found_words = document.querySelector("#found_preview");
const toggle_collapse = document.querySelector("#toggleText");

toggle_collapse.addEventListener("click", () => {
	const expanded = found_words.classList.toggle("is-expanded");
	toggle_collapse.classList.toggle("is-expanded", expanded);
	toggle_collapse.setAttribute("aria-expanded", String(expanded));
	toggle_collapse.setAttribute("aria-label", expanded ? "show less" : "show more");
});

let words_from_file = ''


//load letters on page load

let gameletters;
let score = 0;
let found = [];
let word_score = 0;
let guessed_words;

function prepareHintsTable() {
	hint_lengths = lengthtable(gameletters.solution);
	const hints_container = document.getElementById("hintsTable");
	const table = document.createElement("table");
	const header = table.createTHead().insertRow();

	const inner_dicts = Object.values(hint_lengths);
	const inner_keys = inner_dicts.flatMap(dict => Object.keys(dict));
	let possible_lengths = [...new Set(inner_keys)]
	possible_lengths = possible_lengths.sort((a, b) => Number(a) - Number(b));

	const thead = document.createElement("thead");
	const headerRow = document.createElement("tr");
	for (const column of [" ", ...possible_lengths]) {
		const th = document.createElement("th");
		th.textContent = column;
		headerRow.appendChild(th);
	}

	thead.appendChild(headerRow);
	table.appendChild(thead);
	const tbody = document.createElement("tbody");

	for (const [letter, entries] of Object.entries(hint_lengths)) {
		const row = document.createElement("tr");

		const letterCell = document.createElement("th");
		letterCell.scope = "row";
		letterCell.textContent = letter;
		row.appendChild(letterCell);

		for (const key of possible_lengths) {
			const cell = document.createElement("td");
			cell.textContent = entries[key] ?? "";
			row.appendChild(cell);
		}

		tbody.appendChild(row);
	}

	table.appendChild(tbody);
	const columnCount = possible_lengths.length + 1;
	table.style.width = "95%";
	table.style.tableLayout = "fixed";
	for (const cell of table.querySelectorAll("th, td")) {
		cell.style.width = `${100/columnCount}%`;
	}
	hints_container.replaceChildren(table);
}

function prepareHintsColumns() {
	const pairsPerRow = 4;
	let starts_data = startstable(gameletters.solution);
	const numberTable = document.createElement("table");
	const numberBody = document.createElement("tbody");
	const entries = Object.entries(starts_data);

	// Each row holds several letter/value pairs
	for (let i = 0; i < entries.length; i += pairsPerRow) {
		const row = document.createElement("tr");

		for (let j = 0; j < pairsPerRow; j++) {
			const entry = entries[i + j];

			if (entry) {
				const [letter, value] = entry;
				const letterCell = document.createElement("th");
				const valueCell = document.createElement("td");

				letterCell.textContent = letter;
				valueCell.textContent = value;
				row.append(letterCell, valueCell);
			} else {
				// Keep the final row's columns aligned
				row.append(document.createElement("th"), document.createElement("td"));
			}
		}

		numberBody.appendChild(row);
	}

	numberTable.style.width = "95%";
	numberTable.style.tableLayout = "fixed";
	for (const cell of numberTable.querySelectorAll("th, td")) {
		cell.style.width = `${100/pairsPerRows}%`;
	}

	numberTable.appendChild(numberBody);
	document.getElementById("hintsColumns").replaceChildren(numberTable);
}

async function prepare() {
	await fetch_file();
	gameletters = makeletters();

	outerCell.forEach((element,index)=>{
		element.innerText = gameletters.outer[index];
	});
	innerCell.innerText = gameletters.inner;
	maxScore.innerHTML = maxscore();
	maxWords.innerHTML = maxwords();
	prepareHintsTable();
	prepareHintsColumns();
}

prepare();

function randletter() {
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
	return 'ъ'
}

function randint(max, min = 0) {
	return Math.floor(Math.random() * max + min);
}

//game letters and solutions
function makeletters() {
	letters = []
	while (letters.length < 7) {
		let letter = randletter();
		if (!letters.includes(letter)) letters.push(letter);
	}

	let inner_idx = randint(7);
	let center = letters.splice(inner_idx, 1);
	let result = solution(center[0], letters);
	console.log(result)

	return {
		inner: center,
		outer: letters,
		solution: result
	};
}

function lengthtable(words) {
	const table = {};
	console.log(words)
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

function startstable(words) {
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

function maxscore()
{
	let score = 0;
	for (word of gameletters.solution) {
		if (word.length == 4) {
			score = score + 1;
		}
		else {
			score = score + word.length;
		}
	}
	return String(score);
}

function maxwords()
{
	return String(gameletters.solution.length)
}

function solution(inner, outer) {
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

//shuffle the outer letters around the center letter
const shufflebutton = document.getElementById("shuffle-button")
shufflebutton.addEventListener('click', shuffle)

function shuffle(array) {
	array = gameletters.outer

	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1)); 
		[array[i], array[j]] = [array[j], array[i]];
	} //fisher-yates algo

	outerCell.forEach((element,index)=>{
		element.innerText = array[index]
	})
}

//add event listener to every letter
function selectletter(){
	letter.forEach(letter => {
		letter.addEventListener('click', handleclick);
		letter.addEventListener('mousedown', (event) => {
			if (event.detail > 1) {
				event.preventDefault();
			}
		});
	})
}
selectletter()

//take selected letter and add to input
function handleclick(e){
	e = e;
	let target = e.target;
	let text = target.textContent
	letterInput.innerText += text
}

//delete button + backspace input
deleteButton.addEventListener('click', deleteletter)
function deleteletter(){
	letterInput.textContent = letterInput.textContent.substring(0, letterInput.textContent.length - 1);
}

//enter button + checkword
enterButton.addEventListener('click', checkword)

function checkword(){
	//console.log(gameletters.solution)
	let word =  letterInput.textContent
	letterInput.textContent = ""
	if (word.length < 4)
		wronginput("#too-short");
	else if (word.includes(gameletters.inner) !== true)
		wronginput("#miss-center");
	else if (gameletters.solution.includes(word) !== true)
		wronginput("#invalid-word");
	else if (found.includes(word))
		wronginput("#already-found");
	else if (gameletters.solution.includes(word)){
		word_score = word.length;
		if (ispangram(word)) {
			word_score = word_score + 7;
			rightword("#pangram", word);
			return;
		}
		if (word.length == 4) {
			word_score = word_score - 3;
			rightword("#good", word)
		}
		else if (word.length < 7) {
			rightword("#great", word)
		}
		else {
			rightword("#amazing", word);
		}
	}
}

function ispangram(word) {
	for (l of gameletters.outer) {
		if (!(word.includes(l))) {
			return false;
		}
	}
	return true;
}

function rightword(selector, word) {
	$(".points").html("+" + word_score);
	$(selector).fadeIn(1000);
	$(selector).fadeOut(500);
	found.push(word);
	numFound.innerHTML = found.length;
	score = score + word_score;
	currScore.innerHTML = score;
	found_words.prepend(document.createTextNode(word + " · "));
}

function wronginput(selector){
	$(selector).fadeIn(1000);
	$(selector).fadeOut(500);
	$("#letter-input").effect("shake", {times:2.5}, 450, function(){} );
}

const popup = document.getElementById("popup");
const openBtn = document.getElementById("open-button");
const closeBtn = document.getElementById("closeBtn");

openBtn.addEventListener("click", () => {
  popup.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
});
