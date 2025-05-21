/**
 * landing_crisfa - JavaScript
 * 
 * @author Cristian Farías
 * @copyright 2024 Cristian Farías
 * @license MIT
 * 
 * Este archivo contiene toda la lógica de interacción y animaciones
 * para el portafolio web landing_crisfa.
 */

// Variables globales
const SCROLL_THROTTLE_MS = 100;
let lastScrollTime = 0;

// Configuración
const config = {
    animationDelay: 100,
    scrollThreshold: 50,
    hoverScale: 1.05,
    hoverLift: -3
};

// Funciones de utilidad
const throttle = (callback, delay) => {
    let lastCall = 0;
    return function (...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) return;
        lastCall = now;
        return callback(...args);
    };
};

const isElementInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

// Funciones de animación
const animateElement = (element, animationClass) => {
    if (!element.classList.contains(animationClass)) {
        element.classList.add(animationClass);
    }
};

const checkElementVisibility = (elements, animationClass) => {
    elements.forEach(element => {
        if (isElementInViewport(element)) {
            animateElement(element, animationClass);
        }
    });
};

// Funciones de interacción
const handleNavbarScroll = () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > config.scrollThreshold) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
};

const handleScrollAnimations = () => {
    const now = Date.now();
    if (now - lastScrollTime < SCROLL_THROTTLE_MS) return;
    lastScrollTime = now;

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    checkElementVisibility(animatedElements, 'animated');

    const dividers = document.querySelectorAll('.section-divider');
    checkElementVisibility(dividers, 'animated');

    const titles = document.querySelectorAll('section h2');
    checkElementVisibility(titles, 'animated');
};

const handleHoverEffect = (event, element, scale = config.hoverScale, lift = config.hoverLift) => {
    const isHover = event.type === 'mouseenter';
    element.style.transform = isHover 
        ? `translateY(${lift}px) scale(${scale})`
        : 'translateY(0) scale(1)';
    
    if (element.classList.contains('nav-link')) {
        element.style.textShadow = isHover 
            ? '0 0 10px rgba(255, 255, 255, 0.5)'
            : 'none';
    }
};

const handleFormSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    
    form.classList.add('form-submitted');
    submitButton.disabled = true;
    
    setTimeout(() => {
        form.classList.remove('form-submitted');
        form.classList.add('form-success');
        submitButton.disabled = false;
        
        setTimeout(() => {
            form.reset();
            form.classList.remove('form-success');
        }, 2000);
    }, 1500);
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Configurar eventos de scroll
    window.addEventListener('scroll', throttle(handleNavbarScroll, 100));
    window.addEventListener('scroll', throttle(handleScrollAnimations, 100));
    
    // Configurar eventos del navbar
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const navLinks = navbar.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            ['mouseenter', 'mouseleave'].forEach(eventType => {
                link.addEventListener(eventType, (e) => handleHoverEffect(e, link));
            });
        });
    }
    
    // Configurar eventos de formulario
    const contactForm = document.querySelector('#contacto form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Inicializar animaciones
    handleScrollAnimations();
    handleNavbarScroll();
    
    // Animar título principal
    const mainTitle = document.querySelector('#inicio h1');
    if (mainTitle) {
        const text = mainTitle.textContent;
        mainTitle.textContent = '';
        [...text].forEach((letter, index) => {
            const span = document.createElement('span');
            span.textContent = letter;
            span.classList.add('title-letter');
            span.style.animationDelay = `${index * 0.1}s`;
            mainTitle.appendChild(span);
        });
    }
});

// Optimización de rendimiento
window.addEventListener('load', () => {
    // Precargar imágenes críticas
    const criticalImages = document.querySelectorAll('img[data-src]');
    criticalImages.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
    });
    
    // Inicializar lazy loading para imágenes no críticas
    if ('loading' in HTMLImageElement.prototype) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback para navegadores que no soportan lazy loading nativo
        const lazyLoadScript = document.createElement('script');
        lazyLoadScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(lazyLoadScript);
    }
}); 