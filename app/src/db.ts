/// <reference path="../../typings/index.d.ts" />

const fs = require("fs");
const SQL = require("sql.js");

let db = new SQL.Database();

db.run("CREATE TABLE IF NOT EXISTS test (col1, col2);");

// veritabanını dosyaya kaydet.
let data = db.export();
let buffer = new Buffer(data);
fs.writeFileSync("../db.sqlite", buffer);