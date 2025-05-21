// Script para Sistema POS

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar tooltips de Bootstrap
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Inicializar popovers de Bootstrap
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Animación para las tarjetas al cargar la página
    animateCards();

    // Funcionalidad para el punto de venta
    initPOS();

    // Funcionalidad para la gestión de inventario
    initInventory();

    // Funcionalidad para la gestión de usuarios
    initUserManagement();

    // Funcionalidad para la revisión de ventas
    initSalesReview();

    // Funcionalidad para finalizar compra
    initCheckout();
});

// Función para animar las tarjetas al cargar la página
function animateCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });
}

// Funcionalidad para el punto de venta
function initPOS() {
    // Verificar si estamos en la página de punto de venta
    if (!document.querySelector('.container-fluid')) return;

    // Funcionalidad para agregar productos
    const addProductBtn = document.querySelector('.btn-primary');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            const productInput = document.querySelector('input[placeholder="Escanear código o ingresar nombre/código"]');
            if (productInput && productInput.value.trim() !== '') {
                addProductToCart(productInput.value);
                productInput.value = '';
                
                // Animación de éxito
                showNotification('Producto agregado al carrito', 'success');
            }
        });
    }

    // Funcionalidad para calcular totales
    const calculateBtn = document.querySelector('.btn-success');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            calculateTotals();
        });
    }

    // Funcionalidad para aplicar descuentos
    const discountButtons = document.querySelectorAll('.btn-warning');
    discountButtons.forEach(button => {
        button.addEventListener('click', function() {
            const discount = this.textContent;
            applyDiscount(discount);
            
            // Animación de descuento aplicado
            this.classList.add('pulse-animation');
            setTimeout(() => {
                this.classList.remove('pulse-animation');
            }, 1000);
        });
    });

    // Funcionalidad para calcular vuelto
    const cashInput = document.querySelector('input[placeholder="Monto Recibido"]');
    if (cashInput) {
        cashInput.addEventListener('input', function() {
            calculateChange(this.value);
        });
    }
}

// Función para agregar producto al carrito
function addProductToCart(productCode) {
    // Simulación de agregar producto
    const tbody = document.querySelector('tbody');
    if (tbody) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${productCode}</td>
            <td>
                <input type="number" class="form-control form-control-sm" value="1" min="1" style="width: 70px;">
            </td>
            <td>$100.00</td>
            <td>$100.00</td>
            <td>
                <button class="btn btn-outline-danger btn-sm">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        
        // Animación de entrada
        newRow.style.opacity = '0';
        newRow.style.transform = 'translateX(-20px)';
        newRow.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        tbody.appendChild(newRow);
        
        setTimeout(() => {
            newRow.style.opacity = '1';
            newRow.style.transform = 'translateX(0)';
        }, 50);
        
        // Agregar evento para eliminar producto
        const deleteBtn = newRow.querySelector('.btn-outline-danger');
        deleteBtn.addEventListener('click', function() {
            // Animación de salida
            newRow.style.opacity = '0';
            newRow.style.transform = 'translateX(20px)';
            
            setTimeout(() => {
                tbody.removeChild(newRow);
                calculateTotals();
            }, 300);
        });
        
        // Agregar evento para actualizar cantidad
        const quantityInput = newRow.querySelector('input[type="number"]');
        quantityInput.addEventListener('change', function() {
            const price = 100;
            const quantity = parseInt(this.value);
            const subtotal = price * quantity;
            
            newRow.children[3].textContent = `$${subtotal.toFixed(2)}`;
            calculateTotals();
        });
    }
}

// Función para calcular totales
function calculateTotals() {
    const rows = document.querySelectorAll('tbody tr');
    let subtotal = 0;
    
    rows.forEach(row => {
        const rowSubtotal = parseFloat(row.children[3].textContent.replace('$', ''));
        subtotal += rowSubtotal;
    });
    
    const iva = subtotal * 0.19;
    const total = subtotal + iva;
    
    // Actualizar valores en la interfaz
    const subtotalElement = document.querySelector('.d-flex.justify-content-between.mb-2 span:last-child');
    const ivaElement = document.querySelector('.d-flex.justify-content-between.mb-2:nth-child(2) span:last-child');
    const totalElement = document.querySelector('.display-6');
    
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (ivaElement) ivaElement.textContent = `$${iva.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
    
    // Animación de actualización
    [subtotalElement, ivaElement, totalElement].forEach(el => {
        if (el) {
            el.classList.add('highlight-animation');
            setTimeout(() => {
                el.classList.remove('highlight-animation');
            }, 1000);
        }
    });
}

// Función para aplicar descuento
function applyDiscount(discount) {
    const discountValue = parseInt(discount) / 100;
    const subtotalElement = document.querySelector('.d-flex.justify-content-between.mb-2 span:last-child');
    const totalElement = document.querySelector('.display-6');
    
    if (subtotalElement && totalElement) {
        const subtotal = parseFloat(subtotalElement.textContent.replace('$', ''));
        const discountAmount = subtotal * discountValue;
        const newTotal = subtotal - discountAmount + (subtotal - discountAmount) * 0.19;
        
        totalElement.textContent = `$${newTotal.toFixed(2)}`;
        
        // Mostrar notificación de descuento
        showNotification(`Descuento de ${discount} aplicado`, 'info');
    }
}

// Función para calcular vuelto
function calculateChange(amountReceived) {
    const totalElement = document.querySelector('.display-6');
    const changeElement = document.querySelector('.alert-info');
    
    if (totalElement && changeElement) {
        const total = parseFloat(totalElement.textContent.replace('$', ''));
        const amount = parseFloat(amountReceived) || 0;
        const change = amount - total;
        
        if (change >= 0) {
            changeElement.textContent = `Vuelto: $${change.toFixed(2)}`;
            changeElement.classList.remove('alert-danger');
            changeElement.classList.add('alert-success');
        } else {
            changeElement.textContent = `Falta: $${Math.abs(change).toFixed(2)}`;
            changeElement.classList.remove('alert-success');
            changeElement.classList.add('alert-danger');
        }
    }
}

// Funcionalidad para la gestión de inventario
function initInventory() {
    // Verificar si estamos en la página de gestión de inventario
    if (!document.querySelector('.container.py-4')) return;

    // Funcionalidad para editar stock
    const editButtons = document.querySelectorAll('[data-bs-target="#editarStockModal"]');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const productName = row.children[1].textContent;
            const currentStock = row.children[3].textContent;
            const minStock = row.children[4].textContent;
            
            const modal = document.getElementById('editarStockModal');
            if (modal) {
                const productInput = modal.querySelector('input[readonly]');
                const stockInput = modal.querySelector('input[type="number"]:first-of-type');
                const minStockInput = modal.querySelector('input[type="number"]:last-of-type');
                
                if (productInput) productInput.value = productName;
                if (stockInput) stockInput.value = currentStock;
                if (minStockInput) minStockInput.value = minStock;
            }
        });
    });

    // Funcionalidad para guardar cambios en el stock
    const saveStockBtn = document.querySelector('#editarStockModal .btn-primary');
    if (saveStockBtn) {
        saveStockBtn.addEventListener('click', function() {
            const modal = document.getElementById('editarStockModal');
            const stockInput = modal.querySelector('input[type="number"]:first-of-type');
            const minStockInput = modal.querySelector('input[type="number"]:last-of-type');
            
            if (stockInput && minStockInput) {
                const newStock = parseInt(stockInput.value);
                const newMinStock = parseInt(minStockInput.value);
                
                // Actualizar la fila en la tabla
                const activeRow = document.querySelector('tr.active-row');
                if (activeRow) {
                    activeRow.children[3].textContent = newStock;
                    activeRow.children[4].textContent = newMinStock;
                    
                    // Actualizar el estado del stock
                    const statusCell = activeRow.children[6];
                    if (newStock > newMinStock * 1.5) {
                        statusCell.innerHTML = '<span class="badge bg-success">Stock Alto</span>';
                    } else if (newStock > newMinStock) {
                        statusCell.innerHTML = '<span class="badge bg-warning">Stock Medio</span>';
                    } else {
                        statusCell.innerHTML = '<span class="badge bg-danger">Stock Bajo</span>';
                    }
                    
                    // Cerrar el modal
                    const modalInstance = bootstrap.Modal.getInstance(modal);
                    modalInstance.hide();
                    
                    // Mostrar notificación
                    showNotification('Stock actualizado correctamente', 'success');
                }
            }
        });
    }

    // Marcar la fila activa al abrir el modal
    const editStockModal = document.getElementById('editarStockModal');
    if (editStockModal) {
        editStockModal.addEventListener('show.bs.modal', function() {
            const editButton = document.activeElement;
            const row = editButton.closest('tr');
            
            // Remover clase activa de todas las filas
            document.querySelectorAll('tr.active-row').forEach(r => {
                r.classList.remove('active-row');
            });
            
            // Agregar clase activa a la fila seleccionada
            row.classList.add('active-row');
        });
    }
}

// Funcionalidad para la gestión de usuarios
function initUserManagement() {
    // Verificar si estamos en la página de gestión de usuarios
    if (!document.querySelector('.container.py-4')) return;

    // Funcionalidad para agregar usuario
    const addUserBtn = document.querySelector('#agregarUsuarioModal .btn-success');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', function() {
            const modal = document.getElementById('agregarUsuarioModal');
            const form = modal.querySelector('form');
            const nameInput = form.querySelector('input[type="text"]');
            const emailInput = form.querySelector('input[type="email"]');
            const roleSelect = form.querySelector('select');
            const passwordInput = form.querySelector('input[type="password"]:first-of-type');
            const confirmPasswordInput = form.querySelector('input[type="password"]:last-of-type');
            
            if (nameInput && emailInput && roleSelect && passwordInput && confirmPasswordInput) {
                if (passwordInput.value !== confirmPasswordInput.value) {
                    showNotification('Las contraseñas no coinciden', 'danger');
                    return;
                }
                
                // Simulación de agregar usuario
                const tbody = document.querySelector('tbody');
                if (tbody) {
                    const newRow = document.createElement('tr');
                    const userId = `U${String(tbody.children.length + 1).padStart(3, '0')}`;
                    const role = roleSelect.value;
                    let roleBadge = '';
                    
                    if (role === 'admin') {
                        roleBadge = '<span class="badge bg-primary">Administrador</span>';
                    } else if (role === 'cajero') {
                        roleBadge = '<span class="badge bg-info">Cajero</span>';
                    } else {
                        roleBadge = '<span class="badge bg-secondary">Inventario</span>';
                    }
                    
                    newRow.innerHTML = `
                        <td>${userId}</td>
                        <td>${nameInput.value}</td>
                        <td>${emailInput.value}</td>
                        <td>${roleBadge}</td>
                        <td><span class="badge bg-success">Activo</span></td>
                        <td>${new Date().toLocaleString()}</td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#editarUsuarioModal">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    `;
                    
                    // Animación de entrada
                    newRow.style.opacity = '0';
                    newRow.style.transform = 'translateY(20px)';
                    newRow.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    
                    tbody.appendChild(newRow);
                    
                    setTimeout(() => {
                        newRow.style.opacity = '1';
                        newRow.style.transform = 'translateY(0)';
                    }, 50);
                    
                    // Agregar evento para eliminar usuario
                    const deleteBtn = newRow.querySelector('.btn-outline-danger');
                    deleteBtn.addEventListener('click', function() {
                        // Animación de salida
                        newRow.style.opacity = '0';
                        newRow.style.transform = 'translateY(-20px)';
                        
                        setTimeout(() => {
                            tbody.removeChild(newRow);
                            showNotification('Usuario eliminado correctamente', 'success');
                        }, 300);
                    });
                    
                    // Agregar evento para editar usuario
                    const editBtn = newRow.querySelector('.btn-outline-primary');
                    editBtn.addEventListener('click', function() {
                        // Marcar la fila activa
                        document.querySelectorAll('tr.active-row').forEach(r => {
                            r.classList.remove('active-row');
                        });
                        newRow.classList.add('active-row');
                    });
                    
                    // Cerrar el modal
                    const modalInstance = bootstrap.Modal.getInstance(modal);
                    modalInstance.hide();
                    
                    // Limpiar el formulario
                    form.reset();
                    
                    // Mostrar notificación
                    showNotification('Usuario agregado correctamente', 'success');
                }
            }
        });
    }

    // Funcionalidad para editar usuario
    const editUserBtn = document.querySelector('#editarUsuarioModal .btn-primary');
    if (editUserBtn) {
        editUserBtn.addEventListener('click', function() {
            const modal = document.getElementById('editarUsuarioModal');
            const form = modal.querySelector('form');
            const nameInput = form.querySelector('input[type="text"]');
            const emailInput = form.querySelector('input[type="email"]');
            const roleSelect = form.querySelector('select:first-of-type');
            const statusSelect = form.querySelector('select:last-of-type');
            
            if (nameInput && emailInput && roleSelect && statusSelect) {
                // Actualizar la fila en la tabla
                const activeRow = document.querySelector('tr.active-row');
                if (activeRow) {
                    activeRow.children[1].textContent = nameInput.value;
                    activeRow.children[2].textContent = emailInput.value;
                    
                    // Actualizar el rol
                    const role = roleSelect.value;
                    let roleBadge = '';
                    
                    if (role === 'admin') {
                        roleBadge = '<span class="badge bg-primary">Administrador</span>';
                    } else if (role === 'cajero') {
                        roleBadge = '<span class="badge bg-info">Cajero</span>';
                    } else {
                        roleBadge = '<span class="badge bg-secondary">Inventario</span>';
                    }
                    
                    activeRow.children[3].innerHTML = roleBadge;
                    
                    // Actualizar el estado
                    const status = statusSelect.value;
                    if (status === 'activo') {
                        activeRow.children[4].innerHTML = '<span class="badge bg-success">Activo</span>';
                    } else {
                        activeRow.children[4].innerHTML = '<span class="badge bg-danger">Inactivo</span>';
                    }
                    
                    // Cerrar el modal
                    const modalInstance = bootstrap.Modal.getInstance(modal);
                    modalInstance.hide();
                    
                    // Mostrar notificación
                    showNotification('Usuario actualizado correctamente', 'success');
                }
            }
        });
    }

    // Funcionalidad para eliminar usuario
    const deleteButtons = document.querySelectorAll('.btn-outline-danger');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            
            // Animación de salida
            row.style.opacity = '0';
            row.style.transform = 'translateY(-20px)';
            row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            
            setTimeout(() => {
                row.parentNode.removeChild(row);
                showNotification('Usuario eliminado correctamente', 'success');
            }, 300);
        });
    });
}

// Funcionalidad para la revisión de ventas
function initSalesReview() {
    // Verificar si estamos en la página de revisión de ventas
    if (!document.querySelector('.container.py-4')) return;

    // Funcionalidad para ver detalles de venta
    const viewDetailsButtons = document.querySelectorAll('[data-bs-toggle="collapse"]');
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-bs-target');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Alternar la visibilidad del detalle
                if (targetElement.classList.contains('show')) {
                    targetElement.classList.remove('show');
                    this.innerHTML = '<i class="bi bi-eye"></i> Ver Detalle';
                } else {
                    targetElement.classList.add('show');
                    this.innerHTML = '<i class="bi bi-eye-slash"></i> Ocultar Detalle';
                }
            }
        });
    });

    // Funcionalidad para filtrar ventas
    const filterForm = document.querySelector('form');
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulación de filtrado
            const rows = document.querySelectorAll('tbody tr:not([colspan="6"])');
            rows.forEach(row => {
                const saleId = row.children[0].textContent;
                const client = row.children[2].textContent;
                const status = row.children[4].querySelector('.badge').textContent;
                
                // Mostrar todas las filas
                row.style.display = '';
                
                // Ocultar filas que no coinciden con los filtros
                if (saleId !== 'V001' && client !== 'Juan Pérez' && status !== 'Completada') {
                    row.style.display = 'none';
                }
            });
            
            showNotification('Filtros aplicados correctamente', 'info');
        });
    }
}

// Funcionalidad para finalizar compra
function initCheckout() {
    // Verificar si estamos en la página de finalizar compra
    if (!document.querySelector('.container.py-4')) return;

    // Funcionalidad para seleccionar método de envío
    const shippingRadios = document.querySelectorAll('input[name="envio"]');
    const addressTextarea = document.querySelector('textarea[disabled]');
    
    shippingRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.id === 'domicilio') {
                addressTextarea.disabled = false;
                addressTextarea.placeholder = 'Ingrese la dirección de envío';
            } else {
                addressTextarea.disabled = true;
                addressTextarea.value = '';
                addressTextarea.placeholder = '';
            }
        });
    });

    // Funcionalidad para seleccionar método de pago
    const paymentButtons = document.querySelectorAll('.d-grid .btn-outline-primary');
    paymentButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase activa de todos los botones
            paymentButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-outline-primary');
            });
            
            // Agregar clase activa al botón seleccionado
            this.classList.remove('btn-outline-primary');
            this.classList.add('btn-primary');
            this.classList.add('active');
            
            // Mostrar notificación
            const paymentMethod = this.textContent.trim();
            showNotification(`Método de pago seleccionado: ${paymentMethod}`, 'info');
        });
    });

    // Funcionalidad para confirmar compra
    const confirmButton = document.querySelector('.btn-success.btn-lg');
    if (confirmButton) {
        confirmButton.addEventListener('click', function() {
            // Simulación de confirmación de compra
            showNotification('Compra finalizada correctamente', 'success');
            
            // Redirigir a la página de revisión de ventas
            setTimeout(() => {
                window.location.href = 'revisar-ventas.html';
            }, 2000);
        });
    }
}

// Función para mostrar notificaciones
function showNotification(message, type) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification`;
    notification.innerHTML = `
        <i class="bi bi-info-circle"></i> ${message}
    `;
    
    // Agregar estilos para la notificación
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100px)';
    notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // Agregar la notificación al body
    document.body.appendChild(notification);
    
    // Mostrar la notificación con animación
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Ocultar la notificación después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        
        // Eliminar la notificación del DOM después de la animación
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Agregar estilos CSS para animaciones
const style = document.createElement('style');
style.textContent = `
    /* Animación de pulso para botones */
    .pulse-animation {
        animation: pulse 1s;
    }
    
    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
        }
    }
    
    /* Animación de resaltado para valores actualizados */
    .highlight-animation {
        animation: highlight 1s;
    }
    
    @keyframes highlight {
        0% {
            background-color: rgba(255, 255, 0, 0.5);
        }
        100% {
            background-color: transparent;
        }
    }
    
    /* Estilo para fila activa */
    .active-row {
        background-color: rgba(13, 110, 253, 0.1) !important;
    }
    
    /* Estilo para notificaciones */
    .notification {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
`;
document.head.appendChild(style); 