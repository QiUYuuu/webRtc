const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');

app.use(helmet());
app.use(cors(require('./conf/cors.conf')));


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

require('./routes/http.routemgr')(app);

app.use((req, res, next) => {
    const err = new Error('Not Found' + req.url + '?');
    err.status = 404;
    res.json({'respCode': '404'});
    next(err);
});
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.end('error');
});
module.exports = app;
