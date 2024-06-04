import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

const users = [];

app.post("/usuarios", async (req, res) => {
  await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age,
    },
  });
  res.status(201).json({ message: "Usuário criado com sucesso!" });
});

app.put("/usuarios/:id", async (req, res) => {
  await prisma.user.update({
    where: {
      id: req.params.id,
    },
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age,
    },
  });
  res.status(201).json({ message: "Usuário alterado com sucesso!" });
});

app.delete("/usuarios/:id", async (req, res) => {
  await prisma.user.delete({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json({ message: "Usuário deletado com sucesso" });
});

app.get("/usuarios", async (req, res) => {
  let users = [];

  if (req.query) {
    users = await prisma.user.findMany({
      where: {
        name: req.query.name,
        age: req.query.age,
        email: req.query.email,
      },
    });
  } else {
    users = await prisma.user.findMany();
  }

  res.status(200).json(users);
});

app.get("/usuarios/:id", async (req, res) => {
  const user = await prisma.user.findFirst({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json(user);
});

app.listen(3000, (req, res) => console.log("Runnig..."));
