import React from "react";

export default function TextField(props: {
  icon: string;
  placeholder: string;
  rows: number;
  value: any;
  onChange: any;
  disabled?: boolean;
}) {
  return (
    <React.Fragment>
      <div className="w-full mb-4 py-4 px-5 border-none rounded-lg bg-white font-normal flex flex-col items-start justify-start">
        <div className="flex flex-row items-center justify-start w-full">
          <i className={`${props.icon} text-slate-400`} />
          <p className="text-slate-400 ml-4">{props.placeholder}</p>
        </div>
        <textarea
          className="w-full h-32 border-none outline-none mt-2"
          name="inputField"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          disabled={props.disabled}
          rows={props.rows}
          style={{ resize: "none" }}
        />
      </div>
    </React.Fragment>
  );
}
