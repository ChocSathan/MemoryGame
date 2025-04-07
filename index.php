<?php
session_start();
require 'db_connect.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Memory Game</title>
    <link rel="stylesheet" href="style.css">
    <link rel="icon" href="assets/img/icon.png" type="image/x-icon">
</head>

<body>
    <div id="header">
        <h1>Jeu de mémoire</h1>
        <label for="card-number">Nombre de paires:</label>
        <input type="number" id="card-number" name="card-number" min="2" max="15" value="5"><br>
        <label for="timeAsked">Temps :</label>
        <input type="number" id="timeAsked" name="timeAsked" min="1" max="999" value="35"><br>
        <button id="start" onclick="startGame()">Start Game</button><br>
        <button id="historic" onclick="showHistoric()">Historique des Joueurs</button>
    </div>
    <div id="scoreboard">
        <?php
        echo "<h2>Meilleurs scores</h2>";
        try {
            $stmt = $conn->prepare("SELECT username, MAX(finalScore) AS maxScore FROM SCORES GROUP BY username ORDER BY maxScore DESC LIMIT 10");
            $stmt->execute();
            $scores = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($scores as $score) {
                echo "<p>" . htmlspecialchars($score['username']) . " : " . htmlspecialchars($score['maxScore']) . "</p>";
            }
        } catch (PDOException $e) {
            echo "Erreur : " . $e->getMessage();
        }
        ?>
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
    <div class="hidden" id="historic-board">
        <h2>Historique des Joueurs</h2>
        <button id="closeHistoric" onclick="closeHistoric()">Retour</button><br>
        <input type="text" id="search" placeholder="Rechercher un joueur..."><br>
        <button id="searchBtn" onclick="searchPlayer()">Rechercher</button><br>
        <div id="historic-content">
            <?php
            try {
                $stmt = $conn->prepare("SELECT username, timeSpend, movesNB, cardNB, finalScore FROM SCORES WHERE username LIKE :username ORDER BY finalScore DESC");
                $stmt->bindValue(':username', '%' . ($_POST['search'] ?? '') . '%', PDO::PARAM_STR);
                $stmt->execute();
                $historic = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo "<table>";
                echo "<tr>";
                echo "<th>Nom d'utilisateur</th>";
                echo "<th>Temps passé</th>";
                echo "<th>Nombre de coups</th>";
                echo "<th>Nombre de cartes</th>";
                echo "<th>Score final</th>";
                echo "</tr>";
                foreach ($historic as $record) {
                    echo "<tr>";
                    echo "<td>" . htmlspecialchars($record['username']) . "</td>";
                    echo "<td>" . htmlspecialchars($record['timeSpend']) . "</td>";
                    echo "<td>" . htmlspecialchars($record['movesNB']) . "</td>";
                    echo "<td>" . htmlspecialchars($record['cardNB']) . "</td>";
                    echo "<td>" . htmlspecialchars($record['finalScore']) . "</td>";
                    echo "</tr>";
                }
                echo "</table>";
            } catch (PDOException $e) {
                echo "Erreur : " . $e->getMessage();
            }
            ?>
        </div>
    </div>
    <div class="hidden" id="popupMenu">
        <h2 id="menuName">Placeholder</h2>
        <button id="resume" onclick="continueGame()">Continuer</button><br>
        <button id="quit" onclick="quitGame()">Retour au Menu Principal</button>
    </div>

</body>
<script src="app.js"></script>
</html>