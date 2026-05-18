import { ObjectId } from "mongodb";
import client from "../common/db.js";
import { Actor } from "./actor.js";

const actorCollection = client.db("cine-db").collection("actores");
const peliculaCollection = client.db("cine-db").collection("peliculas");

async function handleInsertActorRequest(req, res) {
    let data = req.body;
    let actor = Actor;

    actor.idPelicula = data.idPelicula;
    actor.nombre = data.nombre;
    actor.edad = data.edad;
    actor.estaRetirado = data.estaRetirado;
    actor.premios = data.premios;

    await peliculaCollection.findOne({ nombre: actor.idPelicula })
    .then((peliculaExistente) => {
        if(peliculaExistente === null) {
            return res.status(404).send("La pelicula no existe");
        }

        actorCollection.insertOne(actor)
        .then((data) => {
            if(data === null) return res.status(400).send("Error al guardar registro");
            return res.status(201).send(data);
        })
        .catch((e) => { return res.status(500).send({ error: e }) });
    })
    .catch((e) => { return res.status(500).send({ error: e }) });
}

async function handleGetActoresRequest(req, res) {
    await actorCollection.find().toArray()
    .then((data) => { return res.status(200).send(data) })
    .catch((e) => { return res.status(500).send({ error: e }) });
}

async function handleGetActorByIdRequest(req, res) {
    let id = req.params.id;

    try {
        let oid = ObjectId.createFromHexString(id);

        await actorCollection.findOne({ _id: oid })
        .then((data) => {
            if(data === null) return res.status(404).send(data);
            return res.status(200).send(data);
        })
        .catch((e) => { 
            return res.status(500).send({ error: e });
        });
    } catch (e) {
        return res.status(400).send("Id mal formado");
    }
}

async function handleGetActoresByPeliculaIdRequest(req, res) {
    let nombrePelicula = req.params.nombrePelicula;

    await actorCollection.find({ idPelicula: nombrePelicula }).toArray()
    .then((data) => {
        if(data === null || data.length === 0) return res.status(404).send("No se encontraron actores para esta pelicula");
        return res.status(200).send(data);
    })
    .catch((e) => { return res.status(500).send({ error: e }) });
}

export default {
    handleInsertActorRequest,
    handleGetActoresRequest,
    handleGetActorByIdRequest,
    handleGetActoresByPeliculaIdRequest
};