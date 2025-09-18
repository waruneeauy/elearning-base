import express, { Response } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../interfaces/request.interface";

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CALLBACK_URL}/redirect-on-failure`,
  }),
  (req: CustomRequest, res: Response) => {
    if (!req.user) {
      res.redirect(`${process.env.REDIRECT_URL}/`);
      return;
    }

    const token = jwt.sign(
      { id: req.user.learnerId, username: req.user.email, name: req.user.name },
      process.env.SECRET_KEY_CLIENT!,
      {
        expiresIn: "24h",
      },
    );

    res.redirect(`${process.env.REDIRECT_URL}/?token=${token}`);
  },
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: `${process.env.CALLBACK_URL}/redirect-on-failure`,
  }),
  (req: CustomRequest, res: Response) => {
    const token = jwt.sign(
      { id: req.user.learnerId, username: req.user.email, name: req.user.name },
      process.env.SECRET_KEY_CLIENT!,
      {
        expiresIn: "24h",
      },
    );
    res.redirect(`${process.env.REDIRECT_URL}/?token=${token}`);
  },
);

// Failure route to handle existing email redirect
router.get("/redirect-on-failure", (req, res) => {
  res.redirect(`${process.env.REDIRECT_URL}/?error=Email already exists`);
});

export default router;
