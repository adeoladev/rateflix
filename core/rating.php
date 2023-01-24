<?php
header("Access-Control-Allow-Origin: *");
require 'connect.php';

$movie = $_GET['movie'];
$array = array();

$sql = "SELECT * FROM ratings WHERE imdb_id = '$movie'";
$result = $conn->query($sql);
$num = mysqli_num_rows($result);

if ($num == 0) {
header("HTTP/1.0 404 No Rateflix Ratings.");
exit();
} else {

foreach($result as $row) {
    array_push($array,$row['rating']);
}

$a = array_filter($array);
$average = array_sum($a)/count($a);
$avg = $average * 10;
$final = round($avg, 0);


$data=array('rating'=>$final);
header('Content-Type: application/json');
echo json_encode($data);
}

?>
