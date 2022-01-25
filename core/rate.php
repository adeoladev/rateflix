<?php

require 'connect.php';

$rating = mysqli_real_escape_string($conn,$_GET['rating']);
$username = $_GET['username'];
$movie = $_GET['movie'];
$date = date("F j, Y h:i a");

$stmt = $conn->prepare("INSERT INTO ratings (username, imdb_id, rating, date) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssis", $username, $movie, $rating, $date);
$stmt->execute();
$stmt->close();
$conn->close();

if (mysqli_connect_errno()) {
    header("HTTP/1.0 404".mysqli_connect_error());
    exit();
} else {
    header("HTTP/1.0 200 Success");
    exit();
}
  


?>
