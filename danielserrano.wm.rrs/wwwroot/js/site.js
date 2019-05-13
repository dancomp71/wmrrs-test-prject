'use strict';

var reservations = JSON.parse(localStorage.getItem("reservations")) || [];

var saveReservations = function () {
    localStorage.setItem("reservations", JSON.stringify(reservations));
};

var resetInputs = function () {
    $("#dateInput").val(moment().format("MM/DD/YYYY"));
    $("#timeInput").val(moment().format("kk:mm"));
    $("#partyNameInput").val("");
    $("#numOfPplInput").val(1);
};

var newGuid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
    function(c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    }).toUpperCase();
};

var addRow = function(reservation) {
    var tr = $('<tr>'
        + '<td>' + reservation.time + '</td>'
        + '<td>' + reservation.date + '</td>'
        + '<td>' + reservation.partyName + '</td>'
        + '<td>' + (reservation.numOfPpl || 1) + '</td>'
        + '<td>' + reservation.fulfilled + '</td>'
        + '<td>'
        + '<button class="btn btn-sm btn-primary" onclick="fulfillRow(this)" data-toggle="tooltip" title="Fulfill a reservation">Fulfill</button>'
        + '<button class="btn btn-sm btn-primary" onclick="deleteRow(this)" data-toggle="tooltip" title="Cancel reservation" >Cancel</button>'
        +'</td>'
        + '</tr>'
        );
    tr[0].id = reservation.id;
    $("#table-reservations").append(tr);
};

var deleteRow = function (r) {
    var tr = $(r).parent().parent();
    var tds = tr.children();
    tr.remove();
    reservations = reservations.filter(function(item) {
        return (item.id !== tr[0].id);
    });
    saveReservations();
    populateReservations(false);
};

var fulfillRow = function (r) {
    var tr = $(r).parent().parent();
    var tds = tr.children();
    var reservation = reservations.find(function (item, i) {
        return tr[0].id === item.id;
    });

    // mark as fulfilled
    if (reservation) {
        reservation.fulfilled = !reservation.fulfilled;
    }

    tds[4].innerHTML = reservation.fulfilled;

    saveReservations();
};

var populateReservations = function (refresh) {
    if(refresh) {
        $("#table-reser").empty();
        for(var i in reservations) {
            addRow(reservations[i]);
        }
    }

    if(reservations.length > 0) {
        $("#no-reservations").hide();
        $("#section-reservations").show();
    } else {
        $("#section-reservations").hide();
        $("#no-reservations").show();
    }
};

$(document).ready(function () {
    resetInputs();

    $("#add-reservation").on("click", function (e) {
        resetInputs();
        $("#current-reservations").hide();
        $("#new-reservation").show();
        return e.preventDefault();
    });

    $("#cancel-reservation").on("click", function (e) {
        $("#new-reservation").hide();
        $("#current-reservations").show();
        return e.preventDefault();
    });

    $("#new-reservation-form").submit(function (e) {

        if ($("#new-reservation-form").valid()) {
            var reservation = {
                id: newGuid(),
                time: $("#timeInput").val(),
                date: $("#dateInput").val(),
                numOfPpl: Number.parseInt($("#numOfPplInput").val()),
                partyName: $("#partyNameInput").val(),
                fulfilled: false
            };
            // add reservation to collection
            reservations.push(reservation);
            // add reservation to ui and generate id
            addRow(reservation);
            // handle ui display flow
            $("#section-reservations").show();
            $("#new-reservation").hide();
            $("#current-reservations").show();
            populateReservations(false);
            // save reservations to localstorage
            saveReservations();
        }
        return e.preventDefault();
    });

    $("#new-reservation-form").validate({
        rules: {
            dateInput: {
                required: true
            },
            timeInput: {
                required: true
            },
            partyNameInput: {
                required: true,
                minlength: 2
            },
            numOfPplInput: {
                required: true,
                number: true,
                min: 1
            }
        },
        messages: {
            dateInput: "Please enter date of reservation",
            timeInput: "Please enter time of reservation",
            partyNameInput: {
                required: "Please enter Party's Name",
                minlength: "Party name must consist of at least 2 characters"
            },
            numOfPplInput: {
                required: "Please enter the number of people in the party",
                number: "Please enter a valid number",
                min: "Please enter a number greater than 0"
            }
        }
    });
    populateReservations(true);
    $("#loading-reservations").hide();
    $("#current-reservations").show();
});
