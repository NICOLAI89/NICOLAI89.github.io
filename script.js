// const URL_API = "https://fakestoreapi.com/products";// antigua URL de prueba
const URL_API = "https://687afd97abb83744b7ee71c1.mockapi.io/api/v1/productos";
const contenedor = document.getElementById("productos-container");
let carrito = [];

// Intentamos cargar carrito del localStorage
if (localStorage.getItem("carrito")) {
  carrito = JSON.parse(localStorage.getItem("carrito"));
  actualizarContadorCarrito();
}

// Fetch y renderizado de productos
fetch(URL_API)
  .then((res) => res.json())
  .then((data) => renderProductos(data))
  .catch((error) => console.error("Error al obtener productos:", error));

function renderProductos(productos) {
  productos.forEach((producto) => {
    const card = document.createElement("div");
    card.className = "col-md-4 col-lg-3 mb-4";
    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${producto.image}" class="card-img-top p-3" alt="${producto.title}" style="height: 200px; object-fit: contain;">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${producto.title}</h5>
          <p class="card-text fw-bold">$${producto.price}</p>
          <button class="btn btn-primary mt-auto btn-agregar" data-id="${producto.id}">Agregar al carrito</button>
        </div>
      </div>
    `;
    contenedor.appendChild(card);
  });

  // Agregar eventos a los botones
  const botonesAgregar = document.querySelectorAll(".btn-agregar");
  botonesAgregar.forEach((btn) => {
    btn.addEventListener("click", agregarAlCarrito);
  });
}

// Agregar al carrito
function agregarAlCarrito(e) {
  const idProducto = parseInt(e.target.dataset.id);
  const productoCard = e.target.closest(".card");
  const titulo = productoCard.querySelector(".card-title").textContent;
  const precio = parseFloat(productoCard.querySelector(".card-text").textContent.replace("$", ""));
  const imagen = productoCard.querySelector("img").src;

  const producto = { id: idProducto, titulo, precio, imagen, cantidad: 1 };

  const productoExistente = carrito.find((p) => p.id === idProducto);
  if (productoExistente) {
    productoExistente.cantidad++;
  } else {
    carrito.push(producto);
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
  renderCarrito();

}

// Mostrar contador en el ícono del carrito
function actualizarContadorCarrito() {
  const contador = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
  const badge = document.getElementById("carrito-contador");
  if (badge) {
    badge.textContent = contador;
  }
}


function renderCarrito() {
  const contenedorCarrito = document.getElementById("carrito-container");
  contenedorCarrito.innerHTML = "";

  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = "<p class='text-center'>El carrito está vacío.</p>";
    document.getElementById("total-carrito").textContent = "0";
    return;
  }

  let tabla = `
    <table class="table table-striped align-middle">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Precio</th>
          <th>Cantidad</th>
          <th>Subtotal</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
  `;

  carrito.forEach((prod, index) => {
    const subtotal = prod.precio * prod.cantidad;
    tabla += `
      <tr>
        <td><img src="${prod.imagen}" alt="${prod.titulo}" style="height:50px;"> ${prod.titulo}</td>
        <td>$${prod.precio.toFixed(2)}</td>
        <td>
          <input type="number" min="1" value="${prod.cantidad}" data-index="${index}" class="form-control form-control-sm cantidad-input" style="width: 60px;">
        </td>
        <td>$${subtotal.toFixed(2)}</td>
        <td>
          <button class="btn btn-danger btn-sm eliminar-btn" data-index="${index}">Eliminar</button>
        </td>
      </tr>
    `;
  });

  tabla += "</tbody></table>";
  contenedorCarrito.innerHTML = tabla;

  // Total general
  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  document.getElementById("total-carrito").textContent = total.toFixed(2);

  // Eventos
  document.querySelectorAll(".cantidad-input").forEach((input) => {
    input.addEventListener("change", actualizarCantidad);
  });

  document.querySelectorAll(".eliminar-btn").forEach((btn) => {
    btn.addEventListener("click", eliminarProducto);
  });
}

function actualizarCantidad(e) {
  const index = e.target.dataset.index;
  const nuevaCantidad = parseInt(e.target.value);
  if (nuevaCantidad > 0) {
    carrito[index].cantidad = nuevaCantidad;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
    renderCarrito();
  }
}

function eliminarProducto(e) {
  const index = e.target.dataset.index;
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
  renderCarrito();
}

// Mostrar carrito al cargar
renderCarrito();


const finalizarBtn = document.getElementById("finalizar-compra");
if (finalizarBtn) {
  finalizarBtn.addEventListener("click", finalizarCompra);
}

function finalizarCompra() {
  if (carrito.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Tu carrito está vacío',
      confirmButtonText: 'Ok'
    });
    return;
  }

  Swal.fire({
    icon: 'success',
    title: '¡Compra realizada!',
    text: 'Gracias por confiar en NGM Bots. Recibirás un email con los pasos a seguir.',
    confirmButtonText: 'Cerrar'
  });

  carrito = [];
  localStorage.removeItem("carrito");
  actualizarContadorCarrito();
  renderCarrito();
}
// Mostrar carrito al cargar

// Validación del formulario de contacto
// Validación del formulario con SweetAlert2
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formulario-contacto");

  if (form) {
    form.addEventListener("submit", function (e) {
      const nombre = document.getElementById("nombre").value.trim();
      const email = document.getElementById("email").value.trim();
      const mensaje = document.getElementById("mensaje").value.trim();

      if (!nombre || !email || !mensaje) {
        e.preventDefault();
        Swal.fire({
          icon: 'warning',
          title: 'Campos incompletos',
          text: 'Por favor, completá todos los campos del formulario.',
          confirmButtonText: 'Ok'
        });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        e.preventDefault();
        Swal.fire({
          icon: 'error',
          title: 'Correo inválido',
          text: 'Por favor, ingresá un correo electrónico válido.',
          confirmButtonText: 'Ok'
        });
        return;
      }

      // (Opcional) Mensaje de envío correcto antes de redirigir (no bloquea el envío)
      // Swal.fire({
      //   icon: 'success',
      //   title: 'Formulario enviado',
      //   text: 'Gracias por contactarnos',
      //   timer: 2000,
      //   showConfirmButton: false
      // });
    });
  }
});
// Validación del formulario de contacto