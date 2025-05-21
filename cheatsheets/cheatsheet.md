# 📖 Cheatsheet Completo de Django

## 🔧 Instalación y Configuración

### Instalación
```bash
# Instalar Django
pip install django

# Instalar versión específica
pip install django==4.2.0

# Crear proyecto
django-admin startproject mi_proyecto
cd mi_proyecto

# Crear aplicación
python manage.py startapp mi_app

# Iniciar servidor
python manage.py runserver
python manage.py runserver 8001  # Puerto específico
python manage.py runserver 0.0.0.0:8000  # Acceso externo
```

### Configuración Inicial
```python
# settings.py
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'mi_app',  # Tu aplicación
]

# Configuración de base de datos
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Configuración de archivos estáticos
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Configuración de archivos multimedia
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

## 📁 Estructura del Proyecto
```
mi_proyecto/
├── manage.py
├── mi_proyecto/
│   ├── __init__.py
│   ├── settings.py      # Configuración del proyecto
│   ├── urls.py         # URLs principales
│   ├── asgi.py         # ASGI config
│   └── wsgi.py         # WSGI config
└── mi_app/
    ├── __init__.py
    ├── admin.py        # Configuración del admin
    ├── apps.py         # Configuración de la app
    ├── models.py       # Modelos de datos
    ├── tests.py        # Pruebas
    ├── views.py        # Vistas
    ├── urls.py         # URLs de la app
    ├── templates/      # Plantillas HTML
    │   └── mi_app/
    │       ├── base.html
    │       └── index.html
    └── static/         # Archivos estáticos
        └── mi_app/
            ├── css/
            ├── js/
            └── img/
```

## 💾 Modelos y Base de Datos

### Tipos de Campos
```python
from django.db import models

class MiModelo(models.Model):
    # Campos básicos
    char = models.CharField(max_length=100)
    text = models.TextField()
    integer = models.IntegerField()
    decimal = models.DecimalField(max_digits=5, decimal_places=2)
    boolean = models.BooleanField(default=False)
    date = models.DateField()
    datetime = models.DateTimeField()
    email = models.EmailField()
    url = models.URLField()
    file = models.FileField(upload_to='uploads/')
    image = models.ImageField(upload_to='images/')
    
    # Campos con opciones
    CHOICES = [
        ('A', 'Opción A'),
        ('B', 'Opción B'),
    ]
    choice = models.CharField(max_length=1, choices=CHOICES)
    
    # Campos automáticos
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Métodos
    def __str__(self):
        return self.char
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Mi Modelo'
        verbose_name_plural = 'Mis Modelos'
```

### Relaciones
```python
class Autor(models.Model):
    nombre = models.CharField(max_length=100)

class Libro(models.Model):
    # Relación uno a muchos
    autor = models.ForeignKey(Autor, on_delete=models.CASCADE)
    
    # Relación muchos a muchos
    categorias = models.ManyToManyField('Categoria')
    
    # Relación uno a uno
    detalle = models.OneToOneField('DetalleLibro', on_delete=models.CASCADE)

class Categoria(models.Model):
    nombre = models.CharField(max_length=100)

class DetalleLibro(models.Model):
    descripcion = models.TextField()
```

## 🔍 Consultas ORM

### Consultas Básicas
```python
# Obtener todos los registros
Libro.objects.all()

# Obtener un registro específico
Libro.objects.get(id=1)
Libro.objects.get(pk=1)

# Filtrar registros
Libro.objects.filter(autor__nombre='Juan')
Libro.objects.exclude(precio__gt=100)

# Ordenar resultados
Libro.objects.order_by('titulo')
Libro.objects.order_by('-fecha_publicacion')

# Limitar resultados
Libro.objects.all()[:5]
```

### Consultas Avanzadas
```python
# Consultas complejas
Libro.objects.filter(
    Q(precio__gt=100) | Q(autor__nombre='Juan')
).exclude(
    categoria__nombre='Ficción'
)

# Anotaciones y agregaciones
from django.db.models import Count, Avg, Sum

Libro.objects.annotate(
    num_categorias=Count('categorias')
).filter(
    num_categorias__gt=1
)

Libro.objects.aggregate(
    precio_promedio=Avg('precio'),
    total_ventas=Sum('ventas')
)

# Subconsultas
Libro.objects.filter(
    autor__in=Autor.objects.filter(
        fecha_nacimiento__year=1990
    )
)
```

## ➡️ Vistas y URLs

### Vistas Basadas en Funciones
```python
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse

def vista_basica(request):
    return HttpResponse("Hola Mundo")

def vista_con_template(request):
    context = {
        'titulo': 'Mi Página',
        'libros': Libro.objects.all()
    }
    return render(request, 'mi_app/index.html', context)

def vista_con_formulario(request):
    if request.method == 'POST':
        form = MiFormulario(request.POST)
        if form.is_valid():
            form.save()
            return redirect('exito')
    else:
        form = MiFormulario()
    return render(request, 'form.html', {'form': form})
```

### Vistas Basadas en Clases
```python
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView

class ListaLibros(ListView):
    model = Libro
    template_name = 'libros/lista.html'
    context_object_name = 'libros'
    paginate_by = 10

class DetalleLibro(DetailView):
    model = Libro
    template_name = 'libros/detalle.html'

class CrearLibro(CreateView):
    model = Libro
    form_class = LibroForm
    template_name = 'libros/crear.html'
    success_url = reverse_lazy('lista_libros')

class ActualizarLibro(UpdateView):
    model = Libro
    form_class = LibroForm
    template_name = 'libros/actualizar.html'
    success_url = reverse_lazy('lista_libros')

class EliminarLibro(DeleteView):
    model = Libro
    template_name = 'libros/eliminar.html'
    success_url = reverse_lazy('lista_libros')
```

### URLs
```python
# urls.py
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.inicio, name='inicio'),
    path('libros/', views.ListaLibros.as_view(), name='lista_libros'),
    path('libros/<int:pk>/', views.DetalleLibro.as_view(), name='detalle_libro'),
    path('api/', include('mi_app.api.urls')),
]
```

## 📄 Templates

### Sintaxis Básica
```html
<!-- Variables -->
{{ variable }}

<!-- Filtros -->
{{ variable|lower }}
{{ fecha|date:"d/m/Y" }}
{{ texto|truncatechars:50 }}

<!-- Etiquetas -->
{% if condicion %}
    <!-- contenido -->
{% elif otra_condicion %}
    <!-- contenido -->
{% else %}
    <!-- contenido -->
{% endif %}

{% for item in lista %}
    {{ item }}
{% empty %}
    <!-- contenido si la lista está vacía -->
{% endfor %}

<!-- Herencia de templates -->
{% extends 'base.html' %}

{% block contenido %}
    <!-- contenido específico -->
{% endblock %}
```

### Filtros Comunes
```html
<!-- Texto -->
{{ texto|lower }}
{{ texto|upper }}
{{ texto|title }}
{{ texto|truncatewords:30 }}
{{ texto|truncatechars:50 }}

<!-- Fechas -->
{{ fecha|date:"d/m/Y" }}
{{ fecha|time:"H:i" }}
{{ fecha|timesince }}

<!-- Números -->
{{ numero|floatformat:2 }}
{{ numero|filesizeformat }}

<!-- URLs -->
{{ url|urlencode }}
{{ texto|urlize }}

<!-- HTML -->
{{ html|safe }}
{{ texto|linebreaks }}
{{ texto|striptags }}
```

## ✅ Formularios

### Formularios Básicos
```python
from django import forms

class MiFormulario(forms.Form):
    nombre = forms.CharField(max_length=100)
    email = forms.EmailField()
    mensaje = forms.CharField(widget=forms.Textarea)
    fecha = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}))
```

### ModelForms
```python
from django.forms import ModelForm

class LibroForm(ModelForm):
    class Meta:
        model = Libro
        fields = ['titulo', 'autor', 'precio']
        widgets = {
            'titulo': forms.TextInput(attrs={'class': 'form-control'}),
            'precio': forms.NumberInput(attrs={'class': 'form-control'}),
        }
```

### Validación Personalizada
```python
def validar_precio(value):
    if value < 0:
        raise forms.ValidationError("El precio no puede ser negativo")

class LibroForm(forms.ModelForm):
    precio = forms.DecimalField(validators=[validar_precio])
    
    def clean_titulo(self):
        titulo = self.cleaned_data['titulo']
        if len(titulo) < 3:
            raise forms.ValidationError("El título es muy corto")
        return titulo
```

## 🔐 Autenticación y Autorización

### Configuración
```python
# settings.py
AUTH_USER_MODEL = 'mi_app.UsuarioPersonalizado'
LOGIN_URL = '/login/'
LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/login/'
```

### Vistas de Autenticación
```python
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin

@login_required
def vista_protegida(request):
    return render(request, 'protegida.html')

class VistaProtegida(LoginRequiredMixin, View):
    login_url = '/login/'
    redirect_field_name = 'redirect_to'
```

### Permisos
```python
from django.contrib.auth.decorators import permission_required
from django.contrib.auth.mixins import PermissionRequiredMixin

@permission_required('mi_app.puede_editar')
def vista_con_permiso(request):
    pass

class VistaConPermiso(PermissionRequiredMixin, View):
    permission_required = 'mi_app.puede_editar'
```

## ⚙️ Middlewares

### Middlewares Personalizados
```python
class MiMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Código ejecutado antes de la vista
        response = self.get_response(request)
        # Código ejecutado después de la vista
        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        # Código ejecutado antes de llamar a la vista
        return None

    def process_exception(self, request, exception):
        # Manejo de excepciones
        return None
```

## 🔔 Señales

### Señales Comunes
```python
from django.db.models.signals import pre_save, post_save, pre_delete, post_delete
from django.dispatch import receiver

@receiver(pre_save, sender=Libro)
def antes_de_guardar(sender, instance, **kwargs):
    instance.precio = round(instance.precio, 2)

@receiver(post_save, sender=Libro)
def despues_de_guardar(sender, instance, created, **kwargs):
    if created:
        print(f"Nuevo libro creado: {instance.titulo}")

@receiver(pre_delete, sender=Libro)
def antes_de_eliminar(sender, instance, **kwargs):
    print(f"Eliminando libro: {instance.titulo}")
```

## 📦 Paginación

### Paginación en Vistas
```python
from django.core.paginator import Paginator

def lista_libros(request):
    libros = Libro.objects.all()
    paginador = Paginator(libros, 10)
    pagina = request.GET.get('page')
    libros_pagina = paginador.get_page(pagina)
    return render(request, 'lista.html', {'libros': libros_pagina})
```

### Paginación en Templates
```html
{% for libro in libros %}
    {{ libro.titulo }}
{% endfor %}

<div class="pagination">
    <span class="step-links">
        {% if libros.has_previous %}
            <a href="?page=1">&laquo; primera</a>
            <a href="?page={{ libros.previous_page_number }}">anterior</a>
        {% endif %}

        <span class="current">
            Página {{ libros.number }} de {{ libros.paginator.num_pages }}
        </span>

        {% if libros.has_next %}
            <a href="?page={{ libros.next_page_number }}">siguiente</a>
            <a href="?page={{ libros.paginator.num_pages }}">última &raquo;</a>
        {% endif %}
    </span>
</div>
```

## ⚠️ Gestión de Errores

### Manejo de Errores
```python
from django.http import Http404

def vista_con_error(request):
    try:
        libro = Libro.objects.get(pk=1000)
    except Libro.DoesNotExist:
        raise Http404("El libro no existe")
    return render(request, 'detalle.html', {'libro': libro})

# En urls.py
handler404 = 'mi_app.views.pagina_no_encontrada'
handler500 = 'mi_app.views.error_servidor'
```

## 💻 Comandos Útiles

### Comandos de Gestión
```bash
# Crear proyecto
django-admin startproject mi_proyecto

# Crear aplicación
python manage.py startapp mi_app

# Migraciones
python manage.py makemigrations
python manage.py migrate
python manage.py showmigrations
python manage.py sqlmigrate mi_app 0001

# Usuarios
python manage.py createsuperuser
python manage.py changepassword usuario

# Shell
python manage.py shell
python manage.py shell_plus  # Con django-extensions

# Pruebas
python manage.py test
python manage.py test mi_app
python manage.py test mi_app.tests

# Internacionalización
python manage.py makemessages -l es
python manage.py compilemessages

# Estáticos
python manage.py collectstatic
python manage.py findstatic css/style.css

# Base de datos
python manage.py dbshell
python manage.py dumpdata > datos.json
python manage.py loaddata datos.json
```

## 🔄 API REST con Django REST Framework

### Configuración
```python
# settings.py
INSTALLED_APPS = [
    'rest_framework',
    'rest_framework.authtoken',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10
}
```

### Serializadores
```python
from rest_framework import serializers

class LibroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Libro
        fields = ['id', 'titulo', 'autor', 'precio']
```

### Vistas API
```python
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def api_libros(request):
    libros = Libro.objects.all()
    serializer = LibroSerializer(libros, many=True)
    return Response(serializer.data)

class LibroViewSet(viewsets.ModelViewSet):
    queryset = Libro.objects.all()
    serializer_class = LibroSerializer
    permission_classes = [IsAuthenticated]
```

## 🧪 Pruebas

### Pruebas Unitarias
```python
from django.test import TestCase
from django.urls import reverse

class LibroTests(TestCase):
    def setUp(self):
        self.libro = Libro.objects.create(
            titulo='Test Libro',
            precio=100
        )

    def test_precio_positivo(self):
        self.assertTrue(self.libro.precio > 0)

    def test_vista_lista(self):
        url = reverse('lista_libros')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Test Libro')
```

### Pruebas de API
```python
from rest_framework.test import APITestCase

class LibroAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass'
        )
        self.client.force_authenticate(user=self.user)

    def test_lista_libros(self):
        url = reverse('libro-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
```

## 🔒 Seguridad

### Configuración de Seguridad
```python
# settings.py
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
```

### Protección contra CSRF
```html
<form method="post">
    {% csrf_token %}
    <!-- campos del formulario -->
</form>
```

## 🌐 Internacionalización

### Configuración
```python
# settings.py
LANGUAGE_CODE = 'es'
TIME_ZONE = 'America/Mexico_City'
USE_I18N = True
USE_L10N = True
USE_TZ = True

LANGUAGES = [
    ('es', 'Español'),
    ('en', 'English'),
]

LOCALE_PATHS = [
    BASE_DIR / 'locale',
]
```

### Uso en Templates
```html
{% load i18n %}
{% trans "Hola Mundo" %}
{% blocktrans %}Bienvenido, {{ nombre }}{% endblocktrans %}
```

### Uso en Python
```python
from django.utils.translation import gettext as _

def mi_vista(request):
    mensaje = _("Bienvenido")
    return HttpResponse(mensaje)
```

## 📊 Caché

### Configuración
```python
# settings.py
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}
```

### Uso del Caché
```python
from django.core.cache import cache

# Almacenar en caché
cache.set('mi_clave', 'mi_valor', timeout=3600)

# Obtener de caché
valor = cache.get('mi_clave')

# Decorador de caché
from django.views.decorators.cache import cache_page

@cache_page(60 * 15)
def mi_vista(request):
    return HttpResponse("Vista en caché")
```

## 📝 Logging

### Configuración
```python
# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'debug.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
```

### Uso del Logging
```python
import logging

logger = logging.getLogger(__name__)

def mi_vista(request):
    logger.debug('Mensaje de debug')
    logger.info('Mensaje informativo')
    logger.warning('Advertencia')
    logger.error('Error')
    logger.critical('Error crítico')
``` 