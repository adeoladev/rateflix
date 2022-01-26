<?php
session_start();

$username = '<i class="fas fa-user"></i>';
$loggedIn = "data-bs-toggle='modal' data-bs-target='#accountModal'";
$modal = "#accountModal";

if (isset($_SESSION['username']))  {
$username = $_SESSION['username'];
$loggedIn = "";
$modal = "#ratingsModal";
}

?>


<title>Rateflix</title>
<meta name="viewport" content="width=device-width, initial-scale=0.6, user-scalable=no">
<link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
<link href='style.css' rel="stylesheet">
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>



<div id='mainbox'>


<!-------------SIGN IN/UP MODAL------------->
<div class="modal fade" id="accountModal" tabindex="-1" aria-labelledby="accountModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="accountModalLabel">Account</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
      <div class="mb-3">
      <label for="exampleFormControlInput1" class="form-label">Username</label>
      <input type="test" v-model="username" class="form-control" id="exampleFormControlInput1">
      </div>

      <div class="mb-3">
      <label for="exampleFormControlInput1" class="form-label">Password</label>
      <input type="password" v-model="password" class="form-control" id="exampleFormControlInput1">
      </div>
      </div>

      <div class="modal-footer">
      <button type="button" v-on:click="signUp" class="btn btn-secondary" data-bs-dismiss="modal">Sign Up</button>
      <button type="button" v-on:click="signIn" class="btn btn-primary">Sign In</button>
      </div>

    </div>
  </div>
</div>
<!------------------------------------->


<!-------------RATINGS MODAL------------->
<div class="modal fade" id="ratingsModal" tabindex="-1" aria-labelledby="ratingsModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="ratingsModalLabel">Rate {{ movieTitle }}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body" style='display:flex;justify-content: space-evenly;'>

      <div class="form-check">
      <input class="form-check-input" v-model="userRating" type="radio" name="userRating" v-bind:value="1" id="flexRadioDefault1">
      <label class="form-check-label" for="flexRadioDefault1">1</label>
      </div>

      <div class="form-check">
      <input class="form-check-input" v-model="userRating" type="radio" name="userRating" v-bind:value="2" id="flexRadioDefault2">
      <label class="form-check-label" for="flexRadioDefault2">2</label>
      </div>

      <div class="form-check">
      <input class="form-check-input" v-model="userRating" type="radio" name="userRating" v-bind:value="3" id="flexRadioDefault3">
      <label class="form-check-label" for="flexRadioDefault3">3</label>
      </div>

      <div class="form-check">
      <input class="form-check-input" v-model="userRating" type="radio" name="userRating" v-bind:value="4" id="flexRadioDefault4">
      <label class="form-check-label" for="flexRadioDefault4">4</label>
      </div>

      <div class="form-check">
      <input class="form-check-input" v-model="userRating" type="radio" name="userRating" v-bind:value="5" id="flexRadioDefault5">
      <label class="form-check-label" for="flexRadioDefault5">5</label>
      </div>

      <div class="form-check">
      <input class="form-check-input" v-model="userRating" type="radio" name="userRating" v-bind:value="6" id="flexRadioDefault6">
      <label class="form-check-label" for="flexRadioDefault6">6</label>
      </div>

      <div class="form-check">
      <input class="form-check-input" v-model="userRating" type="radio" name="userRating" v-bind:value="7" id="flexRadioDefault7">
      <label class="form-check-label" for="flexRadioDefault7">7</label>
      </div>

      <div class="form-check">
      <input class="form-check-input" v-model="userRating" type="radio" name="userRating" v-bind:value="8" id="flexRadioDefault8">
      <label class="form-check-label" for="flexRadioDefault8">8</label>
      </div>

      <div class="form-check">
      <input class="form-check-input" v-model="userRating" type="radio" name="userRating" v-bind:value="9" id="flexRadioDefault9">
      <label class="form-check-label" for="flexRadioDefault9">9</label>
      </div>

      <div class="form-check">
      <input class="form-check-input" v-model="userRating" type="radio" name="userRating" v-bind:value="10" id="flexRadioDefault10">
      <label class="form-check-label" for="flexRadioDefault10">10</label>
      </div>

      </div>

      <div class="modal-footer">
      <button type="button" v-on:click="rateMovie" class="btn btn-secondary" data-bs-dismiss="modal">Submit</button>
      </div>

    </div>
  </div>
</div>
<!------------------------------------->


<!------------------------MOVIE BOX------------------------->
<form id='mainForm' @submit.prevent="submitForm">
<img id='logo' src='https://i.postimg.cc/Y2fDDJhm/logo.png'><br>
<div class="input-group mb-3">
<span class='input-group-text' <?php echo $loggedIn ?> id='basic-addon1'><?php echo $username ?></span>
<input type="text" v-model="inputTitle" v-bind:class="{ noMovie: error2 }" class="form-control" placeholder="Movie Title" aria-label="Username" aria-describedby="basic-addon1">
<input type="text" v-model="inputYear" class="form-control" placeholder="Year (optional)" aria-label="Username" aria-describedby="basic-addon1">
<button class="btn btn-outline-secondary" type="submit" id="button-addon2">Search</button>
</div>
</form>

<br>

<div v-bind:class="{ noCard: error }" class='card' > 
  <div class="card-body">
  <div v-bind:style="{backgroundImage: 'url(' + moviePoster + ')'}" id='poster'></div>
    <h5 id='movieTitle' class="card-title">{{ movieTitle }} <span id='movieYear'>{{ movieYear }}</span></h5>

    <div class='preProgress'>
    <p class='progSource'>Rotten Tomatoes <strong>{{ rottenTomatoes }}</strong></p>
    <div class="progress">
    <div class="progress-bar bg-danger" role="progressbar" v-bind:style="{width: rottenTomatoes}" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
    </div>

    <div class='preProgress'>
    <p class='progSource'>IMDB <strong>{{ imdb }}%</strong></p>
    <div class="progress">
    <div class="progress-bar bg-warning" role="progressbar" v-bind:style="{width: imdb+'%'}" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
    </div>

    <div class='preProgress'>
    <p class='progSource'>Metacritic <strong>{{ metacritic }}%</strong></p>
    <div class="progress">
    <div class="progress-bar bg-success" role="progressbar" v-bind:style="{width: metacritic+'%'}" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
    </div>

    <div class='preProgress'>
    <p class='progSource'>Rateflix <strong>{{ rateflix }}%</strong></p>
    <div class="progress">
    <div class="progress-bar" role="progressbar" v-bind:style="{width: rateflix+'%'}" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
    </div>

    <br>
    <a href="#" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="<?php echo $modal ?>">Rate</a>
  </div>
</div>
</div>
<!-------------------------------------------------------->

<script type="text/javascript">var username = "<?php echo $username ?>";</script>
<script type="text/javascript" src="script.js"></script>
