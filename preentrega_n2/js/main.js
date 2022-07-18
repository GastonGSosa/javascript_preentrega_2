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

//Creo un array con los componentes de las cartas en el DOM
const divsCartas=[divBasicas,divNormales,divRaras,divEpicas,divLegendarias]

//Creo una constante para cada mano, una del jugador y una del rival
const divJugador = document.getElementById('divCartasJugador')
const divRival = document.getElementById('divCartasRival')

//Creo una funcion para armar los divs con las cartas seleccionadas por el jugador y subsecuentemente las cartas del rival, los argumentos son 
// las manos (array con las 5 cartas ya dentro) y el div donde va a ser armado el group card 
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

//Itero por las rangos de cartas, y por cada rango, consulto el DOM para cada div por cada rango, para luego agregar una card(bootstrap) por carta y rango.
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

//Acá le agrego el evento para pasar a la siguiente fase, la cuál sería confirmar la mano y orden de cartas.
botonBatalla.addEventListener('click', ()=>{
    
    //Creo un condicional, si la mano del jugador no contiene las 5 cartas, emite un error.
    if(manoJugador.length !== 5 ){
        document.getElementById('alertaErrorBatalla').innerText='¡NO HAS SELECCIONADO 5 CARTAS, POR FAVOR REVISA!'
    }
    else {                                                                  //Si el jugador eligió las 5 cartas, prosigo.
        document.getElementById('divCartas').innerHTML=""                   //Limpio el div donde se eligen las cartas.
        document.getElementById('alertaErrorBatalla').innerHTML=""          //Vacío el div del error.

        //Acá itero por el mazo, y tomo las cartas que el jugador no haya agregado a su mano.
        MAZO.forEach(carta => { 
            if (manoJugador.includes(carta)){                               //Chequeo por cada carta, si es que existe en la mano del jugador
                console.log(`la carta ${carta.nombre} ya esta en la mano del jugador`)
            }
            else {
                manoRival.push(carta)                                       //Si la carta no esta en la mano, puedo agregarla a la mano del rival.
            }
            console.log(manoRival)                                          //Confirmo las cartas del rival en la consola.
        })  
        armarDivManos(manoJugador,divJugador)                               //Armo el div con las cartas del jugador
        armarDivManos(manoRival,divRival)                                   //Armo el div con las cartas del Rival

    }
})
/*
    TO DO: 

    1) AGREGAR LAS CARTAS QUE NO ESTAN SELECCIONADAS EN MAZO A LA MANO DEL RIVAL ( x )

    2) MOSTRAR EN UN DIV, TODAS LAS CARTAS NUESTRAS Y LAS CARTAS DEL RIVAL, VER CÓMO HACER PARA CAMBIAR DE LUGAR LAS CARTAS (  )

    3) LUEGO DE ESO Y DE CONFIRMAR PARA IR A LA BATALLA, BORRAR TODO LO QUE ESTÁ DENTRO DEL DIV "divCartas" - ESTE DIV LUEGO VA A SER EL "CAMPO DE BATALLA" ()

*/




















//creo una funcion dado, para ver quién ataca primero
const dado = () => {
    return Math.round(Math.random()*6)
}