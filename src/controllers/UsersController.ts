import { Request, Response } from "express";
import { db, auth, firebaseAuth } from "../../firebase";

export const getUsers = async (req: Request, res: Response) => {
    try {
        const snapshot = await db.collection("users").get();
        const users = snapshot.docs.map((doc) => {
            const { name, permission } = doc.data();
            return { uid: doc.id, name, permission };
        });
        return res.status(200).json(users);
    } catch (error: any) {
        return res.status(400).json({ msg: "Ocorreu um erro ao listar os usuários" });
    }
}

export const getUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const users = await db.collection("users").doc(id).get();
        const userAuth = await auth.getUser(id);
        return res.status(200).json({ uid: id, name: users.data().name, email: userAuth.email, permission: users.data().permission });
    } catch (error: any) {
        return res.status(400).json({ msg: "Ocorreu um erro ao listar o usuário" });
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, permission, email, password } = req.body;
        const resultCreateuser = await auth.createUser({ email, password });
        await db.collection("users").doc(resultCreateuser.uid).set({ name, permission });
        return res.status(200).json({ msg: "Usuário criado com sucesso!" });
    } catch (error: any) {
        return res.status(400).json({ msg: "Ocorreu um erro interno ao criar este usuário", debug: error.code });
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, permission, email, password } = req.body;
        const userAuth = await auth.getUser(id);
        await auth.updateUser(userAuth.uid, {
            email,
            password
        });
        await db.collection("users").doc(id).set({ name, permission });
        return res.status(200).json({ msg: "Usuário editado com sucesso!" });
    } catch (error: any) {
        return res.status(400).json({ msg: "Ocorreu um erro interno ao editado este usuário", debug: error.code });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Promise.all([
            auth.deleteUser(id),
            db.collection("users").doc(id).delete()
        ]);
        return res.status(200).json({ msg: "Usuário deletado com sucesso!" });
    } catch (error: any) {
        return res.status(400).json({ msg: "Ocorreu um erro interno ao deletar este usuário", debug: error.code });
    }
}