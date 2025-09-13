import React, { useEffect, useRef, useState } from "react";
import { FiEdit, FiTrash2, FiMoreVertical } from "react-icons/fi";

interface DropdownActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const DropdownActions: React.FC<DropdownActionsProps> = ({
  onEdit,
  onDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fermer le dropdown avec la touche Échap
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div
      className="relative    flex items-center justify-center"
      ref={dropdownRef}
    >
      <button
        className="p-2 hover:bg-gray-100 cursor-pointer border border-[#252525] border-solid  rounded-md "
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiMoreVertical />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md border border-[#252525] border-solid  shadow-lg z-[300]">
          <button
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
            onClick={onEdit}
          >
            <FiEdit className="mr-2" /> Modifier
          </button>
          <button
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
            onClick={onDelete}
          >
            <FiTrash2 className="mr-2" /> Supprimer
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownActions;
