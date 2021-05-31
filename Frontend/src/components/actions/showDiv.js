import Constants from "../../utilities/Constants";
import React from "react";
export const showDiv = () => {
  return {
    type: Constants.showModal,
    payload: {
      visible: true,
      modalComponent: () => {
        var res = 1 + 1;
        return <div>{res}</div>;
      },
    },
  };
};
