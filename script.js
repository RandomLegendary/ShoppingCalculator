const addItemButton = document.getElementById('add-item');
const productInput = document.getElementById('product');
const priceInput = document.getElementById('price');
const itemsDiv = document.getElementById('items');
const noItems = document.getElementById('no-items');
const budgetButton = document.getElementById('budget-button');
const budgetAmount = document.getElementById('budget-amount');
const budgetInput = document.getElementById('budget');
const budgetText = document.getElementById('budget-text');
const totalResultButton = document.getElementById('total-result-button');
const result = document.getElementById('result');
const formDiv = document.getElementById('form-div');
const budgetDiv = document.getElementById('budget-div');

let all_results = {};
let counterItems = 0;
let budgetOG = 0;

/* =========================
   ITEM CREATION
========================= */
function createItem(id, product, price, realPrice = '', diff = null) {
    noItems.style.display = 'none';

    const itemDiv = document.createElement('div');
    itemDiv.id = `item-${id}`;

    const productName = document.createElement('p');
    productName.id = `product-${id}`;
    productName.textContent = product;

    const priceAmount = document.createElement('p');
    priceAmount.id = `price-${id}`;
    priceAmount.textContent = `€${price}`;

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.dataset.remover = id;

    removeButton.addEventListener('click', () => {
        const price = Number(priceAmount.textContent.replace('€', ''));
        budgetAmount.innerHTML =
            `€${Number(budgetAmount.innerHTML.replace('€', '')) + price}`;

        itemDiv.remove();
        delete all_results[id];
        saveToStorage();
    });

    const label = document.createElement('label');
    label.textContent = 'Real price?';

    const input = document.createElement('input');
    input.type = 'number';
    input.id = `input-${id}`;
    input.value = realPrice;

    const checkButton = document.createElement('button');
    checkButton.textContent = 'Check';

    const itemResult = document.createElement('p');
    itemResult.id = `result-${id}`;

    if (diff !== null) {
        itemResult.textContent = diff >= 0 ? `+€${diff}` : `€${diff}`;
        itemResult.style.color = diff <= 0 ? 'green' : 'red';
        all_results[id] = diff;
    }

    checkButton.addEventListener('click', (e) => {
        e.preventDefault();
        const d =
            Math.round((Number(input.value) - Number(price)) * 100) / 100;
        itemResult.textContent = d >= 0 ? `+€${d}` : `€${d}`;
        itemResult.style.color = d <= 0 ? 'green' : 'red';
        all_results[id] = d;
        saveToStorage();
    });

    itemDiv.append(
        productName,
        priceAmount,
        removeButton,
        label,
        input,
        checkButton,
        itemResult
    );

    itemsDiv.appendChild(itemDiv);
}

/* =========================
   ADD ITEM
========================= */
addItemButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (!productInput.value) return;

    budgetDiv.style.display = 'none';

    createItem(counterItems, productInput.value, priceInput.value || 0);

    counterItems++;
    productInput.value = '';
    priceInput.value = '';

    saveToStorage();
});

/* =========================
   BUDGET
========================= */
budgetButton.addEventListener('click', (e) => {
    e.preventDefault();

    if (!budgetInput.value) return;

    budgetOG = Number(budgetInput.value);
    budgetAmount.innerHTML = `€${budgetOG}`;
    budgetText.style.display = 'block';
    formDiv.style.display = 'block';

    saveToStorage();
});

/* =========================
   TOTAL RESULT
========================= */
totalResultButton.addEventListener('click', function () {
    let total = 0;
    let totalDiff = 0;

    document.querySelectorAll('[id^="item-"]').forEach(item => {
        const id = item.id.split('-')[1];

        const originalPrice = Number(
            document.getElementById(`price-${id}`).textContent.replace('€', '')
        );

        const realPriceInput = document.getElementById(`input-${id}`);
        const realPrice = Number(realPriceInput.value);

        // Use real price if provided, otherwise original
        const finalPrice = realPriceInput.value !== '' ? realPrice : originalPrice;

        total += finalPrice;
    });

    for (let key in all_results) {
        totalDiff += all_results[key];
    }

    total = Math.round(total * 100) / 100;
    totalDiff = Math.round(totalDiff * 100) / 100;

    result.innerHTML =
        `Total: €${total} | Difference: €${totalDiff}`;

    if (budgetOG && total <= budgetOG) {
        result.style.color = 'green';
    } else if (budgetOG) {
        result.style.color = 'red';
    }
});



/* =========================
   STORAGE
========================= */
function saveToStorage() {
    const items = [];

    document.querySelectorAll('[id^="item-"]').forEach(item => {
        const id = Number(item.id.split('-')[1]);
        items.push({
            id,
            product: document.getElementById(`product-${id}`).textContent,
            price: document.getElementById(`price-${id}`).textContent.replace('€', ''),
            realPrice: document.getElementById(`input-${id}`).value
        });
    });

    localStorage.setItem(
        'budgetApp',
        JSON.stringify({
            budgetOG,
            counterItems,
            all_results,
            budgetAmount: budgetAmount.innerHTML,
            items
        })
    );
}

function loadFromStorage() {
    const data = JSON.parse(localStorage.getItem('budgetApp'));
    if (!data) return;

    budgetOG = data.budgetOG || 0;
    counterItems = data.counterItems || 0;
    all_results = data.all_results || {};

    if (data.budgetAmount) {
        budgetAmount.innerHTML = data.budgetAmount;
        budgetText.style.display = 'block';
        formDiv.style.display = 'block';
    }

    if (data.items.length) noItems.style.display = 'none';

    data.items.forEach(item => {
        createItem(
            item.id,
            item.product,
            item.price,
            item.realPrice,
            all_results[item.id] ?? null
        );
    });
}

window.addEventListener('load', loadFromStorage);
