//importing the modules necessary
const path = require("path")
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const favicon = require('serve-favicon')
require("dotenv").config({ path: path.resolve(__dirname, ".env"), })
//configure the db
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .catch(({ message }) => {
    console.error(`Unable to connect to the mongodb instance: ${message}`)
  }
)

const db = mongoose.connection
db.on("error", ({ message }) => {
  console.error(`Mongoose default connection error: ${message}`)
})
db.once("open", () => {
  console.info(`Mongoose default connection opened`)
})
//initialize express
const app = express()
app.set("port", process.env.PORT || 3000)

//
app.use(express.static(path.join(__dirname, "public")))
app.use(favicon(path.resolve(__dirname, 'public', 'images', 'favicon.ico')))

app.use(bodyParser.urlencoded({ extended: false, }))

app.use(bodyParser.json())

app.use(cors())

require("./routes")(app);

const server = app.listen(app.get("port"), () => {
  const { port, address, } = server.address()
  console.info(`Express server started on ${address}:${port}`)
})