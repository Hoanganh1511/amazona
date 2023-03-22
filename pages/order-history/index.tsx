import Layout from "@/components/Layout";
import { getError } from "@/utils/error";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useReducer } from "react";
function reducer(state: any, action: any) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
function OrderHistoryScreen() {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: "",
  });
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/history`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err: any) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    fetchOrders();
  }, []);
  return (
    <Layout title="Order History">
      <h1 className="mb-4 text-xl font-bold">Oredr History</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <th className="px-5 text-left">ID</th>
              <th className="p-5 text-left">DATE</th>
              <th className="p-5 text-left">TOTAL</th>
              <th className="p-5 text-left">PAID</th>
              <th className="p-5 text-left">DELIVERED</th>
              <th className="p-5 text-left">ACTION</th>
            </thead>
            <tbody>
              {orders?.map((order: any) => {
                return (
                  <tr key={order._id} className="border-b">
                    <td className="px-5 text-black-500 font-semibold">
                      {order._id.substring(20, 24)}
                    </td>
                    <td className="p-5 font-light">
                      {order.createdAt.substring(0, 10)}
                    </td>
                    <td className="p-5 ">
                      <p className="text-black-700 font-semibold inline-block">
                        $
                      </p>
                      {order.totalPrice}
                    </td>
                    <td className="p-5 font-semibold">
                      {order.isPaid
                        ? `${order.paidAt.substring(0, 10)}`
                        : "not paid"}
                    </td>
                    <td className="p-5 font-regular italic">
                      {order.isDelivered
                        ? `${order.deliveredAt.substring(0, 10)}`
                        : "not delivered"}
                    </td>
                    <td className="p-5 font-semibold">
                      <Link href={`/order/${order._id}`} passHref>
                        <p className="text-blue-500">Details</p>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}

export default OrderHistoryScreen;
OrderHistoryScreen.auth = true;
