import { Request, Response } from "express";
import { db, auth } from "../../firebase";
import { generateLog } from "./LogsController";
import jwt_decode from "jwt-decode";

export const getUsers = async (req: Request, res: Response) => {
    try {
        const snapshot = await db.collection("users").get();
        let users = [];
        for (const doc of snapshot.docs) {
            const { name, permission } = doc.data();
            const userAuth = await auth.getUser(doc.id);
            users.push({ id: doc.id, name, permission, email: userAuth.email })
        }
        
        generateLog(req, 'get users');
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

        generateLog(req, `get user ${id}`);
        return res.status(200).json({ uid: id, name: users.data().name, email: userAuth.email, permission: users.data().permission });
    } catch (error: any) {
        return res.status(400).json({ msg: "Ocorreu um erro ao listar o usuário" });
    }
}

export const loadUser = async (req: Request, res: Response) => {
    const regex = /Bearer (.+)/i;

    try {
        const token = req.headers['authorization'].match(regex)?.[1];
        const userTokenDecoded: any = await jwt_decode(token);
        const user = await db.collection("users").doc(userTokenDecoded.user_id).get();
        const userAuth = await auth.getUser(userTokenDecoded.user_id);

        return res.status(200).json({ id: userTokenDecoded.user_id, name: user.data().name, email: userAuth.email, permission: user.data().permission });
    } catch (error: any) {
        console.log(error);
        return res.status(401).json({ msg: "Erro ao carregar o usuário." });
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, permission, email, password } = req.body;
        const resultCreateuser = await auth.createUser({ email, password });
        await db.collection("users").doc(resultCreateuser.uid).set({ name, permission });

        generateLog(req, `created user ${resultCreateuser.uid}`);
        return res.status(200).json({ msg: "Usuário criado com sucesso!" });
    } catch (error: any) {
        console.log(error);
        return res.status(400).json({ msg: "Ocorreu um erro interno ao criar este usuário", debug: error.code });
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, permission, email } = req.body;
        const userAuth = await auth.getUser(id);
        await auth.updateUser(userAuth.uid, {
            email
        });

        generateLog(req, `updated user ${id}`);
        await db.collection("users").doc(id).update({ name, permission });
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

        generateLog(req, `deleted user ${id}`);
        return res.status(200).json({ msg: "Usuário deletado com sucesso!" });
    } catch (error: any) {
        return res.status(400).json({ msg: "Ocorreu um erro interno ao deletar este usuário", debug: error.code });
    }
}