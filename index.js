import { PrismaClient } from "@prisma/client";
import express from "express";
import userRoutes from "./routes/users.js";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

// Middleware para adicionar prisma ao objeto de request
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Rotas de usuário
app.use("/usuarios", userRoutes);

app.listen(3000, () => console.log("Running on http://localhost:3000"));
