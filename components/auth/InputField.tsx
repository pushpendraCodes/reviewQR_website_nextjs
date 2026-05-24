'use client';

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  icon?: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registration?: any;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}
const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  placeholder,
  error,
  icon,
  registration,
  disabled,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          disabled={disabled}
          {...(registration || {})}
          className={`w-full bg-white border-2 ${
            error
              ? "border-red-400 focus:ring-red-200 focus:border-red-500"
              : "border-gray-200 focus:ring-violet-100 focus:border-violet-500"
          } rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm
          focus:outline-none focus:ring-4
          hover:border-gray-300 transition-all duration-200
          ${icon ? "pl-10" : ""}
          ${isPassword ? "pr-12" : ""}
          disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50
          shadow-sm`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1.5 mt-1">
          <span className="w-1.5 h-1.5 bg-red-400 rounded-full inline-block flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};
export default InputField;