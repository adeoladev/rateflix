<?php
header("Access-Control-Allow-Origin: *");
require 'connect.php';
session_start();

$rating = $_GET['rating'];
$username = $_GET['username'];
$movie = $_GET['movie'];
$date = date("F j, Y h:i a");

if ($rating > 10 || $rating < 0 || empty($rating)) {
    header("HTTP/1.0 404 Incorrect Values.");
    exit(); 
}

$already = $conn->query("SELECT * FROM ratings WHERE username='$username' AND imdb_id = '$movie'") or die($conn->error);

if ($already->num_rows>0) {
    $stmt = $conn->prepare("UPDATE ratings SET rating = ? WHERE imdb_id = ? AND username = ?");
    $stmt->bind_param("iss", $rating, $movie, $username);
    $stmt->execute();
    $stmt->close();
    $conn->close();
    header("HTTP/1.0 200 Success");
    exit();
} else {
    $stmt = $conn->prepare("INSERT INTO ratings (username, imdb_id, rating) VALUES (?, ?, ?)");
    $stmt->bind_param("ssi", $username, $movie, $rating);
    $stmt->execute();
    $stmt->close();
    $conn->close();
    header("HTTP/1.0 200 Success");
    exit();
}

?>
