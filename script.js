
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
      rateflix:100,
      error: true,
      error2: false,
      username: '',
      password: '',
      userRating: 0,
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
            console.log(response);
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
            axios.request('core/rating.php?movie='+that.movieID).then(function (response) {
                that.rateflix = response.data.rating;
                return response;
            }).catch(function (error) {
                that.rateflix = 100;
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
            axios.post('core/signup.php?username='+this.username+'&password='+this.password).then(function () {
            alert('Account Created!');
            that.username = '';
            that.password = '';
        }).catch(function (error) {
	        alert(error.response.statusText);
        }); 
        },

        signIn:function() {
            axios.post('core/signin.php?username='+this.username+'&password='+this.password).then(function () {
            alert('Signed in!');
            location.reload();
        }).catch(function (error) {
            alert(error.response.statusText);
        });
        },

        rateMovie:function() {
            axios.post('core/rate.php?username='+username+'&rating='+this.userRating+'&movie='+this.movieID).then(function (response) {
            alert('Movie Rated!');
        }).catch(function (error) {
	        alert(error.response.statusText);
        });
        }

    },

});
