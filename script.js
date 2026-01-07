const addItemButton = document.getElementById('add-item');
const productInput = document.getElementById('product');
const priceInput = document.getElementById('price');
const itemsDiv = document.getElementById('items');
const noItems = document.getElementById('no-items');
const budgetButton = document.getElementById('budget-button');
const budgetAmount = document.getElementById('budget-amount');
const budgetInput = document.getElementById('budget');
const budgetText = document.getElementById('budget-text');
const theForm = document.getElementById('form');
const totalResultButton = document.getElementById('total-result-button');
const result = document.getElementById('result');
const formDiv = document.getElementById('form-div');
const budgetDiv =  document.getElementById('budget-div');

let all_results = {}

let counterItems = 0

addItemButton.addEventListener('click', function(e) {
    e.preventDefault()

    
    if (productInput.value !== '' && priceInput.value !== '') {
        
        budgetDiv.style.display = 'none'
        
        // budgetAmount.innerHTML = `€${Number(budgetAmount.innerHTML.replace('€', '')) - Number(priceInput.value)}`;

        noItems.style.display = 'none'

        const itemDiv = document.createElement('div');
        itemDiv.id = `item-${counterItems}`
        const productName = document.createElement('p');
        productName.id = `product-${counterItems}`
        productName.innerHTML = productInput.value
        const priceAmount = document.createElement('p');
        priceAmount.id = `price-${counterItems}`
        priceAmount.innerHTML = `€${priceInput.value}`

        const removeButton = document.createElement('button');
        removeButton.id = `remove-${counterItems}`
        removeButton.dataset.remover = counterItems
        removeButton.innerHTML = 'Remove'
        removeButton.addEventListener('click', function() {
            const id = removeButton.dataset.remover;
            let price = Number(document.getElementById(`price-${id}`).textContent.replace('€', ''));
            budgetAmount.innerHTML = `€${Number(budgetAmount.innerHTML.replace('€', '')) + price}`;

            document.getElementById(`item-${id}`).remove();
            delete all_results[id];
        });


        const label = document.createElement('label')
        label.id = `label-${counterItems}`
        label.innerHTML = 'Real price?'
        label.setAttribute('for', `input-${counterItems}`)

        const input = document.createElement('input')
        input.type = 'number'
        input.id = `input-${counterItems}`

        const checkButton = document.createElement('button')
        checkButton.innerHTML = 'Check'
        checkButton.dataset.checker = counterItems
        const itemResult  = document.createElement('p')
        itemResult.id = `result-${counterItems}`
        checkButton.addEventListener('click', function(e) {
            e.preventDefault()
            
            const id = checkButton.dataset.checker
            
            let ogPrice = Number(document.getElementById(`price-${id}`).textContent.replace('€', ''))
            let newPrice = Number(document.getElementById(`input-${id}`).value)
            
            
            const diff = Math.round((newPrice - ogPrice) * 100) / 100
            itemResult.innerHTML = (diff >= 0 ? `+€${diff}` : `€${diff}`)
            itemResult.style.color = diff <= 0 ? 'green' : 'red'
            all_results[id] = diff
        })
        
        productInput.value = ''
        priceInput.value = ''
        
        
        itemDiv.appendChild(productName)
        itemDiv.appendChild(priceAmount)
        itemDiv.appendChild(removeButton)
        itemDiv.appendChild(label)
        itemDiv.appendChild(input)
        itemDiv.appendChild(checkButton)
        itemDiv.appendChild(itemResult)
        itemsDiv.appendChild(itemDiv)

        counterItems ++
    }
})

let budgetOG = 0

budgetButton.addEventListener('click', function(e) {
    e.preventDefault()

    budgetOG = budgetInput.value

    formDiv.style.display = 'block'

    budgetText.style.display = 'block'

    if (budgetInput.value !== '') {
        budgetAmount.innerHTML = `€${budgetInput.value}`
    }
})


totalResultButton.addEventListener('click', function() {
    let totalPrice = 0;
    let totalDiff = 0; 

    for (let i = 0; i < counterItems; i++) {
        const priceEl = document.getElementById(`price-${i}`);
        if (priceEl) {
            totalPrice += Number(priceEl.textContent.replace('€', ''));
        }
    }
    for (let key in all_results) {
        totalDiff += all_results[key];
    }
    totalDiff = Math.round(totalDiff * 100) / 100; 

    result.innerHTML = `Total Price: €${Math.round(totalPrice * 100) / 100} with a difference of the original price of €${Math.round(totalDiff* 100) / 100}`;

    if (budgetOG && totalPrice <= budgetOG) {
        result.style.color = 'green';
    } else if (budgetOG) {
        result.style.color = 'red';
    }
});

