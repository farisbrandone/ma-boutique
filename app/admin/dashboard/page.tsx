import Layout from "@/components/Layout";
import { getError } from "../../lib-true/error";
import axios from "axios";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import Link from "next/link";
import React, { useEffect, useReducer } from "react";
import { Bar } from "react-chartjs-2";
import { actionType } from "../products/[id]/page";
import Auth from "@/components/auth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor?: string[];
      borderWidth?: number;
    }[];
  };
  options?: ChartOptions<"bar">;
}
export const options = {
  responsive: true,
  plugins: {
    legend: {
      postion: "top",
    },
  },
};

interface saleDateType {
  _id: string;
  totalSales: number;
}

export interface summayType {
  ordersPrice: number;
  ordersCount: number;
  productsCount: number;
  usersCount: number;
  salesDate: saleDateType[];
}

interface initialStateDashboardType {
  loading: boolean;
  error: string | summayType;
  summay: string | summayType;
}

interface actionDashboardType {
  type: string;
  payload: string | summayType;
}

function reducer(
  state: initialStateDashboardType,
  action: actionDashboardType
) {
  switch (action.type) {
    case "FETCH_REQUEST": {
      return { ...state, loading: true, error: "" };
    }
    case "FETCH_SUCCESS": {
      return { ...state, loading: false, summay: action.payload, error: "" };
    }
    case "FETCH_FAIL": {
      return { ...state, loading: false, error: action.payload };
    }
    default: {
      return state;
    }
  }
}

export default function Dashboard() {
  const [{ loading, error, summay }, dispatch] = useReducer(reducer, {
    loading: true,
    summay: {
      salesDate: [
        {
          _id: "",
          totalSales: 0,
        },
      ],
      ordersCount: 0,
      ordersPrice: 0,
      productsCount: 0,
    } as summayType,
    error: "",
  });
  const defaultOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "right" as const,
      },
      title: {
        display: true,
        text: "Bar Chart Example",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST", payload: "" });
        const { data } = await axios.get("/api/admin/summary");
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchData();
  }, []);

  const data = {
    labels: (summay as summayType).salesDate.map(
      (yearAndMont) => yearAndMont._id
    ),
    datasets: [
      {
        label: "Sales",
        backgroundColor: "rgba(162,222,208,1)",
        data: (summay as summayType).salesDate.map(
          (yearAndMont) => yearAndMont.totalSales
        ),
      },
    ],
  };

  return (
    <Auth adminOnly={true}>
      <Layout title="Admin Dashboard">
        <div className="grid md:grid-cols-4 md:gap-5">
          <div>
            <ul className="leading-9">
              <li className="flex items-center whitespace-nowrap font-bold text-blue-700">
                <Link href="/admin/dashboard">Dashboard</Link>
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
                <Link href="/admin/orders">Orders</Link>
              </li>
              <li>
                <Link href="/admin/products">Products</Link>
              </li>
              <li>
                <Link href="/admin/users">Users</Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <h1 className="mb-4 text-xl">Admin Dashboard</h1>
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="alert-error">{error as string}</div>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-4">
                  <div className="card m-5 p-5">
                    <p className="text-3xl">
                      {(summay as summayType).ordersPrice} ₹
                    </p>
                    <p>Sales</p>
                    <Link href="/admin/orders">View sales</Link>
                  </div>

                  <div className="card m-5 p-5">
                    <p className="text-3xl">
                      {(summay as summayType).ordersCount}
                    </p>
                    <p>Orders</p>
                    <Link href="/admin/orders">View orders</Link>
                  </div>

                  <div className="card m-5 p-5">
                    <p className="text-3xl">
                      {(summay as summayType).productsCount}
                    </p>
                    <p>Products</p>
                    <Link href="/admin/products">View products</Link>
                  </div>

                  <div className="card m-5 p-5">
                    <p className="text-3xl">
                      {(summay as summayType).usersCount}
                    </p>
                    <p>Users</p>
                    <Link href="/admin/users">View users</Link>
                  </div>
                </div>
                <h2 className="text-xl"> Sales Report</h2>
                <Bar options={{ ...defaultOptions }} data={data} />
              </div>
            )}
          </div>
        </div>
      </Layout>
    </Auth>
  );
}

/* Dashboard.auth = { adminOnly: true }; */
