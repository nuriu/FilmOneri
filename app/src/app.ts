/// <reference path="../../typings/index.d.ts" />

import { Veritabani } from "./veritabani";

let db: Veritabani;

$(document).ready(() => {
    db = new Veritabani();

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
