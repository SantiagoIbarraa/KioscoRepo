document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.getElementById('burgerMenu');
    const sideMenu = document.getElementById('sideMenu');
    const orderCards = document.querySelectorAll('.order-card');
    const orderDetails = document.getElementById('orderDetails');
    const closeDetails = document.getElementById('closeDetails');
    const cancelModal = document.getElementById('cancelModal');
    const closeCancelModal = document.getElementById('closeCancelModal');
    const btnCancel = document.querySelector('.btn-cancel');
    const btnBack = document.querySelector('.btn-back');
    const btnConfirmCancel = document.querySelector('.btn-confirm-cancel');
    let menuOpen = false;
    let currentOrderId = null;

    const orders = {
        1: {
            id: 1,
            customer: "Juan Pérez",
            time: "10:30",
            salad: ["Tomate", "Lechuga", "Zanahoria"],
            drinks: ["Sprite (1)", "Agua (1)"],
            notes: ["Sin sal"]
        },
        2: {
            id: 2,
            customer: "María García",
            time: "11:15",
            salad: ["Rúcula", "Tomate cherry", "Queso"],
            drinks: ["Coca Cola (2)"],
            notes: ["Extra queso"]
        },
        3: {
            id: 3,
            customer: "Carlos López",
            time: "11:45",
            salad: ["Espinaca", "Palta", "Pollo"],
            drinks: ["Jugo natural (1)"],
            notes: ["Sin cebolla"]
        },
        4: {
            id: 4,
            customer: "Ana Rodríguez",
            time: "12:00",
            salad: ["Espinaca", "Palta", "Pollo"],
            drinks: ["Jugo natural (1)"],
            notes: ["Sin cebolla"]
        }
    };

    burgerMenu.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        sideMenu.classList.toggle('active');
        menuOpen = !menuOpen;
    });

    document.addEventListener('click', function(e) {
        if (menuOpen && !sideMenu.contains(e.target) && e.target !== burgerMenu) {
            burgerMenu.classList.remove('active');
            sideMenu.classList.remove('active');
            menuOpen = false;
        }
    });

    orderCards.forEach(card => {
        card.addEventListener('click', function() {
            const orderId = this.dataset.id;
            currentOrderId = orderId;
            showOrderDetails(orderId);
        });
    });

    closeDetails.addEventListener('click', function() {
        orderDetails.classList.remove('active');
    });

    btnCancel.addEventListener('click', function() {
        cancelModal.classList.add('active');
    });

    btnBack.addEventListener('click', function() {
        cancelModal.classList.remove('active');
    });

    closeCancelModal.addEventListener('click', function() {
        cancelModal.classList.remove('active');
    });

    btnConfirmCancel.addEventListener('click', function() {
        const reason = document.getElementById('cancelReason').value;
        if (!reason.trim()) {
            alert('Por favor, ingrese un motivo para la cancelación');
            return;
        }
        
        console.log(`Pedido ${currentOrderId} cancelado. Motivo: ${reason}`);
        
        cancelModal.classList.remove('active');
        orderDetails.classList.remove('active');
        document.querySelector(`[data-id="${currentOrderId}"]`).remove();
        
        document.getElementById('cancelReason').value = '';
    });

    function showOrderDetails(orderId) {
        const order = orders[orderId];
        if (!order) return;

        document.querySelector('.order-id').textContent = order.id;
        document.querySelector('.customer-name').textContent = order.customer;
        document.querySelector('.pickup-time').textContent = order.time;

        const saladList = document.querySelector('.salad-items');
        const drinkList = document.querySelector('.drink-items');
        const notesList = document.querySelector('.notes-items');

        saladList.innerHTML = order.salad.map(item => `<li>${item}</li>`).join('');
        drinkList.innerHTML = order.drinks.map(item => `<li>${item}</li>`).join('');
        notesList.innerHTML = order.notes.map(item => `<li>${item}</li>`).join('');

        orderDetails.classList.add('active');
    }

    document.querySelector('.btn-complete').addEventListener('click', function() {
        const orderId = document.querySelector('.order-id').textContent;
        orderDetails.classList.remove('active');
        document.querySelector(`[data-id="${orderId}"]`).remove();
    });

    document.addEventListener('click', function(e) {
        if (orderDetails.classList.contains('active') && 
            !orderDetails.contains(e.target) && 
            !e.target.closest('.order-card')) {
            orderDetails.classList.remove('active');
        }

        if (cancelModal.classList.contains('active') && 
            !cancelModal.querySelector('.modal-content').contains(e.target) &&
            e.target !== btnCancel) {
            cancelModal.classList.remove('active');
        }
    });
});
