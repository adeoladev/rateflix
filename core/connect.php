<?php
error_reporting(0);
$conn = mysqli_connect("localhost", "root", "", "rateflix_db");
if (!$conn) {
die("Connection failed: ".mysqli_connect_error());
}
?>
