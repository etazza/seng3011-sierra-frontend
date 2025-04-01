const ENV = import.meta.env.VITE_ENV || "dev"; // Default to "dev" if not set

export const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN || "";
export const clientId = import.meta.env.VITE_CLIENT_ID || "";
export const clientSecret = import.meta.env.VITE_CLIENT_SECRET || "";

export const collectionEndpoint = `https://2vyhl58mci.execute-api.ap-southeast-2.amazonaws.com/${ENV}/get-upload-url`;
export const collectionBucket = ENV === "dev" ? "dev-sierra-e-bucket" : "sierra-e-bucket";
export const frontend = ENV === "dev" ? "https://d3kuyfddew0um3.cloudfront.net/upload" : "https://sierra-frontend.s3-website-ap-southeast-2.amazonaws.com";
export const retrievalCSVEndpoint = `https://tni794cvna.execute-api.ap-southeast-2.amazonaws.com/${ENV}/get-csv-data`;
export const retrievalJSONEndpoint = `https://tni794cvna.execute-api.ap-southeast-2.amazonaws.com/${ENV}/get-json-data`;