import express from "express";
import { PrismaClient } from "@prisma/client";

const PORT = 3000;
const app = express();
const prisma = new PrismaClient();
app.use(express.json());

app.get("/movies", async (req, res) => {
    const movies = await prisma.movie.findMany({
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

app.post("/movies", async (req, res) => {
    const { title, genre_id, language_id, oscar_count, release_date } = req.body;

    try {

        const movieWithSameTitle = await prisma.movie.findFirst({
            where: { title: { equals: title, mode: "insensitive" } }
        })

        if (movieWithSameTitle) {
            return res.status(409).send({ message: "Já existe um filmes cadastrado com esse título" })
        }

        await prisma.movie.create({
            data: {
                title,
                genre_id,
                language_id,
                oscar_count,
                release_date: new Date(release_date),
            }
        });
    } catch (error) {
        return res.status(500).send({ message: "Falha aos cadastrar um filme" })
    }

    res.status(201).send();
});

app.put("/movies/:id", async (req, res) => {
    const { id } = req.params;
    const { title, genre_id, language_id, oscar_count, release_date } = req.body;

    try {
        const movie = await prisma.movie.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!movie) {
            return res.status(404).send({ message: "Filme não encontrado" })
        }

        await prisma.movie.update({
            where: {
                id: Number(id)
            },
            data: {
                title,
                genre_id,
                language_id,
                oscar_count,
                release_date: new Date(release_date),
            }
        })

    } catch (error) {
        return res.status(500).send({ message: "falha ao atualizar o registro do filme" })
    }


    return res.status(200).send()
});

app.delete("/movies/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const movie = await prisma.movie.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!movie) {
            return res.status(404).send({ message: "Filme não encontrado" })
        }

        await prisma.movie.delete({
            where: {
                id: Number(id)
            }
        });
    } catch (error) {
        return res.status(500).send({ message: "falha ao deletar o filme" })
    }


    return res.status(200).send()
});

app.listen(PORT, () => {
    console.log(`Servido rodando na porta ${PORT}`);

})

