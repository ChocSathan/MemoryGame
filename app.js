function startGame() {
    const header = document.getElementById("header");
    header.classList.add("hidden");
    const game = document.getElementById("game");
    game.classList.remove("hidden");

    const pairsNumber = document.getElementById("card-number").value;
    let cardNumber = pairsNumber * 2;
    
    const time = document.getElementById("time");
    const coups = document.getElementById("coups");
    
    coups.innerHTML = 0;
    time.innerHTML = 0;


    createpairs(cardNumber)
    generateTable(cardNumber);
}

function createpairs(cardNumber) {
    const pairs = [];
    const usedNumbers = new Set();

    for (let i = 0; i < cardNumber; i++) {
        let randomNumber;
        do {
            randomNumber = Math.floor(Math.random() * cardNumber) + 1;
        } while (usedNumbers.has(randomNumber));
        usedNumbers.add(randomNumber);
    }

    const usedNumbersArray = Array.from(usedNumbers);
    for (let i = 0; i < cardNumber / 2; i++) {
        pairs.push([usedNumbersArray[i * 2], usedNumbersArray[i * 2 + 1]]);
    }

    window.pairs = pairs;
}

function findOptimalDimensions(cardCount) {
    let rows = Math.floor(Math.sqrt(cardCount));
    let cols = Math.ceil(cardCount / rows);
    return [rows, cols];
}

function generateTable(cardCount) {
    if (isNaN(cardCount) || cardCount <= 0) {
        alert("Please enter a valid number of cards.");
        return;
    }

    const [rows, cols] = findOptimalDimensions(cardCount);
    const gameGrid = document.getElementById("game-grid");

    gameGrid.style.display = "grid";
    gameGrid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    gameGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gameGrid.innerHTML = ""; // Clear previous grid

    for (let i = 1; i <= cardCount; i++) {
        const card = document.createElement("div");
        card.className = "card-container";
        card.id = `card${i}`;
        card.onclick = () => revealCard(i);
        card.innerHTML = `<img class="card" src="assets/img/back.png" alt="Card ${i}"></img>`;
        gameGrid.appendChild(card);
    }
}

function revealCard(cardIndex) {
    const card = document.getElementById(`card${cardIndex}`);

    if (card.classList.contains("revealed")) {
        return;
    }
    card.classList.add("revealed");
    if (typeof cardIndex === "undefined") {
        console.error("Invalid cardIndex: undefined");
        return;
    }

    if (!card) {
        console.error(`Card with ID card ${cardIndex} not found.`);
        return;
    }
    const pairIndex = searchPairs(cardIndex, window.pairs);

    const coups = document.getElementById("coups");
    coups.innerHTML = parseInt(coups.innerHTML) + 1;
    
    card.innerHTML = `<img class="card" src="assets/img/cards/${pairIndex}.png" alt="Card ${cardIndex}"></img>`;
    
    checkPairs(cardIndex, pairIndex);
}

function hideCard(cardIndex) {
    if (typeof cardIndex === "undefined") {
        console.error("Invalid cardIndex: undefined");
        return;
    }

    const card = document.getElementById(`card${cardIndex}`);
    if (!card) {
        console.error(`Card with ID card${cardIndex} not found.`);
        return;
    }
    card.classList.remove("revealed");
    card.innerHTML = '<img class="card" src="assets/img/back.png" alt="Card ${cardIndex}"></img>';
}

function searchPairs(cardIndex, pairs) {
    for (let i = 0; i < pairs.length; i++) {
        if (pairs[i].includes(cardIndex)) {
            const pairIndex = i + 1;
            return pairIndex;
        }
    }
}

function checkPairs(cardIndex, pairIndex) {
    if (typeof window.firstCardIndex === "undefined") {
        window.firstCardIndex = cardIndex;
    } else {
        document.querySelectorAll(".card-container").forEach(card => card.onclick = null);
        setTimeout(() => {
            document.querySelectorAll(".card-container").forEach((card, index) => {
                card.onclick = () => revealCard(index + 1);
            });
        }, 500);
        if (!(pairIndex === searchPairs(window.firstCardIndex, window.pairs) && window.firstCardIndex !== cardIndex)) {
            const firstCardIndex = window.firstCardIndex;
            setTimeout(() => {
                hideCard(cardIndex);
                hideCard(firstCardIndex);
            }, 500);
        }
        window.firstCardIndex = undefined;
    }
}