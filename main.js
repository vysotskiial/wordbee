// Game state
let gameLetters = {inner: '', outer: []};
let gameSolution = [];
let score = 0;
let found = [];
let word_score = 0;
let guessed_words;
let words_from_file = ''

// control buttons
const letterInput = document.querySelector('#letter-input')

document.getElementById("delete-button").addEventListener('click', () => {
	letterInput.textContent = letterInput.textContent.substring(0, letterInput.textContent.length - 1);
});

function isPangram(word) {
	for (l of gameLetters.outer) {
		if (!(word.includes(l))) {
			return false;
		}
	}
	return true;
}

function rightWord(selector, word) {
	$(".points").html("+" + word_score);
	$(selector).fadeIn(1000);
	$(selector).fadeOut(500);
	score = score + word_score;
	document.getElementById("score").innerHTML = score;
	found.push(word);
	found.sort()
	document.getElementById("numfound").innerHTML = found.length;
	document.querySelector("#found_preview").innerHTML = found.join(" · ");

	// Modify hint tables accordingly
	const ht = document.getElementById("hints_table");
	let l = word[0];
	let i = 0, j = 0;
	for (; i < ht.rows.length; i++) {
		if (ht.rows[i].cells[0].textContent == l)
			break;
	}
	for (; j < ht.rows[0].cells.length; j++)
		if (ht.rows[0].cells[j].textContent == word.length)
			break;
	const cell = ht.rows[i].cells[j];
	cell.textContent = String(Number(cell.textContent) - 1);

	const nt = document.getElementById("numberTable");
	for (i = 0; i < nt.rows.length; i++) {
		for (j = 0; j < nt.rows[i].cells.length; j = j + 2) {
			const key_cell = nt.rows[i].cells[j];
			if (key_cell.textContent == word.slice(0, 2)) {
				const value_cell = nt.rows[i].cells[j + 1];
				value_cell.textContent = String(Number(value_cell.textContent) - 1);
				return;
			}
		}
	}
}

function wrongInput(selector){
	$(selector).fadeIn(1000);
	$(selector).fadeOut(500);
	$("#letter-input").effect("shake", {times:2.5}, 450, function(){} );
}

document.getElementById('enter-button').addEventListener('click', () => {
	let word =  letterInput.textContent
	letterInput.textContent = ""
	if (word.length < 4)
		wrongInput("#too-short");
	else if (word.includes(gameLetters.inner) !== true)
		wrongInput("#miss-center");
	else if (gameSolution.includes(word) !== true)
		wrongInput("#invalid-word");
	else if (found.includes(word))
		wrongInput("#already-found");
	else if (gameSolution.includes(word)){
		word_score = word.length;
		if (isPangram(word)) {
			word_score = word_score + 7;
			rightWord("#pangram", word);
			return;
		}
		if (word.length == 4) {
			word_score = word_score - 3;
			rightWord("#good", word)
		}
		else if (word.length < 7) {
			rightWord("#great", word)
		}
		else {
			rightWord("#amazing", word);
		}
	}
});

//shuffle the outer letters around the center letter
function putLetters() {
	const outerCell = document.querySelectorAll('[data-cell]')
	outerCell.forEach((element,index)=>{
		element.innerText = gameLetters.outer[index];
	});
}

const shufflebutton = document.getElementById("shuffle-button")
shufflebutton.addEventListener('click', () => {
	array = gameLetters.outer

	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1)); 
		[array[i], array[j]] = [array[j], array[i]];
	} //fisher-yates algo
	putLetters();
});

// hint button
const popup = document.getElementById("popup");
const openBtn = document.getElementById("open-button");
const closeBtn = document.getElementById("closeBtn");

openBtn.addEventListener("click", () => {
  popup.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
});

// letter clicks
const letter = document.querySelectorAll('.letter')
letter.forEach(letter => {
	letter.addEventListener('click', (e) => {
		letterInput.innerText += e.target.textContent;
	});
	letter.addEventListener('mousedown', (event) => {
		if (event.detail > 1) {
			event.preventDefault(); // prevent text selection with double click
		}
	});
})

// Found words list popup
const toggle_collapse = document.querySelector("#toggleText");
toggle_collapse.addEventListener("click", () => {
	const found_words = document.querySelector("#found_preview");
	const expanded = found_words.classList.toggle("is-expanded");
	toggle_collapse.classList.toggle("is-expanded", expanded);
	toggle_collapse.setAttribute("aria-expanded", String(expanded));
	toggle_collapse.setAttribute("aria-label", expanded ? "show less" : "show more");
});

// Preparations before starting
function prepareHintsTable() {
	hint_lengths = lengthtable(gameSolution);
	const hints_container = document.getElementById("hintsTable");
	const table = document.createElement("table");
	table.id = "hints_table";

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
	let starts_data = startstable(gameSolution);
	const numberTable = document.createElement("table");
	numberTable.id = "numberTable";
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
function makeLetters() {
	letters = []
	while (letters.length < 7) {
		let letter = randletter();
		if (!letters.includes(letter)) letters.push(letter);
	}

	let center = letters.splice(randint(7), 1);

	gameLetters.inner = center[0];
	gameLetters.outer = letters;
}

function makeSolution() {
	const words = words_from_file.split("\n");
	console.log(gameLetters.inner)
	const possible = [...gameLetters.outer, gameLetters.inner];
	let result=[];
	let acceptable = 1
	for (let word of words){
		if (!(word.includes(gameLetters.inner))){
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
			gameSolution.push(word);
		}
	}
	console.log(gameSolution)
}

function lengthtable(words) {
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
	for (word of gameSolution) {
		if (word.length == 4) {
			score = score + 1;
		}
		else {
			score = score + word.length;
		}
		if (isPangram(word))
			score = score + 7;
	}
	return String(score);
}

function maxwords()
{
	return String(gameSolution.length)
}


async function fetch_file(){
	words_from_file = await(await(fetch("filtered_words.txt"))).text();
}

async function prepare() {
	await fetch_file();
	makeLetters();
	makeSolution();
	document.querySelector('[data-cell-center]').innerText = gameLetters.inner;

	putLetters();
	document.getElementById("maxscore").innerHTML = maxscore();
	document.getElementById("maxwords").innerHTML = maxwords();
	prepareHintsTable();
	prepareHintsColumns();
}

prepare();
