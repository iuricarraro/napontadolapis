/**
 * initialize global variables
 */
let _placeholders, _jsonDataSet, _arrDataSet, _secListCards, _cardTemplate, _styleInputInvalid = '';

/**
 * set global variables
 * start storage structure
 */
window.onload = function (e) {
    console.log('app ready');
    newDataSet();

    _placeholders = '{ "items": [] }';
    _secListCards = document.querySelector("#cards-list");
    _cardTemplate = document.querySelector("#card-template");
    _styleInputInvalid = getComputedStyle(document.documentElement).getPropertyValue('--input-invalid');
}

/**
 * add item to dataset e refresh interface
 */
function addItem() {
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

    // add object in storage structure
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

    // delete all cards from list
    _secListCards.innerHTML = "";

    // fill template values and append on list
    _arrDataSet.items.forEach(function (item, index, arr) {
        let strUnit = item.units.toString().replace(".", ",");
        let strVol = item.vol.toString().replace(".", ",");
        let strRatio = item.rating.toString().replace(".", ",");
        let strPrice = (Math.round(item.price * 100) / 100).toFixed(2).toString().replace(".", ",");

        // load template
        let card = _cardTemplate.content.querySelector("article").cloneNode(true);

        // using HTML5 tag TEMPLATE
        card.querySelector("#tplUnit").innerHTML = strUnit + ' unid.';
        card.querySelector("#tplVol").innerHTML = strVol + ' vol.';
        card.querySelector("#tplRatio").innerHTML = 'R$ ' + strRatio + '/vol.';
        card.querySelector("#tplPrice").innerHTML = 'R$ ' + strPrice;

        _secListCards.appendChild(card);
    });
}

/**
 * destroy interface list and renew storage structure
 */
function clearList() {
    console.log("resetting");
    newDataSet();
    document.querySelector("#cards-list").innerHTML = "";
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