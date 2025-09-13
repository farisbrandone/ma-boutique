import Layout from "@/components/Layout";
import { userType } from "@/models/User";
import { getError } from "@/app/lib-true/error";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useReducer } from "react";
import { toast } from "react-toastify";
import Auth from "@/components/auth";

interface initialStateProductType {
  loading: boolean;
  error: string | userType[];
  users: string | userType[];
  /*  loadingCreate: boolean; */
  loadingDelete: boolean;
  successDelete: boolean;
}

interface actionProductType {
  type: string;
  payload: string | userType[];
}

function reducer(state: initialStateProductType, action: actionProductType) {
  switch (action.type) {
    case "FETCH_REQUEST": {
      return { ...state, loading: true, error: "" };
    }
    case "FETCH_SUCCESS": {
      return { ...state, loading: false, users: action.payload, error: "" };
    }
    case "FETCH_FAIL": {
      return { ...state, loading: false, error: action.payload };
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

export default function Users() {
  const [{ loading, error, users, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      users: [],
      error: "",
      loadingDelete: false,
      successDelete: false,
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST", payload: "" });
        const { data } = await axios.get(`/api/admin/users`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    if (successDelete) {
      dispatch({ type: "DELETE_RESET", payload: "" });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const deletHandler = async (userId: string) => {
    if (!window.confirm("Are you sure?")) {
      return;
    }
    try {
      dispatch({ type: "DELETE_REQUEST", payload: "" });
      await axios.delete(`/api/admin/users/${userId}`);
      dispatch({ type: "DELETE_SUCCESS", payload: "" });
      toast.success("User deleted succssfully");
    } catch (error) {
      dispatch({ type: "DELETE_FAIL", payload: "" });
      toast.error(getError(error));
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
              <li>
                <Link href="/admin/products">Products</Link>
              </li>
              <li className="flex items-center whitespace-nowrap font-bold text-blue-700">
                <Link className="font-bold" href="/admin/users">
                  Users
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
            </ul>
          </div>
          <div className="overflow-x-auto md:col-span-3">
            <h1 className="mb-4 text-xl">Users</h1>
            {loadingDelete && <div>Deleting...</div>}
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
                      <th className="px-5 text-left">EMAIL</th>
                      <th className="px-5 text-left">ADMIN</th>
                      <th className="px-5 text-left">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(users as userType[]).map((user) => (
                      <tr key={user._id} className="border-b">
                        <td className="p-5">{user._id.substring(20, 24)}</td>
                        <td className="p-5">{user.name}</td>
                        <td className="p-5">{user.email}</td>
                        <td className="p-5">{user.isAdmin ? "YES" : "NO"}</td>
                        <td className="p-5">
                          <Link
                            className="default-button"
                            href={`/admin/user/${user._id}`}
                          >
                            Edit
                          </Link>
                          &nbsp;
                          <button
                            onClick={() => deletHandler(user._id)}
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

/* Users.auth = { adminOnly: true }; */
