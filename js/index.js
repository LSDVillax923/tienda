const initialProducts = [
  {
    id: crypto.randomUUID(),
    nombre: "Camiseta Visitante Bruma Umbro 2026",
    precio: 220000,
    imagen: "../images/blanca.jpg",
    categoria: "Camiseta oficial",
    talla: "S - XL",
    material: "Poliéster",
  },
  {
    id: crypto.randomUUID(),
    nombre: "Camiseta Negra Edición Especial 2026",
    precio: 210000,
    imagen: "../images/negra.webp",
    categoria: "Camiseta edición",
    talla: "M - XL",
    material: "Microfibra",
  },
  {
    id: crypto.randomUUID(),
    nombre: "Camiseta Tercera Equipación Oro 2026",
    precio: 230000,
    imagen: "../images/oro.webp",
    categoria: "Camiseta oficial",
    talla: "S - XXL",
    material: "Poliéster reciclado",
  },
  {
    id: crypto.randomUUID(),
    nombre: "Camiseta de Entrenamiento 2026",
    precio: 180000,
    imagen: "../images/entreno.webp",
    categoria: "Entrenamiento",
    talla: "S - L",
    material: "Dry-fit",
  },
  {
    id: crypto.randomUUID(),
    nombre: "Chaqueta Oficial Deportes Tolima 2026",
    precio: 260000,
    imagen: "../images/chaqueta.webp",
    categoria: "Chaqueta",
    talla: "M - XXL",
    material: "Algodón y poliéster",
  },
  {
    id: crypto.randomUUID(),
    nombre: "Camiseta Local Vinotinto 2026",
    precio: 220000,
    imagen: "../images/vinotinto.jpg",
    categoria: "Camiseta oficial",
    talla: "S - XXL",
    material: "Poliéster",
  },
];

const productContainer = document.getElementById("productos");
const previewBody = document.getElementById("cart-preview-body");
const cartCount = document.getElementById("cart-count");
const clearCartButton = document.getElementById("clear-cart");
const articleForm = document.getElementById("article-form");

const cartStorageKey = "tienda-cart";
let products = [...initialProducts];

function normalizeImageUrl(rawUrl) {
  const trimmedUrl = String(rawUrl ?? "").trim();
  if (!trimmedUrl) return "";

  try {
    const parsedUrl = new URL(trimmedUrl);
    const isGoogleImageRedirect =
      parsedUrl.hostname.includes("google.") && parsedUrl.pathname === "/imgres";

    if (!isGoogleImageRedirect) return parsedUrl.toString();

    const redirectedImageUrl = parsedUrl.searchParams.get("imgurl");
    if (!redirectedImageUrl) return parsedUrl.toString();

    return decodeURIComponent(redirectedImageUrl);
  } catch {
    return trimmedUrl;
  }
}

function getSafeImageUrl(url) {
  return normalizeImageUrl(url) || "../images/tienda_vyo_85x@2x.avif";
}

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

function renderProducts() {
  productContainer.innerHTML = "";

  products.forEach((product) => {
    const imageUrl = getSafeImageUrl(product.imagen);
    const card = document.createElement("article");
    card.className = "venta";
    card.innerHTML = `
      <img src="${imageUrl}" alt="${product.nombre}">
      <h3>${product.nombre}</h3>
      <p><strong>${formatCurrency(product.precio)}</strong></p>
      <ul>
        <li><strong>Categoría:</strong> ${product.categoria}</li>
        <li><strong>Talla:</strong> ${product.talla}</li>
        <li><strong>Material:</strong> ${product.material}</li>
      </ul>
      <button type="button" data-id="${product.id}">Agregar al carrito</button>
    `;

    const addButton = card.querySelector("button");
    addButton.addEventListener("click", () => addToCart(product.id));

    productContainer.appendChild(card);
  });
}

function renderCartPreview() {
  const cart = getCart();
  const itemCount = cart.reduce((total, item) => total + item.cantidad, 0);
  cartCount.textContent = itemCount;

  if (cart.length === 0) {
    previewBody.innerHTML = '<tr><td colspan="4">No hay productos en el carrito.</td></tr>';
    return;
  }

  previewBody.innerHTML = "";
  cart.forEach((item) => {
    const imageUrl = getSafeImageUrl(item.imagen);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${imageUrl}" alt="${item.nombre}" class="thumb"></td>
      <td>${item.nombre}</td>
      <td>${formatCurrency(item.precio)}</td>
      <td>${item.cantidad}</td>
    `;
    previewBody.appendChild(row);
  });
}

function addToCart(productId) {
  const selectedProduct = products.find((product) => product.id === productId);
  if (!selectedProduct) return;

  const cart = getCart();
  const existing = cart.find((item) => item.id === selectedProduct.id);

  if (!existing) {
    cart.push({ ...selectedProduct, cantidad: 1 });
  } else {
    existing.cantidad += 1;
  }

  saveCart(cart);
  renderCartPreview();
}

function clearCart() {
  saveCart([]);
  renderCartPreview();
}

articleForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(articleForm);
  const precio = Number(formData.get("precio"));

  if (precio < 1000) {
    alert("El precio debe ser igual o mayor a 1.000 COP.");
    return;
  }

  const newProduct = {
    id: crypto.randomUUID(),
    nombre: String(formData.get("nombre") ?? "").trim(),
    precio,
        imagen: normalizeImageUrl(formData.get("imagen")),
    categoria: String(formData.get("categoria") ?? "").trim(),
    talla: String(formData.get("talla") ?? "").trim(),
    material: String(formData.get("material") ?? "").trim(),
  };

   if (!newProduct.imagen) {
    alert("Agrega una URL de imagen válida.");
    return;
  }
  
  products.push(newProduct);
  renderProducts();
  articleForm.reset();
});

clearCartButton.addEventListener("click", clearCart);

renderProducts();
renderCartPreview();