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
document.body.insertAdjacentHTML('beforeend', div_carga_html);
const div_carga = document.getElementById('overlayGuardando');
const div_carga_texto = document.getElementById('carga_texto');
const div_carga_barra = document.getElementById('div_barra');
//-----------------------------------------------------


//-----------OBTENER GET Y DETECTAR CUANDO SE TIENEN Q ENVIAR-------------
const urlParams = new URLSearchParams(window.location.search);
let tabla='',lista_placas={};


// Leer un parámetro específico
const id = urlParams.get('vapi_lote');
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

async function llamar_ia() {
      //probar llamadas ia************************************
    const arrayNumeros = [
        1005046, 1005045, 1007956, 1007958, 1007959, 1007962, 1007989, 1007968, 1007002,
        1008203, 1008461, 1008605, 1008481, 1008211, 1008482, 1008456, 1008237, 1008385,
        1008595, 1008390, 1008260, 1008430, 1008251, 1008594, 1008112, 1008115, 1008418,
        1008454, 1008394, 1008460, 1008240, 1008416, 1008602, 1008262, 1008274, 1008591,
        1008301, 1008252, 1008238, 1008292, 1008322, 1008265, 1008280, 1008432, 1008425,
        1008209, 1007944, 1008239, 1008278, 1008606, 1008297, 1008601, 1008462, 1008250,
        1008463, 1008457, 1008254, 1007130, 1008315, 1008319, 1008593, 1008396, 1008361,
        1008236, 1008607, 1008613, 1008281, 1008284, 1008291, 1008320, 1008417, 1008427,
        1008234, 1008233, 1008424, 1008610, 1008294, 1008334, 1008429, 1008340, 1008483,
        1008449, 1008121, 1008592, 1008261, 1008253, 1008389, 1008392, 1008345, 1007915,
        1003557, 1004392, 1005667, 1005670, 1006738, 1006741, 1004455, 1006754, 1006742,
        1006739, 1007633, 1007632, 1007679, 1007636, 1006783, 1007631, 1007635, 1007599,
        1006567, 1007588, 1007645, 1007644, 1006728, 1008697, 1007648, 1008655, 1008657,
        1003436, 1007648, 1008653, 1008645, 1008669, 1008675
    ];

    console.log(arrayNumeros);
    console.log('Total:', arrayNumeros.length);
    const url_ia='https://efletexia.com/newmonit/llamadaia/send?shippingrequestid='

    //let fecha_despachador='';
    for (const item of arrayNumeros) {

        const response = await fetch(url_ia + item);
        const html = await response.text();
        console.log(html)
    }
    //*************************** */
}


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


async function buscar_fecha_despachador() {
    div_carga_texto.innerHTML =  div_carga_texto.innerHTML + "<br>Buscando datos de las referencias en efletexia...";

    let data_refs_devueltas = {};
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
        tabla+=`<tr>
        <td> ${item}   </td>
        <td><b> ${transportista}  </b> </td>
        <td> 51${tlf_chofer}   </td>
        <td><strong><h1> ${fecha_despachador} </h1></strong></td>
        </tr>`;

        contador+=1;
        progreso=((contador/total_lineas)*100).toFixed(2);

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
            fecha_despachador: fecha_despachador,
            confirmacion:confirmacion,
            fecha_llamada: fecha_llamada
        };
    }   

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

