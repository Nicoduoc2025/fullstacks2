const productsData = [
  { Codigo: 'GA001', Categoria: 'Guitarras Acústicas', Nombre: 'Guitarra Acústica Folk', Marca: 'Yamaha', Modelo: 'F310', Stock: 8, Precio: 129990, Imagen: 'imagenes/ACUSTICA.webp' },
  { Codigo: 'GA002', Categoria: 'Guitarras Acústicas', Nombre: 'Guitarra Acústica Dreadnought', Marca: 'Fender', Modelo: 'CD-60S', Stock: 5, Precio: 189990, Imagen: 'imagenes/CD-60S.webp' },
  { Codigo: 'GE001', Categoria: 'Guitarras Eléctricas', Nombre: 'Guitarra Eléctrica Stratocaster', Marca: 'Squier', Modelo: 'Affinity Strat', Stock: 6, Precio: 249990, Imagen: 'imagenes/Affinity Strat.webp' },
  { Codigo: 'BE001', Categoria: 'Bajos Eléctricos', Nombre: 'Bajo Eléctrico 4 Cuerdas', Marca: 'Ibanez', Modelo: 'GSR200', Stock: 7, Precio: 219990, Imagen: 'imagenes/GSR200.webp' },
  { Codigo: 'TC001', Categoria: 'Teclados y Pianos', Nombre: 'Piano Digital 88 Teclas', Marca: 'Casio', Modelo: 'CDP-S110', Stock: 3, Precio: 389990, Imagen: 'imagenes/CDP-S110.webp' },
  { Codigo: 'BT001', Categoria: 'Baterías', Nombre: 'Batería Acústica 5 Cuerpos', Marca: 'Pearl', Modelo: 'Roadshow', Stock: 2, Precio: 529990, Imagen: 'imagenes/Roadshow.webp' },
  { Codigo: 'AM001', Categoria: 'Amplificadores', Nombre: 'Amplificador Guitarra 15W', Marca: 'Marshall', Modelo: 'MG15G', Stock: 9, Precio: 119990, Imagen: 'imagenes/MG15G.webp' },
  { Codigo: 'PD001', Categoria: 'Pedales de Efectos', Nombre: 'Pedal Overdrive Classic', Marca: 'Boss', Modelo: 'SD-1', Stock: 12, Precio: 69990, Imagen: 'imagenes/SD-1.webp' }
];

let currentRole = 'CLIENTE';
let mapInitialized = false;

document.addEventListener('DOMContentLoaded', () => {
  renderCatalog(productsData);
  updateInventoryTable();
  updateUsersTable();
});

function changeRole(role) {
  currentRole = role;
  
  const staffElements = document.querySelectorAll('.staff-only');
  staffElements.forEach(el => {
    el.style.display = (role === 'ADMIN' || role === 'VENDEDOR') ? 'block' : 'none';
  });

  const adminElements = document.querySelectorAll('.admin-only');
  adminElements.forEach(el => {
    el.style.display = (role === 'ADMIN') ? 'block' : 'none';
  });

  if (role === 'CLIENTE') showSection('catalogSection');
}

function showSection(sectionId) {
  document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  
  const targetSection = document.getElementById(sectionId);
  if (targetSection) targetSection.classList.add('active');
  
  if (sectionId === 'mapSection' && !mapInitialized) {
    initMap();
    mapInitialized = true;
  }
}

function toggleMobileMenu() {
  document.getElementById('navLinks').classList.toggle('active');
}

let cart = [];

function renderCatalog(products) {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';

  products.forEach(p => {
    const stockClass = p.Stock > 5 ? 'stock-in' : (p.Stock > 0 ? 'stock-low' : 'stock-out');
    const stockText = p.Stock > 0 ? `${p.Stock} unidades disponibles` : 'Agotado';

    grid.innerHTML += `
      <div class="product-card">
        <div class="product-image-container">
          <img src="${p.Imagen}" alt="${p.Nombre}" class="product-image" loading="lazy">
        </div>
        <div class="product-info">
          <span class="product-category">${p.Categoria}</span>
          <h3 class="product-title">${p.Nombre}</h3>
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 8px;">${p.Marca} ${p.Modelo}</p>
          <div class="product-price">$${p.Precio.toLocaleString('es-CL')} CLP</div>
          <div class="product-stock ${stockClass}">
            <i class="fa-solid fa-box"></i> ${stockText}
          </div>
          <button class="btn-add-cart" onclick="addToCart('${p.Codigo}')" ${p.Stock === 0 ? 'disabled' : ''}>
            <i class="fa-solid fa-cart-plus"></i> Agregar al Carrito
          </button>
        </div>
      </div>
    `;
  });
}

function filterProducts() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const category = document.getElementById('categorySelect').value;

  const filtered = productsData.filter(p => {
    const matchesSearch = p.Nombre.toLowerCase().includes(search) || 
                          p.Marca.toLowerCase().includes(search) || 
                          p.Codigo.toLowerCase().includes(search);
    const matchesCat = category === 'ALL' || p.Categoria === category;
    return matchesSearch && matchesCat;
  });

  renderCatalog(filtered);
}

function addToCart(code) {
  const product = productsData.find(p => p.Codigo === code);
  if (!product || product.Stock <= 0) return;

  const cartItem = cart.find(item => item.Codigo === code);
  if (cartItem) {
    if (cartItem.qty < product.Stock) {
      cartItem.qty++;
    } else {
      alert('Límite de stock alcanzado.');
      return;
    }
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
}

function updateCartUI() {
  document.getElementById('cartBadge').innerText = cart.reduce((sum, item) => sum + item.qty, 0);
  const container = document.getElementById('cartItemsContainer');
  const totalEl = document.getElementById('cartTotalAmount');
  
  container.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = '<p style="text-align:center; padding:20px; color:var(--text-muted);">El carrito está vacío.</p>';
  } else {
    cart.forEach(item => {
      const subtotal = item.Precio * item.qty;
      total += subtotal;
      container.innerHTML += `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid var(--border-color); padding-bottom:8px;">
          <div>
            <strong>${item.Nombre}</strong>
            <div style="font-size:12px; color:var(--text-muted);">$${item.Precio.toLocaleString('es-CL')} x ${item.qty}</div>
          </div>
          <div>
            <strong style="color:var(--accent);">$${subtotal.toLocaleString('es-CL')}</strong>
          </div>
        </div>
      `;
    });
  }

  totalEl.innerText = `$${total.toLocaleString('es-CL')} CLP`;
}

function checkout() {
  if (cart.length === 0) return;

  cart.forEach(cartItem => {
    const prod = productsData.find(p => p.Codigo === cartItem.Codigo);
    if (prod) prod.Stock -= cartItem.qty;
  });

  const orderCode = 'SV-' + Math.floor(1000 + Math.random() * 9000);
  alert(`¡Pedido confirmado!\nCódigo de Pedido: ${orderCode}\n\nEl stock ha sido actualizado.`);

  cart = [];
  updateCartUI();
  toggleModal('cartModal');
  renderCatalog(productsData);
  updateInventoryTable();
}

let usersData = [
  { id: 1, username: 'admin_general', email: 'admin@sonidovivo.cl', role: 'ADMIN', status: 'Activo' },
  { id: 2, username: 'vendedor_vina', email: 'vendedor1@sonidovivo.cl', role: 'VENDEDOR', status: 'Activo' },
  { id: 3, username: 'cliente_demo', email: 'cliente@gmail.com', role: 'CLIENTE', status: 'Activo' }
];

function trackOrder() {
  const code = document.getElementById('trackingInput').value.trim();
  const resultBox = document.getElementById('trackingResult');

  if (!code) return;

  resultBox.style.display = 'block';
  resultBox.innerHTML = `
    <div style="background:var(--primary-card); padding:20px; border-radius:12px; border:1px solid var(--border-color); margin-top:16px;">
      <h3>Pedido: <span style="color:var(--accent);">${code.toUpperCase()}</span></h3>
      <p style="margin:8px 0;"><strong>Método de entrega:</strong> Despacho a Domicilio (Starken)</p>
      <p><strong>Estado Actual:</strong> <span style="color:var(--success); font-weight:bold;">En Preparación / Listo para envío</span></p>
    </div>
  `;
}

function updateInventoryTable() {
  const tbody = document.getElementById('inventoryTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  productsData.forEach(p => {
    tbody.innerHTML += `
      <tr>
        <td><strong>${p.Codigo}</strong></td>
        <td>${p.Nombre} (${p.Marca})</td>
        <td>${p.Categoria}</td>
        <td>$${p.Precio.toLocaleString('es-CL')}</td>
        <td><strong>${p.Stock}</strong></td>
        <td><span class="${p.Stock > 0 ? 'stock-in' : 'stock-out'}">${p.Stock > 0 ? 'Disponible' : 'Agotado'}</span></td>
        <td><button onclick="addStock('${p.Codigo}')" class="btn-action"><i class="fa-solid fa-plus"></i> Reabastecer</button></td>
      </tr>
    `;
  });
}

function addStock(code) {
  const prod = productsData.find(p => p.Codigo === code);
  if (prod) {
    prod.Stock += 5;
    updateInventoryTable();
    renderCatalog(productsData);
  }
}

function updateUsersTable() {
  const tbody = document.getElementById('usersTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  usersData.forEach(u => {
    const statusClass = u.status === 'Activo' ? 'status-active' : 'status-inactive';
    tbody.innerHTML += `
      <tr>
        <td>${u.id}</td>
        <td><strong>${u.username}</strong></td>
        <td>${u.email}</td>
        <td><span class="role-badge">${u.role}</span></td>
        <td><span class="${statusClass}">${u.status}</span></td>
        <td><button onclick="toggleUserStatus(${u.id})" class="btn-action"><i class="fa-solid fa-user-pen"></i> Cambiar Estado</button></td>
      </tr>
    `;
  });
}

function toggleUserStatus(userId) {
  const user = usersData.find(u => u.id === userId);
  if (user) {
    user.status = (user.status === 'Activo') ? 'Inactivo' : 'Activo';
    updateUsersTable();
  }
}

function initMap() {
  const map = L.map('leafletMap').setView([-33.0245, -71.5518], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  L.marker([-33.0245, -71.5518]).addTo(map)
    .bindPopup('<b>Sonido Vivo (Casa Matriz)</b><br>Calle Arlegui #450, Viña del Mar.')
    .openPopup();
}

function toggleModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
  }
}