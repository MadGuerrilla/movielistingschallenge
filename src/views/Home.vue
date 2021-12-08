<template>
<div class="home">
  <div class="movies">
    <v-container>
      <v-layout>
        <v-flex>
          <h1 class="heading heading--large">Movie listings challenge</h1>
          <v-form class="filter__form">
            <h4 class="heading heading--small">Filters</h4>
            <div class="filter__form-ratings">
              <label class="filter__form-ratings-label" :for="'filter__form-ratings'">Ratings</label>
              <input type="range" v-model="filterRating" min="0" max="10" value="3" step="0.5" class="filter__form-ratings-input" name="filter__form-ratings" id="filter__form-ratings" @change="ratingsFilter($event)">
              <div class="filter__form-ratings-value">{{filterRating}}</div>
            </div>
            <div class="filter__form-checkboxs">
              <template v-for="genre in tmdbGenres">
                <!-- <v-switch class="filter__form-checkbox" :value="genre.id" @change="genreFilter($event)" :label="genre.name"> </v-switch> -->
                <!-- <input v-if="genre.active" checked class="filter__form-checkbox" type="checkbox" :name="genre.id" :id="genre.id" :value="genre.id" @change="genreFilter($event)"> -->
                <input v-if="!genre.disabled" class="filter__form-checkbox" type="checkbox" :name="genre.id" :id="genre.id" :value="genre.id" @change="genreFilter($event)">
                <input v-else disabled class="filter__form-checkbox" type="checkbox" :name="genre.id" :id="genre.id" :value="genre.id" @change="genreFilter($event)">
                <label class="filter__form-label" :for="genre.id">{{genre.name}}</label>
              </template>
            </div>
          </v-form>
          <div v-if="movieListingsDisplay">
            <h2 class="heading heading--medium">Popular movies ({{movieListingsDisplay.length}})</h2>
            <div v-if="movieListingsDisplay.length" class="movie-posters">
              <MoviePoster v-for="movie in movieListingsDisplay" :key="movie.id" :movie="movie"></MoviePoster>
            </div>
            <div v-else class="movie-posters movie-posters--empty">
              <h4 class="heading heading--small">
                Sorry no films were found based on your filter choices
              </h4>
            </div>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import MoviePoster from '@/components/MoviePoster'

export default {
  name: 'home',
  components: {
    MoviePoster
  },
  data() {
    return {
      tmdbConfigApi: `${this.$store.state.apiConfigUrl}${this.$store.state.apiV3}`,
      tmdbGenresApiUrl: `${this.$store.state.apiGenresUrl}${this.$store.state.apiV3}&language=${this.$store.state.apiLang}`,
      tmdbNowPlayingApi: `//api.themoviedb.org/3/movie/now_playing?api_key=${this.$store.state.apiV3}&language=${this.$store.state.apiLang}`,
      tmdbConfig: null,
      tmdbGenres: null,
      tmdbMovieList: null,
      movieListingsDisplay: null,
      tempMovieListings: [],
      activeGenres: [],
      filterRating: 3
    }
  },
  mounted() {
    this.getTmdbConfig()
    this.getTmdbGenres()
  },
  methods: {
    getTmdbConfig: function() {
      axios
        .get(this.tmdbConfigApi)
        .then(
          response => (this.tmdbConfig = response.data.results)
        )
    },
    getTmdbGenres: function() {
      axios
        .get(this.tmdbGenresApiUrl)
        .then(response => (
          this.genresList = response.data.genres,
          this.genresList.map((genre) => {
            genre.active = false
            genre.disabled = true
          }),
          this.tmdbGenres = this.genresList,
          this.getNowPlaying()
        ))
    },
    getNowPlaying: function() {
      axios
        .get(this.tmdbNowPlayingApi)
        .then(response => (
          this.tmdbMovieList = response.data.results,
          this.tmdbMovieList.map((movie) => {
            movie.genresList = []
          }),
          this.sortPopularNowPlaying()
        ))
    },
    sortPopularNowPlaying: function() {
      this.tmdbMovieList.sort((a, b) => (a.vote_average < b.vote_average) ? 1 : -1)
      this.movieListingsDisplay = this.tmdbMovieList,
        this.sortActiveGenres()
    },
    sortActiveGenres: function() {
      this.movieListingsDisplay.map((movie) => {
        movie.genre_ids.map((genreId) => {
          this.tmdbGenres.filter((genre) => {
            if (genreId === genre.id) {
              movie.genresList.push(genre.name)
              genre.active = true
              genre.disabled = false
            }
          })
        })
      })
      this.ratingsFilter()
    },
    genreFilter: function(e) {
      this.tmdbGenres.filter((genre) => {
        if (e) {
          if (genre.id == e.target.id) {
            genre.active = e.target.checked
          }
        }
      })
      if (e) {
        switch (e.target.checked) {
          case true:
            this.activeGenres.push(e.target.id)
            break;
          case false:
            this.activeGenres = this.activeGenres.filter((val) => {
              if(val != e.target.id) return val
            })
            break;
        }
      }
      this.movieListingsDisplay = null
      this.tempMovieListings.length = 0

      this.tmdbMovieList.map((movie) => {
        if(this.activeGenres.length) {
          if(this.activeGenres.every(val => movie.genre_ids.includes(Number(val))) && this.filterRating <= movie.vote_average) this.tempMovieListings.push(movie)
        }
        else if(this.filterRating <= movie.vote_average) {
          this.tempMovieListings.push(movie)
        }
      })

      this.movieListingsDisplay = this.tempMovieListings
    },
    ratingsFilter: function(e) {
      this.movieListingsDisplay = null
      this.tempMovieListings.length = 0
      this.tmdbMovieList.map((movie) => {
        if (this.filterRating <= movie.vote_average) {
          this.tempMovieListings.push(movie)
        }
      })
      this.movieListingsDisplay = this.tempMovieListings
      this.genreFilter()
    }
  }
}
</script>

<style lang="scss" scoped>
.heading {
  color: $orange;
  text-align: center;
  padding-bottom: 20px;
  &--large {
    font-size: 2rem;
  }
  &--medium {
    font-size: 1.5rem;
  }
  &--small {
    font-size: 1.2rem;
    font-weight: normal;
  }
}
.movie {
    &s {
        background-color: $lighterGrey;
        min-height: 100vh;
        > .container {
          max-width: 1185px;
        }
        .filter {
            &__form {
              padding-bottom: 20px;
              display: flex;
              flex-flow: column;
                &-checkbox {
                    position: absolute;
                    opacity: 0;
                    &s {
                        display: grid;
                        grid-template-rows: auto;
                        grid-template-columns: repeat(2, 1fr);
                        @media only screen and (min-width: 641px) {
                            grid-template-columns: repeat(3, 1fr);
                        }
                        @media only screen and (min-width: 961px) {
                            grid-template-columns: repeat(4, 1fr);
                        }
                        padding: 0 20px;
                    }
                    & + label {
                        position: relative;
                        cursor: pointer;
                        padding: 0;
                        font-size: 0.8rem;
                        margin: 10px;
                        display: flex;
                        align-items: center;
                    }

                    & + label:before {
                        content: '';
                        margin-right: 10px;
                        display: inline-block;
                        vertical-align: text-top;
                        width: 20px;
                        height: 20px;
                        background: $white;
                    }

                    &:hover + label:before {
                        background: $orange;
                    }

                    &:focus + label:before {
                        box-shadow: 0 0 0 2px rgba($darkGrey, 0.4);
                    }

                    &:checked + label:before {
                        background: $orange;
                    }

                    &:disabled + label {
                        color: $grey;
                        cursor: not-allowed;
                    }

                    &:disabled + label:before {
                        box-shadow: none;
                        background: $lightGrey;
                    }

                    &:checked + label:after {
                        content: '';
                        position: absolute;
                        left: 5px;
                        top: 9px;
                        background: $white;
                        width: 2px;
                        height: 2px;
                        box-shadow: 2px 0 0 white, 4px 0 0 white, 4px -2px 0 white, 4px -4px 0 white, 4px -6px 0 white, 4px -8px 0 white;
                        transform: rotate(45deg);
                    }

                }
                &-ratings {
                    display: flex;
                    align-items: center;
                    padding: 0 20px;
                    justify-content: center;
                    margin-bottom: 20px;
                    &-label {
                        font-size: 0.8rem;
                    }
                    &-value {
                        font-size: 0.8rem;
                        font-weight: bold;
                        color: $white;
                        min-width: 24px;
                        height: 24px;
                        background-color: $orange;
                        border-radius: 50rem;
                        text-align: center;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    &-input {
                        -webkit-appearance: none;
                        width: 100%;
                        margin: 13.8px 20px;
                        max-width: 600px;
                        &:focus {
                            outline: none;
                        }
                        &::-webkit-slider-runnable-track {
                            width: 100%;
                            height: 8.4px;
                            cursor: pointer;
                            background-color: rgba($orange, 0.5);
                            border-radius: 28px;
                        }
                        &::-webkit-slider-thumb {
                            height: 24px;
                            width: 24px;
                            border-radius: 50rem;
                            background-color: $orange;
                            cursor: pointer;
                            -webkit-appearance: none;
                            margin-top: -8px;
                        }
                        &:focus::-webkit-slider-runnable-track {
                            background-color: rgba($orange, 0.8);
                        }
                        &::-moz-range-track {
                            width: 100%;
                            height: 8.4px;
                            cursor: pointer;
                            background-color: rgba($orange, 0.5);
                            border-radius: 1.3px;
                        }
                        &::-moz-range-thumb {
                            height: 36px;
                            width: 16px;
                            border-radius: 3px;
                            background-color: $orange;
                            cursor: pointer;
                        }
                        &::-ms-track {
                            width: 100%;
                            height: 8.4px;
                            cursor: pointer;
                            background: transparent;
                            border-color: transparent;
                            color: transparent;
                        }
                        &::-ms-fill-lower {
                            background: #2a6495;
                            border-radius: 2.6px;
                        }
                        &::-ms-fill-upper {
                            background-color: rgba($orange, 0.7);
                            border-radius: 2.6px;
                        }
                        &::-ms-thumb {
                            height: 36px;
                            width: 16px;
                            border-radius: 3px;
                            background-color: $orange;
                            cursor: pointer;
                            height: 8.4px;
                        }
                        &:focus::-ms-fill-lower {
                            background-color: rgba($orange, 0.7);
                        }
                        &:focus::-ms-fill-upper {
                            background-color: $orange;
                        }
                    }
                }
            }
        }
    }
    &-posters {
        display: grid;
        grid-template-rows: auto;
        @media only screen and (min-width: 641px) {
            grid-template-columns: repeat(3, 1fr);
        }
        @media only screen and (min-width: 961px) {
            grid-template-columns: repeat(4, 1fr);
        }
        &--empty {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
    }
}
</style>
