/// <reference path="../../typings/index.d.ts" />

const fs = require("fs");
const SQL = require("sql.js");

$(document).ready(() => {
    let filebuffer = fs.readFileSync("./app/data/db.sqlite");
    let db = new SQL.Database(filebuffer);
    let a = db.exec("SELECT * FROM test");
    console.log(db);
    console.log(a);
});