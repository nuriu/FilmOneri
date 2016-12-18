/// <reference path="../../typings/index.d.ts" />

import { Bayes } from "ts-bayes";

const fs = require("fs");
const SQL = require("sql.js");

$(document).ready(() => {
    let filebuffer = fs.readFileSync("./app/data/db.sqlite");
    let db = new SQL.Database(filebuffer);
});

export class Veritabani {
    private dosya: any;
    private db: any;
    private siniflandirici: Bayes;
    private begenilenID: number[];
    private begenilmeyenID: number[];

    constructor() {
        this.begenilenID = new Array<number>();
        this.begenilmeyenID = new Array<number>();

        if (fs.existsSync("./app/data/db.sqlite")) {
            console.log("Veritabanı bulundu!");

            this.dosya = fs.readFileSync("./app/data/db.sqlite");
            this.db = new SQL.Database(this.dosya);
        } else {
            console.log("Veritabanı yok! Oluşturuluyor.");

            this.db = new SQL.Database();

            this.db.run("CREATE TABLE IF NOT EXISTS Filmler (\
                ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
                FilmAdi TEXT NOT NULL,\
                Yonetmen TEXT NOT NULL,\
                Senarist TEXT NOT NULL,\
                Oyuncu TEXT NOT NULL,\
                Tur TEXT NOT NULL,\
                Yil TEXT NOT NULL,\
                IMDBPuani REAL NOT NULL,\
                Aciklama TEXT NOT NULL,\
                AfisURL TEXT NOT NULL\
            );");

            this.db.run("CREATE TABLE IF NOT EXISTS BegenilenFilmler (\
                ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
                FilmID INTEGER NOT NULL,\
                FOREIGN KEY(`FilmID`) REFERENCES `Filmler`(`ID`)\
            );");

            this.db.run("CREATE TABLE IF NOT EXISTS BegenilmeyenFilmler (\
                ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
                FilmID INTEGER NOT NULL,\
                FOREIGN KEY(`FilmID`) REFERENCES `Filmler`(`ID`)\
            );");

            this.Kaydet();
        }

        this.siniflandirici = new Bayes({
            tokenizer: (metin) => { return metin.split(", "); }
        });
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

    public Ogren() {
        this.begenilenID = new Array<number>();
        this.begenilmeyenID = new Array<number>();
        let begenilenFilmler = this.db.exec("SELECT * FROM Filmler, BegenilenFilmler WHERE Filmler.ID = BegenilenFilmler.FilmID");
        let begenilmeyenFilmler = this.db.exec("SELECT * FROM Filmler, BegenilmeyenFilmler WHERE Filmler.ID = BegenilmeyenFilmler.FilmID");

        begenilenFilmler = begenilenFilmler[0].values;
        begenilmeyenFilmler = begenilmeyenFilmler[0].values;

        begenilenFilmler.forEach((film) => {
            let ifade = film[1] + ", " +
                film[2] + ", " +
                film[3] + ", " +
                film[4] + ", " +
                film[5] + ", " +
                film[7] + ", " +
                film[8];
            this.begenilenID.push(film[0]);
            this.siniflandirici.learn(ifade, "önerilir");
        });

        begenilmeyenFilmler.forEach((film) => {
            let ifade = film[1] + ", " +
                film[2] + ", " +
                film[3] + ", " +
                film[4] + ", " +
                film[5] + ", " +
                film[7] + ", " +
                film[8];
            this.begenilmeyenID.push(film[0]);
            this.siniflandirici.learn(ifade, "önerilmez");
        });
    }

    public TumFilmleriListele() {
        $("#tumFilmlerListe").html("");
        let filmler = this.db.exec("SELECT * FROM Filmler");
        filmler = filmler[0].values;
        filmler.forEach((film) => {
            this.FilmKartBloguEkle("tumFilmlerListe", film, true);
        });
    }

    public BegenilenFilmleriListele() {
        $("#begenilenFilmlerListe").html("");
        let begenilenFilmler = this.db.exec("SELECT * FROM Filmler, BegenilenFilmler WHERE Filmler.ID = BegenilenFilmler.FilmID");
        begenilenFilmler = begenilenFilmler[0].values;
        begenilenFilmler.forEach((film) => {
            this.FilmKartBloguEkle("begenilenFilmlerListe", film, false);
        });
    }

    public BegenilmeyenFilmleriListele() {
        $("#begenilmeyenFilmlerListe").html("");
        let begenilmeyenFilmler = this.db.exec("SELECT * FROM Filmler, BegenilmeyenFilmler WHERE Filmler.ID = BegenilmeyenFilmler.FilmID");
        begenilmeyenFilmler = begenilmeyenFilmler[0].values;
        begenilmeyenFilmler.forEach((film) => {
            this.FilmKartBloguEkle("begenilmeyenFilmlerListe", film, false);
        });
    }

    public OnerilenFilmleriListele() {
        $("#onerilenFilmlerListe").html("");
        let tumFilmler = this.db.exec("SELECT * FROM Filmler");
        tumFilmler = tumFilmler[0].values;

        tumFilmler.forEach((film) => {
            let kontrol = true;
            this.begenilenID.forEach((id) => {
                if (film[0] === id) {
                    kontrol = false;
                }
            });

            if (kontrol) {
                let ifade = film[1] + ", " +
                    film[2] + ", " +
                    film[3] + ", " +
                    film[4] + ", " +
                    film[5] + ", " +
                    film[7] + ", " +
                    film[8];
                if (this.siniflandirici.categorize(ifade) === "önerilir") {
                    this.FilmKartBloguEkle("onerilenFilmlerListe", film, true);
                }
            }
        });
    }

    public OnerilmeyenFilmleriListele() {
        $("#onerilmeyenFilmlerListe").html("");
        let tumFilmler = this.db.exec("SELECT * FROM Filmler");
        tumFilmler = tumFilmler[0].values;

        tumFilmler.forEach((film) => {
            let kontrol = true;
            this.begenilmeyenID.forEach((id) => {
                if (film[0] === id) {
                    kontrol = false;
                }
            });

            if (kontrol) {
                let ifade = film[1] + ", " +
                    film[2] + ", " +
                    film[3] + ", " +
                    film[4] + ", " +
                    film[5] + ", " +
                    film[7] + ", " +
                    film[8];
                if (this.siniflandirici.categorize(ifade) === "önerilmez") {
                    this.FilmKartBloguEkle("onerilmeyenFilmlerListe", film, true);
                }
            }
        });
    }

    private FilmKartBloguEkle(id: string, film: any, tur: boolean) {
        let kod: string = "";
        kod += '<div class="row"><div class="card horizontal blue-grey darken-3 z-depth-4">';
        kod += '<div class="card-image" id="' + film[0] + '">';
        kod += '<img src="' + film[9] + '"></div>';
        kod += '<div class="card-stacked"><div class="card-content">';
        kod += '<p id="' + film[0] + '"><a href="#" id="filmAdi">' + film[1] + "</a></p>";
        kod += "<p>Tür: " + film[5] + "</p><hr/>";
        kod += "<p style='padding-bottom:5px;'>Yönetmen(ler): " + film[2] + "</p>";
        kod += "<p style='padding-bottom:5px;'>Senarist(ler): " + film[3] + "</p>";
        kod += "<p>Oyuncular: " + film[4] + "</p><br/>";
        if (tur) {
            kod += '<div class="card-action">\
            <a href="#" id="+' + film[0] + '">BEĞENDİM</a>\
            <a href="#" id="-' + film[0] + '">BEĞENMEDİM</a>\
            </div>';
        } else {
            kod += "<p>Konu: " + film[8] + "</p><br/>";
        }
        kod += "</div>";
        kod += "</div></div>";
        $("#" + id).append(kod);

        document.getElementById("+" + film[0]).addEventListener("click", () => {
            this.BegenilenFilmlereEkle(film[0]);
        });

        document.getElementById("-" + film[0]).addEventListener("click", () => {
            this.BegenilmeyenFilmlereEkle(film[0]);
        });
    }

    private BegenilenFilmlereEkle(id: string) {
        let kontrol = this.db.exec("SELECT * FROM BegenilmeyenFilmler WHERE FilmID = " + id);

        if (kontrol.length === 0) {
            let kontrol2 = this.db.exec("SELECT * FROM BegenilenFilmler WHERE FilmID = " + id);

            if (kontrol2.length === 0) {
                let komut: string = "";

                komut += "INSERT INTO BegenilenFilmler('FilmID')";
                komut += "VALUES(";
                komut += "'" + id + "'";
                komut += ")";

                this.db.run(komut);
                this.Kaydet();
                Materialize.toast("Film beğenilenler listenize eklendi!", 3000, "teal rounded");
            } else {
                Materialize.toast("Bu film zaten beğenilenler listenizde!", 3000, "red rounded");
            }
        } else {
            Materialize.toast("Bu film beğenilmeyenler listenizde!", 3000, "red rounded");
        }
    }

    private BegenilmeyenFilmlereEkle(id: string) {
        let kontrol = this.db.exec("SELECT * FROM BegenilenFilmler WHERE FilmID = " + id);

        if (kontrol.length === 0) {
            let kontrol2 = this.db.exec("SELECT * FROM BegenilmeyenFilmler WHERE FilmID = " + id);

            if (kontrol2.length === 0) {
                let komut: string = "";

                komut += "INSERT INTO BegenilmeyenFilmler('FilmID')";
                komut += "VALUES(";
                komut += "'" + id + "'";
                komut += ")";

                this.db.run(komut);
                this.Kaydet();
                Materialize.toast("Film beğenilmeyenler listenize eklendi!", 3000, "teal rounded");
            } else {
                Materialize.toast("Bu film zaten beğenilmeyenler listenizde!", 3000, "red rounded");
            }
        } else {
            Materialize.toast("Bu film beğenilenler listenizde!", 3000, "red rounded");
        }
    }

    private Kaydet() {
        let veri = this.db.export();
        let buffer = new Buffer(veri);
        fs.writeFileSync("./app/data/db.sqlite", buffer);
    }

}
