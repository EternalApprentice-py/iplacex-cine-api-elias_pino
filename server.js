/* Evaluación unidad 3 - Express - Elías Pino*/

import "dotenv/config";

import express from "express";
import cors from "cors";
import { connectDB } from "./src/common/db.js";
import peliculaRoutes from "./src/pelicula/routes.js";
import actorRoutes from "./src/actor/routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).send("Bienvenido al cine Iplacex");
});

app.use("/api", peliculaRoutes);
app.use("/api", actorRoutes);

async function startServer() {
  try {
    await connectDB();
    console.log("Conexion a MongoDB Atlas establecida");

    app.listen(PORT, () => {
      console.log(`Servidor Express corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error.message);
    console.error("El servidor no se levantara debido a error de conexion");
    process.exit(1);
  }
}

startServer();