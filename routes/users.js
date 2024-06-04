import express from "express";
import { body, validationResult } from "express-validator";

const router = express.Router();

const userValidationRules = [
  body("email").isEmail().withMessage("Email inválido"),
  body("name").notEmpty().withMessage("Nome é obrigatório"),
  body("age")
    .isInt({ min: 0 })
    .withMessage("Idade deve ser um número inteiro positivo"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post("/", userValidationRules, validate, async (req, res) => {
  try {
    await req.prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        age: req.body.age,
      },
    });
    res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao criar usuário", details: error.message });
  }
});

router.put("/:id", userValidationRules, validate, async (req, res) => {
  try {
    await req.prisma.user.update({
      where: {
        id: parseInt(req.params.id, 10),
      },
      data: {
        email: req.body.email,
        name: req.body.name,
        age: req.body.age,
      },
    });
    res.status(200).json({ message: "Usuário alterado com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao alterar usuário", details: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await req.prisma.user.delete({
      where: {
        id: parseInt(req.params.id, 10),
      },
    });
    res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao deletar usuário", details: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    let users = [];
    if (Object.keys(req.query).length) {
      users = await req.prisma.user.findMany({
        where: {
          name: req.query.name,
          age: req.query.age ? parseInt(req.query.age, 10) : undefined,
          email: req.query.email,
        },
      });
    } else {
      users = await req.prisma.user.findMany();
    }
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao obter usuários", details: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await req.prisma.user.findFirst({
      where: {
        id: parseInt(req.params.id, 10),
      },
    });
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao obter usuário", details: error.message });
  }
});

export default router;
