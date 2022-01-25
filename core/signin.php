<?php

require 'connect.php';

    $username = mysqli_real_escape_string($conn,$_GET['username']);
    $password = mysqli_real_escape_string($conn,$_GET['password']);

    $result = $conn->query("SELECT * FROM users WHERE username='$username'") or die($conn->error);
    $user = $result->fetch_assoc();

    if ($result->num_rows == 0) {
      header("HTTP/1.0 404 Account Does Not Exist");
      exit();
    } 
    
    if (password_verify($password, $user['password'])) {
      session_start();
        
      $_SESSION['username'] = $user['username'];
      header("HTTP/1.0 200 Success");
      exit();

    } else {
      header("HTTP/1.0 404 Sign In Error");
      exit();
    }
    


?>