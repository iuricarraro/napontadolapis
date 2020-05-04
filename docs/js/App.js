let _jsonDataSet, _arrDataSet;
let _placeholders = '{ "items": [] }';

let cardTemplate = '' +
    '<article>' +
    '    <header class="block-column card-info-2">' +
    '        <div>[UNIT] unit.</div>' +
    '        <div>[VOL] vol.</div>' +
    '        <div style="font-weight: bold;">R$ [RAT]/vol.</div>' +
    '</header>' +
    '<div class="card-separator"></div>' +
    '    <p style="font-weight: bold;">R$ [PRICE]</p>' +
    '</article >';

/**
 * getting colors system from CSS
 */
let _styleFirstCardBgColor, _styleLastCardBgColor, _styleInputInvalid = '';

/**
 * set global variables
 * start storage structure
 */
window.onload = function (e) {
    console.log('app ready');
    newDataSet();

    _styleFirstCardBgColor = getComputedStyle(document.documentElement).getPropertyValue('--card-first-bg-color');
    _styleLastCardBgColor = getComputedStyle(document.documentElement).getPropertyValue('--card-last-bg-color');
    _styleInputInvalid = getComputedStyle(document.documentElement).getPropertyValue('--input-invalid');
}

/**
 * add item to dataset e refresh interface
 */
function addItemList() {
    console.log("adding");

    let oNumUnits = document.querySelector('#numUnits');
    let oVolUnit = document.querySelector('#volUnit');
    let oPrice = document.querySelector('#price');
    let oForm = document.querySelector("#form");

    let numUnits = parseInt(oNumUnits.value);
    let volUnit = parseFloat(oVolUnit.value.replace(",", "."));
    let price = parseFloat(oPrice.value.replace(",", "."));

    oNumUnits.style.backgroundColor = '';
    oVolUnit.style.backgroundColor = '';
    oPrice.style.backgroundColor = '';

    if (!oForm.reportValidity() || isNaN(numUnits) || isNaN(volUnit) || isNaN(price)
        || numUnits === 0 || volUnit === 0 || price === 0) {

        if (numUnits === 0)
            oNumUnits.style.backgroundColor = _styleInputInvalid;
        else if (volUnit === 0)
            oVolUnit.style.backgroundColor = _styleInputInvalid;
        else if (price === 0)
            oPrice.style.backgroundColor = _styleInputInvalid;

        console.log("invalid input data");
        return false;
    }

    addDataSet(calculateRation(numUnits, volUnit, price));

    // refresh interface
    updateList();

    // reset form inputs
    oForm.reset();

    restartFocus();

    return true;
}

/**
 * remake sorted items list
 */
function updateList() {
    console.log("updating");

    // reorder items list 
    sortDataSet();

    let secCards = document.querySelector("#list-itens");
    secCards.innerHTML = "";

    _arrDataSet.items.forEach(function (item, index, arr) {
        let strUnit = item.units.toString().replace(".", ",");
        let strVol = item.vol.toString().replace(".", ",");
        let strRating = item.rating.toString().replace(".", ",");
        let strPrice = (Math.round(item.price * 100) / 100).toFixed(2).toString().replace(".", ",");

        secCards.innerHTML += cardTemplate
            .replace('[UNIT]', strUnit)
            .replace('[VOL]', strVol)
            .replace('[RAT]', strRating)
            .replace('[PRICE]', strPrice);
    });

    // altera a o backgrounfd-color do primeiro e último item da lista
    document.querySelector("article:last-child").style.backgroundColor = _styleLastCardBgColor;
    document.querySelector("article:first-child").style.backgroundColor = _styleFirstCardBgColor;
}

/**
 * destroy interface list and renew storage structure
 */
function clearList() {
    console.log("resetting");
    newDataSet();
    document.querySelector("#list-itens").innerHTML = "";
}

/**
 * set focus on first input
 */
function restartFocus() {
    document.querySelector("input:first-child").focus();
}

/**
 * calculate ratio from item
 * @param {number} units 
 * @param {number} vol 
 * @param {number} price 
 */
function calculateRation(units, vol, price) {
    if (vol - parseInt(vol) > 0)
        vol = vol * 1000; // convert to default unit

    let rating = parseFloat((price / (units * vol)).toFixed(3));

    return ({ "units": units, "vol": vol, "price": price, "rating": rating });
}

/**
 * init storage structure
 */
function newDataSet() {
    console.log('create dataset');
    _jsonDataSet = '{ "items": [] }';
    _arrDataSet = JSON.parse(_jsonDataSet);
}

/**
 * add new item
 * @param {object item} newItem 
 */
function addDataSet(newItem) {
    console.log('add item dataset');
    _arrDataSet["items"].push(newItem);
    _jsonDataSet = JSON.stringify(_arrDataSet);
}

/**
 * sort list
 */
function sortDataSet() {
    console.log('sort dataset');
    _arrDataSet.items.sort(function (a, b) {
        return a["rating"] - b["rating"];
    });
    //console.table(_arrDataSet.items);
}