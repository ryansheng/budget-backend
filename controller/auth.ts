import { Request, Response, NextFunction } from "express";
import { prisma } from "../prismaClient";
import jwt from "jsonwebtoken";
import { User } from "../types/user";

const max = 24 * 60 * 60; 
const JWT_SECRET = "budget_secret";

const createToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: max });
};


export async function signUp(req: Request, res: Response) {
  try {
    const { email, password, firstName, lastname, currency } = req.body;

    const user = await prisma.user.create({
      data: { email, password, firstName, lastname, currency }
    });

    const token = createToken(user.id);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,       
      sameSite: "none",   
      maxAge: max * 1000
    });

    res.status(201).json({
      message: "signup successful",
      user
    });
  } catch (err: any) {
    if (err.code === "P2002") {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "could not sign up user" });
  }
}


export async function loginCheck(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ message: "email not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "incorrect password" });
    }

    const token = createToken(user.id);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: max * 1000
    });

    res.json({
      message: "login successful",
      user
    });
  } catch {
    res.status(500).json({ message: "could not log in user" });
  }
}


export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "not logged in" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: "invalid token" });
    }

    (req as any).userId = decoded.id;
    next();
  });
}


export async function getMe(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    res.json({ user });
  } catch {
    res.status(500).json({ message: "could not fetch user" });
  }
}
