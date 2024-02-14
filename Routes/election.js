const express = require("express");

const electionController = require("../Controllers/election");
const isAuth = require("../Middleware/is-auth");

const route = express.Router();

route.post(
  "/createElection/:userId",
  isAuth,
  electionController.createElection
);

route.delete(
  "/deleteElection/:electionId",
  isAuth,
  electionController.deleteElection
);

route.get("/getElections", electionController.getElections);

route.get("/getElectionById/:electionId", electionController.getElectionById);

route.put(
  "/startElection/:electionId",
  isAuth,
  electionController.startElection
);

route.put(
  "/finishElection/:electionId",
  isAuth,
  electionController.finishElection
);

route.put("/exerciseVote/:electionId", electionController.exerciseVote);

module.exports = route;
