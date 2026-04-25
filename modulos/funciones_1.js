
function insertarTextoEnXPath(xpath, texto, usarHTML = false, maxLength = null) {
    const nodo = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;

    if (!nodo) {
        console.warn("Nodo no encontrado para el XPath:", xpath);
        return;
    }

    let valor = texto;
    if (maxLength !== null && typeof maxLength === "number") {
        valor = valor.slice(0, maxLength);
    }

    if (usarHTML) {
        nodo.innerHTML = valor;
    } else {
        nodo.textContent = valor;
    }
}

function getNodoByXPath(xpath, contexto = document) {
    const result = document.evaluate(
        xpath,
        contexto,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    );
    return result.singleNodeValue;
}

//usado para limpiar textos multilinea
function eliminar_lineas_vacias(texto) {
    return texto
        .split('\n')
        .map(l => l.trim())
        .filter(l => l !== '');
}

//cambiar el formato de fecha para excel
function transformarFecha(fechaOriginal) {
  if (fechaOriginal === '') return '';
  // Separar hora y fecha
  let [hora, fecha] = fechaOriginal.split(" | ");

  // Dividir la fecha en partes (día, mes, año)
  let [dia, mes, anio] = fecha.split("/");


  // Construir el nuevo formato
  return `${dia}/${mes}/${anio} ${hora}`;
}

//barra de lejania de hora
function barraDeCarga(fechaReferencia, horasMax = 4) {
    if (fechaReferencia === '') return '';
  // Parsear "DD/MM/YYYY HH:mm"
  let [fecha, hora] = fechaReferencia.split(" ");
  let [dia, mes, anio] = fecha.split("/");
  let [hh, mm] = hora.split(":");

  let inicio = new Date(anio, mes - 1, dia, hh, mm);
  let ahora = new Date();

  // Diferencia total (horasMax en milisegundos)
  let total = horasMax * 60 * 60 * 1000;
  let transcurrido = ahora - inicio;

  // Porcentaje
  let porcentaje = Math.min(Math.max((transcurrido / total) * 100, 0), 100);
  let pct = Math.round(porcentaje);

  // Bloques de la barra
  let llenos = Math.round((porcentaje / 100) * 20);
  let vacios = 20 - llenos;
  let barra = `[${"█".repeat(llenos)}${" ".repeat(vacios)}] ${pct}%`;

  // Color según porcentaje
  let color = "green";   // ≤50%
  if (pct > 50) color = "orange"; // >50%
  if (pct >= 100) color = "red";  // 100%

  // Devolver string con HTML
  return `<span style="color:${color}; font-family:monospace;font-size:10px;">${barra}</span>`;
}

function parseFecha(fechaStr) {
  let [fecha, hora] = fechaStr.split(" ");
  let [dia, mes, anio] = fecha.split("/");
  let [hh, mm] = hora.split(":");
  return new Date(anio, mes - 1, dia, hh, mm);
}

// Convierte Date -> "DD/MM/YYYY HH:mm"
function formatFecha(date) {
  const pad = n => String(n).padStart(2, "0");
  const dia = pad(date.getDate());
  const mes = pad(date.getMonth() + 1);
  const anio = date.getFullYear();
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${dia}/${mes}/${anio} ${hh}:${mm}`;
}



function fecha_mayor(registro) {
  const fechas = Object.values(registro)
    .filter(v => typeof v === "string" && v.includes("/")) // toma solo campos con fecha
    .map(parseFecha)
    .filter(d => d instanceof Date); // filtra nulos/invalidos

  if (fechas.length === 0) return ""; // o null si prefieres

  const maxTime = Math.max(...fechas.map(f => f.getTime()));
  return formatFecha(new Date(maxTime));

}

function normalizar(texto) {
  return texto
    .normalize("NFD")                 // separa letras y acentos
    .replace(/[\u0300-\u036f]/g, "") // elimina acentos
    .toLowerCase();                  // ignora mayúsculas
}


function hora_actual() {
    const a = new Date();
    return `${a.getHours().toString().padStart(2, '0')}:${a.getMinutes().toString().padStart(2, '0')}`;
}


function copiar_texto(texto) {
  navigator.clipboard.writeText(texto);
  // Se copió sin mostrar nada
}
//window.insertarTextoEnXPath = insertarTextoEnXPath;
//window.getNodoByXPath = getNodoByXPath;
// Opcional: exportar si quieres usar módulos ES6
// export { insertarTextoEnXPath };
