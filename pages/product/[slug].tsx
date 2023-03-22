import Layout from "@/components/Layout";
import data from "@/utils/data";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { Store } from "@/utils/Store";
import db from "@/utils/db";
import Product from "@/models/Product";
import axios from "axios";
import { toast } from "react-toastify";
type TProduct = {
  product: {
    name: string;
    price: number;
  };
};
function ProductScreen(props: any) {
  const { product } = props;
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  if (!product) {
    return (
      <Layout title="Product not Found">
        <h5 className="text-blue-500 font-bold text-2xl">Product Not Found</h5>
      </Layout>
    );
  }
  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find(
      (x: any) => x.slug === product.slug
    );
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      return toast.error("Sorry ! Product is out of stock");
    }
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity: quantity },
    });
    router.push("/cart");
  };
  return (
    <div>
      <Layout title={`${product.name}`}>
        <div className="my-7 bg-gray-500 inline-block p-3 text-white rounded-md  ">
          <Link href="/">Back to products</Link>
        </div>
        <div className="grid md:grid-cols-4 md:gap-3">
          <div className="md:col-span-2">
            <Image
              src={product.image}
              alt={product.name}
              width={500}
              height={500}
            />
          </div>
          <div className="md:col-span-2">
            <ul>
              <li>
                <h1 className="text-2xl font-bold my-5">{product.name}</h1>
              </li>
              <li>Category: {product.category}</li>
              <li>Brand: {product.brand}</li>
              <li>
                {product.rating} of {product.numReviews}
              </li>
              <li>Description: {product.description}</li>
            </ul>
            <div className="card p-5 mt-5 flex h-fit">
              <div className="mb-2 flex justify-between">
                <h6>Price</h6>
                <p>${product.price}</p>
              </div>
              <div className="mb-2 flex justify-between">
                <h6>Status</h6>
                <p>{product.countInStock > 0 ? "In Stock" : "Unavailable"}</p>
              </div>
              <button
                className="primary-button w-full"
                onClick={addToCartHandler}
              >
                {" "}
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default ProductScreen;
export async function getServerSideProps(context: any) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
