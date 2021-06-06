const http = require('http');
const express = require('express');
const morgan = require('morgan');
const path = require('path')
const handlebars = require('express-handlebars');
const hostname = 'localhost';
const port = process.env.PORT || 3001;
const app = express();
const route = require("./routes");
const methodOverride = require('method-override');
const cors = require('cors')

// Connect to DB
const db = require('./config/db')
db.connect()

// const firebase = require('./config/db/firebase')
// firebase

app.use(morgan('combined'))
app.use(cors());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json())
app.use(methodOverride('_method'))
app.engine('hbs', handlebars({
  extname: '.hbs',
  helpers:{
    sum:(a, b) => a + b,
  },
  
}))
app.set("view engine", 'hbs')
app.set('views', path.join(__dirname, 'resources', 'views'))

//routes inits
route(app);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});