import React from "react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => {
  return (
    <div
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
        checked ? "bg-green-500" : "bg-gray-300"
      }`}
      onClick={() => onChange(!checked)}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
          checked ? "translate-x-6" : ""
        }`}
      />
    </div>
  );
};

export default ToggleSwitch;
