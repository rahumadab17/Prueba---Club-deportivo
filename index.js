const express = require('express');
const app = express();
const chalk = require('chalk')
const fs = require('fs');

const port = 3000;

app.listen(port, () => {
    console.log(`Servidor inicializado escuchando en puerto ${port}`)
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get("/agregar", (req, res) => {
    const { nombre, precio } = req.query

    const nuevoDeporte = {
        nombre,
        precio,
    };

    const data = JSON.parse(fs.readFileSync("Deportes.json", "utf-8"));

    const deportes = data.deportes;

    deportes.push(nuevoDeporte);

    fs.writeFileSync("Deportes.json", JSON.stringify(data));
    console.log(chalk.black.bgGreenBright.bold(`Nuevo deporte: "${nuevoDeporte.nombre}", precio: $${nuevoDeporte.precio} agregado con exito`))
});

app.get("/deportes", (req, res) => {
    const data = JSON.parse(fs.readFileSync("Deportes.json", "utf-8"));

    res.send(data)
})

app.get("/editar", (req, res) => {
    const { nombre, precio } = req.query;

    const nuevoPrecio = precio

    const data = JSON.parse(fs.readFileSync("Deportes.json", "utf-8"));

    const deportes = data.deportes;

    const index = deportes.findIndex(e => e.nombre === nombre)

    if (index !== -1){
        deportes[index].precio = nuevoPrecio
    };

    try {
        fs.writeFileSync("Deportes.json", JSON.stringify(data));
        console.log(chalk.black.bgYellowBright.bold(`El precio del deporte: "${nombre}" fue editado con exito`))
    } catch (error) {
        console.log(`No ha sido posible editar este deporte, error: ${error}`)
    }
});

app.get("/eliminar", (req, res) => {
    const { nombre } = req.query

    const data = JSON.parse(fs.readFileSync("Deportes.json", "utf-8"));

    const deportes = data.deportes;

    const index = deportes.findIndex(e => e.nombre === nombre);
    try {
        deportes.pop(index, 1)
        fs.writeFileSync("Deportes.json", JSON.stringify(data));
        console.log(chalk.black.bgRedBright.bold(`El deporte: "${nombre}" fue eliminado con exito`))
    } catch (error) {
        console.log(`No ha sido posible eliminar este deporte, error: ${error}`)
    }
});

