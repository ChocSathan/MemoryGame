<?php
require 'db_connect.php';

header('Content-Type: application/json'); 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    error_log("Received input: " . print_r($data, true));

    if (is_array($data) && isset($data['username'], $data['timeSpend'], $data['movesNB'], $data['cardNB'], $data['finalScore'])) {
        $username = trim($data['username']);
        $timeSpend = (int)$data['timeSpend'];
        $movesNB = (int)$data['movesNB'];
        $cardNB = (int)$data['cardNB'];
        $finalScore = (float)$data['finalScore'];

        if ($timeSpend < 0 || $movesNB < 0 || $cardNB < 0 || $finalScore < 0) {
            error_log("Invalid input: Negative values are not allowed.");
            echo json_encode(["status" => "error", "message" => "Invalid input: Negative values are not allowed."]);
            exit;
        }

        try {
            $stmt = $conn->prepare("INSERT INTO SCORES (username, timeSpend, movesNB, cardNB, finalScore) VALUES (:username, :timeSpend, :movesNB, :cardNB, :finalScore)");
            $stmt->bindParam(':username', $username, PDO::PARAM_STR);
            $stmt->bindParam(':timeSpend', $timeSpend, PDO::PARAM_INT);
            $stmt->bindParam(':movesNB', $movesNB, PDO::PARAM_INT);
            $stmt->bindParam(':cardNB', $cardNB, PDO::PARAM_INT);
            $stmt->bindParam(':finalScore', $finalScore, PDO::PARAM_STR);

            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "Score saved successfully."]);
            } else {
                error_log("Execute failed: " . implode(", ", $stmt->errorInfo())); 
                echo json_encode(["status" => "error", "message" => "Failed to save score."]);
            }
        } catch (PDOException $e) {
            error_log("Database error: " . $e->getMessage());
            echo json_encode(["status" => "error", "message" => "Database error."]);
        }
    } else {
        error_log("Invalid input: Missing or malformed required fields."); 
        echo json_encode(["status" => "error", "message" => "Invalid input: Missing or malformed required fields."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}

$conn = null;
?>
