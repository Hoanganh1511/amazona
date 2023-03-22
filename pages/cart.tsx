import React, { useContext } from "react";
import Layout from "@/components/Layout";
import { Store } from "@/utils/Store";
import Link from "next/link";
import Image from "next/image";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import axios from "axios";
import { toast } from "react-toastify";
function CartScreen() {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const {
    cart: { cartItems },
  } = state;
  const removeItemhandler = (item: any) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };
  const updateCardHandler = async (item: any, qty: any) => {
    const quantity = Number(qty);
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      return toast.error("Sorry, Product is out of stock");
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
    toast.success("Product updated in the cart");
  };
  return (
    <Layout title="Shopping Cart">
      <>
        <h1 className="mb-4 text-xl">Shopping cart</h1>
        {cartItems.length === 0 ? (
          <div className="bg-gray-200 p-2 inline-block rounded-md">
            Cart is empty.{" "}
            <Link href="/">
              <p className="text-blue-500 inline-block">Go shopping</p>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 md:gap-5">
            <div className="overflow-x-auto md:col-span-3">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Item</th>
                    <th className="p-5 text-right">Quantity</th>
                    <th className="p-5 text-right">Price</th>
                    <th className="p-5">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item: any) => {
                    return (
                      <tr key={item.slug} className="border-b">
                        <td>
                          <Link href={`/product/${item.slug}`}>
                            <div className="flex flex-row  items-center">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={50}
                                height={50}
                              />
                              {item.name}
                            </div>
                          </Link>
                        </td>
                        <td className="p-5 text-right">
                          <select
                            value={item.quantity}
                            onChange={(e) =>
                              updateCardHandler(item, e.target.value)
                            }
                          >
                            {[...Array(item.countInStock).keys()].map((x) => (
                              <option value={x + 1} key={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-5 text-right">{item.price}</td>
                        <td className="p-5 text-center">
                          <button onClick={() => removeItemhandler(item)}>
                            <XCircleIcon className="h-5 w-5"></XCircleIcon>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="card p-5 h-fit">
              <ul>
                <li>
                  <div className="pb-3 font-bold">
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}) :
                    ${cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                  </div>
                </li>
                <li>
                  <button
                    onClick={() => router.push("login?redirect=/shipping")}
                    className="primary-button w-full"
                  >
                    Check out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
