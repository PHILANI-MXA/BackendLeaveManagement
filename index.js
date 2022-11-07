require("dotenv").config();
const db = require("./config/dbconn");
const con = require("./config/dbconn");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const cors = require("cors");
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["http://127.0.0.1:8080 ", "http://localhost:8080"],
    credentials: true,
    optionSuccessStatus: 200,
  })
);

app.use(
  router,
  express.json(),
  express.urlencoded({
    extended: true,
  })
);

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Sever http://localhost:${PORT} is running`);
});

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "View", "index.html"));
});

router.get("/employees", (req, res) => {
  try {
    con.query("SELECT * FROM employees", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// router.post("/post", (req, res) => {
//   const employee = {
//     firstName,
//     lastName,
//     email,
//   };
//   try {
//     con.query(`INSERT INTO books SET ?`, employee, (err, result) => {
//       if (err) throw err;
//       res.send(result);
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(400).send(error);
//   }
// });

// router.post("/post", (req, res) => {
//   const LeaveRequests = {
//     LeaveReq_no,
//     startDate,
//     endDate,
//     leaveType,
//     Reason,
//     leaveTotal,
//     employee_id
//   };
//   try {
//     con.query(`INSERT INTO LeaveRequests SET ?`, employee, (err, result) => {
//       if (err) throw err;
//       res.send(result);
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(400).send(error);
//   }
// });
// Leave request
router.get("/LeaveRequests", (req, res) => {
  try {
    con.query("SELECT * FROM LeaveRequests", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Specific employee
router.get("/:id", (req, res) => {
  try {
    con.query(
      `SELECT * FROM employees WHERE employee_id ="${req.params.id}"`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// get leave all applications

router.get("/capturedRequests", (req, res) => {
  try {
    con.query("SELECT * FROM employees inner join LeaveRequests", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// delete a leave request

router.delete("/:id", (req, res) => {
  try {
    con.query(
      `DELETE  FROM employees WHERE employee_id =${req.params.id}`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// insert into employees 

app.post('/post/employee', bodyParser.json(), (req, res) => {
  let { firstName, lastName, email } = req.body;

  const sqlQry = `INSERT INTO employees (firstName, lastName, email)
              VALUES ( ?, ?, ?);`;
  db.query(sqlQry, [firstName, lastName, email], (err) => {
    if (err) {
      res.json({
        status: 400,
        err: 'Please enter a unique email'
      });
    } else {
      res.json({
        status: 200,
        msg: `employee with the name: ${firstName} is successfully added to the database!`
      });
    }
  });
});

// apply for a leave


app.post('/post/application', bodyParser.json(), (req, res) => {
  let { startDate, endDate, Reason, leaveType, leaveTotal, employee_id } = req.body;

  const sqlQry = `INSERT INTO LeaveRequests (startDate, endDate, Reason, leaveType, leaveTotal, employee_id)
              VALUES ( ?, ?, ?, ?, ?, ?);`;
  db.query(sqlQry, [startDate, endDate, Reason, leaveType, leaveTotal,  employee_id], (err) => {
    if (err) {
      res.json({
        status: 400,
        err: 'Sorry cannot retrieve your information'
      });
    } else {
      res.json({
        status: 200,
        msg: `employee with the following employee ID: ${employee_id} has successfully applied for a leave!`
      });
    }
  });
});
