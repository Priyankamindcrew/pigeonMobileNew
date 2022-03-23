// app/customroutes.js
var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var dbconfig = require("../config/database");
var base64 = require("base-64");
var moment = require("moment-timezone");
const { route } = require("./adminroutes");
let async = require("async");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
var AWS = require("aws-sdk");
var multerS3 = require("multer-s3");
const e = require("connect-flash");

// const storage = multer.memoryStorage({
//     destination: function (req, file, callback) {
//         callback(null, '')
//     },
//     filename: function (req, file, callback) {
//         console.log("file2",file)
//        // console.log("req",req)
//         //console.log("file", file)
//         callback(null, file.fieldname + Date.now() + path.extname(file.originalname))
//     }
// })
// const upload = multer({ storage })

// var s3  = new AWS.S3({
//     accessKeyId: "AKIAV5Q2MJY2O57DW4OX",
//     secretAccessKey: "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"
// });

//var upload = multer({ storage: storage })

var connection = mysql.createPool(dbconfig.connection);

connection.on("connection", (_conn) => {
  if (_conn) {
    console.log("Connected the database via threadId %d!!", _conn.threadId);
    _conn.query("SET SESSION auto_increment_increment=1");
  }
});

// moment().tz("America/Toronto").format();
var d = new Date();
var myTimezone = "America/Toronto";
var myDatetimeFormat = "YYYY-MM-DD hh:mm_a_z";
var myDatetimeString = moment().tz(myTimezone).format(myDatetimeFormat);

// const accountSid = "ACc376ef236d3f499bdfc21710ff56dab9";
// const authToken = "d3c6613b5ad7402293bed75d6c97ed57";
// const accountSid = "AC0ac6bdecd4618b05dd7fd66bbe18bb83";
// const authToken = "ad829aa9333e14ceb631486fe700e9cc";
const accountSid = "AC1f8f40001fbda6ba970f533d2d985c7d";
const authToken = "c087f9cfe6f2f8af77449967f6495a05";

const client = require("twilio")(accountSid, authToken);

// var s3 = new AWS.S3();

// AWS.config.update({
// accessKeyId: "AKIAV5Q2MJY2O57DW4OX",
// secretAccessKey: "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",
//     region: 'us-east-1',
// });

// var upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: 'pigeonimage/proofofdelivery',
//         acl: 'public-read',
//         metadata:function(req, file, cb){
//           cb(null,{fieldname:file.fieldname})
//         },
//         key: function (req, file, cb) {
//             console.log("hello from file1",file);
//           //  console.log("hello from req",req);
//             cb(null, file.fieldname + Date.now() + path.extname(file.originalname)); //use Date.now() for unique file keys
//         }
//     })
// });

///
const s3Config = new AWS.S3({
  accessKeyId: "AKIAV5Q2MJY2O57DW4OX",
  secretAccessKey: "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",
});

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
  },
});

const multerS3Config = multerS3({
  s3: s3Config,
  bucket: "pigeonimage/proofofdelivery",
  acl: "public-read",
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    console.log(file);
    cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: multerS3Config,
});

////

router.get("/hello", (req, res) => {
  const today = myDatetimeString;
  var d = "17/06/2021";
  var myDatetimeFormat = "YYYY-MM-DD";
  var myDatetimeString = moment(d, "DD/MM/YYYY").format("YYYY-MM-DD");
  res.json({ msg: myDatetimeString });
});

router.get("/test", (req, res) => {
  data = [
    {
      key4: "value4",
      key1: "value1",
      key5: "value5",
      key3: "value3",
      key2: "value2",
    },
    {
      key4: "value4",
      key1: "value1",
      key5: "value5",
      key3: "value3",
      key2: "value2",
    },
  ];
  let headerList = ["key1", "key2", "key3", "key4", "key5"];
  let newExportData = [];

  data.forEach((obj) => {
    let json = {};
    headerList.forEach((header) => {
      json[header] = obj[header];
    });
    newExportData.push(json);
  });
  res.send(newExportData);
});

// router.get('/demoTest', (req, res) => {
//     var a = "hello123",
//     b=base64.encode(a);
//     console.log("b",b)
//     c = base64.decode(b)
//     res.json({
//       data:b,
//       data1:c
//     })
// })

router.post("/encode-pwd", async (req, res) => {
  var bodytxt = req.body.pwd;
  var encodedpwd = await base64.encode(bodytxt);
  console.log("encoded data", encodedpwd);
  res.send(encodedpwd);
});

router.post("/decode-pwd", async (req, res) => {
  var bodytxt = req.body.pwd;
  var decodedpwd = await base64.decode(bodytxt);
  console.log("decoded data", decodedpwd);
  res.send(decodedpwd);
});

// router.post('/driver-signup', async(req, res) => {
//     try {

//         var { driver_name, driver_email, password, contact, licence_info, licence_plate } = req.body;
//         console.log("req.body.password",password)

//         var encoded_pwd = await base64.encode(password);
//         console.log("encoded password",encoded_pwd)

//         var users = { driver_name, driver_email, driver_pwd: encoded_pwd, contact, licence_info, licence_plate, created_at: myDatetimeString, approve: 0 };

//         console.log("users", users)

//         connection.query('INSERT INTO driver_info SET ?', users, (err, results) => {
//             if (err) {
//                 err.errno === 1062 ?
//                     res.json({
//                         status: 2,
//                         msg: "Driver already registered",
//                         err: err
//                     }) :
//                     res.json({
//                         status: 0,
//                         msg: "Query Error",
//                         error: err
//                     })
//             }
//             else
//                 res.json({
//                     status: 1,
//                     msg: "Successfully signup!",
//                     data: results
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

// =====================================
// ========== Driver sign-up ===========
// =====================================

router.post("/driver-signup", (req, res) => {
  try {
    //console.log("hello shubham",req.body)

    let {
        body: {
          driver_name,
          driver_email,
          password,
          contact,
          licence_info,
          licence_plate,
        },
      } = req,
      approve = 0;
    bcrypt.hash(password, 10, function (err, hash) {
      if (err) throw err;
      else {
        //var users = { driver_name, driver_email, driver_pwd: hash, contact, licence_info, licence_plate, created_at: myDatetimeString, approve: 0 }

        var sql = `insert into driver_info(driver_name, driver_email, driver_pwd, contact, licence_info, licence_plate, created_at,updated_at,approve) values('${driver_name}','${driver_email}','${hash}','${contact}','${licence_info}','${licence_plate}','${myDatetimeString}','${myDatetimeString}',${approve})`;

        // var data = [driver_name, driver_email, hash, contact, licence_info, licence_plate, created_at, approve]
        connection.query(sql, (err, results) => {
          if (err) {
            err.errno === 1062
              ? res.json({
                  status: 2,
                  msg: "Driver already registered",
                  err: err,
                })
              : res.json({
                  status: 0,
                  msg: "Query Error",
                  error: err,
                });
          } else {
            res.json({
              status: 1,
              msg: "Successfully signup!",
              data: results,
            });
          }
        });
      }
    });
  } catch (err) {
    res.json({
      status: 0,
      msg: "Something went wrong",
      error: err,
    });
  }
});

//////////////////////////////

// =====================================
// ============ All Driver =============
// =====================================

router.get("/all-driver", (req, res) => {
  try {
    connection.query("SELECT * FROM driver_info", (err, result) => {
      if (err)
        res.json({
          status: 0,
          msg: "Query error",
          err: err,
        });
      else {
        if (result.length === 0)
          res.json({
            status: 2,
            msg: "No driver found",
          });
        else
          res.json({
            status: 1,
            msg: "All drivers found",
            data: result,
          });
      }
    });
  } catch (err) {
    res.json({
      status: 0,
      msg: "Something went wrong",
      error: err,
    });
  }
});

////////////////////////////////
////////  driver info  /////////
///////////////////////////////

router.get("/driverInfo/:email", (req, res) => {
  try {
    var sql =
      "SELECT * FROM driver_info WHERE driver_email = '" +
      req.params.email +
      "'";
    connection.query(sql, (err, result) => {
      if (err) {
        res.json({
          status: 0,
          msg: "Query error",
          err: err,
        });
      } else {
        if (result.length > 0) {
          res.json({
            status: 1,
            msg: "Driver data found",
            data: result,
          });
        } else {
          res.json({
            status: 0,
            msg: "No driver data found",
          });
        }
      }
    });
  } catch (err) {
    res.json({
      status: 0,
      msg: "Something went wrong",
      error: err,
    });
  }
});

/////////////////////////////////
////// Update driver info  /////
///////////////////////////////

router.post("/Update-driverInfo/:email", (req, res) => {
  try {
    var { Name, Email, ContactNo, Licence_details, Licence_plate } = req.body;
    var contactNoNew = parseInt(ContactNo);
    console.log("string===>", ContactNo);
    console.log("parseint===>", contactNoNew);
    var sql = `UPDATE driver_info set driver_name='${Name}',driver_email='${Email}',contact='${contactNoNew}',licence_info='${Licence_details}',licence_plate='${Licence_plate}',updated_at='${myDatetimeString}' WHERE driver_email='${req.params.email}'`;
    connection.query(sql, (err) => {
      if (err) {
        res.json({
          status: 0,
          msg: "Query error",
          err: err,
        });
      } else {
        res.json({
          status: 1,
          msg: "Driver data Updated",
        });
      }
    });
  } catch (err) {
    res.json({
      status: 0,
      msg: "Something went wrong",
      error: err,
    });
  }
});

// =====================================
// ========== Approved driver ==========
// =====================================

router.get("/get-approved-driver", (req, res) => {
  try {
    connection.query(
      "SELECT driver_name, contact, driver_email, licence_info, licence_plate FROM driver_info WHERE approve = '1'",
      (err, result) => {
        if (err)
          res.json({
            status: 0,
            msg: "Query error",
            err: err,
          });
        else {
          !result || result.length === 0
            ? res.json({
                status: 2,
                msg: "No driver approved",
              })
            : res.json({
                status: 1,
                msg: "Approved driver found",
                data: result,
              });
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
// ========== Assigned order ===========
// =====================================

router.get("/get-assigned-driver", (req, res) => {
  try {
    var query1 =
      "SELECT DISTINCT di.driver_id, di.driver_name FROM assign_driver as ad, driver_info as di WHERE ad.driver_id = di.driver_id";
    connection.query(`${query1}`, (err, data) => {
      if (err)
        res.json({
          status: 0,
          msg: "Query error",
          error: err,
        });
      else
        res.json({
          status: 1,
          msg: "Assigned driver found",
          data: data,
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

// =====================================
// ======= Driver's orders dates =======
// =====================================

router.post("/driver-order-dates", (req, res) => {
  try {
    var driverId = req.body.driver_id;
    connection.query(
      `SELECT DISTINCT driver_id, DATE_FORMAT(delivery_date, "%d/%m/%Y")as delivery_at, delivery_date FROM assign_driver WHERE driver_id = ? ORDER BY delivery_date`,
      [driverId],
      (err, result) => {
        if (err) {
          res.json({
            status: 0,
            msg: "Query error",
            error: err,
          });
        } else {
          if (result.length > 0) {
            // console.log("if result.....", result)
            res.json({
              status: 1,
              msg: "Assigned orders found",
              data: result,
            });
          } else {
            // console.log("else result...")
            res.json({
              status: 1,
              msg: "No order found",
            });
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

// =====================================
// ========== Driver's orders ==========
// =====================================

router.post("/driver-orders", (req, res) => {
  try {
    var driverId = req.body.driver_id;
    var deliveryDate = req.body.delivery_date;
    connection.query(
      `SELECT order_id, driver_id, driver_name, address, delivery_date, service, date_added, delivery_type, seq FROM order_seq WHERE driver_id = ? AND delivery_date = ? ORDER BY seq`,
      [driverId, deliveryDate],
      (err, result) => {
        if (err) {
          res.json({
            status: 0,
            msg: "Query error",
            error: err,
          });
        } else {
          if (result.length > 0) {
            console.log("if result.....", result);
            res.json({
              status: 1,
              msg: "Order sequence found",
              data: result,
            });
          } else {
            // SELECT o.id AS order_id, di.driver_id, di.driver_name, CONCAT(from_address1, ', ', from_city, ', ' , from_province, ' ' , from_postal) AS address, s.name AS service, DATE_FORMAT(o.created, "%d/%m/%Y") AS date_added, "Pick Up" AS delivery_type, ad.delivery_date FROM guest_deliver_order o, guest_deliver_from f, services s, assign_driver as ad, driver_info as di WHERE o.id = f.order_id AND o.delivery_service = s.id AND ad.order_id = o.id AND ad.driver_id = 160 AND di.driver_id = 160
            // union
            //  SELECT o.id AS order_id, di.driver_id, di.driver_name, CONCAT(to_address1, ', ', to_city, ', ' , to_province, ' ' , to_postal) AS address, s.name AS service, DATE_FORMAT(o.created, "%d/%m/%Y") AS date_added, "Drop Off" AS delivery_type, ad.delivery_date FROM guest_deliver_order o, guest_deliver_to t, services s, assign_driver as ad, driver_info as di WHERE o.id = t.order_id AND o.delivery_service = s.id AND ad.order_id = o.id AND ad.driver_id = 160 AND di.driver_id = 160
            // var query1 = `SELECT o.id AS order_id, di.driver_id, di.driver_name, CONCAT(from_address1, ', ', from_city, ', ' , from_province, ' ' , from_postal) AS address, s.name AS service, DATE_FORMAT(o.created, "%d/%m/%Y") AS date_added, "Pick Up" AS delivery_type, ad.delivery_date FROM deliver_order o, deliver_from f, services s, assign_driver as ad, driver_info as di WHERE o.id = f.order_id AND o.delivery_service = s.id AND ad.order_id = o.id AND ad.driver_id = ${driverId} AND di.driver_id = ${driverId}`;
            // var query2 = `SELECT o.id AS order_id, di.driver_id, di.driver_name, CONCAT(to_address1, ', ', to_city, ', ' , to_province, ' ' , to_postal) AS address, s.name AS service, DATE_FORMAT(o.created, "%d/%m/%Y") AS date_added, "Drop Off" AS delivery_type, ad.delivery_date FROM deliver_order o, deliver_to t, services s, assign_driver as ad, driver_info as di WHERE o.id = t.order_id AND o.delivery_service = s.id AND ad.order_id = o.id AND ad.driver_id = ${driverId} AND di.driver_id = ${driverId}`;
            // connection.query(`${query1} UNION ${query2} UNION ${query3} UNION ${query5} UNION  ORDER BY order_id`, (err, data) => {
            var query1 = `SELECT o.id AS order_id, di.driver_id, di.driver_name, CONCAT(from_address1, ', ', from_city, ', ' , from_province, ' ' , from_postal) AS address, s.name AS service, DATE_FORMAT(o.created, "%d/%m/%Y") AS date_added, "Pick Up" AS delivery_type, ad.delivery_date FROM deliver_order o, deliver_from f, services s, assign_driver as ad, driver_info as di WHERE o.id = f.order_id AND o.delivery_service = s.id AND ad.order_id = o.id AND ad.driver_id = ${driverId} AND di.driver_id = ${driverId}`;
            var query3 = `SELECT o.id AS order_id, di.driver_id, di.driver_name, CONCAT(from_address1, ', ', from_city, ', ' , from_province, ' ' , from_postal) AS address, s.name AS service, DATE_FORMAT(o.created, "%d/%m/%Y") AS date_added, "Pick Up" AS delivery_type, ad.delivery_date FROM guest_deliver_order o, guest_deliver_from f, services s, assign_driver as ad, driver_info as di WHERE o.id = f.order_id AND o.delivery_service = s.id AND ad.order_id = o.id AND ad.driver_id = ${driverId} AND di.driver_id = ${driverId}`;
            var query2 = `SELECT o.id AS order_id, di.driver_id, di.driver_name, CONCAT(to_address1, ', ', to_city, ', ' , to_province, ' ' , to_postal) AS address, s.name AS service, DATE_FORMAT(o.created, "%d/%m/%Y") AS date_added, "Drop Off" AS delivery_type, ad.delivery_date FROM deliver_order o, deliver_to t, services s, assign_driver as ad, driver_info as di WHERE o.id = t.order_id AND o.delivery_service = s.id AND ad.order_id = o.id AND ad.driver_id = ${driverId} AND di.driver_id = ${driverId}`;
            var query5 = `SELECT o.id AS order_id, di.driver_id, di.driver_name, CONCAT(to_address1, ', ', to_city, ', ' , to_province, ' ' , to_postal) AS address, s.name AS service, DATE_FORMAT (o.created, "%d/%m/%Y") AS date_added, "Drop Off" AS delivery_type, ad.delivery_date FROM guest_deliver_order o, guest_deliver_to t, services s, assign_driver as ad, driver_info as di WHERE o.id = t.order_id AND o.delivery_service = s.id AND ad.order_id = o.id AND ad.driver_id = ${driverId} AND di.driver_id = ${driverId}`;
            connection.query(
              `${query1} UNION ${query2} UNION ${query3} UNION ${query5} ORDER BY order_id`,

              (err, data) => {
                if (err)
                  res.json({
                    status: 0,
                    msg: "Query error",
                    error: err,
                  });
                else {
                  console.log("else result...", data);
                  let classKeys = [deliveryDate];
                  let filteredClasses = data.filter((cls) =>
                    classKeys.includes(cls.delivery_date)
                  );
                  res.json({
                    status: 1,
                    msg: "Assigned orders found",
                    data: filteredClasses,
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

// =====================================
// ========== order sequence ===========
// =====================================

router.post("/order-seq", (req, res) => {
  var reqBody = req.body;
  var driverId = reqBody[0].driver_id;
  var deliveryDate = reqBody[0].delivery_date;
  console.log(reqBody);
  connection.query(
    "SELECT * FROM order_seq WHERE driver_id = ? AND delivery_date = ?",
    [driverId, deliveryDate],
    (err, data) => {
      if (data && data.length > 0) {
        connection.query(
          `DELETE FROM order_seq WHERE driver_id = ? AND delivery_date = ?`,
          [driverId, deliveryDate],
          (err, result) => {
            if (err) {
              res.json({
                status: 0,
                msg: "Query error",
                error: err,
              });
            } else {
              if (result.affectedRows !== 0) insertOrderSeq(reqBody, res);
              else
                res.json({
                  status: 0,
                  msg: "Something went wrong",
                  error: err,
                });
            }
          }
        );
      } else {
        insertOrderSeq(reqBody, res);
      }
    }
  );
});

const insertOrderSeq = (reqBody, res) => {
  var newBody = reqBody.map((item) =>
    Object.fromEntries(
      Object.entries(item).sort((a, b) => a[0].localeCompare(b[0]))
    )
  );
  let orderSeq = newBody.map((obj) => Object.values(obj));
  console.log(orderSeq);
  var sql =
    "INSERT INTO order_seq (address, date_added, delivery_date, delivery_type, driver_id, driver_name, order_id, seq, service, updated_at) VALUES ?";

  connection.query(sql, [orderSeq], (err, result) => {
    if (err) {
      res.json({
        status: 0,
        msg: "Query error",
        error: err,
      });
    } else {
      res.json({
        status: 1,
        msg: "Order sequence inserted",
      });
    }
  });
};

// =====================================
// ======== get order sequence =========
// =====================================

router.post("/get-order-seq", (req, res) => {
  try {
    var driverId = req.body.driver_id;
    var deliveryDate = req.body.delivery_date;
    connection.query(
      `SELECT order_id, driver_id, driver_name, address, service, date_added, delivery_type, delivery_date, seq FROM order_seq WHERE driver_id = ? AND delivery_date = ?`,
      [driverId, deliveryDate],
      (err, result) => {
        if (err) {
          res.json({
            status: 0,
            msg: "Query error",
            error: err,
          });
        } else {
          res.json({
            status: 1,
            msg: "Order sequence found",
            data: result,
          });
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

router.post("/driver-login", (req, res) => {
  try {
    var query1 =
      'SELECT * FROM driver_info WHERE driver_email="' + req.body.email + '"';
    // var query1 = 'SELECT * FROM driver_info WHERE driver_email="'+req.body.email+'"';
    connection.query(`${query1}`, (err, data) => {
      if (err)
        res.json({
          msg: "Query error",
          error: err,
        });
      else {
        if (data.length > 0) {
          console.log("driver password", data[0].driver_pwd);
          bcrypt.compare(
            req.body.password,
            data[0].driver_pwd,
            function (err, result1) {
              if (err) throw err;
              else {
                console.log("bcrypt result", result1);
                if (result1) {
                  res.json({
                    status: 1,
                    msg: "driver login success",
                    data: data,
                  });
                } else {
                  res.json({
                    status: 0,
                    msg: "driver login false",
                  });
                }
              }
            }
          );
        } else {
          res.json({
            status: 0,
            msg: "driver login failed",
          });
        }
      }
    });
  } catch (err) {
    res.json({
      msg: "Something went wrong",
      error: err,
    });
  }
});

//-=-=-=-==========-=-=-=-=-=-=-=-=-=-=-
router.get("/driver-orders/:email", (req, res) => {
  try {
    var fromAddArr = [];
    var toAddArr = [];
    var deliveryDateArr = [];
    var myTimezone1 = "America/Toronto";
    var myDatetimeFormat1 = "DD-MM-YYYY";
    var myDatetimeString1 = moment(d).tz(myTimezone1).format(myDatetimeFormat1);

    const dateData1 = new Date()
      .toLocaleString("en-US", {
        timeZone: "America/Toronto",
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      })
      .split(", ")[0];
    const datedataNew1 = moment(dateData1).format("YYYY/MM/DD");
    // const dateData2 = new Date().toLocaleString("en-US", {timeZone: "America/Toronto",month: '2-digit', day: '2-digit',year: 'numeric',hour: '2-digit', hour12: true, minute:'2-digit', second:'2-digit'})

    console.log("datennn1......", datedataNew1);
    //console.log("datennn2", dateData2)

    var query1 =
      "SELECT distinct o.id AS order_id,f.from_name,f.from_email, t.to_name, t.to_email, t.to_postal, o.status,o.user_status,t.to_city,di.driver_name,di.driver_email,ad.delivery_date as delivery_at, DATE_FORMAT(ad.delivery_date, '%d/%m/%Y')as delivery_date, CONCAT(from_address1, ', ', from_city, ', ', from_postal) AS from_order, CONCAT(to_address1, ', ' , to_city, ', ', to_postal) AS to_order, s.name AS service, DATE_FORMAT(o.created, '%d/%m/%Y') AS date_added FROM guest_deliver_order o, guest_deliver_to t, guest_deliver_from f, services s, assign_driver as ad, driver_info as di, order_seq as os WHERE o.id = t.order_id AND o.id = f.order_id AND o.delivery_service = s.id AND ad.order_id = o.id AND ad.driver_id = di.driver_id AND DATE(os.delivery_date) = DATE('" +
      datedataNew1 +
      "') and o.id = os.order_id AND di.driver_email ='" +
      req.params.email +
      "'and o.status != 'delivered' order by os.seq";
    // "SELECT o.id AS order_id,f.from_name,f.from_email,t.to_name,t.to_email,t.to_postal, o.status,o.user_status,t.to_city,di.driver_name,di.driver_email,ad.delivery_date as delivery_at, DATE_FORMAT(ad.delivery_date, '%d/%m/%Y')as delivery_date, CONCAT(from_address1, ', ', from_city, ', ', from_postal) AS from_order, CONCAT(to_address1, ', ' , to_city, ', ', to_postal) AS to_order, s.name AS service, DATE_FORMAT(o.created, '%d/%m/%Y') AS date_added FROM guest_deliver_order o, guest_deliver_to t, guest_deliver_from f, services s, assign_driver as ad, driver_info as di WHERE o.id = t.order_id AND o.id = f.order_id AND o.delivery_service = s.id AND ad.order_id = o.id AND ad.driver_id = di.driver_id AND DATE_FORMAT(o.created, '%d/%m/%Y') = '" +
    // datedataNew1 +
    // "' AND di.driver_email ='" +
    // req.params.email +
    // "'";
    var query2 =
      "SELECT distinct o.id AS order_id,f.from_name,f.from_email, t.to_name, t.to_email, t.to_postal, o.status,o.user_status,t.to_city,di.driver_name,di.driver_email,ad.delivery_date as delivery_at, DATE_FORMAT(ad.delivery_date, '%d/%m/%Y')as delivery_date, CONCAT(from_address1, ', ', from_city, ', ', from_postal) AS from_order, CONCAT(to_address1, ', ' , to_city, ', ', to_postal) AS to_order, s.name AS service, DATE_FORMAT(o.created, '%d/%m/%Y') AS date_added FROM deliver_order o, deliver_to t, deliver_from f, services s, assign_driver as ad, driver_info as di, order_seq as os WHERE o.id = t.order_id AND o.id = f.order_id AND o.delivery_service = s.id AND ad.order_id = o.id AND ad.driver_id = di.driver_id AND DATE(os.delivery_date) = DATE('" +
      datedataNew1 +
      "') and o.id = os.order_id AND di.driver_email ='" +
      req.params.email +
      "'and o.status != 'delivered' order by os.seq";

    // "SELECT o.id AS order_id,f.from_name,f.from_email,t.to_name,t.to_email,t.to_postal,o.status,o.user_status,t.to_city,di.driver_name,di.driver_email,ad.delivery_date as delivery_at, DATE_FORMAT(ad.delivery_date, '%d/%m/%Y')as delivery_date, CONCAT(from_address1, ', ', from_city, ', ', from_postal) AS from_order, CONCAT(to_address1, ', ' , to_city, ', ', to_postal) AS to_order, s.name AS service, DATE_FORMAT(o.created, '%d/%m/%Y') AS date_added FROM deliver_order o, deliver_to t, deliver_from f, services s, assign_driver as ad, driver_info as di WHERE o.id = t.order_id AND o.id = f.order_id AND o.delivery_service = s.id AND ad.order_id = o.id AND ad.driver_id = di.driver_id AND DATE_FORMAT(o.created, '%d/%m/%Y') = '" +
    // datedataNew1 +
    // "' AND di.driver_email ='" +
    // req.params.email +
    // "'";

    //console.log("query2",query1)

    connection.query(`${query1}`, (err, data) => {
      if (err) {
        console.log("error..1...", err);
        res.json({
          status: 0,
          msg: "Query error",
          error: err,
        });
      } else {
        console.log("data...1...", data);
        connection.query(`${query2}`, (error, data1) => {
          if (error) {
            console.log("error..2...", error);
            res.json({
              status: 0,
              msg: "Query error",
              error: error,
            });
          } else {
            console.log("data...2...", data1);
            if (data.length > 0 || data1.length > 0) {
              console.log();
              Array.prototype.push.apply(data, data1);
              data.map((item, index) => {
                return fromAddArr.push(item.from_order);
              });
              data.map((item2, index) => {
                return toAddArr.push(item2.to_order);
              });
              data.map((item3, index) => {
                return deliveryDateArr.push(item3.delivery_date);
              });
              deliveryDateArr = deliveryDateArr.filter(
                (x, i, a) => a.indexOf(x) == i
              );
              res.json({
                status: 1,
                msg: "driver assigned orders",
                data: data,
                datetime: myDatetimeString1,
                fromAddress: fromAddArr,
                toAddress: toAddArr,
                deliveryDateArr: deliveryDateArr,
              });
            } else {
              res.json({
                status: 0,
                msg: "no driver assigned orders found",
              });
            }
          }
        });
      }
    });
  } catch (err) {
    console.log("err", err);
    res.json({
      status: 0,
      msg: "Something went wrong",
      error: err,
    });
  }
});

router.get("/order-details/:email/:oid", (req, res) => {
  try {
    var fromAddArr = [];
    var toAddArr = [];
    var dimentionData = [];
    var deliveryDateArr = [];
    var myTimezone1 = "America/Toronto";
    var myDatetimeFormat1 = "DD-MM-YYYY";
    var myDatetimeString1 = moment(d).tz(myTimezone1).format(myDatetimeFormat1);

    const dateData1 = new Date()
      .toLocaleString("en-US", {
        timeZone: "America/Toronto",
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      })
      .split(", ")[0];
    const datedataNew1 = moment(dateData1).format("DD/MM/YYYY");

    // FROM deliver_order o,
    // deliver_order_summary ds,
    // deliver_to t,
    // deliver_from f,
    // services s,
    // assign_driver as ad,
    // driver_info as di
    // WHERE o.id = t.order_id
    // AND o.id = f.order_id
    // AND o.id =  ds.order_id
    // AND o.delivery_service = s.id
    // AND ad.order_id = o.id
    // AND ad.driver_id = di.driver_id
    // AND di.driver_email ='gaurav@gmail.com'
    // and o.id = '2'

    var query1 =
      "SELECT o.id AS order_id,f.from_name,gds.total_package,gds.instruction,gds.packages_detail,gds.fragile,f.from_email,t.to_name,t.to_email,t.to_postal,o.status,o.user_status,t.to_city,di.driver_name,di.driver_email,ad.delivery_date as delivery_at, DATE_FORMAT(ad.delivery_date, '%d/%m/%Y')as delivery_date, CONCAT(from_address1, ', ', from_city, ', ', from_postal) AS from_order, CONCAT(to_address1, ', ' , to_city, ', ', to_postal) AS to_order, s.name AS service, DATE_FORMAT(o.created, '%d/%m/%Y') AS date_added FROM guest_deliver_order o,guest_deliver_order_summary gds ,guest_deliver_to t, guest_deliver_from f, services s, assign_driver as ad, driver_info as di WHERE o.id = t.order_id AND o.id = f.order_id AND o.id = gds.order_id AND o.delivery_service = s.id AND ad.order_id = o.id AND ad.driver_id = di.driver_id AND di.driver_email ='" +
      req.params.email +
      "'AND o.id ='" +
      req.params.oid +
      "'";
    var query2 =
      "SELECT o.id AS order_id,f.from_name,ds.total_package,ds.instruction,ds.packages_detail,ds.fragile,f.from_email,t.to_name,t.to_email,t.to_postal,o.status,o.user_status,t.to_city,di.driver_name,di.driver_email,ad.delivery_date as delivery_at, DATE_FORMAT(ad.delivery_date, '%d/%m/%Y')as delivery_date, CONCAT(from_address1, ', ', from_city, ', ', from_postal) AS from_order, CONCAT(to_address1, ', ' , to_city, ', ', to_postal) AS to_order, s.name AS service, DATE_FORMAT(o.created, '%d/%m/%Y') AS date_added FROM deliver_order o,deliver_order_summary ds,deliver_to t,deliver_from f,services s,assign_driver as ad, driver_info as di WHERE o.id = t.order_id AND o.id = f.order_id AND o.id =  ds.order_id AND o.delivery_service = s.id AND ad.order_id = o.id AND ad.driver_id = di.driver_id AND di.driver_email ='" +
      req.params.email +
      "'AND o.id ='" +
      req.params.oid +
      "'";
    connection.query(`${query1}`, (err, data) => {
      if (err) {
        console.log("err1....", err);
        res.json({
          status: 0,
          msg: "Query error",
          error: err,
        });
      } else {
        console.log("data...1st....", data);
        connection.query(`${query2}`, (error, data1) => {
          if (err) {
            console.log("err2....", error);
            res.json({
              status: 0,
              msg: "Query error",
              error: error,
            });
          } else {
            console.log("data...2nd....", data1);
            if (data.length > 0 || data1.length > 0) {
              Array.prototype.push.apply(data, data1);
              data.map((item0, index) => {
                return dimentionData.push(JSON.parse(item0.packages_detail));
              });
              data.map((item, index) => {
                return fromAddArr.push(item.from_order);
              });
              data.map((item2, index) => {
                return toAddArr.push(item2.to_order);
              });
              res.json({
                status: 1,
                msg: "order details",
                data: data,
                dimentionData: dimentionData[0],
                datetime: myDatetimeString1,
                fromAddress: fromAddArr,
                toAddress: toAddArr,
              });
            } else {
              res.json({
                status: 0,
                msg: "no order details found",
              });
            }
          }
        });
      }
    });
  } catch (err) {
    res.json({
      status: 0,
      msg: "Something went wrong",
      error: err,
    });
  }
});

//-=-=-=-=-=-=-=-=-=-=-=--=-=--=-=--=---=-==-=-==-==-=-=-=-=-=-=-=-=-=-=---=-==-==-=-//
//-=-=-=-=-=--=-=-=-=---=-=-=-=-=-=--update status api===============================//
//-=-=-=-=-=-=-=-=-=-=-=--=-=--=-=--=---=-==-=-==-==-=-=-=-=-=-=-=-=-=-=---=-==-==-=-//

router.get("/driver-orders-myRides/:email/:status", (req, res) => {
  try {
    var fromAddArr = [];
    var toAddArr = [];
    var deliveryDateArr = [];
    var myTimezone1 = "America/Toronto";
    var myDatetimeFormat1 = "DD-MM-YYYY";

    const dateFormater = (ddaattee) => {
      return ddaattee.split("/").reverse().join("/");
    };

    var newwDate = dateFormater(req.query.dateDataurl);
    console.log(newwDate);

    var myDatetimeString1 = moment(d).tz(myTimezone1).format(myDatetimeFormat1);

    var query1 =
      "SELECT o.id AS order_id,f.from_name,f.from_email,t.to_name,t.to_email,t.to_postal, o.status,o.user_status,o.image_name,t.to_city,di.driver_name,di.driver_email,ad.delivery_date as delivery_at, DATE_FORMAT(ad.delivery_date, '%d/%m/%Y')as delivery_date, CONCAT(from_address1, ', ', from_city, ', ', from_postal) AS from_order, CONCAT(to_address1, ', ' , to_city, ', ', to_postal) AS to_order, s.name AS service, DATE_FORMAT(o.created, '%d/%m/%Y') AS date_added FROM guest_deliver_order o, guest_deliver_to t, guest_deliver_from f, services s, assign_driver as ad, driver_info as di WHERE o.id = t.order_id AND o.id = f.order_id AND o.delivery_service = s.id AND ad.order_id = o.id AND ad.driver_id = di.driver_id AND DATE(o.created) <= DATE('" +
      newwDate +
      "') AND di.driver_email ='" +
      req.params.email +
      "' AND o.status='" +
      req.params.status +
      "'";
    var query2 =
      "SELECT o.id AS order_id,f.from_name,f.from_email,t.to_name,t.to_email,t.to_postal,o.status,o.user_status,o.image_name,t.to_city,di.driver_name,di.driver_email,ad.delivery_date as delivery_at, DATE_FORMAT(ad.delivery_date, '%d/%m/%Y')as delivery_date, CONCAT(from_address1, ', ', from_city, ', ', from_postal) AS from_order, CONCAT(to_address1, ', ' , to_city, ', ', to_postal) AS to_order, s.name AS service, DATE_FORMAT(o.created, '%d/%m/%Y') AS date_added FROM deliver_order o, deliver_to t, deliver_from f, services s, assign_driver as ad, driver_info as di WHERE o.id = t.order_id AND o.id = f.order_id AND o.delivery_service = s.id AND ad.order_id = o.id AND ad.driver_id = di.driver_id AND DATE(o.created) <= DATE('" +
      newwDate +
      "') AND di.driver_email ='" +
      req.params.email +
      "' AND o.status='" +
      req.params.status +
      "'";

      var query1 =
      "SELECT distinct o.id AS order_id,f.from_name,f.from_email,t.to_name,t.to_email,t.to_postal, o.status,o.user_status,o.image_name,t.to_city,di.driver_name,di.driver_email,ad.delivery_date as delivery_at,DATE_FORMAT(ad.delivery_date, '%d/%m/%Y')as delivery_date, CONCAT(from_address1, ', ', from_city, ', ', from_postal) AS from_order, CONCAT(to_address1, ', ' , to_city, ', ', to_postal) AS to_order, s.name AS service, DATE_FORMAT(o.created, '%d/%m/%Y') AS date_added FROM guest_deliver_order o, guest_deliver_to t, guest_deliver_from f, services s, assign_driver as ad, driver_info as di , order_seq as os WHERE o.id = t.order_id AND o.id = f.order_id AND o.delivery_service = s.id AND ad.order_id = o.id AND ad.driver_id = di.driver_id AND DATE(os.delivery_date) = DATE('" +
      newwDate +
      "') nd o.id = os.order_id AND di.driver_email ='" +
      req.params.email +
      "' AND o.status='" +
      req.params.status +
      "' order by os.seq";
    var query2 =
      "SELECT distinct o.id AS order_id,f.from_name,f.from_email,t.to_name,t.to_email,t.to_postal,o.status,o.user_status,o.image_name,t.to_city,di.driver_name,di.driver_email,ad.delivery_date as delivery_at, DATE_FORMAT(ad.delivery_date, '%d/%m/%Y')as delivery_date, CONCAT(from_address1, ', ', from_city, ', ', from_postal) AS from_order, CONCAT(to_address1, ', ' , to_city, ', ', to_postal) AS to_order, s.name AS service, DATE_FORMAT(o.created, '%d/%m/%Y') AS date_added FROM deliver_order o, deliver_to t, deliver_from f, services s, assign_driver as ad, driver_info as di,order_seq as os  WHERE o.id = t.order_id AND o.id = f.order_id AND o.delivery_service = s.id AND ad.order_id = o.id AND ad.driver_id = di.driver_id AND DATE(os.delivery_date) = DATE('" +
      newwDate +
      "') AND nd o.id = os.order_id di.driver_email ='" +
      req.params.email +
      "' AND o.status='" +
      req.params.status +
      "' order by os.seq";



    console.log("query", query1);

    connection.query(`${query1}`, (err, data) => {
      if (err) {
        res.json({
          status: 0,
          msg: "Query error",
          error: err,
        });
      } else {
        connection.query(`${query2}`, (error, data1) => {
          if (err) {
            res.json({
              status: 0,
              msg: "Query error",
              error: error,
            });
          } else {
            if (data.length > 0 || data1.length > 0) {
              Array.prototype.push.apply(data, data1);
              data.map((item, index) => {
                return fromAddArr.push(item.from_order);
              });
              data.map((item2, index) => {
                return toAddArr.push(item2.to_order);
              });
              data.map((item3, index) => {
                return deliveryDateArr.push(item3.delivery_date);
              });
              deliveryDateArr = deliveryDateArr.filter(
                (x, i, a) => a.indexOf(x) == i
              );
              res.json({
                status: 1,
                msg: "driver assigned orders",
                data: data,
                datetime: myDatetimeString1,
                fromAddress: fromAddArr,
                toAddress: toAddArr,
                deliveryDateArr: deliveryDateArr,
              });
            } else {
              res.json({
                status: 0,
                msg: "no driver assigned orders found",
              });
            }
          }
        });
      }
    });
  } catch (err) {
    res.json({
      status: 0,
      msg: "Something went wrong",
      error: err,
    });
  }
});

// =====================================
// ========= change password ===========
// =====================================

router.post("/driverChangePassword", (req, res) => {
  try {
    bcrypt.hash(req.body.Password, 10, function (err, hash) {
      if (err) throw err;
      else {
        var sql =
          "UPDATE driver_info SET driver_pwd = '" +
          hash +
          "' WHERE driver_email='" +
          req.body.Email +
          "'";
        connection.query(sql, (err) => {
          if (err) {
            res.json({
              status: 0,
              msg: "Query Error",
              error: err,
            });
          } else {
            res.json({
              status: 1,
              msg: "password changed successfully",
            });
          }
        });
      }
    });
  } catch (err) {
    res.json({
      status: 0,
      msg: "Something went wrong",
      error: err,
    });
  }
});

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "notifications@galedelivery.com",
    pass: "N@rc0555",
    // user: 'developertest71296@gmail.com',
    // pass: 'developer@71296'
  },
});

router.post("/driver-forgotPassword", (req, res) => {
  try {
    connection.query(
      "SELECT * FROM driver_info WHERE driver_email='" + req.body.email + "'",
      (err, result) => {
        if (err) {
          res.json({
            status: 0,
            msg: "Query Error",
            error: err,
          });
        } else {
          if (result.length > 0) {
            var password = Math.random().toString(36).slice(-8);
            console.log("sent password...", password);
            bcrypt.hash(password, 10, function (err, hash) {
              if (err) throw err;
              else {
                var sql =
                  "UPDATE driver_info SET driver_pwd = '" +
                  hash +
                  "' WHERE driver_email='" +
                  req.body.email +
                  "'";
                connection.query(sql, (err) => {
                  if (err) {
                    res.json({
                      status: 0,
                      msg: "Query Error",
                      error: err,
                    });
                  } else {
                    var mailOptions = {
                      from: "developertest71296@gmail.com",
                      to: result[0].driver_email,
                      subject: "galeDelivery Password Recovery",
                      text: "GaleDelivery",
                      html:
                        "Hello <b>" +
                        result[0].driver_name +
                        ",</b> your password is <b>" +
                        password +
                        "</b>",
                    };

                    transporter.sendMail(mailOptions, (err, result1) => {
                      if (err) {
                        res.json({
                          status: 0,
                          msg: "Query Error",
                          error: err,
                        });
                      } else {
                        console.log("result1", result1);
                        res.json({
                          status: 1,
                          msg: "driver password send successfully on your mail",
                          data: result,
                        });
                      }
                    });
                  }
                });
              }
            });
          } else {
            res.json({
              status: 2,
              msg: "Plzzz provide valid email",
              error: err,
            });
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

// var s3  = new AWS.S3({
//     accessKeyId: "AKIAV5Q2MJY2O57DW4OX",
//     secretAccessKey: "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"
// });

router.post("/image_upload", upload.single("CLK_IMG"), (req, res) => {
  try {
    if (req.body.user_status === "guest-user") {
      console.log("req.body", req.body);
      console.log("req.file", req.file);
      var sql = `UPDATE guest_deliver_order SET image_name = '${req.file.location}' WHERE id ='${req.body.oid}'`;
      connection.query(sql, (err) => {
        if (err) {
          res.json({
            status: 0,
            msg: "Query error",
            error: err,
          });
        } else {
          res.json({
            status: 1,
            msg: "image uploaded successfuly",
          });
        }
      });
    } else {
      console.log("req.body", req.body);
      console.log("req.file", req.file);
      var sql = `UPDATE deliver_order SET image_name = '${req.file.location}' WHERE id ='${req.body.oid}'`;
      connection.query(sql, (err) => {
        if (err) {
          res.json({
            status: 0,
            msg: "Query error",
            error: err,
          });
        } else {
          res.json({
            status: 1,
            msg: "image uploaded successfuly",
          });
        }
      });
    }
  } catch (err) {
    res.json({
      status: 0,
      msg: "Something went wrong",
      error: err,
    });
  }
});

router.post("/Update-status", (req, res) => {
  try {
    if (req.body.user_status === "guest-user") {
      // console.log(req.body);
      var query2 =
        "UPDATE guest_deliver_order SET status='" +
        req.body.status +
        "' WHERE id='" +
        req.body.oid +
        "'";
      connection.query(`${query2}`, (err) => {
        if (err) {
          console.log("1251....", err);
          res.json({
            status: 0,
            msg: "Query error",
            error: err,
          });
        } else {
          connection.query(
            "SELECT gdf.from_name, gdf.from_email,gdf.from_phone ,gdf.from_update_by, gdt.to_name, gdt.to_email,gdt.to_phone, gdt.to_update_by, o.status FROM guest_deliver_from gdf, guest_deliver_to gdt, guest_deliver_order o WHERE gdf.order_id = o.id AND gdt.order_id = o.id AND gdf.order_id = '" +
              req.body.oid +
              "' AND gdt.order_id = '" +
              req.body.oid +
              "'",
            (err1, result) => {
              if (err1) {
                console.log("1266....", err1);
                res.json({
                  status: 0,
                  msg: "Query Error",
                  error: err,
                });
              } else {
                console.log("data updated====>", result);
                console.log("'127four....", result[0].from_update_by);
                console.log("'127four....", result[0].to_update_by);
                var statusCount = 0;
                if (
                  result[0].from_update_by === "email" &&
                  (result[0].status === "in-transit" ||
                    result[0].status === "picked-up")
                ) {
                  var mailOptions = {
                    from: "notifications@galedelivery.com",
                    to: result[0].from_email,
                    subject: `galeDelivery Order Status`,
                    text: "GaleDelivery",
                    html:
                      "Hello <b>" +
                      result[0].from_name +
                      ",</b> your package has been <b>" +
                      result[0].status +
                      "</b>",
                  };
                  transporter.sendMail(mailOptions, (err, result1) => {
                    if (err) {
                      res.json({
                        status: 0,
                        msg: "Query Error",
                        error: err,
                      });
                    } else {
                      console.log("mail sent");
                      res.json({
                        status: 1,
                        msg: "picked up mail sent to from user",
                        data: result1,
                      });
                    }
                  });
                   ++statusCount;
                }
                if (
                  result[0].from_update_by === "email" &&
                  result[0].status === "delivered"
                ) {
                  var mailOptions = {
                    from: "notifications@galedelivery.com",
                    to: result[0].from_email,
                    subject: `galeDelivery Order Status`,
                    text: "GaleDelivery",
                    html:
                      "Hello <b>" +
                      result[0].from_name +
                      ",</b> your Package has been delivered.",
                  };
                  transporter.sendMail(mailOptions, (err, result1) => {
                    if (err) {
                      res.json({
                        status: 0,
                        msg: "Query Error",
                        error: err,
                      });
                    } else {
                      res.json({
                        status: 1,
                        msg: "delivered mail sent to from user",
                        data: result1,
                      });
                    }
                  });
                   ++statusCount;
                }
                if (
                  result[0].from_update_by === "text" &&
                  (result[0].status === "in-transit" ||
                    result[0].status === "picked-up")
                ) {
                  client.messages
                    .create({
                      body: `Hello ${result[0].from_name}, your order has been ${result[0].status}`,
                      from: "+17058050911",
                      // to: "+1(416)-527-1483",
                      to: "+1" + result[0].from_phone,
                    })
                    .then((message) => {
                      console.log(
                        "Message sent....",
                        result[0].status,
                        message
                      );
                      res.json({
                        status: 1,
                        msg: "picked up msg sent to from user",
                        data: message,
                      });
                    })
                    .catch((error1) => {
                      console.log("errrrr.......", error1);
                      res.json({
                        status: 0,
                        msg: "Query Error",
                        error: error1,
                      });
                    });
                     ++statusCount;
                }
                if (
                  result[0].from_update_by === "text" &&
                  result[0].status === "delivered"
                ) {
                  client.messages
                    .create({
                      body: `Hello ${result[0].from_name}, your order has been ${result[0].status}`,
                      from: "+17058050911",
                      to: "+1" + result[0].from_phone,
                    })
                    .then((messages) => {
                      console.log("Messages sent!", messages);
                      res.json({
                        status: 1,
                        msg: "delivery message sent to from user",
                        data: messages,
                      });
                    })
                    .catch((err) => {
                      console.error(err);
                      res.json({
                        status: 0,
                        msg: "Query Error",
                        error: err,
                      });
                    });
                     ++statusCount;
                }
                if (
                  result[0].to_update_by === "email" &&
                  (result[0].status === "in-transit" ||
                    result[0].status === "picked-up")
                ) {
                  var mailOptions = {
                    from: "notifications@galedelivery.com",
                    to: result[0].to_email,
                    subject: `galeDelivery Order Status`,
                    text: "GaleDelivery",
                    html:
                      "Hello <b>" +
                      result[0].to_name +
                      ",</b> your package has been <b>" +
                      result[0].status +
                      "</b>",
                  };
                  transporter.sendMail(mailOptions, (err, result1) => {
                    if (err) {
                      res.json({
                        status: 0,
                        msg: "Query Error",
                        error: err,
                      });
                    } else {
                      console.log("mail sent");
                      res.json({
                        status: 1,
                        msg: "picked up mail sent to to-user",
                        data: result1,
                      });
                    }
                  });
                   ++statusCount;
                }
                if (
                  result[0].to_update_by === "email" &&
                  result[0].status === "delivered"
                ) {
                  var mailOptions = {
                    from: "notifications@galedelivery.com",
                    to: result[0].to_email,
                    subject: `galeDelivery Order Status`,
                    text: "GaleDelivery",
                    html:
                      "Hello <b>" +
                      result[0].to_name +
                      ",</b> your Package has been delivered.",
                  };
                  transporter.sendMail(mailOptions, (err, result1) => {
                    if (err) {
                      res.json({
                        status: 0,
                        msg: "Query Error",
                        error: err,
                      });
                    } else {
                      res.json({
                        status: 1,
                        msg: "delivery mail sent to to-user",
                        data: result1,
                      });
                    }
                  });
                   ++statusCount;
                }
                if (
                  result[0].to_update_by === "text" &&
                  (result[0].status === "in-transit" ||
                    result[0].status === "picked-up")
                ) {
                  console.log("llllllllllll,,,,,,,,,,,,,,,,,  ", result[0].to_update_by);
                  client.messages
                    .create({
                      body: `Hello ${result[0].to_name}, your order has been ${result[0].status}`,
                      from: "+17058050911",
                      to: "+1" + result[0].to_phone,
                    })
                    .then((message) => {
                      console.log(
                        "Message sent....",
                        result[0].status,
                        message
                      );
                      res.json({
                        status: 1,
                        msg: "picked up mail sent to to-user",
                        data: message,
                      });
                    })
                    .catch((error1) => {
                      console.log("errrrr.......", error1);
                      res.json({
                        status: 0,
                        msg: "Query Error",
                        error: error1,
                      });
                    });
                     ++statusCount;
                }
                if (
                  result[0].to_update_by === "text" &&
                  result[0].status === "delivered"
                ) {
                  client.messages
                    .create({
                      body: `Hello ${result[0].to_name}, your order has been ${result[0].status}`,
                      from: "+17058050911",
                      to: "+1" + result[0].to_phone,
                    })
                    .then((messages) => {
                      console.log("Messages sent!", messages);
                      res.json({
                        status: 1,
                        msg: "delivery message sent to to-user",
                        data: messages,
                      });
                    })
                    .catch((err) => {
                      console.error(err);
                      res.json({
                        status: 0,
                        msg: "Query Error",
                        error: err,
                      });
                    });
                     ++statusCount;
                } 
                if(statusCount===0){
                    res.json({
                      status: 0,
                      msg: "No orders",
                    });
                }
              }
            }
          );
        }
      });
    } else {
      var query2 =
        "UPDATE deliver_order SET status='" +
        req.body.status +
        "' WHERE id='" +
        req.body.oid +
        "'";
      connection.query(`${query2}`, (err) => {
        if (err) {
          res.json({
            status: 0,
            msg: "Query error",
            error: err,
          });
        } else {
          connection.query(
            "SELECT df.from_name, df.from_email,df.from_phone ,df.from_update_by, dt.to_name, dt.to_email,dt.to_phone ,dt.to_update_by, o.status FROM deliver_from df, deliver_to dt, deliver_order o WHERE df.order_id = o.id AND dt.order_id = o.id AND df.order_id = '" +
              req.body.oid +
              "' AND dt.order_id = '" +
              req.body.oid +
              "'",
            (err, result) => {
              if (err) {
                res.json({
                  status: 0,
                  msg: "Query Error",
                  error: err,
                });
              } else {
                console.log("data updated====>", result);
                console.log("'127four....", result[0].from_update_by);
                var statusCountt =0;
                if (
                  result[0].from_update_by === "email" &&
                  (result[0].status === "in-transit" ||
                    result[0].status === "picked-up")
                ) {
                  var mailOptions = {
                    from: "notifications@galedelivery.com",
                    to: result[0].from_email,
                    subject: `galeDelivery Order Status`,
                    text: "GaleDelivery",
                    html:
                      "Hello <b>" +
                      result[0].from_name +
                      ",</b> your package has been <b>" +
                      result[0].status +
                      "</b>",
                  };
                  transporter.sendMail(mailOptions, (err, result1) => {
                    if (err) {
                      res.json({
                        status: 0,
                        msg: "Query Error",
                        error: err,
                      });
                    } else {
                      console.log("mail sent");
                      res.json({
                        status: 1,
                        msg: "picked up mail sent to from user",
                        data: result1,
                      });
                    }
                  });
                  ++statusCountt
                }
                if (
                  result[0].from_update_by === "email" &&
                  result[0].status === "delivered"
                ) {
                  var mailOptions = {
                    from: "notifications@galedelivery.com",
                    to: result[0].from_email,
                    subject: `galeDelivery Order Status`,
                    text: "GaleDelivery",
                    html:
                      "Hello <b>" +
                      result[0].from_name +
                      ",</b> your Package has been delivered.",
                  };
                  transporter.sendMail(mailOptions, (err, result1) => {
                    if (err) {
                      res.json({
                        status: 0,
                        msg: "Query Error",
                        error: err,
                      });
                    } else {
                      res.json({
                        status: 1,
                        msg: "delivered mail sent to from user",
                        data: result1,
                      });
                    }
                  });
                  ++statusCountt
                }
                if (
                  result[0].from_update_by === "text" &&
                  (result[0].status === "in-transit" ||
                    result[0].status === "picked-up")
                ) {
                  client.messages
                    .create({
                      body: `Hello ${result[0].from_name}, your order has been ${result[0].status}`,
                      from: "+17058050911",
                      to: "+1" + result[0].from_phone,
                    })
                    .then((message) => {
                      console.log(
                        "Message sent....",
                        result[0].status,
                        message
                      );
                      // res.json({
                      //   status: 1,
                      //   msg: "picked up msg sent to from user",
                      //   data: message,
                      // });
                    })
                    .catch((error1) => {
                      console.log("errrrr.......", error1);
                      res.json({
                        status: 0,
                        msg: "Query Error",
                        error: error1,
                      });
                    });
                    ++statusCountt
                }
                if (
                  result[0].from_update_by === "text" &&
                  result[0].status === "delivered"
                ) {
                  client.messages
                    .create({
                      body: `Hello ${result[0].from_name}, your order has been ${result[0].status}`,
                      from: "+17058050911",
                      to: "+1" + result[0].from_phone,
                    })
                    .then((messages) => {
                      console.log("Messages sent!", messages);
                      res.json({
                        status: 1,
                        msg: "delivery message sent to from user",
                        data: messages,
                      });
                    })
                    .catch((err) => {
                      console.error(err);
                      res.json({
                        status: 0,
                        msg: "Query Error",
                        error: err,
                      });
                    });
                    ++statusCountt
                }
                if (
                  result[0].to_update_by === "email" &&
                  (result[0].status === "in-transit" ||
                    result[0].status === "picked-up")
                ) {
                  var mailOptions = {
                    from: "notifications@galedelivery.com",
                    to: result[0].to_email,
                    subject: `galeDelivery Order Status`,
                    text: "GaleDelivery",
                    html:
                      "Hello <b>" +
                      result[0].to_name +
                      ",</b> your package has been <b>" +
                      result[0].status +
                      "</b>",
                  };
                  transporter.sendMail(mailOptions, (err, result1) => {
                    if (err) {
                      res.json({
                        status: 0,
                        msg: "Query Error",
                        error: err,
                      });
                    } else {
                      console.log("mail sent");
                      res.json({
                        status: 1,
                        msg: "picked up mail sent to to-user",
                        data: result1,
                      });
                    }
                  });
                  ++statusCountt
                }
                if (
                  result[0].to_update_by === "email" &&
                  result[0].status === "delivered"
                ) {
                  var mailOptions = {
                    from: "notifications@galedelivery.com",
                    to: result[0].to_email,
                    subject: `galeDelivery Order Status`,
                    text: "GaleDelivery",
                    html:
                      "Hello <b>" +
                      result[0].to_name +
                      ",</b> your Package has been delivered.",
                  };
                  transporter.sendMail(mailOptions, (err, result1) => {
                    if (err) {
                      res.json({
                        status: 0,
                        msg: "Query Error",
                        error: err,
                      });
                    } else {
                      res.json({
                        status: 1,
                        msg: "delivery mail sent to to-user",
                        data: result1,
                      });
                    }
                  });
                  ++statusCountt
                }
                if (
                  result[0].to_update_by === "text" &&
                  (result[0].status === "in-transit" ||
                    result[0].status === "picked-up")
                ) {
                  console.log("rrrrrrrrrrrrrrrrrrsss");
                  client.messages
                    .create({
                      body: `Hello ${result[0].to_name}, your order has been ${result[0].status}`,
                      from: "+17058050911",
                      to: "+1" + result[0].to_phone,
                    })
                    .then((message) => {
                      console.log(
                        "Message sent....",
                        result[0].status,
                        message
                      );
                      // res.json({
                      //   status: 1,
                      //   msg: "picked up mail sent to to-user",
                      //   data: message,
                      // });
                    })
                    .catch((error1) => {
                      console.log("errrrr.......", error1);
                      res.json({
                        status: 0,
                        msg: "Query Error",
                        error: error1,
                      });
                    });
                    ++statusCountt
                }
                if (
                  result[0].to_update_by === "text" &&
                  result[0].status === "delivered"
                ) {
                  client.messages
                    .create({
                      body: `Hello ${result[0].to_name}, your order has been ${result[0].status}`,
                      from: "+17058050911",
                      to: "+1" + result[0].to_phone,
                    })
                    .then((messages) => {
                      console.log("Messages sent!", messages);
                      res.json({
                        status: 1,
                        msg: "delivery message sent to to-user",
                        data: messages,
                      });
                    })
                    .catch((err) => {
                      console.error(err);
                      res.json({
                        status: 0,
                        msg: "Query Error",
                        error: err,
                      });
                    });
                    ++statusCountt
                } if(statusCountt===0){
                  res.json({
                    status: 0,
                    msg: "No orders",
                  });
                }

                // console.log("data updated");
                // if (
                //   result[0].from_update_by === "email" &&
                //   (result[0].status === "in-transit" ||
                //     result[0].status === "picked-up")
                // ) {
                //   console.log("mail sent");
                //   var mailOptions = {
                //     from: "notifications@galedelivery.com",
                //     to: result[0].from_email,
                //     subject: `galeDelivery Order Status`,
                //     text: "GaleDelivery",
                //     html:
                //       "Hello <b>" +
                //       result[0].from_name +
                //       ",</b> your order is <b>" +
                //       result[0].status +
                //       "</b>",
                //   };
                //   transporter.sendMail(mailOptions, (err, result1) => {
                //     if (err) {
                //       res.json({
                //         status: 0,
                //         msg: "Query Error",
                //         error: err,
                //       });
                //     } else {
                //       res.json({
                //         status: 1,
                //         msg: "mail sent",
                //         data: result1,
                //       });
                //     }
                //   });
                // } else if (
                //   result[0].from_update_by === "email" &&
                //   result[0].status === "delivered"
                // ) {
                //   var mailOptions = {
                //     from: "notifications@galedelivery.com",
                //     to: [result[0].from_email, result[0].to_email],
                //     subject: `galeDelivery Order Status`,
                //     text: "GaleDelivery",
                //     html:
                //       "Hello, your order is <b>" + result[0].status + "</b>",
                //   };
                //   transporter.sendMail(mailOptions, (err, result1) => {
                //     if (err) {
                //       res.json({
                //         status: 0,
                //         msg: "Query Error",
                //         error: err,
                //       });
                //     } else {
                //       res.json({
                //         status: 1,
                //         msg: "mail sent",
                //         data: result1,
                //       });
                //     }
                //   });
                // } else if (
                //   result[0].from_update_by === "text" &&
                //   (result[0].status === "in-transit" ||
                //     result[0].status === "picked-up")
                // ) {
                //   client.messages
                //     .create({
                //       body: `Hello, your order is ${result[0].status}`,
                //       from: "+17408075158",
                //       to: result[0].from_phone,
                //     })
                //     .then((message) => {
                //       res.json({
                //         status: 1,
                //         msg: "message sent",
                //         data: message,
                //       });
                //     })
                //     .catch((error) => {
                //       res.json({
                //         status: 0,
                //         msg: "Query Error",
                //         error: error,
                //       });
                //     });
                // } else if (
                //   result[0].from_update_by === "text" &&
                //   result[0].status === "delivered"
                // ) {
                //   const numData = [result[0].from_phone, result[0].to_phone];
                //   Promise.all(
                //     numData.map((number) => {
                //       return client.messages.create({
                //         body: `Hello, your order is ${result[0].status}`,
                //         from: "+17408075158",
                //         to: number,
                //       });
                //     })
                //   )
                //     .then((messages) => {
                //       console.log("Messages sent!", messages);
                //       res.json({
                //         status: 1,
                //         msg: "message sent",
                //         data: messages,
                //       });
                //     })
                //     .catch((err) => {
                //       console.error(err);
                //       res.json({
                //         status: 0,
                //         msg: "Query Error",
                //         error: err,
                //       });
                //     });
                // } else {
                //   res.json({
                //     status: 0,
                //     msg: "No orders",
                //   });
                // }
              }
            }
          );
        }
      });
    }
  } catch (err) {
    console.log("err", err);
    res.json({
      status: 0,
      msg: "Something went wrong",
      error: err,
    });
  }
});

module.exports = router;