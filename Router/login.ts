import { Router, Request, Response } from 'express'
import { User } from '../types/user'
import { signUp, loginUser, loginCheck, requireAuth} from '../controller/auth'



const loginRouter = Router();

loginRouter.get('/', (req: Request, res: Response) => {
  res.json({message: 'Reached Login maybe'})
})


loginRouter.post('/signup', signUp)
loginRouter.post('/login', loginCheck)
loginRouter.get('/me', requireAuth, async (req: Request, res: Response) => {
  res.json({message:'you have successfully authenicated'})
})
loginRouter.post('/logout', (req: Request, res: Response) => {
   res.clearCookie('jwt', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/'
  })
  
  res.json({message:'mogged out successfully'})
})

export default loginRouter