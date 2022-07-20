/* 
La idea del juego es que es un juego "De cartas" al estilo Magic The gathering, o Heartstone.
El usuario es un 'Duque' que controla tierras, y tiene "cartas"
Las cartas son básicamente plebeyos con vida y ataque.

El modo de juego que intento hacer es el siguiente: 

Hay un mazo de 10 cartas, se reparten de manera aleatoria entre el jugador y una IA ("IA"... nada más es un random, quizás pueda agregarle algo más "Razonable")
Cada jugador tendrá 5 cartas que se repartiran de manera aleatoria, luego los jugadores decidirán el orden en que las cartas "combatirán".

El combate básicamente es por turnos, primero ataca una, se le resta el ataque de una, a la vida de la otra carta, cuando llega a 0, esa carta se va, y sigue la siguiente carta.
cuando uno de los jugadores queda sin cartas, pierde.
*/
//LO PRIMERO ES DEFINIR LAS CARTAS, PARA ESO CREO UNA FUNCION CONSTRUCTORA, VENDRÍA A INTRODUCIR UN "TEMPLATE" PARA LAS CARTAS
class Carta {
    constructor (id, nombre, hp, ataque, rango="basicas"){
    this.id = id
    this.nombre=nombre
    this.hp=hp
    this.ataque=ataque
    this.rango=rango
    }
    atacar (objetivo){
        objetivo.hp-=this.ataque
    }
}

// Creo 10 cartas distintas 2 por cada rango de rareza - esto va a hacer que luego se repartan equitativamente
const carta1= new Carta (1,"Granjero agresivo",3,1)
const carta2= new Carta (2,"Chef loco",2,2)
const carta3= new Carta (3,"Milicia sucia",4,2,"normales")
const carta4= new Carta (4,"Mercenario",2,4,"normales")
const carta5= new Carta (5,"Caballero Pesado",7,3,"raras")
const carta6= new Carta (6,"Asesino",4,6,"raras")
const carta7= new Carta (7,"Lancero",8,4,"epicas")
const carta8= new Carta (8,"Maestro de la espada",7,6,"epicas")
const carta9= new Carta (9,"Hechicero",6,8,"legendarias")
const carta10= new Carta (10,"Caballero Real",12,6,"legendarias")

//Creo un array Mazo con todas las cartas
const MAZO = [carta1,carta2,carta3,carta4,carta5,carta6,carta7,carta8,carta9,carta10]
//Creo 2 arrays para las manos
const manoJugador=[]
const manoOponente=[]

//Creo unos arrays, separando las cartas por rango
const basicas = MAZO.filter(carta => carta.rango=="basicas")
const normales = MAZO.filter(carta => carta.rango=="normales")
const raras = MAZO.filter(carta => carta.rango=="raras")
const epicas = MAZO.filter(carta => carta.rango=="epicas")
const legendarias = MAZO.filter(carta => carta.rango=="legendarias")
const ordenadas = [basicas,normales,raras,epicas,legendarias]

//creo una funcion dado, para ver quién ataca primero
const dado = () => {
    return Math.round(Math.random()*6)
}

/* alert('Para armar su mano, usted deberá elegir con cuáles cartas va a jugar.')
alert('Se le presentaran 2 cartas por rango, de menor a mayor son:')
alert('Basicas, Normales, Raras, Epicas y Legendarias')
alert('Tendrá 2 opciones por cada rango, tenga en cuenta que usted jugará contra la carta que NO elija')
 */

//Creo una función que le da a elegir al jugador las cartas con las que jugará.
function armarManos(mano1,mano2,mazo) {
    let eleccion //Esta variable existe sólo para tener la elección del jugador
    mazo.forEach(rango => {
            do{
                eleccion=parseInt(prompt(`Cartas rango ${rango[0].rango}: 
                ----------------------------
                Opción 1        
                Nombre: ${rango[0].nombre}
                HP: ${rango[0].hp}
                Ataque: ${rango[0].ataque} 
                -----------------------------
                Opción 2 
                Nombre: ${rango[1].nombre}
                HP: ${rango[1].hp}
                Ataque: ${rango[1].ataque} 
                -----------------------------     
                Por favor ingrese cuál opción elige (1 o 2):`))
            } while (isNaN(eleccion) || eleccion<1 || eleccion>2)
            if (eleccion ===1){
                mano1.push(rango[0])
                mano2.push(rango[1])
            }
            else {
                mano1.push(rango[1])
                mano2.push(rango[0])
            }
    });
} 

armarManos(manoJugador,manoOponente,ordenadas)

function cambiarPosicionCarta (jugador,posini,posfin) {
    let algo=jugador[posfin]
    jugador[posfin]=jugador[posini]
    jugador[posini]=algo
    }

let cambio

do {cambio=prompt(`Estas son tus cartas:
    1º: ${manoJugador[0].nombre}
    2º: ${manoJugador[1].nombre}
    3º: ${manoJugador[2].nombre}
    4º: ${manoJugador[3].nombre}
    5º: ${manoJugador[4].nombre}
---------------------------------
Quiere modificar las posiciones en que jugarán? (Y/N)
`)}while (!cambio.toLowerCase()==='y' || !cambio.toLowerCase()==='n')

while (cambio.toLowerCase()==='y'){
    let posIni
    let posFin
    do{
        posIni=parseInt(prompt('Qué nº de carta quiere cambiar? (1,2,3,4,5)'))
    } while(isNaN(posIni) || posIni<1 || posIni>5)
    do {
        posFin=parseInt(prompt('A qué posición la quiere cambiar? (1,2,3,4,5)'))
    } while(isNaN(posFin) || posFin<1 || posFin>5)
    
    cambiarPosicionCarta(manoJugador,(posIni-1),(posFin-1))
    cambio=prompt(`Estas son tus cartas:
    1º: ${manoJugador[0].nombre}
    2º: ${manoJugador[1].nombre}
    3º: ${manoJugador[2].nombre}
    4º: ${manoJugador[3].nombre}
    5º: ${manoJugador[4].nombre}
---------------------------------
Quiere volver a modificar las posiciones en que jugarán? (Y/N)
`).toLowerCase()
}

cambiarPosicionCarta(manoOponente,4,0)

console.table(manoJugador)
console.table(manoOponente)

function batalla (mano1,mano2) {
    while (mano1.length>0 && mano2.length>0)
     {
        mano1[0].atacar(mano2[0])
        console.log(`${mano1[0].nombre} atacó a ${mano2[0].nombre} por
        ${mano1[0].ataque} puntos de daño!`)
        if (mano2[0].hp<1){
            console.log(`${mano2[0].nombre} ha sido eliminado/a!`)
            mano2.splice(0,1)
        }
        if(mano2.length>0){
            mano2[0].atacar(mano1[0])
            console.log(`${mano2[0].nombre} atacó a ${mano1[0].nombre} por
            ${mano2[0].ataque} puntos de daño!`)
            if (mano1[0].hp<1){
            console.log(`${mano1[0].nombre} ha sido eliminado/a!`)
            mano1.splice(0,1)
        }
        }
    } 
    if (mano1.length>0){
        console.log('JUAGADOR 1 HA GANADO!')
    }
    else {
        console.log('HAS MUERTO')
    }
}


console.log('Se tiraron los dados para la batalla!')


let turnoJugador=dado()
let turnoOponente=dado()
console.log('El jugado ha sacado '+ turnoJugador)
console.log('El oponente ha sacado '+turnoOponente)

if(turnoJugador>turnoOponente){
    alert('Comienza el jugador!')
    batalla(manoJugador,manoOponente)
}
else {
    alert('Comienza el Oponente')
    batalla(manoOponente,manoJugador)
}
