import { Router } from "express";
import authRoutes from './authRoutes';

const router = Router();

router.get('/', (req, res) => {
    res.send("chat app backend, Let's go!")
})

router.use('/auth', authRoutes)

export default router;