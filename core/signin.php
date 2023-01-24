<?php
header("Access-Control-Allow-Origin: *");
require 'connect.php';

    $username = mysqli_real_escape_string($conn,$_GET['username']);
    $password = mysqli_real_escape_string($conn,$_GET['password']);

    $result = $conn->query("SELECT * FROM users WHERE username='$username'") or die($conn->error);
    $user = $result->fetch_assoc();

    if (empty($username) || empty($password)) {
      $data = array("message" => "You missed a spot.");
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
      $data = array("message" => "Sign in successful.");
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
