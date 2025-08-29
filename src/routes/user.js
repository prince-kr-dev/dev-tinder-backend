const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const connectionRequestModel = require("../models/connectionRequest");
const { User } = require("../models/user");

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await connectionRequestModel
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", ["firstName", "lastName", "skills", "photoURL", "about"]);
    //it is written as string also separated by space
    //   .populate("fromUserId", "firstName lastName skills"]);

    //This excludes mentioned data
    // .select("-_id -toUserId -status -__v -createdAt -updatedAt");

    res.json({
      message: "Data fetched successfully!",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await connectionRequestModel
      .find({
        $or: [
          { toUserId: loggedInUser._id, status: "accepted" },
          { fromUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "skills",
        "photoURL",
        "about", // 👈 added
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "skills",
        "photoURL",
        "about", // 👈 added
      ]);
    const data = connectionRequests.map((row) => {
      // If logged-in user is the sender, return the recipient
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      // If logged-in user is the recipient, return the sender
      return row.fromUserId;
    });

    res.send({ data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 20 ? 20 : limit;
    const skip = (page - 1) * limit;
    //User should see all the user cards except
    //1. his own card
    //2. his connections
    //3. people who has already ignored
    //4. user that is already requested by loggedin user

    const loggedInUser = req.user;
    const connectionRequests = await connectionRequestModel
      .find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      })
      .select("fromUserId toUserId");

    const hiddenUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hiddenUsersFromFeed.add(req.fromUserId.toString());
      hiddenUsersFromFeed.add(req.toUserId.toString());
    });

    const hiddenUserIds = Array.from(hiddenUsersFromFeed);

    const refinedUserForFeed = await User.find({
      $and: [
        { _id: { $nin: hiddenUserIds } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("firstName lastName skills photoURL about")
      .skip(skip)
      .limit(limit);

    res.send(refinedUserForFeed);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

module.exports = userRouter;
