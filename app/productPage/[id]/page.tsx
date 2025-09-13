import Header from "@/component-home/HeaderHome";
import { API_URL } from "@/app/actions/dashboard/productAPI/route";
import ProductTrue from "@/models/ProductTrue";
import ProductDetails from "@/component-card-detail/CardDetail";
const exampleProduct = {
  id: "1",
  name: "Premium Comfort T-Shirt",
  price: 29.99,
  description:
    "Soft, breathable cotton t-shirt for all-day comfort. Perfect for casual wear or workouts.",
  images: [
    "/image/explore4.png",
    "/image/explore6.png",
    "/image/explore7.png",
    "/image/explore8.png",
  ],
  rating: 4.5,
  reviewCount: 128,
  variants: {
    color: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
    size: ["S", "M", "L", "XL"],
  },
};

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await fetch(`${API_URL}/admin/productsTrue/${id}`, {
    method: "GET",
  });

  const product: { product: ProductTrue } = await response.json();
  console.log("blabla");
  console.log(product);

  console.log(product.product);

  return (
    <div className=" mx-auto flex flex-col w-screen xl:max-w-7xl min-h-screen p-0">
      <Header />
      <div className="p-4 flex-1 flex items-center">
        <ProductDetails
          product={product.product}
          locale="en-US"
          currency="USD"
        />
      </div>
    </div>
  );
}
