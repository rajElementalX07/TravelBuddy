import React from "react";
import toast from "react-hot-toast";


export const getError = (error) => {
  return (
    <>
      {console.log({ error })}
      {error.response
        ? error.response.data.error.message
          ? toast.error(error.response.data.error.message)
          : toast.error(error.response)
        : toast.error(error.message)}
    </>
  );
};
