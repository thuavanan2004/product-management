const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const routeClient = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const systemConfig = require("./config/system");
const database = require("./config/database");
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const moment = require('moment');
const path = require('path');
const methodOverride = require('method-override');


const app = express();

database.connect();

const port = process.env.PORT;

app.use(express.static( `${__dirname}/public`));
app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);
app.use(methodOverride('_method'));

app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieParser('453'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

routeClient(app);
routeAdmin(app);

app.listen(port, () => {
    console.log(`App đang lắng nghe cổng ${port}`)
})

