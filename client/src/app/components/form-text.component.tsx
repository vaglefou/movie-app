import React from "react";

export default function FormTextField(props: {
  icon?: string;
  placeholder?: string;
  name: string;
  value: any;
  onChange: any;
  disabled?: boolean;
  rows: number;
  label?: string;
}) {
  return (
    <React.Fragment>
      <label className="text-xs text-slate-400 ml-1">{props.label}</label>
      <div
        className={`${
          props.disabled ? "bg-slate-50 cursor-not-allowed" : "bg-white"
        } w-full mb-4 py-4 px-5 border-none rounded-lg  font-normal flex flex-col items-start justify-start`}
      >
        <div className="flex flex-row items-center justify-start w-full">
          <i className={`${props.icon} text-slate-400`} />
        </div>
        <textarea
          className="w-full h-fit border-none outline-none mt-2"
          name={props.name}
          value={props.value}
          onChange={(e) =>
            props.onChange({ name: props.name, value: e.target.value })
          }
          disabled={props.disabled}
          rows={props.rows}
          style={{ resize: "vertical" }}
          placeholder={props.placeholder}
        />
      </div>
    </React.Fragment>
  );
}
