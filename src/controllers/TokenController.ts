import { Request, Response } from "express";
import { firebaseAuth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export const generate = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const credentials = await signInWithEmailAndPassword(firebaseAuth, email, password);
        return res.status(200).json(credentials.user['stsTokenManager']);
    } catch (error: any) {
        return res.status(404).json({ msg: "Email ou senha inválidos.", error });
    }
}