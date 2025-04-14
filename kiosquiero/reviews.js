const reviews = [
    {
        id: 1,
        customerName: 'Juan Pérez',
        date: '14/04/2025',
        rating: 5,
        comment: 'Excelente servicio y productos muy frescos',
        orderId: '001',
        pickupTime: '10:30',
        reply: ''
    },
    {
        id: 2,
        customerName: 'María García',
        date: '14/04/2025',
        rating: 4,
        comment: 'Buena atención, pero podrían tener más variedad',
        orderId: '002',
        pickupTime: '11:15',
        reply: 'Gracias por tu comentario. Estamos trabajando en ampliar nuestra variedad de productos'
    },
    {
        id: 3,
        customerName: 'Carlos López',
        date: '13/04/2025',
        rating: 5,
        comment: 'Las ensaladas son muy frescas y sabrosas',
        orderId: '003',
        pickupTime: '14:20',
        reply: ''
    }
]

const reviewsContainer = document.querySelector('.reviews-container')
const reviewDetails = document.getElementById('reviewDetails')
const closeReviewDetails = document.getElementById('closeReviewDetails')
const customerNameElement = document.querySelector('.customer-name')
const reviewDateElement = document.querySelector('.review-date')
const starsElement = document.querySelector('.stars')
const reviewCommentElement = document.querySelector('.review-comment')
const replyTextElement = document.querySelector('.reply-text')
const btnReply = document.getElementById('btnReply')
const replyModal = document.getElementById('replyModal')
const closeReplyModal = document.getElementById('closeReplyModal')
const cancelReply = document.getElementById('cancelReply')
const replyForm = document.getElementById('replyForm')

let currentReviewId = null

document.getElementById('burgerMenu').addEventListener('click', function() {
    this.classList.toggle('active')
    document.getElementById('sideMenu').classList.toggle('active')
})

function renderStars(rating) {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

function formatDate(dateStr) {
    const [day, month, year] = dateStr.split('/')
    return `${day}/${month}/${year}`
}

function renderReviews() {
    reviewsContainer.innerHTML = reviews.map(review => `
        <div class="review-card" data-id="${review.id}">
            <div class="review-header">
                <h3>Pedido ${review.orderId}</h3>
                <p class="date">${formatDate(review.date)}</p>
            </div>
            <div class="rating">
                ${renderStars(review.rating)}
            </div>
            <p class="preview-comment">${review.comment.substring(0, 50)}${review.comment.length > 50 ? '...' : ''}</p>
            ${review.reply ? '<span class="has-reply">✓ Respondido</span>' : ''}
        </div>
    `).join('')

    document.querySelectorAll('.review-card').forEach(card => {
        card.addEventListener('click', () => {
            const reviewId = parseInt(card.dataset.id)
            const review = reviews.find(r => r.id === reviewId)
            showReviewDetails(review)
        })
    })
}

function showReviewDetails(review) {
    currentReviewId = review.id
    customerNameElement.textContent = review.customerName
    reviewDateElement.textContent = formatDate(review.date)
    starsElement.innerHTML = renderStars(review.rating)
    reviewCommentElement.textContent = review.comment
    replyTextElement.textContent = review.reply || 'Sin respuesta'
    reviewDetails.classList.add('active')
}

closeReviewDetails.addEventListener('click', () => {
    reviewDetails.classList.remove('active')
    currentReviewId = null
})

btnReply.addEventListener('click', () => {
    replyModal.classList.add('active')
    const review = reviews.find(r => r.id === currentReviewId)
    if (review && review.reply) {
        document.getElementById('replyText').value = review.reply
    }
})

closeReplyModal.addEventListener('click', () => replyModal.classList.remove('active'))
cancelReply.addEventListener('click', () => replyModal.classList.remove('active'))

replyForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const replyText = document.getElementById('replyText').value
    if (currentReviewId && replyText) {
        const review = reviews.find(r => r.id === currentReviewId)
        if (review) {
            review.reply = replyText
            replyTextElement.textContent = replyText
            replyModal.classList.remove('active')
            renderReviews()
            document.getElementById('replyText').value = ''
        }
    }
})

renderReviews()
