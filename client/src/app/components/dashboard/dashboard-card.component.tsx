import React from "react";

export default function DashboardCardComponent(props: {
  title: string;
  value: any;
  icon: string;
}) {
  return (
    <React.Fragment>
      <div className="flex flex-col items-center justify-center p-6 bg-slate-100 hover:bg-slate-200 rounded-xl shadow-sm">
        <i
          className={`${props.icon} text-4xl font-bold text-center`}
        ></i>
        <h1 className="text-4xl font-bold text-slate-800 text-center mt-5">
          {props.value}
        </h1>
        <p className="text-md font-semibold text-slate-700 text-center mt-2">
          {props.title}
        </p>
      </div>
    </React.Fragment>
  );
}
