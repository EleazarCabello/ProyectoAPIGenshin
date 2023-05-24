const express = require('express')
const app = express()
const mysql = require('mysql2/promise')
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const { SwaggerTheme } = require('swagger-themes');
const fs = require('fs');
const path = require('path');
const redoc = require('redoc-express');
const cors = require('cors')

require('dotenv').config();

const port = process.env.PORT || 8082;
const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || "8082",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "genshin_impact"
};

const theme = new SwaggerTheme('v3');
const options = {
    explorer: true,
    customCss: theme.getBuffer('dark')
  };

  let ContenidoReadme = fs.readFileSync(path.join(__dirname)+'/README.md',{encoding:'utf8',flag:'r'})
  let apidef_string = fs.readFileSync(path.join(__dirname)+'/APIdef.json',{encoding:'utf8',flag:'r'})
  let apidef_objeto = JSON.parse(apidef_string)
  apidef_objeto.info.description=ContenidoReadme;

app.use(express.json());
app.use(express.text());
app.use(cors());

const swaggerOptions = {
    definition: apidef_objeto,
    apis: [`${path.join(__dirname,"./index.js")}`],
    };



 /**
 * @swagger
 * /personaje:
 *  get:
 *    tags:
 *      - Personajes
 *    summary: Consulta de personaje aleatorio.
 *    description: Petición Get a la ruta personaje, regresa un personaje de froma aleatoria.
 *    responses:
 *      200:
 *        description: Regresa un Json con un personaje de forma aleatoria.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/personaje'
 */
app.get('/personaje',async(req,res)=>{
    let aletorio = Math.floor(Math.random()*68) + 1 ;
    const connection = await mysql.createConnection(dbConfig);
    const sentenciaSQL = `SELECT * FROM personajes WHERE id = ${aletorio}`;
    const [rows, fields] = await connection.execute(sentenciaSQL);

    res.json(rows[0]);
})


/**
 * @swagger
 * /personaje/i/{id}:
 *  get:
 *    tags:
 *      - Personajes
 *    summary: Consultar un personaje en especifico por el id.
 *    description: Petición Get a un solo usuario especifico por su id.
 *    parameters:
 *      - name: id
 *        in: path
 *        description: Id del personaje que se quiera consultar.
 *        required: true
 *        schema:
 *          type: integer
 *          format: int64 
 *    responses:
 *      200:
 *        description: Regresa un Json con la informacion del personaje que agrego en los parametros.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/personaje'
 *      400:
 *        description: No se encontro el personaje con ese id.
 */
app.get('/personaje/i/:id',async(req,res)=>{
    const connection = await mysql.createConnection(dbConfig);
    const sentenciaSQL = `SELECT * FROM personajes WHERE id = ${[req.params.id]}`;
    const [rows, fields] = await connection.execute(sentenciaSQL);
    
    if(rows.length == 0){
        res.json({registros:"No se encontro ningun personaje con ese id."});
    }else{
        res.json(rows[0]);
    }
})


/**
 * @swagger
 * /personaje/n/{nombre}:
 *  get:
 *    tags:
 *      - Personajes
 *    summary: Consultar un personaje en especifico por el nombre.
 *    description: Petición Get a un solo usuario especifico por su nombre.
 *    parameters:
 *      - name: nombre
 *        in: path
 *        description: Nombre del personaje que se quiera consultar.
 *        required: true
 *        schema:
 *          type: string
 *          format: string  
 *    responses:
 *      200:
 *        description: Regresa un Json con la informacion del personaje que agrego en los parametros.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/personaje'
 *      400:
 *        description: No se encontro el personaje con ese nombre.
 */
app.get('/personaje/n/:nombre',async(req,res)=>{
    const connection = await mysql.createConnection(dbConfig);
    const sentenciaSQL = `SELECT * FROM personajes WHERE nombre = '${[req.params.nombre]}'`;
    const [rows, fields] = await connection.execute(sentenciaSQL);
    
    if(rows.length == 0){
        res.json({registros:"No se encontro ningun personaje con ese nombre."});
    }else{
        res.json(rows[0]);
    }
})



/**
 * @swagger
 * /personaje:
 *   post:
 *     tags:
 *       - Personajes
 *     summary: Registrar un nuevo personaje.
 *     description: Petición Post a la ruta de personaje para ingresar un nuevo registro.
 *     requestBody:
 *       description: Modificar el body para agregar un nuevo personaje.
 *       content:
 *         application/json:
 *           schema:
 *               $ref: '#/components/schemas/personaje'
 *     responses:
 *       200:
 *         description: Insercion realizada con exito.
 *       500:
 *         description: Error...
 */
app.post('/personaje',async(req,res)=>{
try{
    const connection = await mysql.createConnection(dbConfig);
    const sentenciaSQL = `INSERT INTO personajes (id, nombre, elemento, rareza, region, arma, imagen) VALUES ("${req.body.id}","${req.body.nombre}", "${req.body.elemento}", "${req.body.rareza}", "${req.body.region}", "${req.body.arma}", "${req.body.imagen}")`;
    const [rows, fields] = await connection.execute(sentenciaSQL);

    if(rows.affectedRows == 1){
        res.status(200).send(`Insercion realizada con exito.`);
    }

    } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
})


/**
 * @swagger
 * /personaje/{id}:
 *   delete:
 *     tags:
 *       - Personajes
 *     summary: Eliminar un personaje de la base de datos.
 *     description: Petición Delete a la ruta de personaje para borrar por medio de su id.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Id del personaje a ELIMINAR
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: El registro se elimino correctamente. id.'?'
 */
app.delete('/personaje/:id',async(req,res)=>{
    const connection = await mysql.createConnection(dbConfig);
    const sentenciaSQL = `DELETE FROM personajes WHERE id = '${[req.params.id]}'`;
    const [rows, fields] = await connection.execute(sentenciaSQL);

    if(rows.affectedRows == 1){
        res.status(200).send(`El registro se elimino correctamente. \n id: '${[req.params.id]}'`);
    }
})


/**
 * @swagger
 * /personaje/{id}:
 *   put:
 *     tags:
 *       - Personajes
 *     summary: Actualizar un personaje.
 *     description: Petición Patch a la ruta de personaje para modificar su registro.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Id del personaje que desea actualizar.
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *     requestBody:
 *       description: Modifica el body para hacer el Patch
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/resPatch'
 *     responses:
 *       200:
 *         description: Se actualizo correctamente el registro.  id. ?
 */
app.put('/personaje/:id',async(req,res)=>{
try{
    const connection = await mysql.createConnection(dbConfig);
    const sentenciaSQL = `UPDATE personajes SET nombre='${req.body.nombre}',elemento='${req.body.elemento}', rareza=${req.body.rareza},region='${req.body.region}', arma='${req.body.arma}', imagen='${req.body.imagen}' WHERE id = '${[req.params.id]}'`;
    const [rows, fields] = await connection.execute(sentenciaSQL);

    if(rows.affectedRows == 1){
        res.status(200).send(`Se actualizao correctamente el registro. \n id: ${[req.params.id]}`);
    }

    } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
})


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(swaggerDocs,options));
app.get("/docs.json",(req,res)=>{
    res.json(swaggerDocs);
})


app.use((req,res)=>{
    res.status(404).json({estado:"Pagina no encontrada"})
})

app.listen(port,()=>{
    console.log("Servidor Express corriendo y escuchando en el puerto 8082")
})

/**
 * @swagger
 * components:
 *   schemas:
 *     personaje: 
 *       type: object
 *       properties:
 *         id:
 *           type: smallint
 *           description: Identificador de cada personaje    
 *           example: 67
 *         nombre:
 *           type: string
 *           description: Nombre del personaje.
 *           example: Zhongli    
 *         elemento:
 *           type: string
 *           description: Elemento del personaje. (Geo, Hydro, Pyro, Electro, Anemo, Cryo, Dendro)  
 *           example: Geo
 *         rareza:
 *           type: smallint
 *           description: Rareza puede ser 5 o 4.
 *           example: 5
 *         region:
 *           type: string
 *           description: Region a la que pertenece. (Inazuma, Sumeru, Liyue, Mondstadt, Desconocida)
 *           example: Liyue
 *         arma:
 *           type: string
 *           description: Arma que utiliza. (Espada, Mandoble, Arco, Catalizador, Lanza)
 *           example: Lanza
 *         imagen:
 *           type: string
 *           description: URL de la imagen.
 *           example: https://static.wikia.nocookie.net/gen-impact/images/7/7b/Zhongli_Card.png
 *     resPatch: 
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del personaje.
 *           example: Kokomi   
 *         elemento:
 *           type: string
 *           description: Elemento del personaje. (Geo, Hydro, Pyro, Electro, Anemo, Cryo, Dendro)  
 *           example: Hydro
 *         rareza:
 *           type: smallint
 *           description: Rareza puede ser 5 o 4.
 *           example: 5
 *         region:
 *           type: string
 *           description: Region a la que pertenece. (Inazuma, Sumeru, Liyue, Mondstadt, Desconocida)
 *           example: Inazuma
 *         arma:
 *           type: string
 *           description: Arma que utiliza. (Espada, Mandoble, Arco, Catalizador, Lanza)
 *           example: Catalizador
 *         imagen:
 *           type: string
 *           description: URL de la imagen.
 *           example: https://pbs.twimg.com/media/FAOLRwXVkAc9Cmj?format=jpg&name=4096x4096
 */