function startGame() {
    const pairsNumber = document.getElementById("card-number").value;
    window.cardNumber = pairsNumber * 2;

    if (pairsNumber < 2 || pairsNumber > 15) {
        console.warn("Entre un nombre entre 2 et 15");
        return;
    }

    const header = document.getElementById("header");
    header.classList.add("hidden");
    const game = document.getElementById("game");
    game.classList.remove("hidden");
    
    const time = document.getElementById("time");
    const coups = document.getElementById("coups");
    
    window.TimeAsked = document.getElementById("timeAsked").value;
    if (TimeAsked < 1) {
        console.warn("Veuillez entrer un nombre supérieur à 0");
        return;
    }
    if (TimeAsked > 999) {
        console.warn("Veuillez entrer un nombre inférieur à 999");
        return;
    }

    coups.innerHTML = 0;
    time.innerHTML = TimeAsked;

    startTimer(time.innerHTML);

    createpairs(cardNumber)
    const pairfound = [];
    window.pairfound = pairfound;
    window.firstCardIndex = undefined;
    
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
    gameGrid.innerHTML = "";

    for (let i = 1; i <= cardCount; i++) {
        const cardContainer = document.createElement("div");
        cardContainer.className = "card-container";
        cardContainer.id = `card${i}`;
        cardContainer.onclick = () => revealCard(i);

        const card = document.createElement("div");
        card.className = "card";

        const front = document.createElement("div");
        front.className = "front";
        front.innerHTML = `<img src="assets/img/back.png" alt="Card ${i}">`;

        const back = document.createElement("div");
        back.className = "back";
        back.innerHTML = `<img src="assets/img/cards/${searchPairs(i, pairs)}.png" alt="Card ${i}">`;

        card.appendChild(front);
        card.appendChild(back);
        cardContainer.appendChild(card);
        gameGrid.appendChild(cardContainer);
    }
}

function revealCard(cardIndex) {
    const cardContainer = document.getElementById(`card${cardIndex}`);

    if (cardContainer.classList.contains("revealed")) {
        return;
    }
    cardContainer.classList.add("revealed");

    if (typeof cardIndex === "undefined") {
        console.error("Invalid cardIndex: undefined");
        return;
    }

    if (!cardContainer) {
        console.error(`Card with ID card ${cardIndex} not found.`);
        return;
    }

    const pairIndex = searchPairs(cardIndex, window.pairs);

    const coups = document.getElementById("coups");
    coups.innerHTML = parseInt(coups.innerHTML) + 1;

    checkPairs(cardIndex, pairIndex);
}

function hideCard(cardIndex) {
    if (typeof cardIndex === "undefined") {
        console.error("Invalid cardIndex: undefined");
        return;
    }

    const cardContainer = document.getElementById(`card${cardIndex}`);
    if (!cardContainer) {
        console.error(`Card with ID card${cardIndex} not found.`);
        return;
    }
    cardContainer.classList.remove("revealed");
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
        if (pairIndex === searchPairs(window.firstCardIndex, window.pairs) && window.firstCardIndex !== cardIndex) {
            window.pairfound.push(pairIndex);
            if (window.pairfound.length === window.pairs.length) {
                gameWon();
            }
        } else {
            const firstCardIndex = window.firstCardIndex;
            setTimeout(() => {
                hideCard(cardIndex);
                hideCard(firstCardIndex);
            }, 500);
        }
        window.firstCardIndex = undefined;
    }
}

async function startTimer(seconds) {
    let time = document.getElementById("time");
    window.timepaused = false;
    while (window.timepaused === false && seconds > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        seconds--;
        time.innerHTML = seconds;
    }
    if (seconds === 0) {
        gameLost();
    }
}

function pauseTimer() {
    window.timepaused = true;
    const time = document.getElementById("time");
    clearInterval(time);
}

function resumeTimer() {
    const time = document.getElementById("time");
    const seconds = parseInt(time.innerHTML);
    startTimer(seconds);
}


function quitGame() {
    const header = document.getElementById("header");
    header.classList.remove("hidden");
    const game = document.getElementById("game");
    game.classList.add("hidden");
    const menu = document.getElementById("popupMenu");
    menu.classList.add("hidden");
    
    const gameGrid = document.getElementById("game-grid");
    gameGrid.innerHTML = ""; 
    window.firstCardIndex = undefined;

    window.location.reload();
}

function pauseGame() {
    pauseTimer();
    
    const pause = document.getElementById("popupMenu");
    pause.classList.remove("hidden");

    const resumeButton = document.getElementById("resume");
    resumeButton.classList.remove("hidden");

    menuName = document.getElementById("menuName");
    menuName.innerHTML = "Pause";

    setTimeout(() => {
        document.querySelectorAll(".card-container").forEach(card => card.onclick = null);
    }, 500);
}

function continueGame() {
    const pause = document.getElementById("popupMenu");
    pause.classList.add("hidden");

    document.querySelectorAll(".card-container").forEach((card, index) => {
        card.onclick = () => revealCard(index + 1);
    }
    );

    resumeTimer();
}

async function gameWon() {
    pauseTimer();

    document.querySelectorAll(".card-container").forEach(card => card.onclick = null);

    const menu = document.getElementById("popupMenu");
    menu.classList.remove("hidden");

    const resumeButton = document.getElementById("resume");
    resumeButton.classList.add("hidden");
    
    menuName = document.getElementById("menuName");
    menuName.innerHTML = "Bravo ! Vous avez gagné !";

    await new Promise(resolve => setTimeout(resolve, 1000));
    const name = prompt("Entrez votre nom :");

    const coups = parseInt(document.getElementById("coups").innerHTML);
    const timeMax = parseInt(document.getElementById("timeAsked").value);
    const timeRemaining = parseInt(document.getElementById("time").innerHTML);
    const time = timeMax - timeRemaining + 1; 
    const pairNumber = parseInt(document.getElementById("card-number").value);

    const score = {
        username: name,
        timeSpend: time,
        movesNB: coups,
        cardNB: pairNumber * 2,
        finalScore: parseInt(Math.max(0, 1000 * (cardNumber / coups) * (cardNumber / time)))
    };

    fetch("http://localhost:3000/save_score.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(score)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(text => {
        try {
            const data = JSON.parse(text); 
            console.log("Server response:", data);
            if (data.status !== "success") {
                console.error("Error from server:", data.message);
            }
        } catch (error) {
            console.error("Error parsing JSON response:", error, "Response text:", text);
        }
    })
    .catch(error => console.error("Error:", error));
}

function gameLost() {
    pauseTimer();

    document.querySelectorAll(".card-container").forEach(card => card.onclick = null);

    const menu = document.getElementById("popupMenu");
    menu.classList.remove("hidden");

    const resumeButton = document.getElementById("resume");
    resumeButton.classList.add("hidden");
    
    menuName = document.getElementById("menuName");
    menuName.innerHTML = "Dommage ! Vous avez perdu !";
}

function showHistoric() {
    const historicBoard = document.getElementById("historic-board");
    historicBoard.classList.remove("hidden");
    const header = document.getElementById("header");
    header.classList.add("hidden");
}

function closeHistoric() {
    const historicBoard = document.getElementById("historic-board");
    historicBoard.classList.add("hidden");
    const header = document.getElementById("header");
    header.classList.remove("hidden");
}

function searchPlayer() {
    const searchInput = document.getElementById("search").value.trim();
    const historicContent = document.getElementById("historic-content");

    fetch("http://localhost:3000/search_player.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: searchInput })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.status === "success" && data.records && data.records.length > 0) {
            historicContent.innerHTML = data.table; // Use the table from the server response
        } else if (data.status === "success") {
            historicContent.innerHTML = "<p>Aucun résultat trouvé.</p>";
        } else {
            historicContent.innerHTML = `<p>${data.message}</p>`;
        }
    })
    .catch(error => {
        console.error("Error:", error);
        historicContent.innerHTML = `<p>Erreur lors de la recherche.</p>`;
    });
}

addEventListener("keypress", (event) => {
    if (event.key === "p") {
        const game = document.getElementById("game");
        if (game.classList.contains("hidden")) {
            return;
        }
        const menu = document.getElementById("popupMenu");
        if (menu.classList.contains("hidden")) {
            pauseGame();
        } else {
            continueGame();
        }
    }
})

