<?php
header("Access-Control-Allow-Origin: *");
require 'connect.php';

    $username = mysqli_real_escape_string($conn,$_GET['username']);
    $password = mysqli_real_escape_string($conn,$_GET['password']);

    $result = $conn->query("SELECT * FROM users WHERE username='$username'") or die($conn->error);
    $user = $result->fetch_assoc();

    if (empty($username) || empty($password)) {
      $data = array("message" => "Please complete the form.");
      header("Content-Type: application/json");
      echo json_encode($data);
      exit(); 
    } else if ($result->num_rows == 0) {
      $data = array("message" => "Incorrect username or password.");
      header("Content-Type: application/json");
      echo json_encode($data);
      exit();
    } 
    
    if (password_verify($password, $user['password'])) {
      $ratingQuery = mysqli_query($conn,"SELECT * FROM ratings WHERE username='$username'");
      $ratings = mysqli_num_rows($ratingQuery);
      
      $year = date('Y', strtotime($user['created_at']));
      $data = array("message" => "Sign in successful.", "year" => $year, "ratings" => $ratings);
      header("Content-Type: application/json");
      echo json_encode($data);
      exit();

    } else {
      $data = array("message" => "Incorrect username or password.");
      header("Content-Type: application/json");
      echo json_encode($data);
      exit();
    }
    
?>
