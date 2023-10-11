import { deleteFile, uploadFile } from "../utils/uploader";
import { db } from "../../firebase";
import { Product } from "../models/product";
import { uuid } from "uuidv4";

export const getProducts = async (req: any, res: any) => {
  try {
    const snapshotCategories = await db.collection("categories").get();
    let products: Product[] = [];
    for (const docCategory of snapshotCategories.docs) {
      const snapshotProducts = await docCategory.ref
        .collection("products")
        .get();

      for (const docProducts of snapshotProducts.docs) {
        const product: Product = {
          id: docProducts.id,
          category_id: docCategory.id,
          name: docProducts.data().name,
          price: docProducts.data().price,
          image: docProducts.data().image.link,
        };
        products.push(product);
      }
    }
    return res.status(200).json(products);
  } catch (error: any) {
    return res.status(400).json({ msg: "Ocorreu um erro ao listar os logs" });
  }
};

export const getProductsByCategory = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const snapshotCategory = await db.collection("categories").doc(id).get();
    const snapshotProducts = await snapshotCategory.ref
      .collection("products")
      .get();
    let products: Product[] = [];
    for (const docProducts of snapshotProducts.docs) {
      const product: Product = {
        id: docProducts.id,
        category_id: snapshotCategory.id,
        name: docProducts.data().name,
        price: docProducts.data().price,
        image: docProducts.data().image.link,
      };
      products.push(product);
    }
    return res.status(200).json(products);
  } catch (error: any) {
    return res.status(400).json({ msg: "Ocorreu um erro ao listar os logs" });
  }
};

export const getProductByCategoryAndProductId = async (
  req: any,
  res: any
) => {
  try {
    const { id, productId } = req.params;
    const snapshotCategory = await db.collection("categories").doc(id).get();
    const snapshotProducts = await snapshotCategory.ref
      .collection("products")
      .doc(productId)
      .get();
    let product: Product = {
      id: snapshotProducts.id,
      category_id: snapshotCategory.id,
      name: snapshotProducts.data().name,
      price: snapshotProducts.data().price,
      image: snapshotProducts.data().image.link,
    };
    return res.status(200).json(product);
  } catch (error: any) {
    return res.status(400).json({ msg: "Ocorreu um erro ao listar os logs" });
  }
};

export const addProduct = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    console.log('file', req.file);
    const fileUploaded = await uploadFile("image", req.file, uuid());
    const snapshotCategories = await db.collection("categories").doc(id).get();
    await snapshotCategories.ref.collection("products").add({
      name,
      price,
      image: fileUploaded,
    });

    return res.status(200).json({ msg: "Produto criado com sucesso!" });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ msg: "Ocorreu um erro ao listar os logs" });
  }
};

export const updateProduct = async (req: any, res: any) => {
  try {
    const { id, productId } = req.params;
    const { name, price } = req.body;

    const snapshotCategories = await db.collection("categories").doc(id).get();
    
    const snapshotProduct = snapshotCategories.ref.collection("products").doc(productId);
    
    if(req.file){
      const produtRef = await snapshotProduct.get();
      const imageOld = produtRef.data().image.path;
      await deleteFile(imageOld);
      
      const fileUploaded = await uploadFile("image", req.file, uuid());

      await snapshotProduct.update({
        image: fileUploaded
      })
    }
    
    await snapshotProduct.update({
      name,
      price,
    });

    return res.status(200).json({ msg: "Produto atualizado com sucesso!" });
  } catch (error: any) {
    return res.status(400).json({ msg: "Ocorreu um erro ao listar os logs" });
  }
};

export const deleteProduct = async (req: any, res: any) => {
  try {
    const { id, productId } = req.params;

    const snapshotCategories = await db.collection("categories").doc(id).get();
    
    const snapshotProduct = snapshotCategories.ref.collection("products").doc(productId);
    
    const productRef = await snapshotProduct.get();
    const imageOld = productRef.data().image.path;
    await deleteFile(imageOld);

    await snapshotProduct.delete();

    return res.status(200).json({ msg: "Produto deletado com sucesso!" });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ msg: "Ocorreu um erro ao listar os logs" });
  }
};
