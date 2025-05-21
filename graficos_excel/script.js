// Variables globales
let myChart = null;
const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');
const errorMessage = document.getElementById('error-message');
const chartTypeSelect = document.getElementById('chart-type');
const xAxisLabelInput = document.getElementById('x-axis-label');
const yAxisLabelInput = document.getElementById('y-axis-label');

// Eventos para el área de drag & drop
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Efectos visuales durante el drag & drop
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight() {
    dropArea.classList.add('highlight');
}

function unhighlight() {
    dropArea.classList.remove('highlight');
}

// Manejo de archivos soltados
dropArea.addEventListener('drop', handleDrop, false);
fileInput.addEventListener('change', handleFileSelect, false);

// Eventos para los controles del gráfico
chartTypeSelect.addEventListener('change', updateChart);
xAxisLabelInput.addEventListener('change', updateChart);
yAxisLabelInput.addEventListener('change', updateChart);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

// Procesamiento de archivos
function handleFiles(files) {
    if (files.length === 0) return;
    
    const file = files[0];
    if (!isValidFileType(file)) {
        showError('Por favor, selecciona un archivo Excel (.xlsx) o CSV (.csv)');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = e.target.result;
            processExcelFile(data);
        } catch (error) {
            showError('Error al procesar el archivo: ' + error.message);
        }
    };
    reader.readAsArrayBuffer(file);
}

// Validación del tipo de archivo
function isValidFileType(file) {
    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
    return validTypes.includes(file.type);
}

// Procesamiento del archivo Excel
function processExcelFile(data) {
    try {
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Validación de columnas
        if (!validateColumns(jsonData)) {
            showError('El archivo debe contener columnas X e Y');
            return;
        }

        // Extracción de datos
        const xValues = jsonData.map(row => row.X);
        const yValues = jsonData.map(row => row.Y);

        // Validación de valores numéricos en Y
        if (!validateNumericValues(yValues)) {
            showError('La columna Y debe contener solo valores numéricos');
            return;
        }

        // Generar gráfico
        createChart(xValues, yValues);
        hideError();
    } catch (error) {
        showError('Error al procesar el archivo Excel: ' + error.message);
    }
}

// Validación de columnas
function validateColumns(data) {
    if (data.length === 0) return false;
    const firstRow = data[0];
    return 'X' in firstRow && 'Y' in firstRow;
}

// Validación de valores numéricos
function validateNumericValues(values) {
    return values.every(value => !isNaN(value));
}

// Creación del gráfico
function createChart(xValues, yValues) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const chartType = chartTypeSelect.value;
    const xAxisLabel = xAxisLabelInput.value || 'X';
    const yAxisLabel = yAxisLabelInput.value || 'Y';

    // Destruir gráfico existente si hay uno
    if (myChart) {
        myChart.destroy();
    }

    // Configuración común para todos los tipos de gráfico
    const commonConfig = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Gráfico de Datos'
            }
        }
    };

    // Configuración específica para gráficos cartesianos (línea, barras)
    if (['line', 'bar'].includes(chartType)) {
        commonConfig.scales = {
            x: {
                title: {
                    display: true,
                    text: xAxisLabel
                }
            },
            y: {
                title: {
                    display: true,
                    text: yAxisLabel
                }
            }
        };
    }

    // Configuración específica para gráficos circulares (pie, dona)
    if (['pie', 'doughnut'].includes(chartType)) {
        commonConfig.plugins.tooltip = {
            callbacks: {
                label: function(context) {
                    return `${context.label}: ${context.raw}`;
                }
            }
        };
    }

    myChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: xValues,
            datasets: [{
                label: 'Datos',
                data: yValues,
                backgroundColor: getBackgroundColors(chartType, yValues.length),
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1
            }]
        },
        options: commonConfig
    });
}

// Función para actualizar el gráfico
function updateChart() {
    if (myChart) {
        const xValues = myChart.data.labels;
        const yValues = myChart.data.datasets[0].data;
        createChart(xValues, yValues);
    }
}

// Función para generar colores según el tipo de gráfico
function getBackgroundColors(chartType, dataLength) {
    if (['pie', 'doughnut'].includes(chartType)) {
        return Array(dataLength).fill().map((_, i) => {
            const hue = (i * 137.508) % 360; // Golden angle approximation
            return `hsl(${hue}, 70%, 50%)`;
        });
    }
    return 'rgba(75, 192, 192, 0.2)';
}

// Manejo de mensajes de error
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('d-none');
}

function hideError() {
    errorMessage.classList.add('d-none');
} 