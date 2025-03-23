<?php
header("Access-Control-Allow-Origin: *");
require 'connect.php';

    $username = mysqli_real_escape_string($conn,$_GET['username']);
    $password = mysqli_real_escape_string($conn,$_GET['password']);

    $sqldate = date("Y-m-d H:i:s");
    
    $result = $conn->query("SELECT * FROM users WHERE username='$username'") or die($conn->error);
    
    if (empty($username) || empty($password)) {
      $data = array("message" => "Please complete the form.");
      header("Content-Type: application/json");
      echo json_encode($data);
      exit(); 
    } else if ($result->num_rows>0) {
      $data = array("message" => "That username is taken.");
      header("Content-Type: application/json");
      echo json_encode($data);
      exit();
    } else {
      $hashedPwd = password_hash($password, PASSWORD_DEFAULT);
      $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?,?)");
      $stmt->bind_param("ss", $username, $hashedPwd);

      $stmt->execute();
      $stmt->close();

      $conn->close();

      $data = array("message" => "Sign up successful.");
      header("Content-Type: application/json");
      echo json_encode($data);
      exit();
    }

?>
