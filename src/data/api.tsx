const ENV = process.env.REACT_APP_ENV || "dev"; // Default to "prod" if not set

export const collectionEndpoint = `https://2vyhl58mci.execute-api.ap-southeast-2.amazonaws.com/${ENV}/get-upload-url`;
export const collectionBucket = ENV === "dev" ? "dev-sierra-e-bucket" : "sierra-e-bucket";
export const retrievalCSVEndpoint = `https://tni794cvna.execute-api.ap-southeast-2.amazonaws.com/${ENV}/get-csv-data`;
export const retrievalJSONEndpoint = `https://tni794cvna.execute-api.ap-southeast-2.amazonaws.com/${ENV}/get-json-data`;