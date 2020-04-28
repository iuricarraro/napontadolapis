let _jsonDataSet, _arrDataSet;
let _placeholders = '{ "produtos": [] }';

let templateItem = '' +
    '<article>' +
    '    <header class="block-column" >' +
    '        <div>[UNIT] unit.</div>' +
    '        <div>[VOL] vol.</div>' +
    '        <div style="font-weight: bold;">R$ [RAT]/vol.</div>' +
    '</header>' +
    '<hr/>' +
    '    <p style="font-weight: bold;">R$ [PRICE]</p>' +
    '</article >';
let backgroundColorDefault = "";

window.onload = function (e) {
    console.log('app ready');
    newDataSet();
    backgroundColorDefault = document.querySelector('#numUnits').style.backgroundColor;
}

function addItemList() {
    console.log("adding");

    let oNumUnits = document.querySelector('#numUnits');
    let oVolUnit = document.querySelector('#volUnit');
    let oPrice = document.querySelector('#price');
    let oForm = document.querySelector("#form");

    let numUnits = parseInt(oNumUnits.value);
    let volUnit = parseFloat(oVolUnit.value.replace(",", "."));
    let price = parseFloat(oPrice.value.replace(",", "."));

    oNumUnits.style.backgroundColor = backgroundColorDefault;
    oVolUnit.style.backgroundColor = backgroundColorDefault;
    oPrice.style.backgroundColor = backgroundColorDefault;

    if (!oForm.reportValidity() || isNaN(numUnits) || isNaN(volUnit) || isNaN(price)
        || numUnits === 0 || volUnit === 0 || price === 0) {
        if (numUnits === 0)
            oNumUnits.style.backgroundColor = "tomato";
        else if (volUnit === 0)
            oVolUnit.style.backgroundColor = "tomato";
        else if (price === 0)
            oPrice.style.backgroundColor = "tomato";


        console.log("invalid input data");
        return false;
    }

    addDataSet(calculateRating(numUnits, volUnit, price));
    updateList();
    oForm.reset();

    return true;
}

/**
 * Recria a lista de itens com a nova ordenação
 */
function updateList() {
    console.log("updating");
    sortDataSet();

    let secItens = document.querySelector("#list-itens");
    secItens.innerHTML = "";

    _arrDataSet.produtos.forEach(function (item, index, arr) {
        let strUnit = item.units.toString().replace(".", ",");
        let strVol = item.vol.toString().replace(".", ",");
        let strRating = item.rating.toString().replace(".", ",");
        let strPrice = (Math.round(item.price * 100) / 100).toFixed(2).toString().replace(".", ",");

        secItens.innerHTML += templateItem
            .replace('[UNIT]', strUnit)
            .replace('[VOL]', strVol)
            .replace('[RAT]', strRating)
            .replace('[PRICE]', strPrice);
    });

    // altera a o backgrounfd-color do primeiro e último item da lista
    document.querySelector("article:last-child").style.backgroundColor = "sienna"; // darkseagreen
    document.querySelector("article:first-child").style.backgroundColor = "cadetblue"; // rosybrown | tomato | sienna
}

function clearList() {
    console.log("resetting");
    newDataSet();
    let secItens = document.querySelector("#list-itens");
    secItens.innerHTML = "";
}

/**
 * Calcula o custo-benefício do item
 * @param {number} units 
 * @param {number} vol 
 * @param {number} price 
 */
function calculateRating(units, vol, price) {
    if (vol - parseInt(vol) > 0) // caso float convert para unidade
        vol = vol * 1000;

    let rating = parseFloat((price / (units * vol)).toFixed(3));

    return ({ "units": units, "vol": vol, "price": price, "rating": rating });
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
    //console.table(_arrDataSet.produtos);
}