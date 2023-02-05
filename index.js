const express = require('express');
const app = express();
const servidor = require('http').Server(app);

const io = require("socket.io")(servidor, {
    cors: {
        //Esto se cambia (http://localhost:3000)
        //esto tmb se cambia al link vercel
        //https://chat-masivo.vercel.app/
        origin: "https://chat-masivo.vercel.app",
        methods: ["GET", "POST"]
    }
});
app.get('/', function(req,res){
    res.status(200).send("Estamos respondiendo");
});

servidor.listen(process.env.PORT || 8080, () => console.log("Servidor escuchando"));

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

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://chat-masivo.vercel.app"); 
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, Access-Control-Allow-Credentials');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});