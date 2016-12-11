/// <reference path="../../typings/index.d.ts" />

const fs = require("fs");
const SQL = require("sql.js");

$(document).ready(() => {
    let filebuffer = fs.readFileSync("./app/data/db.sqlite");
    let db = new SQL.Database(filebuffer);
});

export class Veritabani {
    private dosya: any;
    private db: any;

    constructor() {
        if (fs.existsSync("./app/data/db.sqlite")) {
            console.log("Veritabanı bulundu!");

            this.dosya = fs.readFileSync("./app/data/db.sqlite");
            this.db = new SQL.Database(this.dosya);
        } else {
            console.log("Veritabanı yok! Oluşturuluyor.");

            this.db = new SQL.Database();

            this.db.run("CREATE TABLE IF NOT EXISTS Filmler (ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
                                                        FilmAdi TEXT NOT NULL,\
                                                        Yonetmen TEXT NOT NULL,\
                                                        Senarist TEXT NOT NULL,\
                                                        Oyuncu TEXT NOT NULL,\
                                                        Tur TEXT NOT NULL,\
                                                        Yil TEXT NOT NULL,\
                                                        IMDBPuani REAL NOT NULL,\
                                                        Aciklama TEXT NOT NULL,\
                                                        AfisURL TEXT NOT NULL);");

            this.db.run("CREATE TABLE IF NOT EXISTS IzlenenFilmler (ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
                                                               FilmID INTEGER NOT NULL,\
                                                               FOREIGN KEY(`FilmID`) REFERENCES `Filmler`(`ID`));");

            this.Kaydet();
        }

        let a = this.db.exec("SELECT * FROM Filmler");

        console.log(this.db);
        console.log(a);
    }

    public FilmEkle(ad: string, aciklama: string, yil: string, puan: string, tur: string,
                    yonetmen: string, senarist: string, oyuncu: string, afis: string) {

        let komut: string = "";

        komut += "INSERT INTO Filmler('FilmAdi','Yonetmen', 'Senarist', 'Oyuncu', 'Tur', 'Yil', 'IMDBPuani', 'Aciklama', 'AfisURL')";
        komut += "VALUES(";
        komut += "'" + ad + "'" + ", ";
        komut += "'" + yonetmen + "'" + ", ";
        komut += "'" + senarist + "'" + ", ";
        komut += "'" + oyuncu + "'" + ", ";
        komut += "'" + tur + "'" + ", ";
        komut += "'" + yil + "'" + ", ";
        komut += "'" + puan + "'" + ", ";
        komut += "'" + aciklama + "'" + ", ";
        komut += "'" + afis + "'";
        komut += ")";

        this.db.run(komut);
        this.Kaydet();
    }

    public FilmleriListele() {
        let filmler = this.db.exec("SELECT * FROM Filmler");
        filmler = filmler[0].values;
        filmler.forEach((film) => {
            this.FilmKartBloguEkle("tumFilmlerListe", film);
        });
        console.log(filmler);
    }

    private FilmKartBloguEkle(id: string, film: any) {
        let kod: string = "";
        kod += '<div class="row"><div class="card horizontal blue-grey darken-3 z-depth-4">';
        kod += '<div class="card-image" id="' + film[0] + '">';
        kod += '<img src="' + film[9] + '"></div>';
        kod += '<div class="card-stacked"><div class="card-content">';
        kod += '<p id="' + film[0] + '"><a href="#" id="filmAdi">' + film[1] + "</a></p>";
        kod += "<p>Tür: " + film[5] + "</p><hr/>";
        kod += "<p style='padding-bottom:5px;'>Yönetmen: " + film[2].split(",", 3) + "</p>";
        kod += "<p>Oyuncular: " + film[4].split(",", 4) + "</p><br/>";
        kod += '<div class="card-action"><a href="#">İZLEDİM</a></div>';
        kod += "</div>";
        kod += "</div></div>";
        $("#" + id).append(kod);
    }

    private Kaydet() {
        let veri = this.db.export();
        let buffer = new Buffer(veri);
        fs.writeFileSync("./app/data/db.sqlite", buffer);
    }
}
