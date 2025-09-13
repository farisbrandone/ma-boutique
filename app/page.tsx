import HomeComponent from "@/component-home/HomeComponent";

import {
  API_URL,
  fetchBestSellers,
  fetchProductsDisplay,
} from "./actions/dashboard/productAPI/service";
import ProductTrue from "@/models/ProductTrue";

export default async function page() {
  const response = await fetch(`${API_URL}/admin/carouselSlideData`);
  const result = await response.json();
  console.log(result);
  const slides1 = result.slides;

  const product2: ProductTrue[] = (await fetchProductsDisplay(false, true))
    .productsDisplay;

  console.log(product2);

  const productsBestSellers4: ProductTrue[] = (await fetchBestSellers())
    .bestSellers;

  console.log(productsBestSellers4);
  const productExplore6: ProductTrue[] = (
    await fetchProductsDisplay(false, false, false, true)
  ).productsDisplay;

  console.log(productExplore6);

  const productNew7: ProductTrue[] = (
    await fetchProductsDisplay(false, false, true, false)
  ).productsDisplay;

  return (
    <div className="w-full flex flex-col items-center ">
      <HomeComponent
        slides1={slides1}
        product2={product2}
        productsBestSellers4={productsBestSellers4}
        productExplore6={productExplore6}
        productNew7={productNew7}
      />
    </div>
  );
}
