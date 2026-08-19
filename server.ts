import express, { Request, Response } from "express";
import cors from "cors";
import router from "./router";
import loginRouter from './Router/login'
import cookieParser from 'cookie-parser'
const app = express();

app.use(cors({
  origin: "http://localhost:4200",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser())

app.use("/api", router );
app.use('/login', loginRouter)


app.get("/", (req: Request, res: Response) => {
  res.json({ message: "welcome to BUDGET" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
