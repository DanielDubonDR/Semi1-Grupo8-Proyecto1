import express from "express";
import morgan from "morgan";
import cors from "cors";
import handlerTest from "./routes/test.routes.js";
import handlerAcceso from "./routes/acceso.routes.js";
import handlerArtista from "./routes/artista.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());

app.use(handlerTest);
app.use(handlerAcceso);
app.use(handlerArtista);

app.listen(4000);
console.log(`Server on port 4000`);