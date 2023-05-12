import express from "express";
import sequelize from "sequelize";
import db from "../database/initializeDB.js";
const router = express.Router();

router.route("/").get((req, res) => {
  res.send("Welcome to the Weed Warriors API!");
});

router.route("/catalog").get(async (req, res) => {
  try {
    const catalog = await db.Catalog.findAll();
    const result =
      catalog.length > 0 ? { data: catalog } : { message: "No results found" };
    res.json(result);
  } catch (err) {
    res.send(err);
  }
});

router.route("/severity").get(async (req, res) => {
  try {
    const severity = await db.Severity.findAll();
    const result =
      severity.length > 0
        ? { data: severity }
        : { message: "No results found" };
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

router
  .route("/media")
  .get(async (req, res) => {
    const media = await db.Media.findAll();
    const result =
      media.length > 0 ? { data: media } : { message: "No results found" };
    res.json(result);
  })
  .post(async (req, res) => {
    try {
      await db.Media.create({
        url: req.body.url,
      });
      res.send({ message: "Media added" });
    } catch (err) {
      res.send(err);
    }
  });

router
  .route("/users")
  .get(async (req, res) => {
    try {
      const users = await db.Users.findAll();
      const result =
        users.length > 0 ? { data: users } : { message: "No results found" };
      res.json(result);
    } catch (err) {
      res.json(err);
    }
  })
  .post(async (req, res) => {
    try {
      await db.Users.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
      });
      res.send({ message: "User added" });
    } catch (err) {
      res.json(err);
    }
  });

router
  .route("/reports")
  .get(async (req, res) => {
    try {
      const reports = await db.Reports.findAll();
      const result =
        reports.length > 0
          ? { data: reports }
          : { message: "No results found" };
      res.json(result);
    } catch (err) {
      res.json(err);
    }
  })
  .post(async (req, res) => {
    try {
      const now = await db.sequelizeDB.query("SELECT NOW();", {
        type: sequelize.QueryTypes.SELECT,
      });
      await db.Reports.create({
        catalog_id: req.body.catalog_id,
        location: {
          type: "Point",
          coordinates: [req.body.latitude, req.body.longitude],
        },
        severity_id: req.body.severity_id,
        media_id: req.body.media_id,
        comments: req.body.comments,
        user_id: req.body.user_id,
        verified: false,
        created: now[0].now
      });
      res.send({ message: "Report added" });
    } catch (err) {
      res.send(err);
    }
  })
  .put(async (req, res) => {
    try {
      await db.Reports.update(
        { ticket_id: req.body.ticket_id },
        { where: { id: req.body.id } }
      );
      res.send({
        message: `Report ID ${req.body.id} now has an associated ticket`,
      });
    } catch (err) {
      res.send(err);
    }
  });

router.route("/custom/:query").get(async (req, res) => {
  try {
    const result = await db.sequelizeDB.query(req.params.query, {
      type: sequelize.QueryTypes.SELECT,
    });
    res.json(result);
  } catch (err) {
    res.send(err);
  }
});

router
  .route("/tickets")
  .get(async (req, res) => {
    try {
      const tickets = await db.Tickets.findAll();
      const result =
        tickets.length > 0
          ? { data: tickets }
          : { message: "No results found" };
      res.json(result);
    } catch (err) {
      res.json(err);
    }
  })
  .post(async (req, res) => {
    try {
      const now = await db.sequelizeDB.query("SELECT NOW();", {
        type: sequelize.QueryTypes.SELECT,
      });
      await db.Tickets.create({
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        status: req.body.status,
        report_id: req.body.report_id,
        created: now[0].now,
        last_modified: now[0].now,
      });
      res.json({ message: "Ticket added" });
    } catch (err) {
      res.json(err);
    }
  })
  .delete(async (req, res) => {
    try {
      await db.Tickets.destroy({
        where: {
          id: req.body.id,
        },
      });
      res.send({ message: `ticket id ${req.body.id} removed.` });
    } catch (err) {
      res.json(err);
    }
  })
  .put(async (req, res) => {
    try {
      const now = await db.sequelizeDB.query("SELECT NOW();", {
        type: sequelize.QueryTypes.SELECT,
      });
      console.log(now[0].now);
      await db.Tickets.update(
        {
          status: "Resolved",
          last_modified: now[0].now,
        },
        { where: { id: req.body.id } }
      );
      res.send({ message: `Ticket #${req.body.id} has been resolved.` });
    } catch (err) {
      res.json(err);
    }
  });
export default router;
