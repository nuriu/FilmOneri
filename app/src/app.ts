/// <reference path="../../typings/index.d.ts" />

import { Veritabani } from "./veritabani";

let db: Veritabani;

$(document).ready(() => {
    document.getElementById("menuTumFilmler").addEventListener("click", tumFilmleriListele);
    document.getElementById("menuBegendiginizFilmler").addEventListener("click", begenilenFilmleriListele);
    document.getElementById("menuBegenmediginizFilmler").addEventListener("click", begenilmeyenFilmleriListele);
    document.getElementById("menuOnerdigimizFilmler").addEventListener("click", onerilenFilmleriListele);
    document.getElementById("menuOnermedigimizFilmler").addEventListener("click", onerilmeyenFilmleriListele);

    db = new Veritabani();

    db.TumFilmleriListele();

    document.getElementById("filmEkle").addEventListener("click", () => {
        let turler = $("#kFilmTurleri").val();
        let tur: string = "";

        for (let i = 0; i < turler.length; i++) {
            let t = turler[i];
            if (i !== turler.length - 1) {
                tur += t + ", ";
            } else {
                tur += t;
            }
        }

        db.FilmEkle($("#kFilmAdi").val().replace(/\'/g, " "), $("#kFilmAciklamasi").val().replace(/\'/g, " "), $("#kFilmYili").val(),
            $("#kFilmPuani").val(), tur, $("#kFilmYonetmenleri").val().replace(/\'/g, " "),
            $("#kFilmSenaristleri").val().replace(/\'/g, " "),
            $("#kFilmOyunculari").val().replace(/\'/g, " "), $("#kFilmAfisUrl").val());

        $(":input").removeAttr("checked").removeAttr("selected").not(":button, :submit, :reset, :hidden, :radio, :checkbox").val("").blur();
    });
});

function tumFilmleriListele() {
    if ($("a[href='#tumFilmler']").hasClass("active") === false) {
        db.TumFilmleriListele();
    }
}

function begenilenFilmleriListele() {
    if ($("a[href='#begendiginizFilmler']").hasClass("active") === false) {
        db.BegenilenFilmleriListele();
    }
}

function begenilmeyenFilmleriListele() {
    if ($("a[href='#begenmediginizFilmler']").hasClass("active") === false) {
        db.BegenilmeyenFilmleriListele();
    }
}

function onerilenFilmleriListele() {
    if ($("a[href='#onerdigimizFilmler']").hasClass("active") === false) {
        db.Ogren();
        db.OnerilenFilmleriListele();
    }
}

function onerilmeyenFilmleriListele() {
    if ($("a[href='#onermedigimizFilmler']").hasClass("active") === false) {
        db.Ogren();
        db.OnerilmeyenFilmleriListele();
    }
}