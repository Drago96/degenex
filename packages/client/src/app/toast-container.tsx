"use client";

import {
  ToastContainer as ToastifyToastContainer,
  ToastContainerProps,
} from "react-toastify";

export default function ToastContainer(props: ToastContainerProps) {
  return <ToastifyToastContainer {...props} />;
}
