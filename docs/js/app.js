/**
 * initialize global variables
 */
let _arrDataSet, _secListCards, _cardTemplate, _styleInputInvalid, _objPlaceholder;

/**
 * set global variables
 * start storage structure
 */
window.onload = function (e) {
    console.log('app ready');
    newDataSet();

    _secListCards = document.querySelector("#cards-list");
    _cardTemplate = document.querySelector("#card-template");
    _styleInputInvalid = getComputedStyle(document.documentElement).getPropertyValue('--input-invalid');
    _styleCardBestChoice = getComputedStyle(document.documentElement).getPropertyValue('--card-best-choice-bg-color');
    _styleCard = getComputedStyle(document.documentElement).getPropertyValue('--card-bg-color');

    // random data input placeholder
    _objPlaceholder = _arrPlaceholderExamples[Math.floor(Math.random() * _arrPlaceholderExamples.length)];

    // set placeholder 
    document.querySelector("#numUnits").placeholder = _objPlaceholder.units;
    document.querySelector("#volUnit").placeholder = _objPlaceholder.volume;
    document.querySelector("#price").placeholder = _objPlaceholder.price;
}

/**
 * add item to dataset e refresh interface
 */
function addItem() {
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
    addDataSet({ "units": numUnits, "vol": volUnit, "price": price, "ratio": calculateRation(numUnits, volUnit, price) });

    // refresh interface
    updateList();

    // reset form inputs
    oForm.reset();
    restartFocus();

    return true;
}

function updateList() {
    // get last item added
    const lastAdded = _arrDataSet[_arrDataSet.length - 1];
    console.log(lastAdded);

    // load template
    let card = _cardTemplate.content.querySelector("article").cloneNode(true);

    // using HTML5 tag TEMPLATE
    card.querySelector("#tplUnit").innerHTML = lastAdded.units.toString().replace(".", ",") + ' unid.';
    card.querySelector("#tplVol").innerHTML = lastAdded.vol.toString().replace(".", ",") + ' vol.';
    card.querySelector("#tplRatio").innerHTML = 'R$ ' + lastAdded.ratio.toString().replace(".", ",") + '/vol.';
    card.querySelector("#tplPrice").innerHTML = 'R$ ' + (Math.round(lastAdded.price * 100) / 100).toFixed(2).toString().replace(".", ",");

    // append next card on section
    _secListCards.appendChild(card);

    // reset background-color all cards (articles)
    document.querySelectorAll("section#cards-list article").forEach((element, index) => {
        element.style.backgroundColor = _styleCard;
    });

    // get index from best choice(s)
    let arrIdxBestChoices = findBestChoiceIndex();
    // set backgroud-color to card
    arrIdxBestChoices.forEach((element, index) => {
        document.querySelectorAll("section#cards-list article")[element].style.backgroundColor = _styleCardBestChoice;
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

    return parseFloat((price / (units * vol)).toFixed(3));
}

/**
 * init storage structure
 */
function newDataSet() {
    console.log('create dataset');
    _arrDataSet = [];
}

/**
 * add new item
 * @param {object item} newItem 
 */
function addDataSet(newItem) {
    console.log('add item in dataset');
    _arrDataSet.push(newItem);
    //console.table(_arrDataSet);
    //_jsonDataSet = JSON.stringify(_arrDataSet);
}

/**
 * find and return minor ratio from array
 */
function findBestChoice() {
    const arrAux = _arrDataSet.slice(0);
    return arrAux.sort((item1, item2) => item1.ratio - item2.ratio)[0];
}

/**
 * Find index of best choice(s) and return array
 */
function findBestChoiceIndex() {
    let arrIndexBestChoice = [];
    const bestChoice = findBestChoice();

    _arrDataSet.forEach((element, index) => {
        if (element.ratio == bestChoice.ratio)
            arrIndexBestChoice.push(index);
    });

    return arrIndexBestChoice;
}
