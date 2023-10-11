import { Request, Response } from "express";
import { firebaseAuth, auth } from "../../firebase";
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

export const check = async (req: Request, res: Response) => {
    const regex = /Bearer (.+)/i;
    try {
      const idToken = req.headers['authorization'].match(regex)?.[1];
      const token = await auth.verifyIdToken(idToken);
      return res.status(200).json(true);
    } catch (error: any) {
      return res.status(401).json(false);
    }
};