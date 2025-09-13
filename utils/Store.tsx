"use client";

import { orderItemsType } from "@/models/Order";
import Cookies from "js-cookie";
import { ActionDispatch, createContext, useReducer } from "react";

const initialStore: initialStateOrderType = {
  cart: Cookies.get("cart")
    ? (JSON.parse(Cookies.get("cart") as string) as cardItemsType)
    : ({
        cartItems: [],
        shippingAddress: {},
        paymentMethod: "",
      } as cardItemsType),
};

export interface shippingAddressType {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface cardItemsType {
  cartItems: orderItemsType[];
  shippingAddress: shippingAddressType | {};
  paymentMethod: string;
}

interface initialStateOrderType {
  cart: cardItemsType;
}

interface actionOrderType {
  type: string;
  payload: orderItemsType | string | shippingAddressType;
}

function reducer(state: initialStateOrderType, action: actionOrderType) {
  switch (action.type) {
    case "CART_ADD_ITEM": {
      const newItem = action.payload as orderItemsType;
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem];

      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));

      return {
        ...state,
        cart: { ...state.cart, cartItems },
      } as initialStateOrderType;
    }
    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.slug != (action.payload as orderItemsType).slug
      );

      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));

      return {
        ...state,
        cart: { ...state.cart, cartItems },
      } as initialStateOrderType;
    }
    case "CART_RESET": {
      return {
        ...state,
        cart: {
          cartItems: [],
          shippingAddress: {
            location: {},
          },
          paymentMethod: "",
        },
      } as initialStateOrderType;
    }
    case "SAVE_SHIPPING_ADDRESS": {
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: {
            ...state.cart.shippingAddress,
            ...(action.payload as orderItemsType),
          },
        },
      } as initialStateOrderType;
    }
    case "SAVE_PAYMENT_METHOD": {
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload.toString(),
        },
      } as initialStateOrderType;
    }
    case "CART_CLEAR_ITEMS": {
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    }
    default:
      return state;
  }
}

export const Store = createContext<{
  state: initialStateOrderType;
  dispatch: ActionDispatch<[action: actionOrderType]>;
}>({ state: initialStore, dispatch: () => null });

export function StoreProvide({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialStore);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
