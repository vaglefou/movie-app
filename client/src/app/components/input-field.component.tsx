import React, { useRef, useState } from "react";

export default function InputField(props: {
  icon: string;
  type: string;
  placeholder: string;
  value: any;
  onChange: any;
  disabled?: boolean;
  onKeyDown?: any;
  label?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <React.Fragment>
      <label className="text-xs text-slate-400 ml-1">{props.label}</label>
      <div
        className={`${
          props.disabled ? "bg-slate-50 cursor-not-allowed" : "bg-white"
        } w-full mb-4 py-4 px-5 rounded-lg font-normal flex flex-row items-center justify-center border-none`}
      >
        <i className={`${props.icon} text-slate-400`}></i>
        <input
          ref={inputRef}
          className={`w-full ml-5 border-none outline-none ${
            props.disabled ? "bg-slate-50 cursor-not-allowed" : "bg-white"
          }`}
          type={props.type === "password" && showPassword ? "text" : props.type}
          name="inputField"
          placeholder={props.placeholder}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          disabled={props.disabled}
          onKeyDown={props.onKeyDown}
          autoComplete={"off"}
        />
        {props.type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="text-slate-400 ml-2 focus:outline-none"
          >
            {showPassword ? (
              <i className="fa-regular fa-eye-slash"></i>
            ) : (
              <i className="fa-regular fa-eye"></i>
            )}
          </button>
        )}
      </div>
    </React.Fragment>
  );
}
