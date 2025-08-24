import { waterOptions, rarityOption, skillOptions, ingredientList, targetingList } from './constants.js';

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
    addButtonListener();
}


function populateComboBox(comboBoxId, contentObject) {
    console.log(contentObject);
    const comboBox = document.getElementById(comboBoxId);
    Object.entries(contentObject).forEach(([textContent, value]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = textContent;
        comboBox.appendChild(option);
    });
}

function calcRecipe() {
    let characterOffset = parseInt(document.getElementById("offsetComboBox").value);
    let targetValue = parseInt(document.getElementById("targetComboBox").value);
    let waterOption = parseInt(document.getElementById("waterComboBox").value);
    let ovenOption = parseInt(document.getElementById("ovenComboBox").value);
    let cauldronOption = parseInt(document.getElementById("cauldronComboBox").value);

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
        } else if (item.ingredient == 'Wheat') {
            ingredient_count += targetingData.wheat;
        } else if (item.ingredient == 'Rye') {
            ingredient_count += targetingData.rye;
        }
        recipeList.push({ state: ingredient_state, name: item.ingredient, amount: ingredient_count });
        totalWeight += item.weight * ingredient_count;
    }
    recipeList.push({ state: ((waterOption) ? 'Salty' : 'Regular'), name: 'Water', amount: totalWeight * 2.4 / 1000 });
    writeTable(recipeList)
}

function addButtonListener() {
    const recipeButton = document.getElementById('recipeButton');
    recipeButton.addEventListener('click', () => { calcRecipe() });
}


function writeTable(products) {

    // Get a reference to the table body and clear it
    const tableBody = document.querySelector('#myTable tbody');
    tableBody.innerHTML = '';

    // Loop through the data and create a row for each item
    products.forEach(product => {
        // Create a new table row
        const row = document.createElement('tr');

        // Create and populate table cells with data

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

        // Append cells to the row
        row.appendChild(nameCell);
        row.appendChild(stateCell);
        row.appendChild(amountCell);
        row.appendChild(checkboxCell);

        // Append the row to the table body
        tableBody.appendChild(row);
    });
}