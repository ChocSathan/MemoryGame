<?php
$servername = 'localhost';
$dbname = 'technoweb';
$username = 'root';
$password = '1701';

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo ("Erreur de connexion : " . $e->getMessage());
}
?>