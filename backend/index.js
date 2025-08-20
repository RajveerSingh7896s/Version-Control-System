const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");

dotenv.config();

yargs(hideBin(process.argv))
  .command("start", "Start a new server", {}, startServer)
  .command("init", "Initialise a new repository", {}, initRepo)
  .command(
    "add <file>",
    "Add a file to the repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add to the stage area",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.file);
    }
  )
  .command(
    "commit <message>",
    "Commit the staged files",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      });
    },
    (argv) => {
      commitRepo(argv.message);
    }
  )
  .command("push", "Push commits to s3", {}, pushRepo)
  .command("pull", "Pull commits from s3", {}, pullRepo)
  .command(
    "revert <commitID>",
    "Revert to specific commit",
    (yargs) => {
      yargs.positional("commmitID", {
        describe: "Commit ID to revert to",
        type: "string",
      });
    },
    (argv) => {
      revertRepo(argv.commitID);
    }
  )
  .demandCommand(1, "You need to give atleast one command")
  .help().argv;

function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(bodyParser.json());
  app.use(express.json());

  const mongoURI = process.env.MONGODG_URI;

  mongoose
    .connect(mongoURI)
    .then(() => console.log("connected to mongoDB"))
    .catch((err) => console.log("Unable to connect : ", err));

  app.use(cors({ origin: "*" }));
  app.get("/", (req, res) => {
    res.send("Welcome!!") ;
  });

  let user = "test";

  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection",(socket) => {
    socket.on("joinRoom",(userID) => {
      user = userID ;
      console.log("=====") ;
      console.log(user) ;
      console.log("=====");
      socket.join(userID) ;
    })
  })

  const db = mongoose.connection ;

  db.once("open",async() => {
    console.log("CRUD Operations called") ;
  })

  httpServer.listen(port ,() => {
    console.log(`server running at port ${port}`) ;
  })
}
