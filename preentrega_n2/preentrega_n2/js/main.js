/************************************************************************************************************************************************** */
/*                                                                CREACION DE CLASES                                                                */
/************************************************************************************************************************************************** */

//Creo una clase para crear cartas, y les doy el método Atacar
class Carta {
    constructor (id, nombre, hp, ataque, rango='basicas',color='lightgrey') {
        this.id=id
        this.nombre=nombre
        this.hp=hp
        this.ataque=ataque
        this.rango=rango
        this.color=color
    }
    atacar (objetivo){
        objetivo.hp-=this.ataque
    }
}

/************************************************************************************************************************************************** */
/*                                                     DECLARACION DE VARIABLES Y CONSTANTES                                                        */
/************************************************************************************************************************************************** */


// Creo 10 cartas distintas 2 por cada rango de rareza - esto va a hacer que luego se repartan equitativamente
const carta1= new Carta (1,"Granjero agresivo",3,1)
const carta2= new Carta (2,"Carnicero psicópata",2,2)
const carta3= new Carta (3,"Milicia sucia",4,2,"normales",'#2ecc71')
const carta4= new Carta (4,"Mercenario",2,3,"normales",'#2ecc71')
const carta5= new Carta (5,"Caballero Pesado",7,3,"raras",'#2e86c1')
const carta6= new Carta (6,"Asesino",4,6,"raras",'#2e86c1')
const carta7= new Carta (7,"Lancero",8,4,"epicas",'#7d3c98')
const carta8= new Carta (8,"Maestro de la espada",7,6,"epicas",'#7d3c98')
const carta9= new Carta (9,"Hechicero",8,8,"legendarias",'#e67e22')
const carta10= new Carta (10,"Caballero Real",14,6,"legendarias",'#e67e22')

//Creo un array Mazo con todas las cartas
const MAZO = [carta1,carta2,carta3,carta4,carta5,carta6,carta7,carta8,carta9,carta10]

//Creo 2 arrays para las manos
const manoJugador=[]
const manoRival=[]

//creo una constante para el form
const form=document.getElementById('idForm')

//Creo una variable para el nombre del jugador
let nombreJugador=""

//Agrego el form desde el DOM con el nombre que será del jugador.
form.addEventListener('submit',(e)=>{
    e.preventDefault()
    let datForm = new FormData(e.target)
    nombreJugador=datForm.get('nombreJugador')
    localStorage.setItem('storageNombre',JSON.stringify(nombreJugador))
    form.reset()
    form.innerHTML=""
    document.getElementById('presentacionJugador').innerHTML=`<h2>${nombreJugador}, por favor, elija una carta de cada rango!</h2>`
})

//Consulto el storage para ver si ya existe el jugador, sino le da nombre
if(localStorage.getItem('storageNombre')) {
    nombreJugador = JSON.parse(localStorage.getItem('storageNombre'))
    form.innerHTML=""
    document.getElementById('presentacionJugador').innerHTML=`<h2>${nombreJugador}, por favor, elija una carta de cada rango!</h2>`
} else {
    localStorage.setItem('storageNombre', JSON.stringify(nombreJugador))
}

//Creo constante para iniciar la batalla con un botón
const botonBatalla=document.getElementById('botonBatalla')

//Creo unos arrays, separando las cartas por rango
const basicas = MAZO.filter(carta => carta.rango=="basicas")
const normales = MAZO.filter(carta => carta.rango=="normales")
const raras = MAZO.filter(carta => carta.rango=="raras")
const epicas = MAZO.filter(carta => carta.rango=="epicas")
const legendarias = MAZO.filter(carta => carta.rango=="legendarias")
const ordenadas = [basicas,normales,raras,epicas,legendarias]

//Consulto el DOM para obtener los divs donde voy a ofrecer las cartas
const divBasicas=document.getElementById('divBasicas')
const divNormales=document.getElementById('divNormales')
const divRaras=document.getElementById('divRaras')
const divEpicas=document.getElementById('divEpicas')
const divLegendarias=document.getElementById('divLegendarias')

//Consulto el DOM para traerme el div recargar
const divCancelar= document.getElementById('cancelar')

//Consulto el DOM para traerme el div Batallar
const divBatallar = document.getElementById('batallar')

//DOM para traerme divs de la batalla
const batallaJugador=document.getElementById('colCartaJugador')
const batallaRival=document.getElementById('colCartaRival')
const batallaText=document.getElementById('colTexto')

//Creo un array con los componentes de las cartas en el DOM
const divsCartas=[divBasicas,divNormales,divRaras,divEpicas,divLegendarias]

//Creo una constante para cada mano, una del jugador y una del rival
const divJugador = document.getElementById('divCartasJugador')
const divRival = document.getElementById('divCartasRival')


/************************************************************************************************************************************************** */
/*                                                           CONSTRUCCIÓN DE FUNCIONES                                                              */
/************************************************************************************************************************************************** */

//Primera funcion que se corre, para armar el html -Itero por las rangos de cartas, y por cada rango, consulto el DOM para cada div por cada rango, para luego agregar una card(bootstrap) por carta y rango.
function armarSeleccionDeCartas(){
    ordenadas.forEach((rangos,index) =>{
        rangos.forEach(carta => { //
            divsCartas[index].innerHTML += //
                (`
                <div class="col md-3">
                    <div class="card" style="width: 15rem; margin:4px; background-color:${carta.color}" id="carta${carta.id}">
                        <img src="images/cards/${carta.id}.png" style="padding:4px;" class="card-img-top" alt="${carta.nombre}-image">
                        <div class="card-body">
                            <h5 class="card-title h4 text-center"><b>${carta.nombre}</b></h5>
                        </div>
                        <ul class="list-group list-group-flush text-center">
                            <li class="list-group-item">🩸​ HP: ${carta.hp}</li>
                            <li class="list-group-item">⚔️​ ATAQUE: ${carta.ataque}</li>
                        </ul>
                        <div class="card-footer text-center">
                            <button class="btn btn-primary" id="botonCarta${carta.id}">Elegir!</button>
                            <button class="btn btn-secondary" id="botonCancelar${carta.id}" disabled>Remover!</button>
                        </div>
                    </div>
                </div>
                `)
            })
        })
}

//Segunda función que se corre, esta va directamente después que la primera, agrega funcionalidad a los botones de las cartas que se crearon en la primer función.
function armarManosJugadores() {
    //ESTE FOR EACH ESTA PORQUE EN EL ANTERIOR NO ENTIENDO POR QUÉ AGREGA FUNCIONALIDAD SÓLO AL ÚLTIMO ELEMENTO DE CADA RANGO.
ordenadas.forEach(rangos=>{ 
    rangos.forEach(carta => {
        //Agrego un evento al boton 'Elegir' de cada carta. 
        document.getElementById(`botonCarta${carta.id}`).addEventListener('click',()=>{
            
            //Si ya existe una carta con el mismo rango, el boton no hace nada
            if(!manoJugador.some(cartaJugador => cartaJugador.rango===carta.rango)){
                manoJugador.push(carta)                                                     //Si no hay otra carta del mismo rango, la agrego a la mano del jugador.
                document.getElementById(`carta${carta.id}`).classList.add('border-5')       //Cambio el borde a uno más grueso en la carta, para mostrar que está seleccionada.
                console.log(`agregada carta ${carta.nombre} a la mano del jugador`)         //Anuncio en la consola
                document.getElementById(`botonCarta${carta.id}`).disabled=true              //Le doy status disabled al boton para agregar la carta.
                document.getElementById(`botonCancelar${carta.id}`).disabled=false          //Una vez que se agrega la carta, habilito el boton para removerla.
                console.log(manoJugador.length)                                             //Anuncio en la consola.
            }
        })

        //Agrego un evento al boton Cancelar de cada carta
        document.getElementById(`botonCancelar${carta.id}`).addEventListener('click',()=>{

            document.getElementById(`botonCancelar${carta.id}`).disabled=true               //Cuando se presiona, el boton vuelve al estado disabled
            if (manoJugador.find(cartaJugador => cartaJugador.id===carta.id)){              //Chequeo si es que la carta, efectivamente, esta en la mano del jugador
                document.getElementById(`carta${carta.id}`).classList.remove('border-5')    //Si la carta esta, primero remuevo los bordes gruesos
                document.getElementById(`botonCarta${carta.id}`).disabled=false             //Luego le remuevo el disabled del boton elegir, por si la quiere volver a elegir.
                manoJugador.splice(manoJugador.indexOf(carta),1)                            //Remuevo la carta del array manoJugador
                console.log(`Removida carta ${carta.nombre} de la mano del jugador`)        //anuncio en la consola.
            }
        })
    })
})
}

//Creo una funcion para armar los divs con las cartas seleccionadas por el jugador y subsecuentemente las cartas del rival, los argumentos son 
// las manos (array con las 5 cartas ya dentro) y el div donde va a ser armado el group card 
// Esto arma los group cards para confirmar antes de comenzar la batalla,
function armarDivManos (mano,div){
    mano.forEach(carta => {
        div.innerHTML +=`
                        <div class="card" id="jugadorCarta${carta.id}" style="background-color: ${carta.color}">
                            <img src="images/cards/${carta.id}.png" class="card-img-top" alt="imagen carta${carta.id}">
                            <div class="card-body">
                                <h5 class="card-title">${carta.nombre}</h5>
                            </div>
                            <ul class="list-group list-group-flush text-center">
                                <li class="list-group-item">🩸​ HP: ${carta.hp}</li>
                                <li class="list-group-item">⚔️​ ATAQUE: ${carta.ataque}</li>
                            </ul>
                            <div class="card-footer text-center">
                                <p>Rango: ${carta.rango}</p>
                            </div>
                        </div>
                        `
    })
}

//Esta función arma el html y luego se usa para actualizar las cartas mientras están batallando.
function armarCarta(html,mano){
    html.innerHTML=""
    html.innerHTML +=`<div class="container">
                        <div class="card" style="width: 15rem; margin:4px; background-color:${mano.color}" id="batalla${mano.id}">
                            <img src="images/cards/${mano.id}.png" style="padding:4px;" class="card-img-top" alt="${mano.nombre}-image">
                            <div class="card-body">
                                <h5 class="card-title h4 text-center"><b>${mano.nombre}</b></h5>
                            </div>
                            <ul class="list-group list-group-flush text-center">
                                <li class="list-group-item">🩸​ HP: ${mano.hp}</li>
                                <li class="list-group-item">⚔️​ ATAQUE: ${mano.ataque}</li>
                            </ul>
                            <div class="card-footer text-center">
                                <p>Rango: ${mano.rango}</p>
                            </div>
                        </div>
                    </div>`
}


//creo una funcion dado, para ver quién ataca primero
const dado = () => {return Math.round(Math.random()*6)}

//Creo la funcion de batalla
function batalla (mano1, mano2) {

    //1 - cargar la carta (HTML Card) del jugador a la izquierda, el texto en el medio, y el rival a la derecha
    //2 - hacer interactuar las cartas
    //3 - cuando una mano llegue a length=0, se termina el juego, y uno gana o pierde.
    if (mano1.length>0 && mano2.length>0){

        armarCarta(batallaJugador,manoJugador[0])
        armarCarta(batallaRival,manoRival[0])

        mano1[0].atacar(mano2[0])
            batallaText.innerText+=`${mano1[0].nombre} atacó a ${mano2[0].nombre} por
            ${mano1[0].ataque} puntos de daño!`
            if (mano2[0].hp<1){
                batallaText.innerText+=(`${mano2[0].nombre} ha sido eliminado/a!`)
                mano2.splice(0,1)
            }
            if(mano2.length>0){
                mano2[0].atacar(mano1[0])
                armarCarta(batallaJugador,manoJugador[0])
                batallaText.innerText+=(`${mano2[0].nombre} atacó a ${mano1[0].nombre} por
                ${mano2[0].ataque} puntos de daño!`)
                if (mano1[0].hp<1){
                batallaText.innerText+=(`${mano1[0].nombre} ha sido eliminado/a!`)
                mano1.splice(0,1)
            }
            }
    }
    else if (mano1.length>0){
        document.getElementById('batallar').innerHTML=`<p class='h1'>${localStorage.getItem('storageNombre')} HA GANADO!</p>`
        document.getElementById('batallar').innerHTML +=`<button class="btn btn-lg" id="reiniciar">Volver a Empezar.</button>`
        document.getElementById('reiniciar').addEventListener('click',()=>{location.reload()})
    }
    else {
        document.getElementById('batallar').innerHTML="<p class='h1'>EL JUGADOR HA PERDIDO!</p>"
        document.getElementById('batallar').innerHTML +=`<button class="btn btn-lg" id="reiniciar">Volver a Empezar.</button>`
        document.getElementById('reiniciar').addEventListener('click',()=>{location.reload()})
    }
}





/************************************************************************************************************************************************** */
/*                                                                      EJECUCIÓN                                                                   */
/************************************************************************************************************************************************** */

//La Ejecución se divide principalmente en 3 partes: 
//1) La parte de selección de cartas y el armado de la interfaz
//2) Se borra la interfaz de selección, y vamos a una parte de confirmación, con las manos ya armadas
//3) La fase de batalla, en el cuál se ejecuta la función batalla, haciendo interactuar las cartas seleccionadas con las cartas del rival.

////////////////////////// FASE 1

armarSeleccionDeCartas()
armarManosJugadores()


////////////////////////// FASE 2

//Acá le agrego el evento para pasar a la siguiente fase, la cuál sería confirmar la mano y orden de cartas.
botonBatalla.addEventListener('click', ()=>{
    
    //Creo un condicional, si la mano del jugador no contiene las 5 cartas, emite un error.
    if(manoJugador.length !== 5 ){
        document.getElementById('alertaErrorBatalla').innerText='¡NO HAS SELECCIONADO 5 CARTAS, POR FAVOR REVISA!'
    }
    else {                                                                  //Si el jugador eligió las 5 cartas, prosigo.
        document.getElementById('divCartas').innerHTML=""                   //Limpio el div donde se eligen las cartas.
        document.getElementById('alertaErrorBatalla').innerHTML=""          //Vacío el div del error.

        //Acá itero por el mazo, y tomo las cartas que el jugador no haya agregado a su mano para agregarlas a la mano del rival.
        MAZO.forEach(carta => { 
            if (manoJugador.includes(carta)){                               //Chequeo por cada carta, si es que existe en la mano del jugador
                console.log(`la carta ${carta.nombre} ya esta en la mano del jugador`)
            }
            else {
                manoRival.push(carta)                                       //Si la carta no esta en la mano, puedo agregarla a la mano del rival.
            }
            console.log(manoRival)                                          //Confirmo las cartas del rival en la consola.
        })  

        armarDivManos(manoJugador,divJugador,'Jugador')                     //Armo el div con las cartas del jugador
        armarDivManos(manoRival,divRival,'Rival')                           //Armo el div con las cartas del Rival

        divCancelar.innerHTML += '<br><button class="btn btn-dark text-center" id="botonRecargar"> CANCELAR</button>'
         document.getElementById('botonRecargar').addEventListener('click',()=>{
            location.reload()
        })

        divBatallar.innerHTML +=`<button id="botonBatallar" class="btn btn-primary"> Tirar los dados y comenzar la batalla!</button>`
        document.getElementById('botonBatallar').addEventListener('click',()=>{
            document.getElementById('manos').innerHTML=""
            armarCarta(batallaJugador,manoJugador[0])
            armarCarta(batallaRival,manoRival[0])
            //Aca armo el campo de batalla, usando grids de bootstrap, 1 fila para el boton de los turnos, y otra fila (con 3 cols) para cartas y texto

            ////////////////////////// FASE 3
            
            //Si todo esta confirmado y correcto, ejecuto la batalla.
            document.getElementById('botonTurno').innerHTML+='<button class="btn btn-primary btn-lg" id="siguienteTurno">Siguiente turno!</button>'
            document.getElementById('siguienteTurno').addEventListener('click',()=>{

                batalla(manoJugador,manoRival)
                batallaText.style="height:450px; background-color:#EDDFB3;"
            })
        })
    }
})
