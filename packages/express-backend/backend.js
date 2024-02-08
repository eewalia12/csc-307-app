import express from "express";
import cors from "cors";
import userServices from "./models/user-services.js";
import user from "./models/user.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  let promise;

  if (job != undefined && name != undefined) {
    promise = userServices.findUserByNameAndJob(name, job);
  } else if (name != undefined) {
    promise = userServices.findUserByName(name);
  } else if (job !== undefined) {
    promise = userServices.findUserByJob(job);
  } else {
    promise = userServices.getUsers();
  }

  promise
    .then((result) => {
      const response = { users_list: result };
      res.send(response);
    })
    .catch((error) => {
      console.error("Error retrieving users:", error);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/users/:_id", (req, res) => {
  const id = req.params["_id"];

  userServices
    .findUserById(id)
    .then((result) => {
      if (!result) {
        res.status(404).send("Resource not found.");
      } else {
        res.send(result);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    });
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userServices.addUser(userToAdd);
  res.status(404).send(userToAdd);
});

app.delete("/users/:_id", (req, res) => {
  const id = req.params["_id"];
  user
    .findByIdAndDelete(id)
    .then((result) => {
      if (!result) {
        res.status(404).send("Resource not found.");
      } else {
        res.status(204).send();
      }
    })
    .catch((error) => {
      console.error("Error deleting:", error);
      res.status(500).send("Internal Server Error");
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
