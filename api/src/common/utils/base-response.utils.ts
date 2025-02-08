// Define an interface for the base response structure
export interface BaseResponse {
  success: boolean; // Indicates whether the operation was successful
  message: string; // Provides a message describing the result of the operation
  data: any; // Holds any data returned by the operation
  error: any; // Contains any error information in case of failure
}

// Create a custom response object
export const createResponse = (
  success: boolean,
  message: string,
  data: any,
  error: any
): BaseResponse => {
  return {
    success,
    message,
    data,
    error,
  };
};

// Success response
export const fromSuccess = (message: string, data: any): BaseResponse => {
  return createResponse(true, message, data, null);
};

// Failed response
export const fromFailed = (errorMessage: string): BaseResponse => {
  return createResponse(false, errorMessage, null, errorMessage);
};
