// Referencias a elementos del DOM
const excelFileInput = document.getElementById('excelFile');
const dropZone = document.getElementById('dropZone');
let dataTable = null;

// Configuración de DataTables
const dataTableOptions = {
    responsive: true,
    language: {
        url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
    },
    dom: 'Bfrtip',
    buttons: [
        {
            extend: 'copy',
            text: 'Copiar',
            className: 'btn btn-secondary',
            exportOptions: {
                columns: ':visible',
                modifier: {
                    page: 'all'
                }
            }
        },
        {
            extend: 'csv',
            text: 'CSV',
            className: 'btn btn-secondary',
            exportOptions: {
                columns: ':visible',
                modifier: {
                    page: 'all'
                }
            },
            filename: 'datos_exportados',
            bom: true
        },
        {
            extend: 'excel',
            text: 'Excel',
            className: 'btn btn-secondary',
            exportOptions: {
                columns: ':visible',
                modifier: {
                    page: 'all'
                }
            },
            filename: 'datos_exportados',
            customize: function(xlsx) {
                const sheet = xlsx.xl.worksheets['sheet1.xml'];
                $('row c', sheet).attr('s', '2');
            }
        },
        {
            extend: 'pdf',
            text: 'PDF',
            className: 'btn btn-secondary',
            exportOptions: {
                columns: ':visible',
                modifier: {
                    page: 'all'
                }
            },
            filename: 'datos_exportados',
            customize: function(doc) {
                doc.defaultStyle.fontSize = 8;
                doc.styles.tableHeader.fontSize = 9;
                doc.styles.title.fontSize = 12;
                doc.pageMargins = [20, 20, 20, 20];
                doc.content[1].table.widths = Array(doc.content[1].table.body[0].length + 1).join('*').split('');
            }
        },
        {
            extend: 'print',
            text: 'Imprimir',
            className: 'btn btn-secondary',
            exportOptions: {
                columns: ':visible',
                modifier: {
                    page: 'all'
                }
            },
            customize: function(win) {
                $(win.document.body).find('table').addClass('display').css('font-size', '9px');
                $(win.document.body).find('tr:nth-child(odd) td').each(function(index) {
                    $(this).css('background-color', '#D0D0D0');
                });
                $(win.document.body).find('h1').css('text-align', 'center');
            }
        }
    ],
    pageLength: 10,
    lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Todos"]],
    order: [[0, 'asc']],
    stateSave: true
};

// Función para inicializar DataTables
function initializeDataTable(data) {
    if (dataTable) {
        dataTable.destroy();
    }

    // Limpiar la tabla existente
    const table = document.getElementById('excelDataTable');
    table.innerHTML = '';

    // Crear la estructura de la tabla
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const headerRow = document.createElement('tr');

    // Agregar encabezados
    data[0].forEach((header, index) => {
        const th = document.createElement('th');
        th.textContent = header || `Columna ${index + 1}`;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Agregar filas de datos
    data.slice(1).forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell || '';
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    // Inicializar DataTables con configuración mejorada
    dataTable = $('#excelDataTable').DataTable({
        ...dataTableOptions,
        data: data.slice(1),
        columns: data[0].map((header, index) => ({
            title: header || `Columna ${index + 1}`,
            data: index
        })),
        order: [[0, 'asc']],
        pageLength: 10,
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Todos"]],
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
        }
    });
}

// Función para validar el tipo de archivo
function isValidFileType(file) {
    const validTypes = ['.xlsx', '.csv'];
    const fileName = file.name.toLowerCase();
    return validTypes.some(type => fileName.endsWith(type));
}

// Función para procesar el archivo Excel
async function processExcelFile(file) {
    try {
        // Validar tipo de archivo
        if (!isValidFileType(file)) {
            throw new Error('Tipo de archivo no válido. Por favor, selecciona un archivo .xlsx o .csv');
        }

        // Mostrar mensaje de carga
        const loadingSwal = Swal.fire({
            title: 'Procesando archivo',
            html: 'Por favor espera mientras se procesa el archivo...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                
                // Convertir a JSON con opciones específicas
                const jsonData = XLSX.utils.sheet_to_json(firstSheet, { 
                    header: 1,
                    raw: false,
                    defval: ''
                });

                // Validar que el archivo no esté vacío
                if (jsonData.length === 0) {
                    throw new Error('El archivo está vacío o no contiene datos válidos');
                }

                // Validar que haya encabezados
                if (jsonData[0].length === 0) {
                    throw new Error('El archivo no contiene encabezados válidos');
                }

                // Limpiar datos vacíos
                const cleanedData = jsonData.filter(row => 
                    row.some(cell => cell !== undefined && cell !== null && cell !== '')
                );

                // Cerrar mensaje de carga
                loadingSwal.close();

                // Inicializar DataTables con los datos
                initializeDataTable(cleanedData);

                // Mostrar mensaje de éxito
                Swal.fire({
                    icon: 'success',
                    title: 'Archivo procesado',
                    text: `Se han cargado ${cleanedData.length - 1} filas de datos`,
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (error) {
                loadingSwal.close();
                throw error;
            }
        };

        reader.onerror = function() {
            loadingSwal.close();
            throw new Error('Error al leer el archivo');
        };

        reader.readAsArrayBuffer(file);
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message
        });
    }
}

// Event Listeners
excelFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        processExcelFile(file);
    }
});

// Drag and Drop
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    
    const file = e.dataTransfer.files[0];
    if (file) {
        excelFileInput.files = e.dataTransfer.files;
        processExcelFile(file);
    }
});

// Evento para hacer clic en la zona de drop
dropZone.addEventListener('click', () => {
    excelFileInput.click();
});

// Inicializar la tabla vacía
$(document).ready(function() {
    $('#excelDataTable').DataTable({
        ...dataTableOptions,
        data: [],
        columns: [{ title: 'No hay datos cargados' }]
    });
}); 