const fs = require("node:fs");
const fastcsv = require("fast-csv");
const models = require("../models");

const browse = (req, res) => {
  models.model
    .findAll()
    .then(([rows]) => {
      res.send(rows);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const read = (req, res) => {
  models.model
    .find(req.params.id)
    .then(([rows]) => {
      if (rows[0] == null) {
        res.sendStatus(404);
      } else {
        res.send(rows[0]);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const edit = (req, res) => {
  const model = req.body;

  // TODO validations (length, format...)

  model.id = parseInt(req.params.id, 10);

  models.model
    .update(model)
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

const add = (req, res) => {
  const model = req.body;

  // TODO validations (length, format...)

  models.model
    .insert(model)
    .then(([result]) => {
      res.location(`/models/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const destroy = (req, res) => {
  models.model
    .delete(req.params.id)
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

const importTable = (req, res) => {
  // console.log(req.file);

  const stream = fs.createReadStream(req.file.path);
  const csvData = [];
  const csvStream = fastcsv
    .parse()
    .on("data", (data) => {
      // console.log("data =", data);
      csvData.push(data);
      // console.log(csvData);
    })
    .on("end", () => {
      models.model
        .insertAll(csvData)
        .then(([result]) => {
          fs.rm(req.file.path, (err) => {
            if (err) throw err;
          });
          if (result.affectedRows === 0) {
            fs.rm(req.file.path, (err) => {
              if (err) throw err;
            });
            res.sendStatus(500);
          }
        })
        .catch((err) => {
          fs.rm(req.file.path, (error) => {
            if (error) throw error;
          });
          console.error(err);
          res.sendStatus(500);
        });
    });

  stream.pipe(csvStream);
};

module.exports = {
  browse,
  read,
  edit,
  add,
  destroy,
  importTable,
};
