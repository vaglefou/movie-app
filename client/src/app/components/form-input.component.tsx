import React from "react";

export default function FormInputField(props: {
  icon: string;
  type: string;
  placeholder: string;
  name: string;
  value?: any;
  onChange: any;
  disabled?: boolean;
  label?: string;
  max?: any;
}) {
  const currentDate = new Date()
    .toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");

  return (
    <React.Fragment>
      <label className="text-xs text-slate-400 ml-1">{props.label}</label>
      <div
        className={`${
          props.disabled ? "bg-slate-50 cursor-not-allowed" : "bg-white"
        } w-full h-14 mb-4 py-4 px-5 border-none rounded-lg  font-normal flex flex-row items-center justify-center`}
      >
        <i className={`${props.icon} text-slate-400`}></i>
        <input
          className={`w-full ml-5 border-none outline-none ${
            props.disabled ? "bg-slate-50 cursor-not-allowed" : "bg-white"
          }`}
          type={props.type}
          name={props.name}
          placeholder={props.placeholder}
          value={props.value}
          onChange={(e) =>
            props.onChange({ name: props.name, value: e.target.value })
          }
          disabled={props.disabled}
          {...(props.type === "date" ? { min: currentDate } : {})}
          max={props.max}
        />
      </div>
    </React.Fragment>
  );
}
