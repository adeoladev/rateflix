var application = new Vue({
    el: '#mainbox',
    data: {
      inputTitle:'',
      inputYear:'',
      moviePoster:'',
      yearProcessed:'',
      movieTitle:'',
      movieYear:'',
      movieID:'',
      rottenTomatoes:'0',
      imdb:'0',
      metacritic:'10',
      rateflix:0,
      error: true,
      error2: false,
      username: '',
      displayUsername: 'Account',
      password: '',
      userRating: 0,
      showMessage: '',
      message: '',
    },
    methods: {
        submitForm:function() {
        
        if (this.inputYear !== '') {
        this.yearProcessed = "&y="+this.inputYear;
        } else {
        this.yearProcessed = '';
        }
        this.fetchdata();
        },

        fetchdata:function() {
            const that = this;
            axios.request('https://www.omdbapi.com/?apikey=6576687f&t='+this.inputTitle+this.yearProcessed).then(function (response) {
            if (response.data.Response !== 'False') {
            that.error = false;
            that.error2 = false;
            that.moviePoster = response.data.Poster;
            that.movieTitle = response.data.Title;
            that.movieYear = response.data.Year;
            that.rottenTomatoes = response.data.Ratings[1].Value;
            that.metacritic = response.data.Metascore;
            that.imdb = response.data.imdbRating * 10;
            that.movieID = response.data.imdbID;
            setTimeout(rateflixRating, 200);

            function rateflixRating() {
            axios.request('yourserver/core/rating.php?movie='+that.movieID).then(function (response) {
            that.rateflix = response.data.rating;
            return response;
            }).catch(function (error) {
            that.rateflix = 0;
            });
            }

            } else {
            that.error = true;
            that.error2 = true;
            }

        }).catch(function (error) {
            console.log(error);
        });

        },

        signUp:function() {
            const that = this;
            axios.post('yourserver/core/signup.php?username='+this.username+'&password='+this.password).then(function (response) {
            that.showMessage = 'block';
            that.message = response.data.message;
            if(that.message == "Sign up successful.") {
            document.cookie = "rateflix="+that.username;
            location.reload();
            }
        }).catch(function (error) {
	        console.log(error);
        }); 
        },

        signIn:function() {
            const that = this;
            axios.post('yourserver/core/signin.php?username='+this.username+'&password='+this.password).then(function (response) {
            that.showMessage = 'block';
            that.message = response.data.message;
            if(that.message == "Sign in successful.") {
            document.cookie = "rateflix="+that.username;
            location.reload();
            }
        }).catch(function (error) {
            console.log(error);
        });
        },

        rateMovie:function() {
            const that = this;
            axios.post('yourserver/core/rate.php?username='+this.username+'&rating='+this.userRating+'&movie='+this.movieID).then(function (response) {

            axios.request('yourserver/core/rating.php?movie='+that.movieID).then(function (response) {
            that.rateflix = response.data.rating;
            return response;
            }).catch(function (error) {
            that.rateflix = 0;
            });

        }).catch(function (error) {
	        console.log(error);
        });
        },

        openRating:function() {
            if (document.cookie.split(';').some((item) => item.trim().startsWith('rateflix='))) {
                $("#ratingsModal").modal('show');
            } else {
                $("#accountModal").modal('show');
            }
        },

        openAccount:function() {
            if (!document.cookie.split(';').some((item) => item.trim().startsWith('rateflix='))) {
                $("#accountModal").modal('show');
            }
        }
    },

    created: function(){
        if (document.cookie.split(';').some((item) => item.trim().startsWith('rateflix='))) {
            const cookieValue = document.cookie.split('; ').find((row) => row.startsWith('rateflix=')).split('=')[1];
            this.username = cookieValue;
            this.displayUsername = cookieValue;
        }
    }

});
