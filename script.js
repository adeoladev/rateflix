var application = new Vue({
    el: '#mainbox',
    data: {
      inputTitle: '',
      inputYear:'',
      moviePoster: {
          1: '',
          2: ''
      },
      yearProcessed:'',
      movieTitle: {
          1: 'Title',
          2: 'Title'
      },
      movieYear: {
          1: 'Year',
          2: 'Year'
      },
      movieID:'',
      movieDescription:{
          1: '',
          2: ''
      },
      rottenTomatoes: {
          1: '0',
          2: '0%'
      },
      imdb:{
          1: '0',
          2: '0'
      },
      metacritic: {
          1: '0',
          2: '0'
      },
      rateflix: {
          1: 0,
          2: 0
      },
      error: false,
      result: false,
      username: '',
      displayUsername: 'Account',
      userYear: '',
      userRatings: 0,
      password: '',
      userRating: 0,
      showMessage: '',
      message: '',
      compare: false,
      selectedCard: 1
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
        apiCall:function() {
        if (this.inputTitle.length >= 3) {
        axios.request('https://www.omdbapi.com/?apikey=6576687f&type=movie&s='+this.inputTitle).then(function (response) {
            $("#list-autocomplete").empty();
            response.data.Search.forEach((element) => {
            const opt = document.createElement('option');
            opt.value = element.Title;
            opt.innerHTML = element.Title;
            $("#list-autocomplete").append(opt);
            }
            );
        }).catch(function (error) {
            //console.log(error);
        });
        } else {
            $("#list-autocomplete").empty();
        }
        },

        fetchdata:function() {
            const url = new URL(window.location.href);
            url.searchParams.set('s', this.inputTitle);
            if(this.inputYear) {
            url.searchParams.set('y', this.inputYear);
            } else {
            url.searchParams.delete('y');    
            }
            window.history.replaceState({}, '', url.href);
            document.title = `Rateflix - "${this.inputTitle+this.inputYear}"`;
            this.rottenTomatoes[this.selectedCard] = '0%';
            this.imdb[this.selectedCard] = '0';
            this.metacritic[this.selectedCard] = '0';
            this.rateflix[this.selectedCard] = 0;
            const that = this;
            axios.request('https://www.omdbapi.com/?apikey=6576687f&t='+this.inputTitle+this.yearProcessed).then(function (response) {
            if (response.data.Response !== 'False') {
            that.error = false;
            that.result = true;
            that.moviePoster[that.selectedCard] = response.data.Poster;
            that.movieTitle[that.selectedCard] = response.data.Title;
            that.movieID = response.data.imdbID;
            that.movieDescription[that.selectedCard] = response.data.Plot;
            if (response.data.Type == 'movie') {
            that.movieYear[that.selectedCard] = response.data.Year;
            that.rottenTomatoes[that.selectedCard] = response.data.Ratings?.[1]?.Value ?? '0%';
            if(response.data.Metascore !== "N/A") {
                that.metacritic[that.selectedCard] = response.data.Metascore;
            }
            if(response.data.imdbRating !== "N/A") {
                that.imdb[that.selectedCard] = response.data.imdbRating * 10;
            }
            } else {
            that.rottenTomatoes[that.selectedCard] = '0%';
            that.metacritic[that.selectedCard] = 0;
            that.imdb[that.selectedCard] = response.data.imdbRating * 10;
            that.movieYear[that.selectedCard] = response.data.Released.slice(7) + " ("+response.data.totalSeasons+" Seasons)";
            }

            setTimeout(rateflixRating, 100);

            function rateflixRating() {
            axios.request('https://gamergoal.net/rateflix/core/rating.php?movie='+that.movieID).then(function (response) {
            that.rateflix[that.selectedCard] = response.data.rating;
            return response;
            }).catch(function () {
            that.rateflix[that.selectedCard] = 0;
            });
            }

            } else {
            that.error = true;
            that.result = true;
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
            document.cookie = "rateflix="+JSON.stringify({username: that.username, year: response.data.year, ratings: response.data.ratings});
            location.reload();
            }
        }).catch(function (error) {
            console.log(error);
        });
        },

        rateMovie:function() {
            const that = this;
            axios.post('https://gamergoal.net/rateflix/core/rate.php?username='+this.username+'&rating='+this.userRating+'&movie='+this.movieID+'&title='+this.movieTitle[1]+'&year='+this.movieYear[1]).then(function (response) {

            that.rateflix[1] = that.userRating*10;

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

        openCompare:function() {
            this.compare = !this.compare;
            if (this.compare === false) {
            this.selectedCard = 1;
            } else {
            this.selectedCard = 2;
            }
        },

        selectCard:function(card) {
            this.selectedCard = card;
            if(card === 1) {
            $("#checkBox2").prop('checked',false);
            } else {
            $("#checkBox1").prop('checked',false);
            }
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
    },

    created: function(){
        const that = this;
        if (document.cookie.split(';').some((item) => item.trim().startsWith('rateflix='))) {
            const { username, year, ratings } = JSON.parse(decodeURIComponent(
                document.cookie
                  .split('; ')
                  .find(r => r.startsWith('rateflix='))
                  ?.split('=')[1] || '{}'
            ));
            this.username = username;
            this.displayUsername = username;
            this.userYear = year;
            this.userRatings = ratings
        }
        that.checkUrl();
    }

});
