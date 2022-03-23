// // app/customroutes.js
// var express = require('express');
// var router = express.Router();
// var mysql = require('mysql');
// var path = require('path');
// var dbconfig = require('../config/database');
// var moment = require('moment-timezone');

// var connection = mysql.createPool(dbconfig.connection);

// connection.on('connection', function (_conn) {
//     if (_conn) {
//         console.log('Connected the database via threadId %d!!', _conn.threadId);
//         _conn.query('SET SESSION auto_increment_increment=1');
//     }
// });

// moment().tz("America/Toronto").format();
// var d = new Date();
// var myTimezone = "America/Toronto";
// var myDatetimeFormat = "YYYY-MM-DD_hh:mm_a_z";
// var myDatetimeString = moment(d).tz(myTimezone).format(myDatetimeFormat);

// // =====================================
// // ======== Admin react project ========
// // =====================================

// router.get('/', (req, res) => {
//     // res.sendFile(path.join(__dirname, "../admin panel/build/index.html"));
//     res.render('admin.ejs')
// })

// // =====================================
// // ========= view order table ==========
// // =====================================

// router.get('/viewOrder', (req, res) => {
//     try {
//         var query1 = "SELECT o.id AS order_id, di.driver_name,ad.delivery_date as delivery_at, DATE_FORMAT(ad.delivery_date, '%d/%m/%Y')as delivery_date, CONCAT(from_address1, ', ', from_city, ', ', from_postal) AS from_order, CONCAT(to_address1, ', ' , to_city, ', ', to_postal) AS to_order, s.name AS service, DATE_FORMAT(o.created, '%d/%m/%Y') AS date_added, 'New' AS status FROM deliver_order o, deliver_to t, deliver_from f, services s, assign_driver as ad, driver_info as di WHERE o.id = t.order_id AND o.id = f.order_id AND o.delivery_service = s.id AND ad.order_id = o.id AND ad.driver_id = di.driver_id";
//         var query2 = "SELECT o.id AS order_id, 'No driver' AS driver_name, 'No delivery date' as delivery_date, CONCAT(from_address1,', ', from_city, ', ', from_postal) AS from_order, CONCAT(to_address1, ', ', to_city, ', ', to_postal) AS to_order, s.name AS service, DATE_FORMAT(o.created, '%d/%m/%Y') AS date_added, 'New' AS status FROM deliver_order o, deliver_to t, deliver_from f, services s, assign_driver as ad, driver_info as di WHERE o.id = t.order_id AND o.id = f.order_id AND o.delivery_service = s.id AND NOT ad.order_id = o.id AND NOT ad.driver_id = di.driver_id GROUP BY order_id"
//         connection.query(`${query2}`, (err, data) => {
//             if (err) {
//                 res.json({
//                     status: 0,
//                     msg: "Query error",
//                     error: err
//                 })
//             } else {
//                 connection.query(`${query1}`, (err, data1) => {
//                     if (err)
//                         res.json({
//                             status: 0,
//                             msg: "Query error",
//                             error: err
//                         })
//                     result = data.filter(function (obj) {
//                         return !this.has(obj.order_id);
//                     }, new Set(data1.map(obj => obj.order_id)));
//                     Array.prototype.push.apply(data1, result);
//                     if (data) {
//                         connection.query("SELECT driver_id as value, driver_name as label FROM driver_info WHERE approve = '1'", (err, driverResult) => {
//                             if (err)
//                                 res.json({
//                                     status: 0,
//                                     msg: "Query error",
//                                     err: err
//                                 })
//                             else {
//                                 (driverResult === undefined || driverResult === 'undefined' || !driverResult || driverResult.length === 0) ?
//                                     res.json({
//                                         status: 2,
//                                         msg: "No driver approved"
//                                     }) :
//                                     res.json({
//                                         status: 1,
//                                         msg: "Table data found",
//                                         data: data1,
//                                         driver: driverResult
//                                     })
//                             }
//                         })
//                     }
//                     else
//                         res.json({
//                             status: false,
//                             msg: "Something went wrong! Try again"
//                         })
//                 })
//             }
//         })
//     } catch (err) {
//         res.json({
//             status: 0,
//             msg: "Something went wrong",
//             error: err
//         })
//     }
// })

// // =====================================
// // ========== Approve driver ===========
// // =====================================

// router.post('/approve-driver', (req, res) => {
//     try {
//         connection.query('SELECT * FROM driver_info WHERE driver_id = ?', req.body.driver_id, (err, detail) => {
//             if (err)
//                 res.json({
//                     status: 0,
//                     msg: "Query error",
//                     err: err
//                 })
//             else {
//                 if (!detail || detail.length === 0) {
//                     res.json({
//                         status: 2,
//                         msg: "Driver not found"
//                     })
//                 } else {
//                     connection.query(`UPDATE driver_info SET approve = ?, updated_at=? WHERE driver_id = ?`, [req.body.approve, myDatetimeString, req.body.driver_id], (err1, updated) => {
//                         if (err1)
//                             res.json({
//                                 status: 0,
//                                 msg: "Query error",
//                                 err: err1
//                             })
//                         else {
//                             (updated.affectedRows) ?
//                                 res.json({
//                                     status: 1,
//                                     msg: "Operation done successfully",
//                                     data: detail
//                                 }) : res.json({
//                                     status: 3,
//                                     msg: "Something went wrong, try again!"
//                                 })
//                         }
//                     })
//                 }
//             }
//         })
//     } catch (err) {
//         res.json({
//             status: 0,
//             msg: "Something went wrong",
//             error: err
//         })
//     }
// })

// // =====================================
// // ======= Assign/Change Driver ========
// // =====================================

// router.post('/assign-driver', (req, res) => {
//     try {
//         var { driver_id, order_id, delivery_date } = req.body;
//         connection.query('SELECT * FROM assign_driver WHERE order_id=?', order_id, (err, exist) => {
//             if (err)
//                 res.json({
//                     status: 0,
//                     msg: 'Query error',
//                     err: err
//                 })
//             else if (!exist || exist.length == 0) {
//                 connection.query("INSERT INTO assign_driver (driver_id, order_id, delivery_date, assigned_date) VALUES ('" + driver_id + "', '" + order_id + "','" + delivery_date + "', '" + myDatetimeString + "')", (err, details) => {
//                     if (err)
//                         res.json({
//                             status: 0,
//                             msg: 'Query error',
//                             err: err
//                         })
//                     else
//                         res.json({
//                             status: 1,
//                             msg: "Successfully assigned!",
//                             data: details
//                         })
//                 })
//             }
//             else {
//                 connection.query("UPDATE assign_driver SET driver_id = '" + driver_id + "', delivery_date = '" + delivery_date + "', assigned_date = '" + myDatetimeString + "' WHERE order_id = '" + order_id + "'", (err, details) => {
//                     if (err)
//                         res.json({
//                             status: 0,
//                             msg: 'Query error',
//                             err: err
//                         })
//                     else{
//                         connection.query("UPDATE order_seq SET driver_id = '" + driver_id + "', delivery_date = '" + delivery_date + "', driver_name = (SELECT driver_name FROM driver_info WHERE driver_id = '" + driver_id + "') WHERE order_id = '" + order_id + "'", (err, details) => {
//                             if (err)
//                                 res.json({
//                                     status: 0,
//                                     msg: 'Query error',
//                                     err: err
//                                 })
//                             else
//                                 res.json({
//                                     status: 1,
//                                     msg: "Successfully changed driver!"
//                                 })
//                         })
//                     }
//                 })
//             }
//         })
//     } catch (err) {
//         res.json({
//             status: 0,
//             msg: "Something went wrong",
//             error: err
//         })
//     }
// })

// // =====================================
// // ======= Change Assign Driver ========
// // =====================================

// router.post('/change-driver', (req, res) => {
//     try {
//         var { driver_id, order_id, delivery_date } = req.body;
//         var query1 = "UPDATE order_seq SET driver_id = '" + driver_id + "', driver_name = (SELECT driver_name FROM driver_info WHERE driver_info.driver_id = '" + driver_id + "') WHERE order_id = '" + order_id + "'";
//         var query2 = "UPDATE assign_driver SET driver_id = '" + driver_id + "', delivery_date = '" + delivery_date + "', assigned_date = '" + myDatetimeString + "' WHERE order_id = '" + order_id + "'";
//         connection.query(`${query1} UNION ${query2}`, (err, details) => {
//             if (err)
//                 res.json({
//                     status: 0,
//                     msg: 'Query error',
//                     err: err
//                 })
//             else
//                 res.json({
//                     status: 1,
//                     msg: "Successfully changed driver!"
//                 })
//         })
//     } catch (err) {
//         res.json({
//             status: 0,
//             msg: "Something went wrong",
//             error: err
//         })
//     }
// })

// module.exports = router;

//galedelivery-c2cc0-firebase-adminsdk-4bl1x-3a71c33620.json

// app/customroutes.js
var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var path = require("path");
var dbconfig = require("../config/database");
var moment = require("moment-timezone");
let async = require("async");
const { connected } = require("process");
var admin = require("firebase-admin");
var forEach = require("async-foreach").forEach;

var connection = mysql.createPool(dbconfig.connection);

connection.on("connection", function (_conn) {
  if (_conn) {
    console.log("Connected the database via threadId %d!!", _conn.threadId);
    _conn.query("SET SESSION auto_increment_increment=1");
  }
});

moment().tz("America/Toronto").format();
var d = new Date();
var myTimezone = "America/Toronto";
var myDatetimeFormat = "YYYY-MM-DD_hh:mm_a_z";
var myDatetimeString = moment(d).tz(myTimezone).format(myDatetimeFormat);

// =====================================
// ======== Admin react project ========
// =====================================

var serviceAccount = require("../galedelivery-c2cc0-firebase-adminsdk-4bl1x-3a71c33620.json");

var TokenData = [];
var dataTokenstr = "";

router.get("/", (req, res) => {
  // res.sendFile(path.join(__dirname, "../admin panel/build/index.html"));
  res.render("admin.ejs");
});

////=======>real api of view order====>
// router.get('/viewOrder', (req, res) => {
//     try {
//         console.log("view order");
//         var query1 = "SELECT o.id AS order_id, di.driver_name,ad.delivery_date as delivery_at, DATE_FORMAT(ad.delivery_date, '%d/%m/%Y')as delivery_date, CONCAT(from_address1, ', ', from_city, ', ', from_postal) AS from_order, CONCAT(to_address1, ', ' , to_city, ', ', to_postal) AS to_order, s.name AS service, DATE_FORMAT(o.created, '%d/%m/%Y') AS date_added, o.status FROM deliver_order o, deliver_to t, deliver_from f, services s, assign_driver as ad, driver_info as di WHERE o.id = t.order_id AND o.id = f.order_id AND o.delivery_service = s.id AND ad.order_id = o.id AND ad.driver_id = di.driver_id";
//         var query2 = "SELECT o.id AS order_id, 'No driver' AS driver_name, 'No delivery date' as delivery_date, CONCAT(from_address1,', ', from_city, ', ', from_postal) AS from_order, CONCAT(to_address1, ', ', to_city, ', ', to_postal) AS to_order, s.name AS service, DATE_FORMAT(o.created, '%d/%m/%Y') AS date_added, o.status FROM deliver_order o, deliver_to t, deliver_from f, services s, assign_driver as ad, driver_info as di WHERE o.id = t.order_id AND o.id = f.order_id AND o.delivery_service = s.id AND NOT ad.order_id = o.id AND NOT ad.driver_id = di.driver_id GROUP BY order_id"
//         var query3 = "SELECT o.id AS order_id, di.driver_name,ad.delivery_date as delivery_at, DATE_FORMAT(ad.delivery_date, '%d/%m/%Y')as delivery_date, CONCAT(from_address1, ', ', from_city, ', ', from_postal) AS from_order, CONCAT(to_address1, ', ' , to_city, ', ', to_postal) AS to_order, s.name AS service, DATE_FORMAT(o.created, '%d/%m/%Y') AS date_added, o.status FROM guest_deliver_order o, guest_deliver_to t, guest_deliver_from f, services s, assign_driver as ad, driver_info as di WHERE o.id = t.order_id AND o.id = f.order_id AND o.delivery_service = s.id AND ad.order_id = o.id AND ad.driver_id = di.driver_id";
//         var query4 = "SELECT o.id AS order_id, 'No driver' AS driver_name, 'No delivery date' as delivery_date, CONCAT(from_address1,', ', from_city, ', ', from_postal) AS from_order, CONCAT(to_address1, ', ', to_city, ', ', to_postal) AS to_order, s.name AS service, DATE_FORMAT(o.created, '%d/%m/%Y') AS date_added, o.status FROM guest_deliver_order o, guest_deliver_to t, guest_deliver_from f, services s, assign_driver as ad, driver_info as di WHERE o.id = t.order_id AND o.id = f.order_id AND o.delivery_service = s.id AND NOT ad.order_id = o.id AND NOT ad.driver_id = di.driver_id GROUP BY order_id"
//         connection.query(`${query2}`, (err, data) => {
//             if (err) {
//                 res.json({
//                     status: 0,
//                     msg: "Query error",
//                     error: err
//                 })
//             } else {
//                 connection.query(`${query1}`, (err, data1) => {
//                     if (err)
//                         res.json({
//                             status: 0,
//                             msg: "Query error",
//                             error: err
//                         })
//                     var result = data.filter(function (obj) {
//                         return !this.has(obj.order_id);
//                     }, new Set(data1.map(obj => obj.order_id)));
//                     Array.prototype.push.apply(data1, result);
//                     if (data) {
//                         connection.query(`${query4}`, (err, data2) => {//data
//                             if (err) {
//                                 res.json({
//                                     status: 0,
//                                     msg: "Query error",
//                                     error: err
//                                 })
//                             } else {
//                                 connection.query(`${query3}`, (err, data3) => {//data1
//                                     if (err)
//                                         res.json({
//                                             status: 0,
//                                             msg: "Query error",
//                                             error: err
//                                         })
//                                     else {
//                                         var result1 = data2.filter(function (obj1) {//result obj
//                                             return !this.has(obj1.order_id);//obj
//                                         }, new Set(data3.map(obj1 => obj1.order_id)));//data1 obj
//                                         Array.prototype.push.apply(data3, result1);//data1 result
//                                         if (data2) {//data
//                                             connection.query("SELECT driver_id as value, driver_name as label FROM driver_info WHERE approve = '1'", (err, driverResult) => {//driverResult
//                                                 if (err)
//                                                     res.json({
//                                                         status: 0,
//                                                         msg: "Query error",
//                                                         err: err
//                                                     })
//                                                 else {
//                                                     console.log("result----->", driverResult);
//                                                     if (!(driverResult) || driverResult === 'undefined') {
//                                                         res.json({
//                                                             status: 2,
//                                                             msg: "No driver approved"
//                                                         })
//                                                     } else {
//                                                         Array.prototype.push.apply(data1, data3);
//                                                         console.log("sdgvcsvcvscvhcvvc", data1)
//                                                         res.json({
//                                                             status: 1,
//                                                             msg: "Table data found",
//                                                             data: data1,//data:data1==>data3
//                                                             driver: driverResult//driver:driverResult
//                                                         })
//                                                     }
//                                                 }
//                                             })
//                                         }
//                                     }
//                                 })
//                             }
//                         })
//                     }
//                     else
//                         res.json({
//                             status: false,
//                             msg: "Something went wrong! Try again"
//                         })
//                 })
//            }
//        })
//         // res.send("hello")
//     } catch (err) {
//         res.json({
//             status: 0,
//             msg: "Something went wrong",
//             error: err
//         })
//     }
// })
//[][][][][][][[[][][][][]][]][]testing

router.get("/viewOrder", (req, res) => {
  try {
    // console.log("view order");
    var query1 =
      "SELECT o.id AS order_id, di.driver_name,ad.delivery_date as delivery_at, DATE_FORMAT(ad.delivery_date, '%d/%m/%Y')as delivery_date, CONCAT(from_address1, ', ', from_city, ', ', from_postal) AS from_order, CONCAT(to_address1, ', ' , to_city, ', ', to_postal) AS to_order, s.name AS service, DATE_FORMAT(o.created, '%d/%m/%Y') AS date_added, o.status,o.image_name FROM deliver_order o, deliver_to t, deliver_from f, services s, assign_driver as ad, driver_info as di WHERE o.id = t.order_id AND o.id = f.order_id AND o.delivery_service = s.id AND ad.order_id = o.id AND ad.driver_id = di.driver_id";
    var query2 =
      "SELECT o.id AS order_id, 'No driver' AS driver_name, 'No delivery date' as delivery_date, CONCAT(from_address1,', ', from_city, ', ', from_postal) AS from_order, CONCAT(to_address1, ', ', to_city, ', ', to_postal) AS to_order, s.name AS service, DATE_FORMAT(o.created, '%d/%m/%Y') AS date_added, o.status,o.image_name FROM deliver_order o, deliver_to t, deliver_from f, services s, assign_driver as ad, driver_info as di WHERE o.id = t.order_id AND o.id = f.order_id AND o.delivery_service = s.id AND NOT ad.order_id = o.id AND NOT ad.driver_id = di.driver_id GROUP BY order_id";

    var query3 =
      "SELECT o.id AS order_id, di.driver_name,ad.delivery_date as delivery_at, DATE_FORMAT(ad.delivery_date, '%d/%m/%Y')as delivery_date, CONCAT(from_address1, ', ', from_city, ', ', from_postal) AS from_order, CONCAT(to_address1, ', ' , to_city, ', ', to_postal) AS to_order, s.name AS service, DATE_FORMAT(o.created, '%d/%m/%Y') AS date_added, o.status,o.image_name FROM guest_deliver_order o, guest_deliver_to t, guest_deliver_from f, services s, assign_driver as ad, driver_info as di WHERE o.id = t.order_id AND o.id = f.order_id AND o.delivery_service = s.id AND ad.order_id = o.id AND ad.driver_id = di.driver_id";
    var query4 =
      "SELECT o.id AS order_id, 'No driver' AS driver_name, 'No delivery date' as delivery_date, CONCAT(from_address1,', ', from_city, ', ', from_postal) AS from_order, CONCAT(to_address1, ', ', to_city, ', ', to_postal) AS to_order, s.name AS service, DATE_FORMAT(o.created, '%d/%m/%Y') AS date_added, o.status,o.image_name FROM guest_deliver_order o, guest_deliver_to t, guest_deliver_from f, services s, assign_driver as ad, driver_info as di WHERE o.id = t.order_id AND o.id = f.order_id AND o.delivery_service = s.id AND NOT ad.order_id = o.id AND NOT ad.driver_id = di.driver_id GROUP BY order_id";

    connection.query(`${query2}`, (err, data) => {
      if (err) {
        res.json({
          status: 0,
          msg: "Query error",
          error: err,
        });
      } else {
        connection.query(`${query1}`, (err, data1) => {
          if (err)
            res.json({
              status: 0,
              msg: "Query error",
              error: err,
            });
          var result = data.filter(function (obj) {
            return !this.has(obj.order_id);
          }, new Set(data1.map((obj) => obj.order_id)));
          Array.prototype.push.apply(data1, result);
          if (data) {
            connection.query(`${query4}`, (err, data2) => {
              //data

              if (err) {
                res.json({
                  status: 0,
                  msg: "Query error",
                  error: err,
                });
              } else {
                connection.query(`${query3}`, (err, data3) => {
                  //data1
                  if (err)
                    res.json({
                      status: 0,
                      msg: "Query error",
                      error: err,
                    });
                  else {
                    var result1 = data2.filter(function (obj1) {
                      //result obj
                      return !this.has(obj1.order_id); //obj
                    }, new Set(data3.map((obj1) => obj1.order_id))); //data1 obj
                    Array.prototype.push.apply(data3, result1); //data1 result

                    if (data2) {
                      //data
                      connection.query(
                        "SELECT driver_id as value, driver_name as label FROM driver_info WHERE approve = '1'",
                        (err, driverResult) => {
                          //driverResult
                          if (err)
                            res.json({
                              status: 0,
                              msg: "Query error",
                              err: err,
                            });
                          else {
                            // console.log("result----->", driverResult);

                            if (!driverResult || driverResult === "undefined") {
                              res.json({
                                status: 2,
                                msg: "No driver approved",
                              });
                            } else {
                              Array.prototype.push.apply(data1, data3);
                              // console.log("sdgvcsvcvscvhcvvc", data1);
                              data1.sort(function (a, b) {
                                return b.order_id - a.order_id;
                              });
                              res.json({
                                status: 1,
                                msg: "Table data found",
                                data: data1, //data:data1==>data3
                                driver: driverResult, //driver:driverResult
                              });
                            }
                          }
                        }
                      );
                    }
                  }
                });
              }
            });
          } else
            res.json({
              status: false,
              msg: "Something went wrong! Try again",
            });
        });
      }
    });
    // res.send("hello")
  } catch (err) {
    res.json({
      status: 0,
      msg: "Something went wrong",
      error: err,
    });
  }
});

//][][][][][][[[][][][][][][[][]]]]

// =====================================
// ========== Approve driver ===========
// =====================================

router.post("/approve-driver", (req, res) => {
  try {
    connection.query(
      "SELECT * FROM driver_info WHERE driver_id = ?",
      req.body.driver_id,
      (err, detail) => {
        if (err)
          res.json({
            status: 0,
            msg: "Query error",
            err: err,
          });
        else {
          if (!detail || detail.length === 0) {
            res.json({
              status: 2,
              msg: "Driver not found",
            });
          } else {
            connection.query(
              `UPDATE driver_info SET approve = ?, updated_at=? WHERE driver_id = ?`,
              [req.body.approve, myDatetimeString, req.body.driver_id],
              (err1, updated) => {
                if (err1)
                  res.json({
                    status: 0,
                    msg: "Query error",
                    err: err1,
                  });
                else {
                  updated.affectedRows
                    ? res.json({
                        status: 1,
                        msg: "Operation done successfully",
                        data: detail,
                      })
                    : res.json({
                        status: 3,
                        msg: "Something went wrong, try again!",
                      });
                }
              }
            );
          }
        }
      }
    );
  } catch (err) {
    res.json({
      status: 0,
      msg: "Something went wrong",
      error: err,
    });
  }
});

const excelQuery = async (v, fDate, exAmount, nIdn) => {
  console.log("query....", nIdn);
  connection.query(
    "INSERT INTO guest_deliver_order (user_email, deliver_from, deliver_to, pickup_date, delivery_service, created, updated, status, user_status, image_name) VALUES ('" +
      v.from_email +
      "','" +
      "Toronto (and Surround Area)'" +
      ",'Toronto (and Surround Area)','" +
      fDate +
      "','" +
      v.delivery_servicename +
      "','" +
      myDatetimeString +
      "','" +
      myDatetimeString +
      "'," +
      "'New','guest-user', 'NO IMAGE')",
    (err1, res1) => {
      if (err1) console.log("err1", err1);
      else {
        console.log("1st done");
        // connection.query(
        //   `SELECT id FROM guest_deliver_order ORDER BY id DESC LIMIT 1`,
        //   (err2, res2) => {
        //     if (err2) console.log("err2", err2);
        //     else {
        //       var nId = res2[0].id;
        //       console.log("2 done");
        connection.query(
          "INSERT INTO guest_deliver_from (order_id, from_name, from_email, from_phone, from_address1, from_address2 , from_city, from_province , from_postal, from_update_by) VALUES ('" +
            nIdn[0][0] +
            "','" +
            v.from_name +
            "','" +
            v.from_email +
            "','" +
            v.from_phone +
            "','" +
            v.from_address1 +
            "','" +
            v.from_address2 +
            "','" +
            v.from_city +
            "','" +
            v.from_province +
            "','" +
            v.from_postal +
            "','" +
            v.from_update_by +
            "')",
          (nIdn[0][0] = nIdn[0][0] + 1),
          (err3, res3) => {
            if (err3) console.log("err3", err3);
            else {
              console.log("2 done");
              connection.query(
                "INSERT INTO guest_deliver_to (order_id, to_name, to_email, to_phone, to_address1, to_address2 , to_city, to_province , to_postal, to_update_by) VALUES ('" +
                  nIdn[1][1] +
                  "','" +
                  v.to_name +
                  "','" +
                  v.to_email +
                  "','" +
                  v.to_phone +
                  "','" +
                  v.to_address1 +
                  "','" +
                  v.to_address2 +
                  "','" +
                  v.to_city +
                  "','" +
                  v.to_province +
                  "','" +
                  v.to_postal +
                  "','" +
                  v.to_update_by +
                  "')",
                (nIdn[1][1] = nIdn[1][1] + 1),
                (err4, res4) => {
                  if (err4) console.log("err4", err4);
                  else {
                    console.log("3 done");
                    connection.query(
                      "INSERT INTO guest_deliver_order_payment (order_id, user_email, charge_id, amount, payment_status, created , updated) VALUES ('" +
                        nIdn[2][2] +
                        "','" +
                        v.from_email +
                        " ',' ','" +
                        exAmount +
                        "','1','" +
                        fDate +
                        "','" +
                        fDate +
                        "')",
                      (nIdn[2][2] = nIdn[2][2] + 1),
                      (err5, res5) => {
                        if (err5) console.log("err5", err5);
                        else {
                          console.log("4 done");
                          connection.query(
                            "INSERT INTO guest_deliver_order_summary (order_id, total_package, instruction, fragile, packages_detail) VALUES ('" +
                              nIdn[3][3] +
                              "','1',' ','" +
                              v.fragile +
                              "','" +
                              v.packages_detail +
                              "')",
                            (nIdn[3][3] = nIdn[3][3] + 1),
                            (err6, res6) => {
                              if (err6) console.log("err6 ", err6);
                              else {
                                console.log("All done");
                              }
                              return;
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    }
  );
  //     }
  //   }
  // );
  // }})
};

//My code

router.post("/import-excel", (req, res) => {
  console.log("req.body", req.body);
  // console.log("req.body", req.body[0]['assigned driver']);
  const data = req.body;

  function pad(d) {
    return d < 10 ? "0" + d.toString() : d.toString();
  }

  var nIdn = [];
  var exAmount;
  var date1 = new Date();
  console.log("date1...", date1);

  var d = new Date(date1.getTime());
  console.log("d...", d);

  var fDate = d.getDate() + "/" + pad(d.getMonth() + 1) + "/" + d.getFullYear();
  console.log("est date", fDate);

  var myTimezone = "America/Toronto";
  var myDatetimeFormat = "YYYY-MM-DD hh:mm:ss a z";
  var myDatetimeString = moment(d).tz(myTimezone).format(myDatetimeFormat);
  console.log("myDatetimeString", myDatetimeString);

  connection.query(
    `SELECT id FROM guest_deliver_order ORDER BY id DESC LIMIT 1`,
    (err2, res2) => {
      if (err2) console.log("err2", err2);
      else {
        var nIdn2 = res2[0].id;
        for (let i = 0; i < 4; i++) {
          nIdn = [...nIdn, { [i]: nIdn2 + 1 }];
        }

        connection.query(
          `ALTER TABLE guest_deliver_order AUTO_INCREMENT = ${nIdn2 + 1}`,
          (e, r) => {
            if (e) console.log("eee", e);
            else {
              console.log("done setting", `${nIdn2 + 1}`);
              data.forEach((v) => {
                if (v.delivery_servicename === "Same Day") {
                  v.delivery_servicename = 1;
                  exAmount = 14;
                }
                if (v.delivery_servicename === "One-Day") {
                  v.delivery_servicename = 2;
                  exAmount = 12;
                }
                if (v.delivery_servicename === "Two-Day") {
                  v.delivery_servicename = 3;
                  exAmount = 10;
                }
                if (v.delivery_servicename === "Five-Day") {
                  v.delivery_servicename = 4;
                  exAmount = 8;
                }
                v.from_province = v.from_province.slice(0, 2).toUpperCase();
                v.to_province = v.to_province.slice(0, 2).toUpperCase();
                excelQuery(v, fDate, exAmount, nIdn);
              });
            }
          }
        );
      }
    }
  );
});

//My code

router.post("/assign-driver", (req, res) => {
  try {
    console.log(">>>>>>>", req.body);
    var { driver_id, order_id, delivery_date } = req.body;
    connection.query(
      "SELECT * FROM assign_driver WHERE order_id=?",
      order_id,
      (err, exist) => {
        if (err)
          res.json({
            status: 0,
            msg: "Query error",
            err: err,
          });
        else if (!exist || exist.length == 0) {
          connection.query(
            "INSERT INTO assign_driver (driver_id, order_id, delivery_date, assigned_date) VALUES ('" +
              driver_id +
              "', '" +
              order_id +
              "','" +
              delivery_date +
              "', '" +
              myDatetimeString +
              "')",
            (err, details) => {
              if (err)
                res.json({
                  status: 0,
                  msg: "Query error",
                  err: err,
                });
              else
                res.json({
                  status: 1,
                  msg: "Successfully assigned!",
                  data: details,
                });
            }
          );
        } else {
          connection.query(
            "UPDATE assign_driver SET driver_id = '" +
              driver_id +
              "', delivery_date = '" +
              delivery_date +
              "', assigned_date = '" +
              myDatetimeString +
              "' WHERE order_id = '" +
              order_id +
              "'",
            (err, details) => {
              if (err)
                res.json({
                  status: 0,
                  msg: "Query error",
                  err: err,
                });
              else {
                connection.query(
                  "UPDATE order_seq SET driver_id = '" +
                    driver_id +
                    "', delivery_date = '" +
                    delivery_date +
                    "', driver_name = (SELECT driver_name FROM driver_info WHERE driver_id = '" +
                    driver_id +
                    "') WHERE order_id = '" +
                    order_id +
                    "'",
                  (err, details) => {
                    if (err)
                      res.json({
                        status: 0,
                        msg: "Query error",
                        err: err,
                      });
                    else
                      res.json({
                        status: 1,
                        msg: "Successfully changed driver!",
                      });
                  }
                );
              }
            }
          );
        }
      }
    );
  } catch (err) {
    res.json({
      status: 0,
      msg: "Something went wrong",
      error: err,
    });
  }
});

// =====================================
// ======= Change Assign Driver ========
// =====================================

router.post("/change-driver", (req, res) => {
  try {
    var { driver_id, order_id, delivery_date } = req.body;
    var query1 =
      "UPDATE order_seq SET driver_id = '" +
      driver_id +
      "', driver_name = (SELECT driver_name FROM driver_info WHERE driver_info.driver_id = '" +
      driver_id +
      "') WHERE order_id = '" +
      order_id +
      "'";
    var query2 =
      "UPDATE assign_driver SET driver_id = '" +
      driver_id +
      "', delivery_date = '" +
      delivery_date +
      "', assigned_date = '" +
      myDatetimeString +
      "' WHERE order_id = '" +
      order_id +
      "'";
    connection.query(`${query1} UNION ${query2}`, (err, details) => {
      if (err)
        res.json({
          status: 0,
          msg: "Query error",
          err: err,
        });
      else
        res.json({
          status: 1,
          msg: "Successfully changed driver!",
        });
    });
  } catch (err) {
    res.json({
      status: 0,
      msg: "Something went wrong",
      error: err,
    });
  }
});

//////////////////////dummy testing api/////////////////////////

router.get("/getDeviceToken/:deviceToken/:email", (req, res) => {
  const devTok = req.params.deviceToken;
  TokenData.push(devTok);
  var sql =
    "UPDATE driver_info SET devToken = '" +
    req.params.deviceToken +
    "' WHERE driver_email = '" +
    req.params.email +
    "'";
  connection.query(sql, (err) => {
    if (err) throw err;
    else {
      res.json({
        msg: "updated succesfully",
      });
    }
  });
});

///////

// router.post('/assign-driver', (req, res) => {
//     try {
//         if (TokenData.length > 0) {
//             var { driver_id, order_id, delivery_date } = req.body;
//             connection.query('SELECT * FROM assign_driver WHERE order_id=?', order_id, (err, exist) => {
//                 if (err)
//                     res.json({
//                         status: 0,
//                         msg: 'Query error',
//                         err: err
//                     })
//                 else if (!exist || exist.length == 0) {
//                     connection.query("INSERT INTO assign_driver (driver_id, order_id, delivery_date, assigned_date,devToken) VALUES ('" + driver_id + "', '" + order_id + "','" + delivery_date + "', '" + myDatetimeString +"', '"+TokenData[0]+"')", (err, details) => {
//                         if (err)
//                             res.json({
//                                 status: 0,
//                                 msg: 'Query error',
//                                 err: err
//                             })
//                         else {
//                             var sql = "SELECT * FROM driver_info WHERE driver_id ='" + driver_id + "'";
//                             connection.query(sql, (err, rsultData) => {
//                                 if (err)
//                                     res.json({
//                                         status: 0,
//                                         msg: 'Query error',
//                                         err: err
//                                     })
//                                 else {
//                                     //rsultData[0].devToken
//                                     var registrationTokens = []
//                                     registrationTokens.push(rsultData[0])
//                                     admin.initializeApp({
//                                         credential: admin.credential.cert(serviceAccount)
//                                     });

//                                     const message = {
//                                         tokens: registrationTokens,
//                                         data: {
//                                             message: "hello",
//                                             title: "hello hi how are you"
//                                         },
//                                         notification: {
//                                             body: 'This is an FCM notification that displays an image!',
//                                             title: 'FCM Notification',
//                                             //sound:'default'
//                                         },
//                                         android: {
//                                             notification: {
//                                                 sound: 'default'
//                                             }
//                                         },
//                                     };
//                                     admin
//                                         .messaging()
//                                         .sendMulticast(message)
//                                         .then(response => {
//                                             console.log('Successfully sent message:', response);
//                                             res.json({
//                                                 status: 1,
//                                                 msg: "Successfully assigned!",
//                                                 data: details
//                                             })
//                                         })
//                                         .catch(error => {
//                                             console.log('Error sending message:', error);
//                                         });
//                                 }
//                             })

//                         }
//                     })
//                 }
//                 else {
//                     connection.query("UPDATE assign_driver SET driver_id = '" + driver_id + "', delivery_date = '" + delivery_date + "', assigned_date = '" + myDatetimeString + "', devToken = '"+TokenData[0]+"' WHERE order_id = '" + order_id + "'", (err, details) => {
//                         if (err)
//                             res.json({
//                                 status: 0,
//                                 msg: 'Query error',
//                                 err: err
//                             })
//                         else {
//                             connection.query("UPDATE order_seq SET driver_id = '" + driver_id + "', delivery_date = '" + delivery_date + "', driver_name = (SELECT driver_name FROM driver_info WHERE driver_id = '" + driver_id + "') WHERE order_id = '" + order_id + "'", (err, details) => {
//                                 if (err)
//                                     res.json({
//                                         status: 0,
//                                         msg: 'Query error',
//                                         err: err
//                                     })
//                                 else{
//                                     var sql = "SELECT * FROM driver_info WHERE driver_id ='" + driver_id + "'";
//                                      connection.query(sql, (err, rsultDataNew) => {
//                                        if(err)
//                                        res.json({
//                                             status: 0,
//                                             msg: 'Query error',
//                                             err: err
//                                        })
//                                        else{
//                                         var registrationTokens = []
//                                         registrationTokens.push(rsultDataNew[0])
//                                         admin.initializeApp({
//                                             credential: admin.credential.cert(serviceAccount)
//                                         });

//                                         const message = {
//                                             tokens: registrationTokens,
//                                             data: {
//                                                 message: "hello",
//                                                 title: "hello hi how are you"
//                                             },
//                                             notification: {
//                                                 body: 'This is an FCM notification that displays an image!',
//                                                 title: 'FCM Notification',
//                                                 //sound:'default'
//                                             },
//                                             android: {
//                                                 notification: {
//                                                     sound: 'default'
//                                                 }
//                                             },
//                                         };
//                                         admin
//                                             .messaging()
//                                             .sendMulticast(message)
//                                             .then(response => {
//                                                 console.log('Successfully sent message:', response);
//                                                 res.json({
//                                                     status: 1,
//                                                     msg: "Successfully changed driver!",
//                                                     data: details
//                                                 })
//                                             })
//                                             .catch(error => {
//                                                 console.log('Error sending message:', error);
//                                             });
//                                        }
//                                      })
//                                 }

//                             })
//                         }
//                     })
//                 }
//             })
//         } else {
//             var { driver_id, order_id, delivery_date } = req.body;
//             connection.query('SELECT * FROM assign_driver WHERE order_id=?', order_id, (err, exist) => {
//                 if (err)
//                     res.json({
//                         status: 0,
//                         msg: 'Query error',
//                         err: err
//                     })
//                 else if (!exist || exist.length == 0) {
//                     connection.query("INSERT INTO assign_driver (driver_id, order_id, delivery_date, assigned_date) VALUES ('" + driver_id + "', '" + order_id + "','" + delivery_date + "', '" + myDatetimeString + "')", (err, details) => {
//                         if (err)
//                             res.json({
//                                 status: 0,
//                                 msg: 'Query error',
//                                 err: err
//                             })
//                         else
//                             res.json({
//                                 status: 1,
//                                 msg: "Successfully assigned!",
//                                 data: details
//                             })
//                     })
//                 }
//                 else {
//                     connection.query("UPDATE assign_driver SET driver_id = '" + driver_id + "', delivery_date = '" + delivery_date + "', assigned_date = '" + myDatetimeString + "' WHERE order_id = '" + order_id + "'", (err, details) => {
//                         if (err)
//                             res.json({
//                                 status: 0,
//                                 msg: 'Query error',
//                                 err: err
//                             })
//                         else {
//                             connection.query("UPDATE order_seq SET driver_id = '" + driver_id + "', delivery_date = '" + delivery_date + "', driver_name = (SELECT driver_name FROM driver_info WHERE driver_id = '" + driver_id + "') WHERE order_id = '" + order_id + "'", (err, details) => {
//                                 if (err)
//                                     res.json({
//                                         status: 0,
//                                         msg: 'Query error',
//                                         err: err
//                                     })
//                                 else
//                                     res.json({
//                                         status: 1,
//                                         msg: "Successfully changed driver!"
//                                     })
//                             })
//                         }
//                     })
//                 }
//             })
//         }
//     } catch (err) {
//         res.json({
//             status: 0,
//             msg: "Something went wrong",
//             error: err
//         })
//     }
// })

// router.get('/hhh', (req, res) => {
//     connection.query("select * from driver_info where driver_id='149'", (err, result) => {
//         if (err) throw err;
//         else {
//             console.log("result", result[0].devToken)
//             res.json({
//                 status: 1,
//                 msg: "Successfully ",
//                 data: result
//             })
//         }
//     })
// })

module.exports = router;