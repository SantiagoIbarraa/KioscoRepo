const cartIcon = document.getElementById("cartIcon")
const cartModal = document.getElementById("cartModal")
const volverBtn = document.querySelector(".volver-btn")

cartIcon.addEventListener("click", () => {
  cartModal.classList.add("open")
})

volverBtn.addEventListener("click", () => {
  cartModal.classList.remove("open")
})

document.addEventListener("click", (e) => {
  if (!cartModal.contains(e.target) && !cartIcon.contains(e.target)) {
    cartModal.classList.remove("open")
  }
})
