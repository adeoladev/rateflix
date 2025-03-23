var application = new Vue({
    el: '#mainbox',
    data: {
      inputTitle: '',
      inputYear:'',
      moviePoster:'',
      yearProcessed:'',
      movieTitle:'',
      movieYear:'',
      movieID:'',
      movieDescription:'',
      rottenTomatoes:'0',
      imdb:'0',
      metacritic:'0',
      rateflix:0,
      error: false,
      result: false,
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
            const url = new URL(window.location.href);
            url.searchParams.set('s', this.inputTitle);
            if(this.inputYear) {
            url.searchParams.set('y', this.inputYear);
            }
            window.history.replaceState({}, '', url.href);
            document.title = `Rateflix - "${this.inputTitle+this.inputYear}"`;

            this.rottenTomatoes = '0';
            this.imdb = '0';
            this.metacritic = '0';
            this.rateflix = 0;
            const that = this;
            axios.request('https://www.omdbapi.com/?apikey=6576687f&t='+this.inputTitle+this.yearProcessed).then(function (response) {
            if (response.data.Response !== 'False') {
            that.error = false;
            that.result = true;
            that.moviePoster = response.data.Poster;
            that.movieTitle = response.data.Title;
            that.movieID = response.data.imdbID;
            that.movieDescription = response.data.Plot;
            if (response.data.Type == 'movie') {
            that.movieYear = response.data.Year;
            that.rottenTomatoes = response.data.Ratings?.[1]?.Value ?? '0%';
            if(response.data.Metascore !== "N/A") {
                that.metacritic = response.data.Metascore;
            }
            if(response.data.imdbRating !== "N/A") {
                that.imdb = response.data.imdbRating * 10;
            }
            } else {
            that.rottenTomatoes = '0%';
            that.metacritic = 0;
            that.imdb = response.data.imdbRating * 10;
            that.movieYear = response.data.Released.slice(7) + " ("+response.data.totalSeasons+" Seasons)";
            }

            setTimeout(rateflixRating, 200);

            function rateflixRating() {
            axios.request('https://gamergoal.net/rateflix/core/rating.php?movie='+that.movieID).then(function (response) {
            that.rateflix = response.data.rating;
            return response;
            }).catch(function () {
            that.rateflix = 0;
            });
            }

            } else {
            that.error = true;
            that.result = false;
            }

        }).catch(function (error) {
            console.log(error);
        });

        },

        signUp:function() {
            const that = this;
            axios.post('https://gamergoal.net/rateflix/core/signup.php?username='+this.username+'&password='+this.password).then(function (response) {
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
            axios.post('https://gamergoal.net/rateflix/core/signin.php?username='+this.username+'&password='+this.password).then(function (response) {
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
            axios.post('https://gamergoal.net/rateflix/core/rate.php?username='+this.username+'&rating='+this.userRating+'&movie='+this.movieID).then(function (response) {

            axios.request('https://gamergoal.net/rateflix/core/rating.php?movie='+that.movieID).then(function (response) {
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
                $("#signInModal").modal('show');
            }
        },

        openAccount:function() {
            if (!document.cookie.split(';').some((item) => item.trim().startsWith('rateflix='))) {
                $("#signInModal").modal('show');
            } else {
                $("#accountModal").modal('show');
            }
        },

        openDescription:function() {
            $("#infoModal").modal('show');
        },

        signOut:function() {
            document.cookie = `rateflix=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
            location.reload();
        },
        
        checkUrl:function(){
            const url = new URL(window.location.href);
            if (url.searchParams.has('s') && url.searchParams.has('y')) {
                this.inputTitle = url.searchParams.get('s');
                this.inputYear = url.searchParams.get('y');
                this.submitForm();
            } else if (url.searchParams.has('s')) {
                this.inputTitle = url.searchParams.get('s');
                this.submitForm();
            }
        },

        async openShare() {
            if (navigator.share) {
                try {
                  await navigator.share({
                    title: `Rateflix - ${this.inputTitle}`,
                    text: "",
                    url: window.location.href
                  });
                } catch (error) {
                  console.error(error);
                }
            } else {
            alert("Sharing is not supported in this browser.");
            }
        }
    },

    created: function(){
        const that = this;
        if (document.cookie.split(';').some((item) => item.trim().startsWith('rateflix='))) {
            const cookieValue = document.cookie.split('; ').find((row) => row.startsWith('rateflix=')).split('=')[1];
            this.username = cookieValue;
            this.displayUsername = cookieValue;
        }
        that.checkUrl();
    }

});
