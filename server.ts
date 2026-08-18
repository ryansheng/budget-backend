import { execSync } from "child_process";

try {
  const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
  console.log("🚀 Server running on branch:", branch);
} catch (err) {
  console.log("⚠️ Could not determine git branch");
}



import express, { Request, Response } from "express";
import cors from "cors";
import router from "./router";
import loginRouter from './Router/login'
import cookieParser from 'cookie-parser'
const app = express();

app.use(cors());
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
