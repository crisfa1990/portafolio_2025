# Portafolio Web DevSolutions

## Descripción General
Este proyecto es un portafolio web moderno y responsivo para DevSolutions, una empresa de desarrollo web y aplicaciones. El sitio está construido con HTML5, CSS3, JavaScript y Bootstrap 5, ofreciendo una experiencia de usuario optimizada tanto en dispositivos móviles como de escritorio.

## Estructura del Proyecto
```
Portafolio_web/
├── index.html              # Página principal del portafolio
├── styles.css              # Estilos personalizados
├── script.js               # Funcionalidades JavaScript
├── sistema_medico/         # Proyecto de sistema médico
├── sistema_venta_cfs/      # Proyecto de sistema de ventas
└── sistema_gestion/        # Proyecto de sistema de gestión
```

## Características Principales

### 1. Diseño Responsivo
- Adaptable a todos los tamaños de pantalla
- Uso de Bootstrap 5 para el sistema de grid
- Breakpoints optimizados para móvil, tablet y escritorio

### 2. Modo Oscuro
- Implementación de un toggle para cambiar entre modo claro y oscuro
- Persistencia de la preferencia usando localStorage
- Paleta de colores optimizada para ambos modos

### 3. Secciones Principales
- Hero Section con animaciones
- Servicios con tarjetas interactivas
- Portafolio con efecto hover
- Testimonios con diseño de tarjetas
- FAQ con acordeón interactivo
- Formulario de contacto

## Tecnologías Utilizadas

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5.3.0
- Bootstrap Icons
- Google Fonts (Inter)

### Características CSS
```css
/* Variables de color */
:root {
    --primary-color: #0d6efd;
    --dark-bg: #121212;
    --dark-text: #e0e0e0;
    --dark-card: #1e1e1e;
}

/* Animaciones */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* Media Queries */
@media (max-width: 768px) {
    /* Estilos para móvil */
}

@media (min-width: 769px) and (max-width: 1024px) {
    /* Estilos para tablet */
}

@media (min-width: 1025px) {
    /* Estilos para escritorio */
}
```

### Funcionalidades JavaScript
```javascript
// Modo Oscuro
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    // Persistencia en localStorage
}

// Animaciones de Scroll
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    // Implementación de Intersection Observer
}

// Validación de Formulario
function validateContactForm() {
    // Validación de campos y envío
}
```

## Estructura HTML

### Navbar
- Logo y marca
- Menú de navegación responsivo
- Botón de modo oscuro
- Iconos de Bootstrap

### Hero Section
- Título principal animado
- Descripción
- Botones de llamada a la acción
- Estadísticas destacadas
- Imagen principal

### Sección de Servicios
- Tarjetas con iconos
- Descripciones detalladas
- Efectos hover
- Diseño en grid

### Portafolio
- Grid de proyectos
- Efectos hover con overlay
- Información detallada
- Enlaces a proyectos

### FAQ
- Acordeón interactivo
- Diseño en dos columnas
- Iconos descriptivos
- Contenido organizado

## Modo Oscuro - Implementación

### Colores
```css
.dark-mode {
    background-color: #121212;
    color: #e0e0e0;
}

/* Ajustes específicos */
.dark-mode .text-primary {
    color: #64b5f6 !important;
}

.dark-mode .card {
    background-color: #1e1e1e;
    border: 1px solid #333;
}
```

### Persistencia
```javascript
// Guardar preferencia
localStorage.setItem('darkMode', 'enabled');

// Cargar preferencia
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
}
```

## Optimizaciones

### Rendimiento
- Lazy loading para imágenes
- Minificación de archivos CSS y JS
- Optimización de assets

### SEO
- Meta tags optimizados
- Estructura semántica HTML
- Títulos y descripciones relevantes

### Accesibilidad
- ARIA labels
- Contraste de colores optimizado
- Navegación por teclado
- Textos alternativos

## Instalación y Uso

1. Clonar el repositorio
```bash
git clone [url-del-repositorio]
```

2. Abrir el proyecto
```bash
cd Portafolio_web
```

3. Iniciar servidor local
```bash
# Usando Python
python -m http.server

# O usando Node.js
npx serve
```