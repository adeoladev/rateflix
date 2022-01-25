<?php

require 'connect.php';

    $username = mysqli_real_escape_string($conn,$_GET['username']);
    $password = mysqli_real_escape_string($conn,$_GET['password']);

    $sqldate = date("Y-m-d H:i:s");
    
    $result = $conn->query("SELECT * FROM users WHERE username='$username'") or die($conn->error);
    
    if ($result->num_rows>0) {
      header("HTTP/1.0 404 Username is taken");
      exit();
    } else {
      $hashedPwd = password_hash($password, PASSWORD_DEFAULT);
      $stmt = $conn->prepare("INSERT INTO users (username, password, date) VALUES (?,?,?)");
      $stmt->bind_param("sss", $username, $hashedPwd, $sqldate);

      $stmt->execute();
      $stmt->close();

      $conn->close();

      header("HTTP/1.0 200 Success");
      exit();
    }
    


?>