# Sistema de Remuneraciones - DevSolutions

## Descripción
Sistema integral para la gestión de nóminas, control de tiempos y beneficios de empleados. Desarrollado con PHP, MySQL y Bootstrap 5.

## Características Principales

### 1. Gestión de Nóminas
- Cálculo automático de salarios
- Gestión de horas extras
- Bonificaciones y descuentos
- Generación de recibos de pago

### 2. Control de Tiempos
- Registro de asistencia
- Control de horas trabajadas
- Gestión de vacaciones
- Reportes de asistencia

### 3. Beneficios
- Gestión de seguros
- Planes de retiro
- Bonos y compensaciones
- Prestaciones sociales

## Tecnologías
- PHP 8.0+
- MySQL 5.7+
- Bootstrap 5.3.0
- JavaScript (ES6+)
- HTML5/CSS3

## Estructura del Proyecto
```
sistema_remu/
├── index.html              # Dashboard principal
├── empleados/             # Gestión de empleados
├── tiempos/               # Control de tiempos
├── remuneraciones/        # Gestión de nóminas
├── beneficios/            # Gestión de beneficios
├── informes/              # Generación de reportes
├── configuracion/         # Configuración del sistema
└── assets/                # Recursos estáticos
    ├── css/              # Estilos CSS
    ├── js/               # Scripts JavaScript
    └── img/              # Imágenes
```

## Instalación
1. Clonar el repositorio
2. Configurar base de datos MySQL
3. Importar esquema de base de datos
4. Configurar conexión en `config/database.php`
5. Iniciar servidor web

## Configuración
- Editar `config/config.php` para ajustes generales
- Configurar parámetros de nómina
- Ajustar políticas de beneficios
- Configurar formatos de reportes

## Seguridad
- Autenticación de dos factores
- Encriptación de datos sensibles
- Registro de actividades
- Copias de seguridad automáticas

## Documentación
Ver `docs/` para documentación detallada:
- Manual de usuario
- Guía de instalación
- API documentation
- Troubleshooting