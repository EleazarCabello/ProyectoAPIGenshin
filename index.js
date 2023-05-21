const express = require('express');
const cors = require('cors');
const app = express()
const mysql = require('mysql2/promise')



app.use(express.json());
app.use(express.text());
app.use(cors);

app.get('/personaje',async(req,res)=>{
    let aletorio = Math.floor(Math.random()*68) + 1 ;
    const connection = await mysql.createConnection({host:'localhost', user:'root', database:'genshin_impact'});
    //const sentenciaSQL = `SELECT * FROM personajes WHERE id = ${aletorio}`;
    const [rows, fields] = await connection.execute('SELECT * FROM `personajes` WHERE id = 1');

    if(rows.length == 0){
        res.json({registros:"No se encontro usuario"});
    }else{
        res.json(rows);
    }
})

app.use((req,res)=>{
    res.status(404).json({estado:"Pagina no encontrada"})
})

app.listen(8082,()=>{
    console.log("Servidor Express corriendo y escuchando en el puerto 8082")
})