
# movielistingschallenge

This tech demo was written in VueJS and Vuetify

### Live working demo
A build version of the application is hosted here on Heroku
(as Heroku is a free service it may take a minute for the dynamo to spin up)
https://movielistingschallenge.herokuapp.com/

### How it works
When the index page is loaded all films with a rating of 3 or higher is shown in order of highest rating
Adjusting the ratings slider will display movies with an equal or higher rating

Genres that are not associated with any movie are greyed out / disabled
If you select genres "Action, Crime, Thriller" then only movies with at least all selected genres are displayed
If you adjust the ratings slider with genres selected then only movies with a equal or higher ratings and selected genres are displayed

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
