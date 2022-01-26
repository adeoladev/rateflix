<?php

require 'connect.php';

    $username = mysqli_real_escape_string($conn,$_GET['username']);
    $password = mysqli_real_escape_string($conn,$_GET['password']);

    $result = $conn->query("SELECT * FROM users WHERE username='$username'") or die($conn->error);
    $user = $result->fetch_assoc();

    if (empty($username) || empty($password)) {
      header("HTTP/1.0 404 Error: You missed a spot.");
      exit(); 
    } else if ($result->num_rows == 0) {
      header("HTTP/1.0 404 Error: Account Does Not Exist.");
      exit();
    } 
    
    if (password_verify($password, $user['password'])) {
      session_start();
        
      $_SESSION['username'] = $user['username'];
      header("HTTP/1.0 200 Success");
      exit();

    } else {
      header("HTTP/1.0 404 Error: Incorrect Password.");
      exit();
    }
    
?>
