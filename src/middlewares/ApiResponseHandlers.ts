import { ApiServiceResponse } from "../tpyeModels/APIServiceResponse";

const returnError = (statusCode: number, message: string) => {
  const response: ApiServiceResponse = {
    statusCode,
    response: {
      status: false,
      code: statusCode,
      message,
    },
  };
};

const returnSuccess = (
  statusCode: number,
  message: string,
  data?: [] | object
) => {
  const response: ApiServiceResponse = {
    statusCode,
    response: {
      status: true,
      code: statusCode,
      message,
      data,
    },
  };
};

export default {
  returnError,
  returnSuccess,
};
