//Variables globales
var areaJ = document.querySelector("#areaJ");
var esp = 40;
var tiempo = 0;
function dos0(n){
    if(n>=10)
        return "" + n;
    else
        return "0" + n;
}
function aumentarTiempo(velocidad){
    tiempo++;
    var tiempoReal = Math.floor(tiempo * velocidad * 0.001);
    document.getElementById("tiempo").innerText =
dos0(Math.floor(tiempoReal / 60)) + ":" + dos0(tiempoReal % 60);
}
var puntuacion = 0;
function addPuntuacion(value){
    puntuacion += value;
    document.getElementById("Puntuacion").innerText = puntuacion;
}
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}
var musica = new sound("music.mp3");
musica.sound.loop = true;
var waiting = true;
addEventListener("keydown", function(e){
    if(waiting){
        waiting = false;
        musica.play();
    }
});
//clases
class Cabeza {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.cuadros = new Array();
        this.siguiente = null;
        this.construirCuerpo();
        this.asignarClases();
        this.mover(this.x,this.y);
        this.agregarElementos();
    }
    construirCuerpo(){
        for(var i=0; i<4;i++){
            this.cuadros[i] = document.createElement("div");
        }
    }
    asignarClases(){
        this.cuadros[0].className = "snake";
        this.cuadros[1].className = "snake tapa";
        this.cuadros[2].className = "snake atras";
        this.cuadros[3].className = "snake alante";
    }
    mover(x,y){
        if(this.siguiente != null){
            this.siguiente.mover(this.x,this.y);
        }
        this.x = x;
        this.y = y;
        for(var i=0; i<this.cuadros.length; i++){
            this.cuadros[i].style.left = this.x+"px";
            this.cuadros[i].style.top = this.y+"px";
        }
    }
    agregar(){
        if(this.siguiente == null){
            this.siguiente = new Cabeza(this.x,this.y);
        } else {
            this.siguiente.agregar();
        }
    }
    agregarElementos(){
        for(var i=0; i<this.cuadros.length; i++){
            areaJ.appendChild(this.cuadros[i]);
        }
    }
    choqueBloque(otro){
        var difx = Math.abs(this.x - otro.x);
        var dify = Math.abs(this.y - otro.y);
        if(difx < 40 && dify < 40){
            return true;
        } else {
            return false;
        }
    }
    verSiguiente(){
        return this.siguiente;
    }
}

class Comida {
    constructor(){
        this.cuadros = new Array();
        this.construirCuerpo();
        this.asignarClases();
        this.colocar();
        this.agregarElementos();
    }
    construirCuerpo(){
        for(var i=0; i<4;i++){
            this.cuadros[i] = document.createElement("div");
        }
    }
    asignarClases(){
        this.cuadros[0].className = "snake comida";
        this.cuadros[1].className = "snake tapa comida";
        this.cuadros[2].className = "snake atras comida";
        this.cuadros[3].className = "snake alante comida";
    }
    posAl(){
        return (Math.round(Math.random() * 9))*40;
    }
    colocar(){
        this.x = this.posAl();
        this.y = this.posAl();
        for(var i=0; i<this.cuadros.length; i++){
            this.cuadros[i].style.left = this.x+"px";
            this.cuadros[i].style.top = this.y+"px";
        }
    }
    agregarElementos(){
        for(var i=0; i<this.cuadros.length; i++){
            areaJ.appendChild(this.cuadros[i]);
        }
    }
}

//Objetos y variables del juego
var snake = new Cabeza(0,0);
var comida = new Comida();
var xidr = 0;
var ydir = 0;
var ejex = true;
var ejey = true;
//Motor juego
document.addEventListener("keydown", function(){
    var cod = event.keyCode;
    if(ejex){
        if(cod == 38){
            xdir = 0;
            ydir = -esp;
            ejex = false;
            ejey = true;
        }
        if(cod == 40){
            xdir = 0;
            ydir = esp;
            ejex = false;
            ejey = true;
        }
    }
    if(ejey){
        if(cod == 37){
            xdir = -esp;
            ydir = 0;
            ejex = true;
            ejey = false;
        }
        if(cod == 39){
            xdir = esp;
            ydir = 0;
            ejex = true;
            ejey = false;
        }
    }
});
function mover(){
    var nx = snake.x + xdir;
    var ny = snake.y + ydir;
    snake.mover(nx,ny);
}
function colisiones(){
    if(snake.choqueBloque(comida)){
        snake.agregar();
        comida.colocar();
      addPuntuacion(100);
    }
    if(snake.x < 0 || snake.x > 360 || snake.y < 0 || snake.y > 360){
        findejuego();
    }
    var temp = null;
    try{
        temp = snake.verSiguiente().verSiguiente();
    } catch(err){
        temp = null;
    }
    while(temp != null){
        if(snake.choqueBloque(temp)){
            findejuego();
            temp = null;
        } else {
            temp = temp.verSiguiente();
        }
    }
}
function findejuego(){
    alert("Perdiste");
    document.location.reload();
}
function bucle(){
    mover();
    colisiones();
    aumentarTiempo(500);
}
setInterval("bucle()", 500);