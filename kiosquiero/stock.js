let categories = [
    {
        id: 1,
        name: 'Comidas',
        image: 'https://placehold.co/400x300',
        description: 'Alimentos preparados y snacks',
        items: []
    },
    {
        id: 2,
        name: 'Bebidas',
        image: 'https://placehold.co/400x300',
        description: 'Gaseosas y refrescos y smoothies',
        items: []
    },
    {
        id: 3,
        name: 'Otros',
        image: 'https://placehold.co/400x300',
        description: 'Galletitas, Postres, Snacks',
        items: []
    }
]

const sampleItems = {
    'Comidas': [
        { name: 'Lechuga', quantity: 5, image: 'https://placehold.co/100x100' },
        { name: 'Tomate', quantity: 0, image: 'https://placehold.co/100x100' },
        { name: 'Zanahoria', quantity: 10, image: 'https://placehold.co/100x100' }
    ],
    'Bebidas': [
        { name: 'Coca Cola', quantity: 15, image: 'https://placehold.co/100x100' },
        { name: '7Up', quantity: 8, image: 'https://placehold.co/100x100' },
        { name: 'Fanta', quantity: 12, image: 'https://placehold.co/100x100' }
    ],
    'Otros': [
        { name: 'Galletas', quantity: 20, image: 'https://placehold.co/100x100' },
        { name: 'Snacks', quantity: 15, image: 'https://placehold.co/100x100' }
    ]
}

const categoriesContainer = document.querySelector('.categories-container')
const stockDetails = document.getElementById('stockDetails')
const closeStockDetails = document.getElementById('closeStockDetails')
const categoryNameElement = document.querySelector('.category-name')
const itemsList = document.querySelector('.items-list')
const addItemButton = document.querySelector('.btn-add-item')
const stockModal = document.getElementById('stockModal')
const closeStockModal = document.getElementById('closeStockModal')
const stockForm = document.getElementById('stockForm')

document.getElementById('burgerMenu').addEventListener('click', function() {
    this.classList.toggle('active')
    document.getElementById('sideMenu').classList.toggle('active')
})

function renderCategories() {
    categoriesContainer.innerHTML = categories.map(category => `
        <div class="category-card" data-id="${category.id}">
            <img src="${category.image}" alt="${category.name}">
            <h3>${category.name}</h3>
            <p>${category.description}</p>
            <button class="btn-ir">Ir >>></button>
        </div>
    `).join('')

    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const categoryId = parseInt(card.dataset.id)
            const category = categories.find(c => c.id === categoryId)
            showCategoryDetails(category)
        })
    })
}

function showCategoryDetails(category) {
    categoryNameElement.textContent = category.name
    renderItems(category.name)
    stockDetails.classList.add('active')
}

function renderItems(categoryName) {
    const items = sampleItems[categoryName] || []
    itemsList.innerHTML = items.map(item => `
        <div class="stock-item">
            <div class="item-info">
                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover">
                <span class="item-name">${item.name}</span>
            </div>
            <div class="item-controls">
                <button class="btn-decrease">-</button>
                <span class="item-quantity">${item.quantity}</span>
                <button class="btn-increase">+</button>
            </div>
        </div>
    `).join('')

    document.querySelectorAll('.btn-decrease').forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation()
            if (items[index].quantity > 0) {
                items[index].quantity--
                renderItems(categoryName)
            }
        })
    })

    document.querySelectorAll('.btn-increase').forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation()
            items[index].quantity++
            renderItems(categoryName)
        })
    })
}

closeStockDetails.addEventListener('click', () => {
    stockDetails.classList.remove('active')
})

renderCategories()
