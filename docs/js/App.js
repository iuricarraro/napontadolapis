let _jsonDataSet, _arrDataSet;
let templateItem = '' +
    '<article>' +
    '    <header class="block-column" >' +
    '        <div>[UNIT] unit.</div>' +
    '        <div>[VOL] vol.</div>' +
    '        <div>R$ [RAT]/vol.</div>' +
    '</header>' +
    '<hr/>' +
    '    <p>R$ [PRICE]</p>' +
    '</article >';

window.onload = function (e) {
    console.log('app ready');
    newDataSet();
}

function addItemList() {
    console.log("adding");

    let oNumUnits = document.querySelector('#numUnits');
    let oVolUnit = document.querySelector('#volUnit');
    let oPrice = document.querySelector('#price');
    let oForm = document.querySelector("#form");

    let numUnits = parseFloat(oNumUnits.value);
    let volUnit = parseFloat(oVolUnit.value);
    let price = parseFloat(oPrice.value);

    if (!oForm.reportValidity() || isNaN(numUnits) || isNaN(volUnit) || isNaN(price)) {
        console.log("exception");
        return false;
    }

    addDataSet(calculateRating(numUnits, volUnit, price));
    updateList();
    oForm.reset();

    return true;
}

function updateList() {
    console.log("updating");
    sortDataSet();

    let secItens = document.querySelector("#list-itens");
    secItens.innerHTML = "";

    _arrDataSet.produtos.forEach(function (item, index, arr) {
        secItens.innerHTML += templateItem.replace('[UNIT]', item.units)
            .replace('[VOL]', item.vol)
            .replace('[RAT]', item.rating)
            .replace('[PRICE]', item.price);
    })
}

function clearList() {
    console.log("resetting");
    newDataSet();
    let secItens = document.querySelector("#list-itens");
    secItens.innerHTML = "";
}

function calculateRating(numUnits, volUnit, price) {
    let volUnitAsset = 1;

    if (numUnits == 0 || volUnit == 0)
        return 0;

    if (volUnit - parseInt(volUnit) > 0)
        volUnitAsset = volUnit * 1000;

    let rating = parseFloat((price / (numUnits * volUnitAsset)).toFixed(3).slice(0, -1));
    console.log(rating);

    return ({ "units": numUnits, "vol": volUnit, "price": price, "rating": rating });
}

function newDataSet() {
    console.log('create dataset');
    _jsonDataSet = '{ "produtos": [] }';
    _arrDataSet = JSON.parse(_jsonDataSet);
}

function addDataSet(newItem) {
    console.log('add item dataset');
    _arrDataSet["produtos"].push(newItem);
    _jsonDataSet = JSON.stringify(_arrDataSet);
}

function sortDataSet() {
    console.log('sort dataset');
    _arrDataSet.produtos.sort(function (a, b) {
        return a["rating"] - b["rating"];
    });
    console.table(_arrDataSet.produtos);
}