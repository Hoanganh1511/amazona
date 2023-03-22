import { AppContext } from "next/app";
import React from "react";
import Cookies from "js-cookie";
import { createContext, useReducer } from "react";
type IGlobalContextProps = {
  state: InitialStateType;
  dispatch: React.Dispatch<any>;
};
type CardItemType = {
  name: string;
  price: number;
  quantity: number;
};
type InitialStateType = {
  cart: {
    shippingAddress: any;
    paymentMethod: any;
    cartItems: CardItemType[];
  };
};
const initialState = {
  cart: Cookies.get("cart")
    ? JSON.parse(Cookies.get("cart")!)
    : { cartItems: [], shippingAddress: {}, paymentMethod: "" },
};
const Store = createContext<IGlobalContextProps>({
  state: initialState,
  dispatch: () => null,
});

function reducer(state: InitialStateType, action: any) {
  switch (action.type) {
    case "CART_ADD_ITEM": {
      const newItem = action.payload;
      console.log(newItem);
      const existItem = state.cart.cartItems.find(
        (item: any) => item.slug === newItem.slug
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item: any) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item: any) => item.slug !== action.payload.slug
      );
      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_RESET": {
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: [],
          shippingAddress: { location: {} },
          paymentMethod: "",
        },
      };
    }
    case "SAVE_SHIPPING_ADDRESS": {
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: { ...state.cart.shippingAddress, ...action.payload },
        },
      };
    }
    case "SAVE_PAYMENT_METHOD": {
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };
    }
    default:
      return state;
  }
}

function StoreProvider({ children }: any) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
export { StoreProvider, Store };
