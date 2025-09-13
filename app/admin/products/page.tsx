"use client";

import Layout from "@/components/Layout";
//import { getError } from "@/app/lib-true/error";
import axios from "axios";
import Link from "next/link";

import React, { useEffect, useReducer } from "react";
import { toast } from "react-toastify";
import { productType } from "@/models/Product";
import Auth from "@/components/auth";
import { useRouter } from "next/navigation";

interface initialStateProductType {
  loading: boolean;
  error: string | productType[];
  products: string | productType[];
  loadingCreate: boolean;
  loadingDelete: boolean;
  successDelete: boolean;
}

interface actionProductType {
  type: string;
  payload: string | productType[];
}

function reducer(state: initialStateProductType, action: actionProductType) {
  switch (action.type) {
    case "FETCH_REQUEST": {
      return { ...state, loading: true, error: "" };
    }
    case "FETCH_SUCCESS": {
      return { ...state, loading: false, products: action.payload, error: "" };
    }
    case "FETCH_FAIL": {
      return { ...state, loading: false, error: action.payload };
    }

    case "CREATE_REQUEST": {
      return { ...state, loadingCreate: true };
    }
    case "CREATE_SUCCESS": {
      return { ...state, loadingCreate: false };
    }
    case "CREATE_FAIL": {
      return { ...state, loadingCreate: false };
    }

    case "DELETE_REQUEST": {
      return { ...state, loadingDelete: true };
    }
    case "DELETE_SUCCESS": {
      return { ...state, loadingDelete: false, successDelete: true };
    }
    case "DELETE_FAIL": {
      return { ...state, loadingDelete: false };
    }
    case "DELETE_RESET": {
      return { ...state, loadingDelete: false, successDelete: false };
    }

    default: {
      return state;
    }
  }
}

export default function Products() {
  const [
    { loading, error, products, loadingCreate, loadingDelete, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    products: [],
    error: "",
    successDelete: false,
    loadingDelete: false,
    loadingCreate: false,
  });

  console.log(products);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST", payload: "" });
        const { data } = await axios.get(`/api/admin/products`);
        dispatch({ type: "FETCH_SUCCESS", payload: data.products });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: "getError(err)" });
      }
    };

    if (successDelete) {
      dispatch({ type: "DELETE_RESET", payload: "" });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const createHandler = async () => {
    if (!window.confirm("Are you sure")) {
      return;
    }
    try {
      dispatch({ type: "CREATE_REQUEST", payload: "" });
      const { data } = await axios.post(`/api/admin/products`);
      dispatch({ type: "CREATE_SUCCESS", payload: "" });
      toast.success("Product created succssfully");
      router.push(`/admin/products/${data.product._id}`);
    } catch (error) {
      dispatch({ type: "CREATE_FAIL", payload: "" });
      toast.error("getError(error)");
    }
  };

  const deletHandler = async (productId: string) => {
    if (!window.confirm("Are you sure?")) {
      return;
    }
    try {
      dispatch({ type: "DELETE_REQUEST", payload: "" });
      await axios.delete(`/api/admin/products/${productId}`);
      dispatch({ type: "DELETE_SUCCESS", payload: "" });
      toast.success("Product deleted succssfully");
    } catch (error) {
      dispatch({ type: "DELETE_FAIL", payload: "" });
      toast.error("getError(error)");
    }
  };

  return (
    <Auth adminOnly={true}>
      <Layout title="Admin Dashboard">
        <div className="grid md:grid-cols-4 md:gap-5">
          <div>
            <ul className="leading-9">
              <li>
                <Link href="/admin/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link href="/admin/orders">Orders</Link>
              </li>
              <li className="flex items-center whitespace-nowrap font-bold text-blue-700">
                <Link className="font-bold" href="/admin/products">
                  Products
                </Link>
                {""}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </li>
              <li>
                <Link href="/admin/users">Users</Link>
              </li>
            </ul>
          </div>
          <div className="overflow-x-auto md:col-span-3">
            <div className="flex justify-between">
              <h1 className="mb-4 text-xl">Admin Dashboard</h1>
              {loadingDelete && <div>Deleting item...</div>}
              <button
                disabled={loadingCreate}
                onClick={createHandler}
                className="primary-button"
              >
                {loadingCreate ? "Loading" : "Create"}
              </button>
            </div>

            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="alert-error">{error as string}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="px-5 text-left">ID</th>
                      <th className="px-5 text-left">NAME</th>
                      <th className="px-5 text-left">PRICE</th>
                      <th className="px-5 text-left">CATEGORY</th>
                      <th className="px-5 text-left">COUNT</th>
                      <th className="px-5 text-left">RATING</th>
                      <th className="px-5 text-left">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products &&
                      (products as productType[]).map((product) => (
                        <tr key={product._id} className="border-b">
                          <td className="p-5">
                            {product._id.substring(20, 24)}
                          </td>
                          <td className="p-5">{product.name}</td>
                          <td className="p-5">{product.price}</td>
                          <td className="p-5">{product.category} ₹</td>
                          <td className="p-5">{product.countInStock}</td>
                          <td className="p-5">{product.rating}</td>
                          <td className="p-5">
                            <Link
                              className="default-button"
                              href={`/admin/products/${product._id}`}
                            >
                              Edit
                            </Link>
                            &nbsp;
                            <button
                              disabled={successDelete}
                              onClick={() => deletHandler(product._id)}
                              className="default-button"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </Auth>
  );
}

/* Products.auth = { adminOnly: true }; */
