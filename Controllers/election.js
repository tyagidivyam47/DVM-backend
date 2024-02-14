const express = require("express");

const Election = require("../Models/election");

exports.createElection = (req, res, next) => {
  try {
    const createdBy = req.params.userId;
    const { post, term, timeLimit, candidates } = req.body;
    const status = "INACTIVE";

    const electionObj = {
      createdBy,
      post,
      timeLimit,
      candidates,
      status,
      term,
    };
    const election = new Election(electionObj);

    election
      .save()
      .then(() => {
        res.status(201).json({ msg: "Election created successfully" });
      })
      .catch((error) => {
        error.statusCode = 500;
        next(error);
      });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deleteElection = async (req, res, next) => {
  try {
    const electionId = req.params.electionId;
    const electionExists = await Election.findById(electionId);
    if (!electionExists) {
      res.status(404).json({ msg: "Election not found" });
      return;
    }
    Election.findByIdAndDelete(electionId)
      .then(() => {
        res.status(200).json({ msg: "Election deleted successfully" });
      })
      .catch((error) => {
        error.statusCode = 500;
        next(error);
      });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getElections = async (req, res, next) => {
  try {
    const existingElections = await Election.find().populate("createdBy");
    res.status(200).json({ data: existingElections });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getElectionById = async (req, res, next) => {
  try {
    const electionId = req.params.electionId;
    const electionExists = await Election.findById(electionId).populate(
      "createdBy"
    );
    if (!electionExists) {
      res.status(404).json({ msg: "Election does not exists" });
      return;
    }
    res.status(200).json({ data: electionExists });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.startElection = async (req, res, next) => {
  try {
    const electionId = req.params.electionId;
    const updatedElection = await Election.findByIdAndUpdate(
      electionId,
      {
        status: "ACTIVE",
      },
      { new: true }
    );

    const timeLimit = updatedElection.timeLimit;
    setTimeout(async () => {
      const updatedElection2 = await Election.findByIdAndUpdate(
        electionId,
        {
          status: "COMPLETED",
        },
        { new: true }
      );
      // res.status(200).json(updatedElection2);
    }, [timeLimit]);
    res.status(200).json(updatedElection);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.finishElection = async (req, res, next) => {
  try {
    const electionId = req.params.electionId;
    const updatedElection = await Election.findByIdAndUpdate(
      electionId,
      {
        status: "COMPLETED",
      },
      { new: true }
    );
    res.status(200).json(updatedElection);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.exerciseVote = async (req, res, next) => {
  try {
    const electionId = req.params.electionId;
    const candidateId = req.body.candidateId;

    const existingElection = await Election.findById(electionId);
    if (!existingElection) {
      res.status(404).json({ msg: "No such election exists" });
      return;
    }
    if (
      existingElection.status === "INACTIVE" ||
      existingElection.status === "COMPLETED"
    ) {
      res
        .status(403)
        .json({ msg: "Election haven't yet started or already finished" });
      return;
    }
    const existingCandidates = existingElection.candidates;
    let candidateFound = false;
    for (let i = 0; i < existingCandidates.length; i++) {
      if (existingCandidates[i]._id.toString() === candidateId) {
        candidateFound = true;
        existingCandidates[i].votes++;
        break;
      }
    }
    if (!candidateFound) {
      res.status(404).json({ msg: "No such candidate found" });
      return;
    }
    existingElection.candidates = existingCandidates;
    const updatedElection = await Election.findOneAndReplace(
      { _id: electionId },
      existingElection,
      { new: true }
    );
    res.status(200).json(updatedElection);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
