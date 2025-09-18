"use client";

// src/pages/CarouselDashboard.tsx
import React, { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiArrowUp,
  FiArrowDown,
  FiSave,
  FiX,
  FiUpload,
} from "react-icons/fi";
import {
  createSlide,
  deleteSlide,
  fetchCarouselSlides,
  reorderSlides,
  updateSlide,
} from "@/app/actions/dashboard/carouselAPI/service";
import axios from "axios";
import { LoadingComponent } from "@/dashboardComponents/dashboard/LoadingComponent";
import { toast } from "react-toastify";

interface CarouselSlide {
  _id: string;
  imageUrl: string;
  altText: string;
  order: number;
  isActive: boolean;
}

const CarouselDashboard = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<CarouselSlide>>({});
  const [newSlide, setNewSlide] = useState({
    imageUrl: "",
    altText: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingChange, setLoadingChange] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    data: slides,
    isLoading,
    isError,
  } = useQuery<CarouselSlide[]>({
    queryKey: ["carouselSlides"],
    queryFn: fetchCarouselSlides,
  });

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  console.log(selectedImage);

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => createSlide(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carouselSlides"] });
      setIsAdding(false);
      setNewSlide({ imageUrl: "", altText: "" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateSlide(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carouselSlides"] });
      setIsEditing(null);
      setLoadingChange(false);
    },
    onError: () => {
      setLoadingChange(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSlide,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carouselSlides"] });
      setLoadingChange(false);
    },
    onError: () => {
      setLoadingChange(false);
    },
  });

  const reorderMutation = useMutation({
    mutationFn: reorderSlides,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carouselSlides"] });
      setLoadingChange(false);
    },
    onError: () => {
      setLoadingChange(false);
    },
  });

  const handleAddSlide = () => {
    setLoadingChange(true);
    const formData = new FormData();
    if (newSlide.imageUrl) formData.append("imageUrl", newSlide.imageUrl);
    formData.append("altText", newSlide.altText);
    createMutation.mutate(formData);
  };

  const handleUpdateSlide = (id: string) => {
    const formData = new FormData();
    if (editData.imageUrl) formData.append("imageUrl", editData.imageUrl);
    formData.append("altText", editData.altText || "");
    formData.append("order", String(editData.order || 0));
    formData.append("isActive", String(editData.isActive || false));
    setLoadingChange(true);

    updateMutation.mutate({ id, formData });
  };

  const handleMoveSlide = (index: number, direction: "up" | "down") => {
    if (!slides) return;

    const newOrder = [...slides];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < newOrder.length) {
      [newOrder[index], newOrder[newIndex]] = [
        newOrder[newIndex],
        newOrder[index],
      ];

      const slideIds = newOrder.map((slide) => slide._id);
      setLoadingChange(true);
      console.log("dodo");
      reorderMutation.mutate({ newOrder: slideIds });

      console.log("popo");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      // Créer une preview de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadHandler = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isNew: boolean = false
  ) => {
    /*   const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`; */
    handleImageChange(e);
    try {
      setLoadingUpload(true);
      const {
        data: { signature, timestamp },
      } = await axios("/api/admin/cloudinary-sign");
      console.log({ signature, timestamp });
      if (!e.target.files) throw new Error("something went wrong");
      const file = e.target.files[0];

      const formData = new FormData();

      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log({ data: data.secure_url });
      setLoadingUpload(false);

      if (isNew) {
        setNewSlide({ ...newSlide, imageUrl: data.secure_url });
      } else {
        setEditData({ ...editData, imageUrl: data.secure_url });
      }

      toast.success("File uploaded successfully");
    } catch (error) {
      setLoadingUpload(false);
      toast.error("Une erreur est survenue");
      console.log(error);
    }
  };

  if (isLoading)
    return <div className="text-center py-12">Chargement des slides...</div>;
  if (isError)
    return (
      <div className="text-center py-12 text-red-500">Erreur de chargement</div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      {loadingChange && (
        <div className="absolute  flex items-center justify-center top-0 bottom-0 left-0 right-0 z-20 bg-white/30 backdrop-blur-none">
          <LoadingComponent width={45} height={45} color="#bd4444" />
        </div>
      )}
      <div className="flex justify-between items-center mb-8  ">
        <h1 className="text-2xl font-bold">Gestion du Carrousel</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FiPlus className="mr-2" /> Ajouter une slide
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4">Nouvelle Slide</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-6 flex flex-col items-center">
              <div
                className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden bg-gray-100"
                onClick={triggerFileInput}
              >
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    {loadingUpload && (
                      <div className=" flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 ">
                        <LoadingComponent width={25} height={25} />
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    className="relative flex flex-col items-center text-gray-400 disabled:backdrop-blur-2xl cursor-pointer "
                    disabled={loadingUpload}
                  >
                    <FiUpload size={40} />
                    <span className="mt-2">Cliquer pour uploader</span>
                  </button>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  uploadHandler(e, true);
                }}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={triggerFileInput}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Changer l&apos;image
              </button>
            </div>

            <div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Texte alternatif
                </label>
                <input
                  type="text"
                  value={newSlide.altText}
                  onChange={(e) =>
                    setNewSlide({ ...newSlide, altText: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Description de l'image"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddSlide}
                  disabled={!newSlide.imageUrl || !newSlide.altText}
                  className={`px-4 py-2 rounded-lg text-white ${
                    !newSlide.imageUrl || !newSlide.altText
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Texte alternatif
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ordre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {slides &&
              slides?.map((slide, index) => (
                <tr key={slide._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing === slide._id ? (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            uploadHandler(e, false);
                          }}
                          className="mb-2"
                        />
                        {editData.imageUrl ? (
                          <div className="relative">
                            <img
                              src={editData.imageUrl}
                              alt="Nouvelle image"
                              className="max-w-xs h-32 object-contain"
                            />
                            {loadingUpload && (
                              <div className=" flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 ">
                                <LoadingComponent width={25} height={25} />
                              </div>
                            )}
                          </div>
                        ) : (
                          <img
                            src={slide.imageUrl}
                            alt={slide.altText}
                            className="max-w-xs h-32 object-contain"
                          />
                        )}
                      </div>
                    ) : (
                      <img
                        src={slide.imageUrl}
                        alt={slide.altText}
                        className="max-w-xs h-32 object-contain"
                      />
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {isEditing === slide._id ? (
                      <input
                        type="text"
                        value={editData.altText || slide.altText}
                        onChange={(e) =>
                          setEditData({ ...editData, altText: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    ) : (
                      slide.altText
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleMoveSlide(index, "up")}
                        disabled={index === 0}
                        className={`p-1 rounded ${
                          index === 0
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <FiArrowUp />
                      </button>

                      <span className="text-lg font-medium">
                        {slide.order + 1}
                      </span>

                      <button
                        onClick={() => handleMoveSlide(index, "down")}
                        disabled={index === slides.length - 1}
                        className={`p-1 rounded ${
                          index === slides.length - 1
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <FiArrowDown />
                      </button>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {isEditing === slide._id ? (
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editData.isActive ?? slide.isActive}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              isActive: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-sm font-medium">
                          {editData.isActive ?? slide.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </label>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          slide.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {slide.isActive ? "Active" : "Inactive"}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {isEditing === slide._id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setIsEditing(null)}
                          className="text-gray-600 hover:text-gray-900 p-2"
                        >
                          <FiX size={20} />
                        </button>
                        <button
                          onClick={() => handleUpdateSlide(slide._id)}
                          className="text-green-600 hover:text-green-900 p-2"
                        >
                          <FiSave size={20} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setIsEditing(slide._id);
                            setEditData({
                              altText: slide.altText,
                              order: slide.order,
                              isActive: slide.isActive,
                            });
                          }}
                          className="text-blue-600 hover:text-blue-900 p-2"
                        >
                          <FiEdit size={20} />
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Êtes-vous sûr de vouloir supprimer cette slide ?"
                              )
                            ) {
                              deleteMutation.mutate(slide._id);
                            }
                          }}
                          className="text-red-600 hover:text-red-900 p-2"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {slides?.length === 0 && (
        <div className="bg-white p-8 rounded-xl shadow-lg text-center mt-8">
          <div className="text-gray-400 mb-4">
            Aucune slide dans le carrousel
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Ajouter votre première slide
          </button>
        </div>
      )}
    </div>
  );
};

export default CarouselDashboard;
