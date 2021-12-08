<template>
  <div :id="movie.id" class="movie-poster">
    <!-- <MoviePosterImage :image="movie.poster_path" /> -->

    <img v-if="movie.poster_path" :src="`//image.tmdb.org/t/p/w300/${movie.poster_path}`" :alt="movie.title" />
    <div class="movie-poster__title">{{movie.title}}</div>
    <ul class="movie-poster__genres">
      <li class="movie-poster__genres-item" v-for="genre in movie.genresList">{{genre}}</li>
    </ul>
    <div class="movie-poster__rating">
      {{movie.vote_average}}
    </div>
  </div>
</template>

<script>
import MoviePosterImage from '@/components/MoviePosterImage'

export default {
  name: 'MoviePoster',
  components: {
    MoviePosterImage
  },
  props: {
    movie: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .movie-poster {
    padding: 15px;
    margin: 20px;
    display: flex;
    align-items: center;
    flex-flow: column;
    background-color: $white;
    border: 1px solid rgba($lightGrey, 0.4);
    &__title, &__genres, &__rating {
      margin: 10px 0 0;
      text-align: center;
    }
    &__title {
      font-size: 0.9rem;
    }
    &__genres {
      list-style: none;
      padding-left: 0;
      line-height: 0.75rem;
      &-item {
        display: inline;
        font-size: 0.7rem;
        text-align: center;
        color: $grey;
        &:not(:last-child) {
          &:after {
            content: ', ';
          }
        }
      }
    }
    &__rating {
      font-size: 0.8rem;
      font-weight: bold;
      color: $white;
      width: 24px;
      height: 24px;
      background-color: $orange;
      border-radius: 50rem;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
