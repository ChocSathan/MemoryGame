function startGame() {
    const score = document.getElementById("scoring");
    const timer = document.getElementById("timer");
    const pairsNumber = document.getElementById("card-number").value;
    const board = document.getElementById("game-table");
    let cardNumber = pairsNumber * 2;

    score.classList.remove("hidden");
    timer.classList.remove("hidden");

    generateTable(cardNumber);
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
    
    let tableHTML = '<table>';
    let cardIndex = 1;

    for (let i = 0; i < rows; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < cols; j++) {
            if (cardIndex <= cardCount) {
                tableHTML += `<td>Card ${cardIndex}</td>`;
                cardIndex++;
            } else {
                tableHTML += '<td></td>'; // Fill empty cells
            }
        }
        tableHTML += '</tr>';
    }
    tableHTML += '</table>';

    document.getElementById("game-table").innerHTML = tableHTML;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}