import { Request, Response ,NextFunction} from 'express'
import { User } from '../types/user'
import { prisma } from '../prismaClient'
import jwt  from 'jsonwebtoken'

const max:number = 24 * 60 * 60
const createToken = (id:string) => {
  return jwt.sign({ id }, ' budget secret ', {
    expiresIn: max
  })
}
declare module 'express-serve-static-core' {
  interface Request {
    userId?: string
  }
}
async function signUp(req: Request, res: Response) {
  try {
    const { email, password, firstName, lastname, currency } = req.body 
    
    const user: User = await prisma.user.create({
      data: {
        email,password,firstName, lastname,currency 
      }
    })
    const token = createToken(user.id)
    res.cookie('jwt',token,{httpOnly:true, maxAge:max * 1000})
 res.status(201).json(user)
  } catch (err) {
    if (err.code === 'P2002') {
    return res.status(400).json({ message: 'Email already exists' })
  }
    console.error('signing up user failed',err.message)
    res.status(500).json({
      message:'could not sign up user'
    })
  }
}

async function loginUser(req: Request, res: Response) {
  try {
    const user: User | null = await prisma.user.findUnique({
      where:{id : req.params.id as string }
    })

    if (!user) return res.status(404).json({ message: 'please sign up _ are not a user' })
    res.json(user)
  } catch (err) {
    console.error(' Could not fimd user', err)
    
  }
}


async function loginCheck(req: Request, res: Response) {
  try {
    const { email, password } = req.body
    const user: User | null = await prisma.user.findUnique({
      where: { email }
    })
    if (!user) {
      return res.status(404).json({ message: 'email not found' })
    }
    if (user.password !== password) {
      return res.status(401).json({ message: 'not correct password' })
    }

    const token = createToken(user.id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: max * 1000 })
 
    res.json({
      message: 'login successful',
      user
    })
  } catch (err) {
    console.error('login failed', err)
    res.status(500).json({
      message: 'could not log in user'
    })
  }
}

  async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.jwt
    if (!token) return res.status(401).json({
      message: 'not logged in'
    })
    jwt.verify(token, ' budget secret ', (err, decoded) => {
      if (err) return res.status(401).json({
        message: 'invalid token'
      })
      req.userId = decoded.id
      next()
    })
  }



export {
  signUp,
  loginUser,
  loginCheck,
  requireAuth
}