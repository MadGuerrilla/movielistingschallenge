<template>
  <div class="movie-poster__image">
    {{image}}
  </div>
</template>

<script>
export default {
  name: 'MoviePoster',
  props: {
    image: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .movie-poster {
    &__image {
    }
  }
</style>
