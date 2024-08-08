const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

const key = "mysecretkeypeen";

module.exports = {
  signIn: async (req, res) => {
    try {
      const u = req.body.username;
      const p = req.body.password;

      if (u == "" || p == "") return res.status(401).send("unauthorized");

      const user = await prisma.user.findFirst({
        where: {
          username: u,
          password: p,
          status: "use",
        },
      });

      if (!user) return res.status(401).send("unauthorized");
      const token = jwt.sign(user, key, { expiresIn: "2d" });

      return res.send({ token: token });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
};
