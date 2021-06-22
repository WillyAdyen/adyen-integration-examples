var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var bp = require('body-parser');
require('dotenv').config();

var apiRouter = require('./routes/api');
var pblRouter = require('./routes/pbl');
var modificationsRouter = require('./routes/modifications');
var posRouter = require('./routes/pos');

var app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api", apiRouter);
app.use("/api", pblRouter);
app.use("/api", modificationsRouter);
app.use("/api", posRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status).json({
    message: err.message,
    error: err
  });
});


const peer = express()
peer.use(bp.json());
const port = 8888

peer.post('/', (req, res) => {
    console.log("Notification:", req.body);
    res.send("received");
})
  
peer.listen(port, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", port);
})

module.exports = { app, peer };
