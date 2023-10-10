const express = require ('express');
const fs = require('fs');
const  {  v4 : uuidv4  }  =  require ( 'uuid' ) ; 
const schema = require('./validationSchema');


const {readFile, writeFile} = require('./src/file');
const app = express();
const FILE_NAME = './db/formula.txt';

app.use(express.urlencoded({extended : false}));
app.use(express.json());

// API
// Listar   Equipo
app.get('/formula', (req, res)=>{
    const data = readFile(FILE_NAME);
    res.json(data);
})

//

//Crear Equipo
app.post('/formula', (req, res) => {
    try {
        //Leer el archivo 
        const data = readFile(FILE_NAME);
        //Agregar (Agregar ID)
        const newEqipo = req.body;
        newEqipo.id = uuidv4();
        console.log(newEqipo)
        data.push(newEqipo);
        // Escribir en el archivo
        writeFile(FILE_NAME, data);
        res.json({ message: 'El equipo fue creado con exito' });
    } catch (error) {
        console.error(error);
        res.json({ message: 'Error al almacenar el equipo' });
    }
});

//Obtener una solo equipo 
app.get('/formula/:id', (req, res) => {
    console.log(req.params.id);
    //Guardar el ID
    const id = req.params.id
    //Leer el contenido del archivo
    const equipo = readFile(FILE_NAME)
    // Buscar la mascota con el ID que recibimos
    const equFound = equipo.find(equ => equ.id === id )
    if(!equFound){// Si no se encuentra el equipo con ese ID
        res.status(404).json({'ok': false, message:"equipo not found"})
        return;
    }
    res.json({'ok': true, equ: equFound});
})


//Actualizar equipo
app.put('/formula/:id', (req, res) => {
    console.log(req.params.id);
    //Guardar el ID
    const id = req.params.id
    //Leer el contenido del archivo
    const equipo = readFile(FILE_NAME)
    // Buscar el equipo con el ID que recibimos
    const equipIndex = equipo.findIndex(equ => equ.id === id )
    if( equipIndex < 0 ){// Si no se encuentra el equipo con ese ID
        res.status(404).json({'ok': false, message:"equipo not found"});
        return;
    }
    let equ = equipo[equipIndex]; //Sacar del arreglo
    equ = { ...equ, ...req.body  };
    equipo[equipIndex] = equ; //Poner el equipo en el mismo lugar
    writeFile(FILE_NAME, equipo);
    //Si el equipo existe, modificar sus datos y almacenarlo nuevamente
    res.json({'ok': true, equ: equ});
})


//Eliminar un equipo
app.delete('/formula/:id', (req, res) => {
    console.log(req.params.id);
    //Guardar el ID
    const id = req.params.id
    //Leer el contenido del archivo
    const equipo = readFile(FILE_NAME)
    // Buscar el equipo con el ID que recibimos
    const equipIndex = equipo.findIndex(equ => equ.id === id )
    if( equipIndex < 0 ){// Si no se encuentra el equipo con ese ID
        res.status(404).json({'ok': false, message:"Pet not found"});
        return;
    }
    //Eliminar el equipo que esté en la posición equipIndex
    equipo.splice(equipIndex, 1);
    writeFile(FILE_NAME, equipo)
    res.json({'ok': true});
})

// Lee y valida el archivo JSON
const archivoJSON = fs.readFileSync('archivo.json', 'utf8');

try {
  const datos = JSON.parse(archivoJSON);
  const resultadoValidacion = schema.validate(datos);

  if (resultadoValidacion.error) {
    console.error('Error de validación:', resultadoValidacion.error.details);
  } else {
    console.log('Los datos son válidos.');
    // Realiza las acciones necesarias con los datos validados
  }
} catch (error) {
  console.error('Error al analizar el archivo JSON:', error);
}



app.listen(3000,()=>{
    console.log('server is running on http://localhost:3000')
})

 

