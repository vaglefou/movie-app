import React, { useEffect, useRef } from "react";

export default function FormPopupComponent(props: {
  popUpDisplay: boolean;
  handleClose: any;
  handleOpen: any;
  popUpTitle: string;
  children: any;
}) {
  // Handling the click out side closing the pop up
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        popupRef.current &&
        event.target &&
        !popupRef.current.contains(event.target as Node) &&
        props.popUpDisplay
      ) {
        props.handleClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [props.popUpDisplay, props.handleClose]);

  return (
    <React.Fragment>
      {props.popUpDisplay ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-gray-800 bg-opacity-75 fixed inset-0 transition-opacity flex justify-center items-center">
            <div
              ref={popupRef}
              className="relative px-6 py-4 bg-slate-50 rounded-xl w-1/2 h-5/6"
            >
              <div className="flex justify-end">
                <button onClick={props.handleClose}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <h1 className="text-2xl font-bold mb-4">{props.popUpTitle}</h1>
              <div className="overflow-auto h-[calc(100%-4rem)]">
                {props.children}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
}
