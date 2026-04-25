
console.log("LUPITA - Obtener referencias");


//-----------OBTENER GET Y DETECTAR CUANDO SE TIENEN Q ENVIAR-------------
const urlParams = new URLSearchParams(window.location.search);
let tabla='',lista_placas={};


// Leer un parámetro específico
const id = urlParams.get('vapi_lote');
console.log('Lote: '+id);

//--------------OBTENER DATOS CUANDO SE TERMINA DE CARGAR LA PAGINA----------------
let lote_refs = null, fechas_conf = null,refs_conf={}; // Variable para almacenar los datos del lote
window.addEventListener('load', function() {
  //-------------OBTENER REFERENCIAS DEL LOTE----------------
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
    .then(data => console.log(data));
    //-------------------------------------------------------
}

