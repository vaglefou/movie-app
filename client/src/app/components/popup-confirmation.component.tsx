import React, { useEffect, useRef } from "react";

export default function PopupConfirmationComponent(props: {
  popUpDisplay: boolean;
  handleClose: any;
  handleOpen: any;
  popUpTitle: string;
  popUpContent: string;
  handleConfirm: any;
  confirmBtnText?: any;
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
              className="relative px-6 py-4 mx-auto min-w-96 max-w-md bg-slate-50 rounded-lg"
            >
              <div className="flex justify-end">
                <button onClick={props.handleClose}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <h1 className="text-2xl font-bold mb-4">{props.popUpTitle}</h1>
              <p className="text-gray-600 mb-10">{props.popUpContent}</p>
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-md border-none"
                  onClick={props.handleClose}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-white bg-rose-500 hover:bg-rose-600 rounded-md border-none"
                  onClick={props.handleConfirm}
                >
                  {props.confirmBtnText ? props.confirmBtnText : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
}
