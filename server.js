const app = require('./app');
const dotenv = require('dotenv');
dotenv.config({path:"./Config/config.env"})
const databaseConnection = require('./Config/databaseConnection');
databaseConnection();
const allRoute = require('./Route/AllRoutes')
app.use(allRoute);

app.listen(process.env.PORT,()=>{
    console.log(`server run on port ${process.env.PORT}`);
})