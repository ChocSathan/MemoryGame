<?php
require 'db_connect.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (is_array($data) && isset($data['username'])) {
        $username = trim($data['username']);

        try {
            $stmt = $conn->prepare("SELECT username, timeSpend, movesNB, cardNB, finalScore FROM SCORES WHERE username LIKE :username ORDER BY finalScore DESC");
            $stmt->bindValue(':username', '%' . $username . '%', PDO::PARAM_STR);
            $stmt->execute();
            $records = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (!empty($records)) {
                $table = "<table>";
                $table .= "<tr>";
                $table .= "<th>Nom d'utilisateur</th>";
                $table .= "<th>Temps passé</th>";
                $table .= "<th>Nombre de coups</th>";
                $table .= "<th>Nombre de cartes</th>";
                $table .= "<th>Score final</th>";
                $table .= "</tr>";

                foreach ($records as $record) {
                    $table .= "<tr>";
                    $table .= "<td>" . htmlspecialchars($record['username']) . "</td>";
                    $table .= "<td>" . htmlspecialchars($record['timeSpend']) . "</td>";
                    $table .= "<td>" . htmlspecialchars($record['movesNB']) . "</td>";
                    $table .= "<td>" . htmlspecialchars($record['cardNB']) . "</td>";
                    $table .= "<td>" . htmlspecialchars($record['finalScore']) . "</td>";
                    $table .= "</tr>";
                }

                $table .= "</table>";

                echo json_encode(["status" => "success", "table" => $table, "records" => $records]);
            } else {
                echo json_encode(["status" => "success", "message" => "Aucun résultat trouvé.", "records" => []]);
            }
        } catch (PDOException $e) {
            error_log("Database error: " . $e->getMessage());
            echo json_encode(["status" => "error", "message" => "Database error."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid input: Missing or malformed required fields."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}

$conn = null;
?>
