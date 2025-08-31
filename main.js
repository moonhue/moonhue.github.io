import { waterOptions, rarityOption, skillOptions, ingredientList, targetingList, bulkOption, grainAOption, grainBOption } from './constants.js';

const N = 138; // number of skills
main();

function mod(n, m) {
    return ((n % m) + m) % m;
}

async function main() {
    populateComboBox("offsetComboBox", skillOptions);
    populateComboBox("targetComboBox", skillOptions);
    populateComboBox("waterComboBox", waterOptions);
    populateComboBox("ovenComboBox", rarityOption);
    populateComboBox("cauldronComboBox", rarityOption);
    populateComboBox("primaryGrainComboBox", bulkOption)
    handleBulkChange();
    addEventListeners();
}


function populateComboBox(comboBoxId, contentObject) {
    const comboBox = document.getElementById(comboBoxId);
    comboBox.innerHTML = '';
    Object.entries(contentObject).forEach(([textContent, value]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = textContent;
        comboBox.appendChild(option);
    });
}

function handleBulkChange() {
    const primaryGrain = document.getElementById('primaryGrainComboBox').value;
    if (Object.keys(grainAOption).includes(primaryGrain))
        populateComboBox("secondaryGrainComboBox", grainBOption);
    else
        populateComboBox("secondaryGrainComboBox", grainAOption);
}

function calcRecipe() {
    let characterOffset = parseInt(document.getElementById("offsetComboBox").value);
    let targetValue = parseInt(document.getElementById("targetComboBox").value);
    let targetWeight = parseFloat(document.getElementById("weightInput").value);
    let waterOption = parseInt(document.getElementById("waterComboBox").value);
    let ovenOption = parseInt(document.getElementById("ovenComboBox").value);
    let cauldronOption = parseInt(document.getElementById("cauldronComboBox").value);
    let primaryBulk = document.getElementById('primaryGrainComboBox').value;
    let secondaryBulk = document.getElementById('secondaryGrainComboBox').value;
    let grainA = (Object.keys(grainAOption).includes(primaryBulk)) ? primaryBulk : secondaryBulk;
    let grainB = (Object.keys(grainBOption).includes(primaryBulk)) ? primaryBulk : secondaryBulk;
    let extra_grain = Math.ceil((targetWeight * 1000 / 3.4 - 8900) / 300);
    let totalValue = 47 + characterOffset + waterOption + ovenOption + cauldronOption;
    let targetingData = targetingList[mod(targetValue - totalValue, N)];
    let totalWeight = 0;

    let recipeList = [];
    let fried_count = targetingData.fried;
    for (const item of ingredientList) {
        let ingredient_state = 'raw'
        let ingredient_count = 1;
        if (item.is_vegetable) {
            if (fried_count > 0) {
                ingredient_state = 'fried';
                fried_count -= 1;
            }
            else ingredient_state = 'roasted';
        }
        else if (item.ingredient == 'Sugar') {
            ingredient_count += targetingData.sugar;
        }
        else {
            if (item.ingredient == primaryBulk)
                ingredient_count += extra_grain;
            if (item.ingredient == grainA)
                ingredient_count += targetingData.rye;
            else if (item.ingredient == grainB)
                ingredient_count += 7 - targetingData.rye;
        }
        recipeList.push({ state: ingredient_state, name: item.ingredient, amount: ingredient_count });
        totalWeight += item.weight * ingredient_count;
    }
    recipeList.push({ state: ((waterOption) ? 'salty' : 'regular'), name: 'Water', amount: totalWeight * 2.4 / 1000 });
    writeTable(recipeList, totalWeight * 3.4 / 1000);
}

function addEventListeners() {
    const recipeButton = document.getElementById('recipeButton');
    recipeButton.addEventListener('click', () => { calcRecipe() });

    document.getElementById('primaryGrainComboBox').addEventListener('change', () => { handleBulkChange() });
}


function writeTable(products, totalWeight) {

    // Get a reference to the table body and clear it
    const tableBody = document.querySelector('#myTable tbody');
    tableBody.innerHTML = '';

    // Loop through the data and create a row for each item
    products.forEach(product => {
        // move this into another function?
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = product.name;

        const stateCell = document.createElement('td');
        stateCell.textContent = product.state;

        const amountCell = document.createElement('td');
        amountCell.textContent = product.amount;
        amountCell.style.textAlign = 'right';

        const checkboxCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'select';
        checkboxCell.appendChild(checkbox);
        checkboxCell.style.textAlign = 'center';

        row.appendChild(nameCell);
        row.appendChild(stateCell);
        row.appendChild(amountCell);
        row.appendChild(checkboxCell);

        tableBody.appendChild(row);
    });

    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.textContent = "Moonshine";
    nameCell.style.borderTop = '1px solid black';

    const stateCell = document.createElement('td');
    stateCell.textContent = "unfermented";
    stateCell.style.borderTop = '1px solid black';

    const amountCell = document.createElement('td');
    amountCell.style.borderTop = '1px solid black';
    amountCell.textContent = totalWeight;
    amountCell.style.textAlign = 'right';

    const lineCell = document.createElement('td');
    lineCell.style.borderTop = '1px solid black';

    row.appendChild(nameCell);
    row.appendChild(stateCell);
    row.appendChild(amountCell);
    row.appendChild(lineCell);


    tableBody.appendChild(row);

}