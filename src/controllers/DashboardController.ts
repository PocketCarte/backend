import { Request, Response } from "express";
import { db, auth } from "../../firebase";
import { generateLog } from "./LogsController";
import { getTokenDecoded } from "../utils/token";
import { Permissions } from "../models/permissions";

export const getDashboardData = async (req: Request, res: Response) => {
    try {
        let data = {};
        const userTokenDecoded: any = await getTokenDecoded(req);
        const user = await db.collection("users").doc(userTokenDecoded.user_id).get();
        const { permission } = user.data();
        if(permission <= Permissions.Cozinha){
            const ordersRef = await db.collection("orders").get();
            const orders = ordersRef.size;

            const tableRequestsRef = await db.collection("table_requests").get();
            const tableRequests = tableRequestsRef.size;

            data['orders'] = orders;
            data['table_requests'] = tableRequests;
        }
        if(permission <= Permissions.Gerente){
            const tablesRef = await db.collection("tables").get();
            const tables = tablesRef.size;

            const categoriesRef = await db.collection("categories").get();
            const categories = categoriesRef.size;

            let products = 0;
            for (const docCategory of categoriesRef.docs) {
                const productsRef = await docCategory.ref
                    .collection("products")
                    .get();
                products += productsRef.size;
            }

            data['tables'] = tables;
            data['categories'] = categories;
            data['products'] = products;
        }
        if(permission == Permissions.Administrador){
            const usersRef = await db.collection("users").get();
            const users = usersRef.size;

            data['users'] = users;
        }
        
        generateLog(req, 'get dashboard');
        return res.status(200).json(data);
    } catch (error: any) {
        console.log(error);
        return res.status(400).json({ msg: "Ocorreu um erro ao pegar os dados do dashboard" });
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
    try {
        const userTokenDecoded: any = await getTokenDecoded(req);
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
        await db.collection("users").doc(resultCreateuser.uid).update({ name, permission });

        generateLog(req, `created user ${resultCreateuser.uid}`);
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