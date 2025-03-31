<?php
require_once 'db_connect.php';


?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Memory Game</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <div id="header">
        <h1>Memory Game</h1>
        <label for="card-number">Nombre de paires:</label>
        <input type="number" id="card-number" name="card-number" min="2" max="15" value="4"><br>
        <a href="#board"><button id="start" onclick="startGame()">Start Game</button></a>
    </div>
    <div class="hidden" id="game">
    <div class="" id="nbcoups">
            <h2>Nombre de coups: <span id="coups">-1</span></h2>
        </div>
        <div class="" id="timer">
            <h2>Temps restant: <span id="time">-1</span></h2>
        </div>
    <div class="" id="board">
        <div style="padding: 5px;"></div>
        <div id="game-grid" class="game-grid"></div>
    </div>
    </div>
</body>
<script src="app.js"></script>

</html>