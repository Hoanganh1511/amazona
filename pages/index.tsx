import db from "@/utils/db";
import Layout from "../components/Layout";
import ProductItem from "../components/ProductItem";
import data from "../utils/data";
import Product from "@/models/Product";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useContext, useEffect } from "react";
import { Store } from "@/utils/Store";
import { useRouter } from "next/router";
import axios from "axios";
import { getSession } from "next-auth/react";
// import { PayPalButtons } from "@paypal/react-paypal-js";
export default function Home({ products }: any) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const router = useRouter();
  const addToCartHandler = async (product: any) => {
    const existItem = state.cart.cartItems.find(
      (x: any) => x.slug === product.slug
    );
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      alert("Sorry ! Product is out of stock");
      return;
    }
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity: quantity },
    });
    router.push("/cart");
  };
  return (
    <Layout title="Home Page">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product: any) => {
          return (
            <ProductItem
              product={product}
              addToCartHandler={addToCartHandler}
              key={product.slug}
            ></ProductItem>
          );
        })}
      </div>
    </Layout>
  );
}
export async function getServerSideProps() {
  db.connect();
  const products = await Product.find().lean();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
