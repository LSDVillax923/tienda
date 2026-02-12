const cartPageBody = document.getElementById("cart-page-body");
const clearCartPageButton = document.getElementById("clear-cart-page");
const cartStorageKey = "tienda-cart";

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

function getCart() {
  return JSON.parse(localStorage.getItem(cartStorageKey) ?? "[]");
}

function saveCart(cart) {
  localStorage.setItem(cartStorageKey, JSON.stringify(cart));
}

function renderCartPage() {
  const cart = getCart();

  if (cart.length === 0) {
    cartPageBody.innerHTML =
      '<tr><td colspan="7">No hay productos en el carrito.</td></tr>';
    return;
  }

  cartPageBody.innerHTML = "";

  cart.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${item.imagen}" alt="${item.nombre}" class="thumb"></td>
      <td>${item.nombre}</td>
      <td>${formatCurrency(item.precio)}</td>
      <td>${item.categoria}</td>
      <td>${item.talla}</td>
      <td>${item.material}</td>
      <td>${item.cantidad}</td>
    `;

    cartPageBody.appendChild(row);
  });
}

function clearCartPage() {
  saveCart([]);
  renderCartPage();
}

clearCartPageButton.addEventListener("click", clearCartPage);

renderCartPage();