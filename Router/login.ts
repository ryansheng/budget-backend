import { Router, Request, Response } from "express";
import { signUp, loginCheck, requireAuth, getMe } from "../controller/auth";

const loginRouter = Router();


loginRouter.get("/", (req: Request, res: Response) => {
  res.json({ message: "Reached Login maybe" });
});


loginRouter.post("/signup", signUp);


loginRouter.post("/login", loginCheck);


loginRouter.get("/me", requireAuth, getMe);


loginRouter.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,       // REQUIRED for Render HTTPS
    sameSite: "none",   // REQUIRED for Angular cross-site cookies
    path: "/"
  });

  res.json({ message: "logged out successfully" });
});

export default loginRouter;
