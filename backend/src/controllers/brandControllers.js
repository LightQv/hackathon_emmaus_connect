const models = require("../models");

const browse = (req, res) => {
  models.brand
    .findAll()
    .then(([result]) => {
      res.send(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
    });
};

const read = (req, res) => {
  const id = parseInt(req.params.id, 10);

  models.brand
    .find(id)
    .then(([rows]) => {
      if (rows[0]) {
        res.send(rows[0]);
      } else {
        res.status(404).send("User not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
    });
};

const edit = (req, res) => {
  const brand = req.body;

  brand.id = parseInt(req.params.id, 10);

  models.brand
    .update(brand)
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("User not found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const add = (req, res) => {
  const newuser = req.body;

  models.brand
    .insert(newuser)
    .then(([result]) => {
      res.location(`/users/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const destroy = (req, res) => {
  const id = parseInt(req.params.id, 10);

  models.brand
    .delete(id)
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};
module.exports = {
  browse,
  read,
  edit,
  add,
  destroy,
};
