//link de llamadas IA 
// https://efletexia.com/newmonit/llamadaia/send?shippingrequestid=1008387
console.log("LUPITA - Obtener referencias");


//-----------INYECTAR CUADRO DE CARGA----------------
const div_carga_html = `<div id="overlayGuardando" class="position-fixed top-0 start-0 w-100 h-100 d-none"
     style="background: rgba(0,0,0,0.5); z-index:9999;
       position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: none;
     ">
     
    <div style="position: relative; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
        <div style="text-align: center; min-width: 300px;">
            
            <!-- Barra de carga -->
            <div style="width: 100%; background-color: rgba(255,255,255,0.2); border-radius: 10px; overflow: hidden; margin-bottom: 20px; height: 8px;">
                <div id='div_barra' style="width: 0%; height: 100%; background: linear-gradient(90deg, #4ecdc4, #45b7d1); border-radius: 10px;"></div>
            </div>
            
            <!-- Texto -->
            <div style="color: white; font-size: 1.2rem; font-weight: 500; letter-spacing: 1px; margin-bottom: 15px;">
            <img src="https://i.ibb.co/x8CKttw7/icon.png" alt="icon" border="0" width='256 px'> <br>
                <h1>Obteniendo datos para lupita</h1>
                <div id='carga_texto'>cargando llamadas q tienen referencias del LOTE</div>
            </div>
            
            
        </div>
    </div>
</div>

<style>
@keyframes cargar {
    0% { width: 0%; }
    50% { width: 70%; }
    100% { width: 100%; }
}
</style>`;
//-----------OBTENER GET Y DETECTAR CUANDO SE TIENEN Q ENVIAR-------------
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('vapi_lote');
if (id) {
    document.body.insertAdjacentHTML('beforeend', div_carga_html);

}
//-----------------------------------------------------
const div_carga = document.getElementById('overlayGuardando');
const div_carga_texto = document.getElementById('carga_texto');
const div_carga_barra = document.getElementById('div_barra');


let tabla='',lista_placas={};


// Leer un parámetro específico

console.log('Lote: '+id);

//--------------OBTENER DATOS CUANDO SE TERMINA DE CARGAR LA PAGINA----------------
let lote_refs = null, fechas_conf = null,refs_conf={}; // Variable para almacenar los datos del lote
window.addEventListener('load', function() {
  //llamar_ia();
  //-------------OBTENER REFERENCIAS DEL LOTE----------------

  if(id){
    div_carga.classList.remove('d-none');
    div_carga.style.display = 'block';
      fetch(`https://lupita-laravel.test/api/lote/${id}/detalle`, {
      method: 'GET'
  })
  .then(response => response.json())
  .then(data => {
    data_json=data
    lote_refs = data_json['refs'];
    fechas_conf = data_json['fechas'];  
    // Guardar las fechas de confirmación para buscarlos en el historial de llamadas
    console.log(fechas_conf);
    obtener_ref_conf();
  });
  }

//--------------------------------------------------------------

});

async function obtener_ref_conf_original() {
  //-----OBTENER REFERENCIAS DE LLAMADAS IA HECHAS POR USUARIO---------------
  let token=document.querySelector('[name="_token"]').value;

  //token='whiRLFWFmTTmugbNV4FmyIIs5ruzcBDeVCxiu9kW';
  console.log('Token para obtener referencias de confirmación: ', token);

  for (const item of fechas_conf) {
    const referencia = '' , fecha=item;
    console.log('Fechas: ', fecha);

    //---------------------DATOS DEL FETCH---------------------
    const datos = {

        'referencia': referencia,
        'fecha': fecha
    };
//shippingrequestid
    //--------------------------------------------

    fetch('https://efletexia.com/newmonit/list_calls', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': token
        },
        body: new URLSearchParams(datos)
    })
    .then(response => response.json())
    .then(data => {
      const lista_ref_conf = data;

      //-----------------LISTAR REFERENCIAS DEL HISTORIAL IA
      for (reg of lista_ref_conf['data']){
        //console.log(reg['shippingrequestid']);
        let i=String (reg['shippingrequestid']) ; //referencia de la lista historial
        refs_conf[i]={
            ref:i ,
            fecha_llamada: reg['fecha_log'] ,
            usuario: reg['user_monitoreo']
            
        };
        // no insertar duplicados para no recargar la plataforma efletexia
        if (!lote_refs.includes(i)) {
            //console.log('se agrego:', i )
            lote_refs.push(i);
        }
      }
      //---------------------------------------------------------
      
    });

  }

  for (j of lote_refs){
    console.log(j);
  }

  console.log('Respuesta completa:', refs_conf);
  //buscar_fecha_despachador();
  //------------------------------------------------------------
}


async function obtener_ref_conf() {
    //-----OBTENER REFERENCIAS DE LLAMADAS IA HECHAS POR USUARIO---------------
    div_carga_texto.innerHTML =  div_carga_texto.innerHTML + "<br>Obteniendo referencias de confirmación del historial de llamadas IA...";


    let token = document.querySelector('[name="_token"]').value;
    console.log('Token para obtener referencias de confirmación: ', token);

    // array de promesas
    const promesas = [];

    for (const item of fechas_conf) {
        const fecha = item;
        console.log('Fechas: ', fecha);

        // Datos del fetch
        const datos = {
            'referencia': '',
            'fecha': fecha
        };

        const promesa = fetch('https://efletexia.com/newmonit/list_calls', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': token
            },
            body: new URLSearchParams(datos)
        })
        .then(response => response.json())
        .then(data => {
            const lista_ref_conf = data;

            // Procesar los datos de este fetch
            for (const reg of lista_ref_conf['data']) {
                let i = String(reg['shippingrequestid']);
                
                refs_conf[i] = {
                    ref: i,
                    fecha_llamada: reg['fecha_log'],
                    usuario: reg['user_monitoreo']
                };
                
                if (!lote_refs.includes(i)) {
                    lote_refs.push(i);
                }
            }
        });

        // Guardar la promesa para esperarla después
        promesas.push(promesa);
    }

    // 3. ESPERAR a que TODOS los fetchs terminen
    await Promise.all(promesas);

    // 4. Ahora SÍ, imprimir los resultados (ya están completos)
    console.log('=== LISTA DE REFERENCIAS AGREGADAS ALA LISTA DE SCRAPING ===');
    console.log('lote_refs:', lote_refs);
    console.log('Cantidad de refs:', lote_refs.length);
    console.log('refs_conf completo:', refs_conf);

    buscar_fecha_despachador()
    
    // Si necesitas llamar otra función después
    // buscar_fecha_despachador();
    //------------------------------------------------------------
}

let data_refs_devueltas = {};
async function buscar_fecha_despachador() {
    div_carga_texto.innerHTML =  div_carga_texto.innerHTML + "<br>Buscando datos de las referencias en efletexia...";

    tabla = '';
        // Separar cada línea, eliminar líneas vacías
    //const lineas= eliminar_lineas_vacias(textarea.value);
    let contador=0;let total_lineas=lote_refs.length;

    const url_fecha_des='https://efletexia.com/opl/confirmacion-ingreso-carga/create?shippingRequestId='
    //let fecha_despachador='';
    for (const item of lote_refs) {
        const response = await fetch(url_fecha_des + item);
        const html = await response.text();
        let pos,pos_2, gps_datos, link_gps,transportista,tlf_chofer,fecha_despachador;
        const response_text= html
        //-------------buscar gps---------------
        pos = response_text.indexOf("<hr>", 1);
        pos_2= response_text.indexOf("<hr>", pos+1);
        gps_datos=response_text.slice(pos+4,pos_2);
        //------------titulo del viaje--------------<label>Título</label>
        pos = response_text.indexOf("Título", 1);
        pos= response_text.indexOf(">", pos+1);
        pos= response_text.indexOf(">", pos+1);
        pos= response_text.indexOf(">", pos+1);
        pos_2=response_text.indexOf("<", pos+1);
        titulo_viaje=response_text.slice(pos+1,pos_2);
        //----------buscar TRT-----------------------------
        pos = response_text.indexOf("Empresa TRT", 1);
        pos= response_text.indexOf(">", pos+1);
        pos= response_text.indexOf(">", pos+1);
        pos_2=response_text.indexOf("<", pos+1);
        transportista=response_text.slice(pos+1,pos_2);
        //--------------------------------------
        //----------telefono-----------------------------
        pos = response_text.indexOf("Tel. Chofer", 1);
        pos= response_text.indexOf(">", pos+1);
        pos= response_text.indexOf(">", pos+1);
        pos_2=response_text.indexOf("<", pos+1);
        tlf_chofer=response_text.slice(pos+1,pos_2);

        //-------------buscar la placa si es q la hay-------
        pos = response_text.indexOf("Vehículo", 1);
        pos_2 = response_text.indexOf(">", pos+1);
        pos = response_text.indexOf(">", pos_2+1);
        pos_2=response_text.indexOf("<", pos+1);
        placa_ref=response_text.slice(pos+1,pos_2);
        placa_ref=placa_ref.replaceAll('-', '').replaceAll(' ', '');
        //-------------solo quiero el link-------------
        pos = gps_datos.indexOf('ref="', 1);
        pos_2= gps_datos.indexOf('"', pos+5);
        link_gps = gps_datos.slice(pos+5, pos_2);

        //lista_gps[contador]=[[item, placa_ref],link_gps];

        lista_placas[item]=[placa_ref,titulo_viaje];

        //console.log (lista_gps[contador]);
        //--------buscar la fecha prometida por el despachador
        pos = response_text.indexOf("Compromiso Carga Coordinador", 1);
        pos= response_text.indexOf(">", pos+1);
        pos= response_text.indexOf(">", pos+1);
        pos_2=response_text.indexOf("<", pos+1);
        fecha_despachador=response_text.slice(pos+1,pos_2);
        //--------

        contador+=1;
        progreso=(  (contador/ (total_lineas*2) )*100  ).toFixed(2);

        div_carga_barra.style.width= `${progreso}%`;

        console.log('FECHA DESPACHADOR',hora_actual(),item,`Progreso: ${progreso}%` );

        //--------------BUSCAR EN EL HISTORIAL IA LAS REFERENCIAS DE CONFIRMACION------------------
        let confirmacion=false,fecha_llamada='';
        let existe_ref= refs_conf[item]??0;
        if (existe_ref) {
            confirmacion=true;
            fecha_llamada=refs_conf[item]['fecha_llamada']
            console.log(existe_ref);
        }
        //---------------------------------------------------------------------------------------

        data_refs_devueltas[item] = {
            placa: placa_ref,
            titulo_viaje: titulo_viaje,
            transportista: transportista,
            tlf_chofer: tlf_chofer,
            fecha_despachador: transformarFecha_2(fecha_despachador),
            confirmacion:confirmacion,
            fecha_llamada: fecha_llamada,
            fecha_conpromiso :'',
            fecha_presente_carga: '',
            fecha_inicio_carga: '',
            fecha_fin_carga: '',
            fecha_inicio_ruta: '',
            fecha_qr_descarga: '',
            fecha_inicio_descarga: '',
            fecha_fin_descarga: '',
        };
    }

    div_carga_texto.innerHTML =  div_carga_texto.innerHTML + "<br>Obteniendo datos de los viajes...";
    await buscar_historial_viaje()
    //-----------ENVIAR DATOS A LUPITA----------------
    div_carga_texto.innerHTML =  div_carga_texto.innerHTML + "<br>Enviando datos a Lupita...";
    console.log('Datos a enviar a Lupita: ', data_refs_devueltas);
    fetch(`https://lupita-laravel.test/api/lote/${id}/detalle/actualizar`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',  // ← Importante
        'Accept': 'application/json'
    },
    body: JSON.stringify( data_refs_devueltas )
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        div_carga.classList.add('d-none');
        div_carga.style.display = 'none';
    });

    //-------------------------------------------------------
}


async function buscar_historial_viaje() {

    // Separar cada línea, eliminar líneas vacías
    const url_historial = 'https://efletexia.com/newmonit/viaje/card/'



    let contador = 0;
    let total_lineas = lote_refs.length;

    //CARGAR EL HISTORIAL DE VIAJE MEDIANTE LINK
    let pos, pos_2, llegada_origen, llegada_destino, inicio_descargue, fin_descargue, qr_descarga, presente_carga,
        fin_carga, inicio_carga,inicio_ruta;



    for (const item of lote_refs) {
        const response = await fetch(url_historial + item);
        const response_text = await response.text();

        //--------------------------confirmado
        let ultimo_confirmado, lista = [];
        //------------COMPROMISO--------------
        pos = response_text.indexOf("Confirmado", 1);
        do {
            if (pos !== -1) {
                let pos_a = response_text.indexOf("<strong>", pos + 1);
                let pos_b = response_text.indexOf("</strong>", pos + 8);
                let etiq = response_text.slice(pos_a + 8, pos_b);
                console.log(pos, etiq);
                lista.push(etiq)
                pos = response_text.indexOf("Confirmado", pos + 1);
            }
        } while (pos !== -1)

        ultimo_confirmado = lista[lista.length - 1] ?? '';

        //-------------LLEGADA ORIGEN--------------
        pos = response_text.indexOf("Llegada a Origen", 1);
        if (pos !== -1) { // si se encuentra obtenerlo
            //<strong>13:00 | 03/01/2026</strong>
            pos = response_text.indexOf("<strong>", pos + 1);
            pos_2 = response_text.indexOf("</strong>", pos + 8);
            llegada_origen = response_text.slice(pos + 8, pos_2);
        } else llegada_origen = '';

        //-------------LLEGADA DESTINO--------------
        pos = response_text.indexOf("Llegada a Destino", 1);
        if (pos !== -1) { // si se encuentra obtenerlo
            //<strong>13:00 | 03/01/2026</strong>
            pos = response_text.indexOf("<strong>", pos + 1);
            pos_2 = response_text.indexOf("</strong>", pos + 8);
            llegada_destino = response_text.slice(pos + 8, pos_2);
        } else llegada_destino = '';

        //-------------INICIO DESCARGUE--------------
        pos = response_text.indexOf("Inicio Descargue", 1);
        if (pos !== -1) { // si se encuentra obtenerlo
            //<strong>13:00 | 03/01/2026</strong>
            pos = response_text.indexOf("<strong>", pos + 1);
            pos_2 = response_text.indexOf("</strong>", pos + 8);
            inicio_descargue = response_text.slice(pos + 8, pos_2);
        } else inicio_descargue = '';

        //-------------FIN DESCARGUE--------------
        pos = response_text.indexOf("Fin Descargue", 1);
        if (pos !== -1) { // si se encuentra obtenerlo
            //<strong>13:00 | 03/01/2026</strong>
            pos = response_text.indexOf("<strong>", pos + 1);
            pos_2 = response_text.indexOf("</strong>", pos + 8);
            fin_descargue = response_text.slice(pos + 8, pos_2);
        } else fin_descargue = '';

        //-------------QR DESCARGA--------------

        pos = response_text.indexOf("QR Monitoreo Maxo", 1);
        if (pos !== -1) { // si se encuentra obtenerlo
            //<strong>13:00 | 03/01/2026</strong>
            pos = response_text.indexOf("<strong>", pos + 1);
            pos_2 = response_text.indexOf("</strong>", pos + 8);
            qr_descarga = response_text.slice(pos + 8, pos_2);
        } else qr_descarga = '';

        //-------------PRESENTE DE CARGA--------------
        pos = response_text.indexOf("Presenta para Carga", 1);
        if (pos !== -1) { // si se encuentra obtenerlo
            //<strong>13:00 | 03/01/2026</strong>
            pos = response_text.indexOf("<strong>", pos + 1);
            pos_2 = response_text.indexOf("</strong>", pos + 8);
            presente_carga = response_text.slice(pos + 8, pos_2);
        } else presente_carga = '';

        //-------------NOTIFICACION DE LLEGADA--------------notificaci&oacute;n de llegada
        if (presente_carga == '') {
            texto_normalizado = normalizar(response_text)
            pos = texto_normalizado.indexOf("notificaci&oacute;n de llegada", 1);
            if (pos !== -1) { // si se encuentra obtenerlo
                //<strong>13:00 | 03/01/2026</strong>
                pos = response_text.indexOf("<strong>", pos + 1);
                pos_2 = response_text.indexOf("</strong>", pos + 8);
                presente_carga = response_text.slice(pos + 8, pos_2);
            } else presente_carga = '';
        }

        //-------------INICIO DE CARGA--------------
        pos = response_text.indexOf("Inicio de Carga", 1);
        if (pos !== -1) { // si se encuentra obtenerlo
            //<strong>13:00 | 03/01/2026</strong>
            pos = response_text.indexOf("<strong>", pos + 1);
            pos_2 = response_text.indexOf("</strong>", pos + 8);
            inicio_carga = response_text.slice(pos + 8, pos_2);
        } else inicio_carga = '';

        //-------------FIN DE CARGA--------------
        pos = response_text.indexOf("Fin de carga", 1);
        if (pos !== -1) { // si se encuentra obtenerlo
            //<strong>13:00 | 03/01/2026</strong>
            pos = response_text.indexOf("<strong>", pos + 1);
            pos_2 = response_text.indexOf("</strong>", pos + 8);
            fin_carga = response_text.slice(pos + 8, pos_2);
        } else fin_carga = '';
        //-------------Inicio Ruta-------------
        pos = response_text.indexOf("Inicio Ruta", 1);
        if (pos !== -1) { // si se encuentra obtenerlo
            //<strong>13:00 | 03/01/2026</strong>
            pos = response_text.indexOf("<strong>", pos + 1);
            pos_2 = response_text.indexOf("</strong>", pos + 8);
            inicio_ruta = response_text.slice(pos + 8, pos_2);
        } else inicio_ruta = '';

        if (!qr_descarga) qr_descarga = llegada_destino;

        data_refs_devueltas[item].fecha_conpromiso= transformarFecha(ultimo_confirmado);
        data_refs_devueltas[item].fecha_presente_carga = transformarFecha(presente_carga);
        data_refs_devueltas[item].fecha_inicio_carga = transformarFecha(inicio_carga);
        data_refs_devueltas[item].fecha_fin_carga = transformarFecha(fin_carga);
        data_refs_devueltas[item].fecha_inicio_ruta = transformarFecha(inicio_ruta);

        data_refs_devueltas[item].fecha_qr_descarga = transformarFecha(qr_descarga);
        data_refs_devueltas[item].fecha_inicio_descarga = transformarFecha(inicio_descargue);
        data_refs_devueltas[item].fecha_fin_descarga = transformarFecha(fin_descargue);

        contador += 1;
        progreso=(  ( ( total_lineas + contador)/ (total_lineas*2) )*100 ).toFixed(2);
        div_carga_barra.style.width= `${progreso}%`;
        console.log('HISTORIAL DE VIAJE', hora_actual(), item, `Progreso: ${progreso}%`);

    }

}


