document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.querySelector(".burger-menu")
    const sideMenu = document.getElementById("sideMenu")
    const cartIcon = document.getElementById("cartIcon")
    const cartModal = document.getElementById("cartModal")
    const cartCounter = document.getElementById("cartCounter")
    const closeCart = document.getElementById("closeCart")
    let menuOpen = false

    // Funcionalidad del carrito
    const cart = {
        items: [],
        total: 0
    }

    // Obtener secciones del menu desde el HTML
    const menuSections = {}
    document.querySelectorAll('.section-title').forEach(section => {
        const sectionName = section.textContent.toUpperCase()
        const items = Array.from(section.nextElementSibling.querySelectorAll('.category-info h3'))
                         .map(h3 => h3.textContent)
        menuSections[sectionName] = items
    })

    function getItemSection(itemName) {
        for (const [section, items] of Object.entries(menuSections)) {
            if (items.includes(itemName)) {
                return section
            }
        }
        return Object.keys(menuSections)[0] // Si no se encuentra, usar la primera seccion
    }

    function toggleCart() {
        cartModal.classList.toggle('active')
    }

    function updateCartCounter() {
        const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0)
        cartCounter.textContent = totalItems
        
        if (totalItems > 0) {
            cartCounter.classList.add('active')
        } else {
            cartCounter.classList.remove('active')
        }
    }

    function shakeCart() {
        cartIcon.classList.add('cart-shake')
        setTimeout(() => {
            cartIcon.classList.remove('cart-shake')
        }, 500)
    }

    function addToCart(name, price, event) {
        if (event) {
            event.stopPropagation()
        }
        const existingItem = cart.items.find(item => item.name === name)
        if (existingItem) {
            existingItem.quantity++
        } else {
            cart.items.push({
                name,
                price,
                quantity: 1,
                section: getItemSection(name)
            })
        }
        updateCart()
        updateCartCounter()
        shakeCart()
    }

    function removeFromCart(name, event) {
        if (event) {
            event.stopPropagation()
        }
        const itemIndex = cart.items.findIndex(item => item.name === name)
        if (itemIndex > -1) {
            if (cart.items[itemIndex].quantity > 1) {
                cart.items[itemIndex].quantity--
            } else {
                cart.items.splice(itemIndex, 1)
            }
        }
        updateCart()
        updateCartCounter()
    }

    function updateCart() {
        const cartItems = document.getElementById('cartItems')
        const cartTotal = document.getElementById('cartTotal')
        
        // Limpiar items actuales
        cartItems.innerHTML = ''
        
        // Agrupar items por seccion
        const sections = {}
        Object.keys(menuSections).forEach(section => {
            sections[section] = []
        })
        
        // Ordenar items en secciones
        cart.items.forEach(item => {
            const section = item.section || getItemSection(item.name)
            sections[section].push(item)
        })
        
        // Crear secciones en el carrito
        Object.entries(sections).forEach(([sectionName, items]) => {
            if (items.length > 0) {
                const sectionElement = document.createElement('div')
                sectionElement.className = 'cart-section'
                
                const sectionTitle = document.createElement('h3')
                sectionTitle.className = 'cart-section-title'
                sectionTitle.textContent = sectionName
                sectionElement.appendChild(sectionTitle)
                
                const sectionItems = document.createElement('div')
                sectionItems.className = 'cart-section-items'
                
                items.forEach(item => {
                    const itemElement = document.createElement('div')
                    itemElement.className = 'cart-item'
                    itemElement.innerHTML = `
                        <div class="cart-item-info">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-price">$${item.price}</div>
                        </div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus-btn" data-name="${item.name}">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn plus-btn" data-name="${item.name}" data-price="${item.price}">+</button>
                        </div>
                    `
                    
                    // Agregar event listeners para los botones de cantidad
                    const minusBtn = itemElement.querySelector('.minus-btn')
                    const plusBtn = itemElement.querySelector('.plus-btn')
                    
                    minusBtn.addEventListener('click', (e) => {
                        removeFromCart(item.name, e)
                    })
                    
                    plusBtn.addEventListener('click', (e) => {
                        addToCart(item.name, item.price, e)
                    })
                    
                    sectionItems.appendChild(itemElement)
                })
                
                sectionElement.appendChild(sectionItems)
                cartItems.appendChild(sectionElement)
            }
        })
        
        // Actualizar total
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        cartTotal.textContent = `$${cart.total.toFixed(2)}`
    }

    // Alternar menu hamburguesa
    burgerMenu.addEventListener('click', function(e) {
        e.stopPropagation()
        this.classList.toggle('active')
        sideMenu.classList.toggle('active')
        menuOpen = !menuOpen
    })

    // Cerrar menu al hacer click afuera
    document.addEventListener('click', function(e) {
        if (menuOpen && !sideMenu.contains(e.target) && e.target !== burgerMenu) {
            burgerMenu.classList.remove('active')
            sideMenu.classList.remove('active')
            menuOpen = false
        }
    })

    // Agregar handlers de click a todos los botones "Elegir"
    document.querySelectorAll('.go-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault()
            const category = e.target.closest('.category')
            const name = category.querySelector('h3').textContent
            const price = 1000 // Precio por defecto, se puede personalizar
            addToCart(name, price)
            
            // Mostrar modal del carrito
            cartModal.classList.add('active')
        })
    })

    // Alternar modal del carrito
    cartIcon.addEventListener('click', (e) => {
        e.stopPropagation()
        toggleCart()
    })

    // Cerrar carrito con boton X
    closeCart.addEventListener('click', (e) => {
        e.stopPropagation()
        cartModal.classList.remove('active')
    })

    // Cerrar carrito al hacer click afuera
    document.addEventListener('click', (e) => {
        if (cartModal.classList.contains('active') && 
            !cartModal.contains(e.target) && 
            !cartIcon.contains(e.target) &&
            !e.target.closest('.go-btn')) {
            cartModal.classList.remove('active')
        }
    })

    // Inicializar contador del carrito
    updateCartCounter()
})
