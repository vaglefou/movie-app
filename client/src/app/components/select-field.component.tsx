import React from "react";

export default function SelectField(props: {
  icon: string;
  options: { value: string; label: string }[];
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <React.Fragment>
      <label className="text-xs text-slate-400 ml-1">{props.label}</label>
      <div className="w-full h-14 py-4 px-5 border-none rounded-lg bg-white font-normal flex flex-row items-center justify-center">
        <i className={`${props.icon} text-slate-400`}></i>
        <select
          className="w-full ml-5 border-none outline-none"
          name="selectField"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          disabled={props.disabled}
        >
          <option value="" disabled={true} hidden={true}>
            {props.placeholder}
          </option>
          {props.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </React.Fragment>
  );
}
