const express = require("express");

const db = require("./userDb");

const postDb = require("../posts/postDb");

const router = express.Router();

//POST new user -- working
router.post("/", validateUser, (req, res) => {
  db.insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).json({
        error: "There was an error while saving the user to the database."
      });
    });
});

//POST a new post -- not working
router.post("/:id/posts", [validateUserId, validatePost], (req, res) => {
  const { id } = req.params;
  console.log("req.body", req.body);
  console.log("id", id);
  postDb
    .insert(req.body)
    .then(user => {
      console.log("user", user);
      if (id !== user.user_id.toString()) {
        //this logic seems like too much
        res.status(400).json({ error: "Not valid." });
      } else {
        res.status(200).json(req.body);
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Unable to post." });
    });
});

// GET users -- working
router.get("/", (req, res) => {
  db.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ error: "Unable to load users." });
    });
});

// GET specfic user -- working
router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

// GET user's posts -- working
router.get("/:id/posts", validateUserId, (req, res) => {
  const id = req.params.id;
  db.getUserPosts(id)
    .then(posts => {
      if (!posts.length) {
        res.status(404).json({ error: "No posts exist." });
      } else {
        res.status(201).json(posts);
      }
    })
    .catch(err => {
      res.status(500).json({ error: "Unable to retrieve user." });
    });
});

// DELETE a user -- working
router.delete("/:id", validateUserId, (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(500).json({ error: "User could not be removed." });
    });
});

//UDPATE a user info -- working
router.put("/:id", validateUserId, validateUser, (req, res) => {
  const { id } = req.params;
  db.update(id, req.body)
    .then(change => {
      res.status(200).json(req.body);
    })
    .catch(err => {
      res.status(500).json({ message: "The user info could not be upadted." });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;
  db.getById(id)
    .then(user => {
      if (!user) {
        res.status(404).json({ message: "Invalid user id." });
      } else {
        req.user = user;
        console.log(req.user);
        next();
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "Couldn't get user" });
    });
}

//validates name but not body
function validateUser(req, res, next) {
  const newUser = req.body;
  if (!newUser) {
    res.status(400).json({ erorrMessage: "Missing body data." });
  } else if (!newUser.name) {
    res.status(400).json({ errorMessage: "Missing name." });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  const newPost = req.body;
  if (!newPost) {
    res.status(400).json({ errorMessage: "Missing body data." });
  } else if (!newPost.text) {
    res.status(400).json({ errorMessage: "Missing text field." });
  } else {
    next();
  }
}

module.exports = router;
