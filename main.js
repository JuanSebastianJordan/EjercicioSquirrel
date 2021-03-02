async function squirrel(){
    /* Obtener informacion */
    let prom = await fetch("https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json");
    let eventos = await prom.json();
    let body = document.getElementsByTagName("tbody")[0];
    /* Map para guardar los TP y FN de un evento */
    let map = new Map();
    let allPos = 0;
    /* Crear primera tabla y poblar el Map */
    for (let i = 0; i < eventos.length; i++) {
        let event = eventos[i].events.join(",");
        let evento = eventos[i].events;
        let squirrel = eventos[i].squirrel;
        for (let j = 0; j < evento.length; j++) {
            let element = evento[j];
            let elem = map.get(element);
            if(elem!=undefined){
                if(squirrel){
                    elem.TP+=1;
                    map.set(element, elem);
                }
                else{
                    elem.FN+=1;
                    map.set(element, elem);
                }
            }
            else{
                if(squirrel){
                    map.set(element, {
                        "FN":0,
                        "TP":1})
                }
                else{
                    map.set(element, {
                        "FN":1,
                        "TP":0})
                }

            }
            
        }
        /* Crear fila */
        let fila = document.createElement("tr");
        /* Verificar si es true y resaltar */
        if(squirrel){
            allPos++;
            fila.className="table-danger";
        }

        /* Crear celdas */
        let celda = document.createElement("th");
        let textoCelda = document.createTextNode(i+1);

        celda.appendChild(textoCelda);

        let celda2 = document.createElement("td");
        let textoCelda2 = document.createTextNode(event);

        celda2.appendChild(textoCelda2);

        let celda3 = document.createElement("td");
        let textoCelda3 = document.createTextNode(squirrel);

        celda3.appendChild(textoCelda3);

        fila.appendChild(celda);
        fila.appendChild(celda2);
        fila.appendChild(celda3);
        body.appendChild(fila);
    }
    let body2 = document.getElementsByTagName("tbody")[1];
    let k = 0;
    let arr = [];
    /* Recorrer Map y calcular la correlacion */
    for(const [key, value] of map){

        let tp = value.TP; 
        let fp = allPos-value.TP
        let fn = value.FN;
        let tn = eventos.length - tp - fp - fn;
        let corr = MCC(tp,tn,fp,fn);
        arr[k]={"Evento": key, "corr":corr};

        k++;

    } 
    /* Ordenar informacion */
    arr.sort((a, b) => {
        if(a["corr"]<b["corr"]){
            return 1;
        }
        else if (a["corr"]>b["corr"]){
            return -1
        }
        return 0;
    });
    /* Crear segunda tabla */
    for (let k = 0; k < arr.length; k++) {
        let element = arr[k];
        /* Crear fila*/
        let fila = document.createElement("tr");
        /* Crear celdas */
        let celda = document.createElement("th");
        let textoCelda = document.createTextNode(k+1);

        celda.appendChild(textoCelda);

        let celda2 = document.createElement("td");
        let textoCelda2 = document.createTextNode(element["Evento"]);

        celda2.appendChild(textoCelda2);

        let celda3 = document.createElement("td");
        let textoCelda3 = document.createTextNode(element["corr"]);

        celda3.appendChild(textoCelda3);

        fila.appendChild(celda);
        fila.appendChild(celda2);
        fila.appendChild(celda3);
        body2.appendChild(fila);

    }

}
/* Funcion que obtiene el MCC */
function MCC(tp, tn, fp, fn){
    let x = (tp*tn)-(fp*fn);
    let y = Math.sqrt((tp+fp)*(tp+fn)*(tn+fp)*(tn+fn));
    return x/y;
}
/* LLamado a la funcion */
squirrel();