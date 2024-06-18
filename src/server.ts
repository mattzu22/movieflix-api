import express from "express";
import { PrismaClient } from "@prisma/client";

const PORT = 3000;
const app = express();
const prisma  = new PrismaClient();

app.get("/movies", async(req, res) =>{
 const movies  = await prisma.movie.findMany({
    orderBy: {
        title: "asc"
    },
    include: {
        genres: true,
        languages: true,
    }
 });
 res.json(movies)
});

app.listen(PORT, () =>{
    console.log(`Servido rodando na porta ${PORT}`);
    
})

