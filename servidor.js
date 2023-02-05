const express = require('express');
const app = express();
const servidor = require('http').Server(app);

const io = require("socket.io")(servidor, {
    cors: {
        //Esto se cambia (http://localhost:3000)
        //esto tmb se cambia al link netlify
        //https://615b748f7f5ec21b8268b3b2--mensajeriawtf.netlify.app
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
app.get('/', function(req,res){
    res.status(200).send("Estamos respondiendo");
});

servidor.listen(process.env.PORT ||8080, () => console.log("Servidor escuchando"));

io.on('connection', (socket) => {
    let nombre;
    let foto;
    socket.on('conectado',(nomb, photo)=>{
        nombre = nomb;
        foto = photo;
        io.emit('mensajes',{nombre : nombre,mensaje: `${nombre} entró al chat`, foto:foto});
    });

    socket.on('mensaje', (nombre,mensaje,foto,hora)=>{
        io.emit('mensajes',{nombre,mensaje,foto,hora});
    });
    socket.on('disconnect',()=>{
        io.emit('mensajes',{nombre: nombre, mensaje:`${nombre} abandonó la sala`, foto:foto})
    });
});

app.use(express.static('frontend'));