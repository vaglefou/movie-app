import React from "react";

export default function Button(props: {
  name: string;
  handleAction?: any;
  isButtonDisabled?: boolean;
  type?: any;
}) {
  return (
    <React.Fragment>
      <button
        className={`w-full h-14 ${
          props.isButtonDisabled
            ? "bg-indigo-300 hover:bg-indigo-400 cursor-not-allowed"
            : "bg-secondary-dark hover:bg-orange-400"
        }  text-white text-sm font-bold py-2 px-4 rounded-2xl  transition duration-300`}
        type={props.type ? props.type : "button"}
        onClick={props.handleAction}
        disabled={props.isButtonDisabled || false}
      >
        {props.name}
      </button>
    </React.Fragment>
  );
}
