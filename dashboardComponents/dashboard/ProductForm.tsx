import React, { ChangeEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import ErrorMessage from "../ui/ErrorMessage";
import { FiX, FiUpload } from "react-icons/fi";
import { ProductFormValues, productSchema } from "../utils/validators";
import axios from "axios";
import { toast } from "react-toastify";
import { LoadingComponent } from "./LoadingComponent";
import ProductTrue from "@/models/ProductTrue";
import { categorieProduct } from "../types/product";

interface ProductFormProps {
  product?: ProductTrue;
  onClose: () => void;
  onSubmit: (data: ProductFormValues, imageUrl?: string[]) => Promise<void>;
  isLoading: boolean;
}

const arrayOfCategorieProduct = [
  "vêtements Femmes",
  "vêtements Hommes",
  "Electronics",
  "Maison et confort",
  "Sport",
  "Jouets pour enfant",
  "Sacs",
  "Sous vetement",
];

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [selectedImage, setSelectedImage] = useState<FileList | null>(null);
  const [imagePreview, setImagePreview] = useState<string[] | null>(
    product?.imageUrl || null
  );
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: yupResolver(productSchema),
    defaultValues: (product as ProductTrue) || {
      name: "",
      description: "",
      category: "",
      price: 0,
      stock: 0,
      displayHome: false,
      displaySolde: false,
      newProduct: false,
      exploreProduct: false,
      discount: 0,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const files = e.target.files;
      setSelectedImage(files);

      for (const file of files) {
        // Créer une preview de l'image
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview((prev) => {
            if (prev) {
              return [...prev, reader.result as string];
            } else {
              return null;
            }
          });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFormSubmit = (data: ProductFormValues) => {
    onSubmit(data, imageUrl);
  };

  const uploadHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;

    try {
      setLoadingUpload(true);
      const {
        data: { signature, timestamp },
      } = await axios("/api/admin/cloudinary-sign");
      console.log({ signature, timestamp });
      if (!e.target.files) throw new Error("something went wrong");
      const file = e.target.files[0];
      const files = e.target.files;
      if (files.length > 5 || files.length === 0) {
        toast.error("nombre d'image supérieur à 5 ou pas d'image téléchargé");
        setLoadingUpload(false);
        return;
      }
      handleImageChange(e);
      const formData = new FormData();

      let resultForm = [];

      for (const elt of files) {
        resultForm.push(formData.append("file", elt));
      }

      const resultAwait = resultForm.map((val) => {
        const response = fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        return response;
      });

      const resultJson = await Promise.all(resultAwait);
      const resultAvant = resultJson.map((val) => {
        return val.json();
      });

      const resultTotal = await Promise.all(resultAvant);
      const imagesUrls = resultTotal.map((val) => {
        return val.secure_url as string;
      });

      console.log({ imagesUrls });

      setLoadingUpload(false);

      setImageUrl([...imagesUrls]);

      /*   formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json(); */

      /*  setLoadingUpload(false); */

      /* setImageUrl(data.secure_url); */

      toast.success("File uploaded successfully");
    } catch (error) {
      setLoadingUpload(false);
      toast.error("Une erreur est survenue");
    }
  };

  console.log(imageUrl);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            {product ? "Modifier le produit" : "Ajouter un produit"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4">
          <div className="mb-6 flex flex-col items-center">
            <div
              className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden bg-gray-100"
              onClick={triggerFileInput}
            >
              {imageUrl.length > 0 && imageUrl[0] ? (
                <div className="relative flex flex-row overflow-x-auto max-w-64">
                  {imageUrl.map((val, index) => (
                    <img
                      src={val}
                      key={index}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ))}
                  {loadingUpload && (
                    <div className=" flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 ">
                      <LoadingComponent width={25} height={25} />
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className="relative flex flex-col items-center text-gray-400 disabled:backdrop-blur-2xl"
                  disabled={loadingUpload}
                >
                  <FiUpload size={40} />
                  <span className="mt-2">Cliquer pour insérer une image</span>
                  {loadingUpload && (
                    <div className=" flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
                      <LoadingComponent width={25} height={25} />
                    </div>
                  )}
                </button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={uploadHandler}
              accept="image/*"
              className="hidden"
              multiple
            />
            <button
              type="button"
              onClick={triggerFileInput}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Changer l'image
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Nom du produit</label>
              <input
                {...register("name")}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <ErrorMessage message={errors.name?.message} />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Catégorie</label>

              <select
                {...register("category")}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {arrayOfCategorieProduct.map((categorie) => (
                  <option value={categorie.toLowerCase().replace(/ /g, "-")}>
                    {" "}
                    {categorie}{" "}
                  </option>
                ))}
              </select>

              {/*   <input
                {...register("category")}
                className="w-full px-3 py-2 border rounded-lg"
              /> */}
              <ErrorMessage message={errors.category?.message} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <ErrorMessage message={errors.description?.message} />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Prix (€)</label>
              <input
                type="number"
                step="0.01"
                {...register("price")}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <ErrorMessage message={errors.price?.message} />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Stock</label>
              <input
                type="number"
                {...register("stock")}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <ErrorMessage message={errors.stock?.message} />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Remise (%)</label>
              <input
                type="number"
                {...register("discount")}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <ErrorMessage message={errors.discount?.message} />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("displayHome")}
                  className="mr-2"
                />
                Afficher sur la page d'accueil
              </label>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("newProduct")}
                  className="mr-2"
                />
                Produit nouveau
              </label>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("exploreProduct")}
                  className="mr-2"
                />
                Produit à explorer
              </label>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("displaySolde")}
                  className="mr-2"
                />
                Afficher en solde
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Envoi en cours...
                </>
              ) : product ? (
                "Mettre à jour"
              ) : (
                "Ajouter"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
