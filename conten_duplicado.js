
console.log("Pedro Sotelo - ARRIBOS CRISAR");
const fecha_c = document.querySelector('input[id="fecha_carga"]');
fecha_c.value = "";

  const txt_buscar = document.querySelector('#buscar');
  const boton_buscar = document.querySelector('button.btn.btn-primary.btn-sm');

//------ monitorear div de procesando solo cuando se busca
//-------y ejecutar el codigo para mostrar el compromiso anunciado
const div_buscar = document.getElementById("lista_processing");

const obs_buscar = new MutationObserver(() => {
  
  if (window.getComputedStyle(div_buscar).display === "none") {
    obs_buscar.disconnect(); // terminar "hilo"
    const ref_padre_txt=txt_buscar.value
    // cargar la info de despachadora
    fetch('https://efletexia.com/opl/confirmacion-ingreso-carga/create?shippingRequestId=' + ref_padre_txt)
      .then(r => r.text())
      .then(html => {
        //--------telefono del chofer
        const response_text= html
        var pos = response_text.indexOf("Tel. Chofer", 1);
        pos= response_text.indexOf(">", pos+1);
        pos= response_text.indexOf(">", pos+1);
        var pos_2=response_text.indexOf("<", pos+1);
        const tlf_conductor=response_text.slice(pos+1,pos_2);


        //--------buscar la fecha prometida por el despachador
        pos = response_text.indexOf("Compromiso Carga Coordinador", 1);
        pos= response_text.indexOf(">", pos+1);
        pos= response_text.indexOf(">", pos+1);
        pos_2=response_text.indexOf("<", pos+1);
        const fecha_despachador=response_text.slice(pos+1,pos_2);
        //-------------buscar gps---------------
        pos = response_text.indexOf("<hr>", 1);
        pos_2= response_text.indexOf("<hr>", pos+1);

        const gps_datos=response_text.slice(pos+4,pos_2);
        //--------------------------------
        

        var link_historico_de_viaje=`<a href='https://efletexia.com/newmonit/viaje/card/${ref_padre_txt}' target='_blank'> Historial de Viaje</a>`
        document.body.insertAdjacentHTML('beforeend', fecha_despachador); // aun no se muestra
        datos_mostrar= `<table><tr><td>   ${fecha_despachador}   </td></tr><tr><td>    ${tlf_conductor}   </td></tr><tr><td>    ${gps_datos}    </td></tr> <br> ${link_historico_de_viaje} `
        insertarTextoEnXPath('/html/body/div[7]/div/div/div[3]/div/div/div/table/tbody/tr/td[7]', datos_mostrar,true, null);

        //agrandar para mostrar todos los datos
        const ht_observaciones =getNodoByXPath('/html/body/div[7]/div/div/div[3]/div/div/div/table/thead/tr/th[7]')
        ht_observaciones.style.minWidth ='310px'
        const tabla_lista = document.getElementById("lista");
        tabla_lista.style.minWidth="100%"
        
      });
    //------------------


	
  }
});

//--------------------------------------------------------------------

const waitBuscar = setInterval(() => {

  if (txt_buscar && boton_buscar) {
    txt_buscar.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        boton_buscar.click(); // ejecutar búsqueda

        // 🔁 activar observer SOLO para esta búsqueda
		    console.log("monitorear estado del display de busqueda")
        obs_buscar.observe(div_buscar, {
          attributes: true,
          attributeFilter: ["style"]
        });
      }
    });

    clearInterval(waitBuscar);
  }
}, 300);



//-----------------GENERAR FECHA_DESPACHADOR--------------------

document.body.insertAdjacentHTML('beforeend', `
  <div class="content-container" style="margin: 0 auto !important; padding: 0px !important;">
    <div id="div_fecha_prom_d" class="content-container" style="margin: 0 auto !important; padding: 0px !important;"></div>
    <textarea id="ref_padres" rows="6" style="width:100%;" class="form-control"></textarea>
    <br><br>
    <button id="btn_obtener" class="btn btn-primary btn-sm">FFECHA DESPACHADOR</button>
    <button id="btn_historial"  class="btn btn-primary btn-sm">HISTORIAL</button>
    <button id="btn_mis_cargas"  class="btn btn-primary btn-sm">CARGAS</button>
  </div>
`);

const textarea = document.getElementById('ref_padres');
const div_fecha_prom_d = document.getElementById('div_fecha_prom_d');
let tabla='',lista_placas={};




async function buscar_fecha_despachador() {

    tabla = '';
        // Separar cada línea, eliminar líneas vacías
    const lineas= eliminar_lineas_vacias(textarea.value);
    let contador=0;let total_lineas=lineas.length;

    const url_fecha_des='https://efletexia.com/opl/confirmacion-ingreso-carga/create?shippingRequestId='
    let fecha_despachador='',lista_gps=[];
    for (const item of lineas) {

        const response = await fetch(url_fecha_des + item);
        const html = await response.text();
        var pos,pos_2, gps_datos, link_gps,transportista,tlf_chofer;
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

        lista_gps[contador]=[[item, placa_ref],link_gps];

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
    }

    //--------agrupar los links de los gps-------------
    contador=0;
    const lista_gps_agrupada = lista_gps.reduce((result, item) => {
      const link = item[1];

      if (!result[link]) {
        result[link] = [];
      }

        result[link].push(item[0]);
        return result;
    }, {});

    const lista_gps_ordenada = Object.entries(lista_gps_agrupada).sort((a, b) => b[1].length - a[1].length);
    //generar el html para mostrarlos
    var html_links=''
    lista_gps_ordenada.forEach(([link, datos]) => {
      html_links += `<h2>   <a href="${link}" target="_blank">${link} </a> (${datos.length})</h2>`;
      html_links += `<ul>`;

      datos.forEach(dato => {
        html_links += `<li>${dato[0]} - <b>${dato[1]}</b></li>`;
      });

      html_links += `</ul>`;
    });

    // --------------no mostrare HTML LINKS POR QUE NO SIRVE MUY BIEN
    html_links='';
    //---------------------------------------
    div_fecha_prom_d.innerHTML = `<table><tr><td>   ${html_links}   </td></tr><tr><td>    <table>${tabla}</table>     </td></tr> </table>`;

}

//------------buscar historial de viaje-------------
async function buscar_historial_viaje() {
  tabla = '';
  // Separar cada línea, eliminar líneas vacías
  const lineas= eliminar_lineas_vacias(textarea.value);
  const url_historial='https://efletexia.com/newmonit/viaje/card/'
  let contador=0;let total_lineas=lineas.length;

  //CARGAR EL HISTORIAL DE VIAJE MEDIANTE LINK
  var lista_historial=[];
  var pos,pos_2, llegada_origen, llegada_destino ,inicio_descargue,fin_descargue , qr_descarga,presente_carga,fin_carga,inicio_carga;
  for (const item of lineas) {
    const response = await fetch(url_historial+ item);
    const response_text = await response.text();
    

    //-------------LLEGADA ORIGEN--------------
    pos = response_text.indexOf("Llegada a Origen", 1);
    if (pos!==-1){ // si se encuentra obtenerlo
      //<strong>13:00 | 03/01/2026</strong>
      pos= response_text.indexOf("<strong>", pos+1);
      pos_2=response_text.indexOf("</strong>", pos+8);
      llegada_origen=response_text.slice(pos+8,pos_2);
    } else llegada_origen='';
    
    //-------------LLEGADA DESTINO--------------
    pos = response_text.indexOf("Llegada a Destino", 1);
    if (pos!==-1){ // si se encuentra obtenerlo
      //<strong>13:00 | 03/01/2026</strong>
      pos= response_text.indexOf("<strong>", pos+1);
      pos_2=response_text.indexOf("</strong>", pos+8);
      llegada_destino=response_text.slice(pos+8,pos_2);
    } else llegada_destino='';

    //-------------INICIO DESCARGUE--------------
    pos = response_text.indexOf("Inicio Descargue", 1);
    if (pos!==-1){ // si se encuentra obtenerlo
      //<strong>13:00 | 03/01/2026</strong>
      pos= response_text.indexOf("<strong>", pos+1);
      pos_2=response_text.indexOf("</strong>", pos+8);
      inicio_descargue=response_text.slice(pos+8,pos_2);
    } else inicio_descargue='';

    //-------------FIN DESCARGUE--------------
    pos = response_text.indexOf("Fin Descargue", 1);
    if (pos!==-1){ // si se encuentra obtenerlo
      //<strong>13:00 | 03/01/2026</strong>
      pos= response_text.indexOf("<strong>", pos+1);
      pos_2=response_text.indexOf("</strong>", pos+8);
      fin_descargue=response_text.slice(pos+8,pos_2);
    } else fin_descargue='';

    //-------------QR DESCARGA--------------
                                            
    pos = response_text.indexOf("QR Monitoreo Maxo", 1);
    if (pos!==-1){ // si se encuentra obtenerlo
      //<strong>13:00 | 03/01/2026</strong>
      pos= response_text.indexOf("<strong>", pos+1);
      pos_2=response_text.indexOf("</strong>", pos+8);
      qr_descarga=response_text.slice(pos+8,pos_2);
    } else qr_descarga='';
    
    //-------------PRESENTE DE CARGA--------------
    pos = response_text.indexOf("Presenta para Carga", 1);
    if (pos!==-1){ // si se encuentra obtenerlo
      //<strong>13:00 | 03/01/2026</strong>
      pos= response_text.indexOf("<strong>", pos+1);
      pos_2=response_text.indexOf("</strong>", pos+8);
      presente_carga=response_text.slice(pos+8,pos_2);
      presente_carga=transformarFecha(presente_carga);
    } else presente_carga='';

    //-------------NOTIFICACION DE LLEGADA--------------notificaci&oacute;n de llegada
    if (presente_carga == ''){
      texto_normalizado= normalizar(response_text)                                 
      pos = texto_normalizado.indexOf("notificaci&oacute;n de llegada", 1);
      if (pos!==-1){ // si se encuentra obtenerlo
        //<strong>13:00 | 03/01/2026</strong>
        pos= response_text.indexOf("<strong>", pos+1);
        pos_2=response_text.indexOf("</strong>", pos+8);
        presente_carga=response_text.slice(pos+8,pos_2);
        presente_carga=transformarFecha(presente_carga);
      } else presente_carga='';
    }

    //-------------INICIO DE CARGA--------------
    pos = response_text.indexOf("Inicio de Carga", 1);
    if (pos!==-1){ // si se encuentra obtenerlo
      //<strong>13:00 | 03/01/2026</strong>
      pos= response_text.indexOf("<strong>", pos+1);
      pos_2=response_text.indexOf("</strong>", pos+8);
      inicio_carga=response_text.slice(pos+8,pos_2);
    } else inicio_carga='';

    //-------------FIN DE CARGA--------------
    pos = response_text.indexOf("Fin de carga", 1);
    if (pos!==-1){ // si se encuentra obtenerlo
      //<strong>13:00 | 03/01/2026</strong>
      pos= response_text.indexOf("<strong>", pos+1);
      pos_2=response_text.indexOf("</strong>", pos+8);
      fin_carga=response_text.slice(pos+8,pos_2);
    } else fin_carga='';


    lista_historial[contador]=[item, llegada_origen, llegada_destino ,inicio_descargue,fin_descargue , qr_descarga,presente_carga,fin_carga,inicio_carga];


    acciones_fechas= [transformarFecha(fin_descargue),transformarFecha(inicio_descargue) ,transformarFecha(qr_descarga) ,transformarFecha(fin_carga) ,transformarFecha(inicio_carga) ,presente_carga];
    ultima_accion_fecha=fecha_mayor(acciones_fechas);
    ayuda_visual_fecha=barraDeCarga(ultima_accion_fecha);

    // Verificar titulo y placa
    if (lista_placas[item]) {
      placa=lista_placas[item][0];
      if (ut_4x4.includes(placa)){
        placa=`<span style="color: orange"><strong> ${placa} </strong></span>`;
      }
      titulo_viaje=lista_placas[item][1]
    } else {
      placa='N/A',titulo_viaje='';
    }


    tabla+=`<tr>
    <td> ${ayuda_visual_fecha}   </td>
    <td><input type="checkbox" class="check_pedro"><h3> ${item} </h3></td> 
    <td><h3> ${titulo_viaje} </h3></td>
    <td><h1> ${placa} </h1></td>
    <td><strong> ${fin_descargue} </strong></td>
    <td> ${inicio_descargue}</td>
    <td style="color: white;background-color: black;" ><strong> ${qr_descarga} </strong></td>
    <td style="background-color: green; color: white;"><strong> ${transformarFecha(fin_carga)} </strong></td>
    <td style="background-color: lightblue;"><strong> ${transformarFecha(inicio_carga)} </strong></td>
    <td style="background-color: orange;"><strong><h3 onclick="navigator.clipboard.writeText('${presente_carga}');">${presente_carga}</h3></strong></td></tr>`;
    
    contador+=1;
    progreso=((contador/total_lineas)*100).toFixed(2);
    console.log('HISTORIAL DE VIAJE',hora_actual(),item,`Progreso: ${progreso}%` );
  
  }

  div_fecha_prom_d.innerHTML = `
  <table class="table table-striped table-bordered table-hover table-highlight table-checkable dataTable no-footer"><thead><tr>
  <th>Lejania</th>
  <th>Referencia</th>
  <th> Título Viaje </th>
  <th style="background-color: red; color: white;">Placa?</th>
  <th>Fin Descargue</th>
  <th>Inicio Descargue</th>
  <th>QR Llegada Destino</th>
  <th>Fin de Carga</th>
  <th>Inicio de Carga</th>
  <th>Presenta para Carga</th></tr></thead>
  ${tabla}</table>`;
}


//------------MIS CARGAR-------------
async function buscar_mis_cargas() {
  tabla = '';
  // Separar cada línea, eliminar líneas vacías
  const lineas= eliminar_lineas_vacias(textarea.value);
  let contador=0;let total_lineas=lineas.length;

  const url_historial='https://efletexia.com/transportista/listadoCargas?buscaTitulo='

  //CARGAR EL HISTORIAL DE VIAJE MEDIANTE LINK
  var lista_mis_cargas=[];
  var pos,pos_2, ref_padre,ref_hijo, placa,titulo_viaje, status_html,status,status_carga;
  for (const item of lineas) {
    const response_json = await fetch(url_historial+ item).then(response => response.json());

    //-----algunas ref se duplican por q tienen codigo de AJE----------
    //FILTRARLAS
    try {
      if (response_json.recordsTotal >1) {
        for (const record of response_json.data) {
          if (record.id.indexOf("Ref."+item)!==-1){
            ref_data=record;
            break;
          }
        }
      }
      else ref_data=response_json.data[0];
    } 
    catch (error) {ref_data='';}


    //ref_data=response_json.data[0];

    //--------------JSON: ID------------------------
    //<b><font class='flet-lab'>Ref.931316 Ref hijo: 931317</b> DESPACHO PLANTA CHICLAYO - SALEM HUACHIPA
    //  (UT CON GPS) PLATAFORMA CARGAR 26-01-26</font>
    try {response_text=ref_data.id;} 
    catch (error) {response_text='';}

    //-------------REF PADRE--------------
    pos = response_text.indexOf("Ref.", 1);
    if (pos!==-1){ // si se encuentra obtenerlo
      pos_2= response_text.indexOf(" ", pos+4);
      ref_padre=response_text.slice(pos+4,pos_2);
      //hay veces esta en negrita el ref padre
      if (ref_padre.indexOf("<")!==-1)ref_padre=ref_padre.slice(0,ref_padre.indexOf("<"));
      

    } else ref_padre='';

    //-------------REF HIJO--------------
    pos = response_text.indexOf("hijo: ", pos_2);
    if (pos!==-1){ // si se encuentra obtenerlo
      pos_2= response_text.indexOf("<", pos+6);
      ref_hijo=response_text.slice(pos+6,pos_2);
    } else ref_hijo='';

    //-------------TITULO VIAJE--------------
    pos = response_text.indexOf(">", pos_2);
    if (pos!==-1){ // si se encuentra obtenerlo
      pos_2= response_text.indexOf("<", pos+1);
      titulo_viaje=response_text.slice(pos+1,pos_2);
    } else titulo_viaje='';


    //--------------JSON: PLATE------------------------
    //<font class='flet-lab'>ATT754</font>
    try {response_text=ref_data.plate;} 
    catch (error) {response_text='';}
    //-------------PLACA--------------
    pos = response_text.indexOf(">", 1);
    if (pos!==-1){ // si se encuentra obtenerlo
      pos_2= response_text.indexOf("<", pos+1);
      placa=response_text.slice(pos+1,pos_2);
    } else placa='';

    //--------------JSON: STATUS------------------------
    //<span class='label label-danger'>Pendiente de asignación</span>
    try {response_text=ref_data.status;} 
    catch (error) {response_text='';}

    //-------------STATUS--------------
    pos = response_text.indexOf(">", 1);
    if (pos!==-1){ // si se encuentra obtenerlo
      pos_2= response_text.indexOf("<", pos+1);
      status=response_text.slice(pos+1,pos_2);
      status_html= response_text;
    } else {status='';status_html='';}
    //-----------------------------------------

    if (status){
      // SOLO HAY 2 ESTADOS EN CARGA:
      // PENDIENTE Y CARGO
      status_carga='CARGO';
      //console.log('status:',status);

      switch (status) {
        case 'Pendiente de asignación':
        case 'Pendiente de carga':
          status_carga='PENDIENTE';
          break;
      }
    }

    if (item==ref_padre) ref_original=`<h3 style="color:lime;">${item}</h3>`;
    else ref_original=`<h3 style="color: red;">${item}</h3>`;

    tabla+=`<tr>
    <td>${ref_original}</td>
    <td>${ref_padre}</td> <td>${ref_hijo}</td> 
    <td><h3> ${titulo_viaje} </h3></td>
    <td><h1> ${placa} </h1></td>
    <td> ${status_html}</td>
    <td><h3>${status}</h3></td>
    <td><h3>${status_carga}</h3></td>
    `;

    contador+=1;
    progreso=((contador/total_lineas)*100).toFixed(2);
    console.log('MIS CARGAS',hora_actual(),item,`Progreso: ${progreso}%` );

  }

  div_fecha_prom_d.innerHTML = `
  1- CONVERTIR TODO EN TABLA <BR>
  2- PEGAR EN COLUMNA Y DESDE LA POSICION DE COPIADO ESTA FORMULA<BR>
  =BUSCARV(VALOR(LIMPIAR(ESPACIOS(B3894)));Tabla1[#Todo];8;FALSO)  <BR>
  DONDE X ES LA COLUMNA DONDE ESTA LA REF
  3- ARRASTRAR HASTA DONDE SE SELECCIONO
  4- ejecuta el script de conversion de formula a texto
  5- aplicar formato condicional para resaltar PENDIENTE en rojo y CARGO en verde

  <table class="table table-striped table-bordered table-hover table-highlight table-checkable dataTable no-footer"><thead><tr>
  <th>Ref Original</th>
  <th>Ref Padre</th>
  <th>Ref Hijo</th>
  <th> Título Viaje </th>
  <th>Placa</th>
  <th>Status HTML</th>
  <th>Status</th>
  <th>Cargo?</th>
  </tr></thead>
  ${tabla}</table>`;
}





document.getElementById('btn_obtener').addEventListener('click', buscar_fecha_despachador);
document.getElementById('btn_historial').addEventListener('click', buscar_historial_viaje);
document.getElementById('btn_mis_cargas').addEventListener('click', buscar_mis_cargas);
//----------------------------------------