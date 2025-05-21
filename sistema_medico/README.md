# Sistema Médico - DevSolutions

## Descripción
Sistema integral para la gestión de pacientes, citas y expedientes médicos. Desarrollado con PHP, MySQL y Bootstrap 5.

## Características Principales

### 1. Gestión de Pacientes
- Registro y actualización de información
- Historial médico completo
- Documentación digital
- Seguimiento de tratamientos

### 2. Sistema de Citas
- Agenda médica
- Recordatorios automáticos
- Gestión de horarios
- Cancelaciones y reprogramaciones

### 3. Expedientes Médicos
- Historial clínico digital
- Documentos adjuntos
- Seguimiento de tratamientos
- Prescripciones médicas

## Tecnologías
- PHP 8.0+
- MySQL 5.7+
- Bootstrap 5.3.0
- JavaScript (ES6+)
- HTML5/CSS3

## Estructura del Proyecto
```
sistema_medico/
├── index.html              # Dashboard principal
├── pacientes/             # Gestión de pacientes
├── citas/                 # Sistema de citas
├── expedientes/          # Expedientes médicos
├── configuracion/        # Configuración del sistema
└── assets/               # Recursos estáticos
    ├── css/             # Estilos CSS
    ├── js/              # Scripts JavaScript
    └── img/             # Imágenes
```

## Instalación
1. Clonar el repositorio
2. Configurar base de datos MySQL
3. Importar esquema de base de datos
4. Configurar conexión en `config/database.php`
5. Iniciar servidor web

## Configuración
- Editar `config/config.php` para ajustes generales
- Configurar correo en `config/mail.php`
- Ajustar permisos de archivos

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