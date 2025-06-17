// src/utils/axiosInstance.js
import axios from 'axios';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response Interceptor: Handle global success/error messages
axiosInstance.interceptors.response.use(
    (response) => {
        // This part handles the 'status: true/false' from your backend's data object
        // Only show success message if the backend explicitly says so

        if (response.data && response.data.status === true && response.data.message) {

            toast.success(response.data.message || 'Success');
        }


        if (response.data && response.data.status === false && response.data.message) {

            toast.error(response.data.message || 'Something went wrong');
        }

        return response; // Always return the response
    },
    (error) => {
        // This is where all network/HTTP errors are caught


        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const status = error.response.status;
            const errorMessage = error.response.data?.message || error.message || 'An unexpected error occurred.';

            switch (status) {
                case 400:
                    console.error("Axios Interceptor Error: my egfrror");
                    //  message.error(`${errorMessage}` || 'Bad Request');
                    toast.error(`${errorMessage} d` || 'Bad Request');
                    break;
                case 401:

                    //message.error('Unauthorized: Please log in again.');
                    toast.error('Unauthorized: Please log in again.');

                    // Optionally, redirect to login or refresh token
                    // keycloak.login();
                    break;
                case 403:
                    //message.error('Forbidden: You do not have permission to perform this action.');
                    toast.error('Forbidden: You do not have permission to perform this action.');
                    break;
                case 404:
                    //message.error(`Requested URL Not Found`);
                    toast.error(`Requested URL Not Found`);
                    break;
                case 409: // Example for conflict (e.g., duplicate category name)
                    //message.error(`Conflict: ${errorMessage}`);
                    toast.error(`Conflict: ${errorMessage}`);
                    break;
                case 422: // Example for unprocessable entity (validation errors)
                    //message.error(`Validation Error: ${errorMessage}`);
                    toast.error(`Validation Error: ${errorMessage}`);
                    break;
                case 500:
                    //message.error(`Server Error: ${errorMessage}`);
                    toast.error(`Server Error: ${errorMessage}`);
                    break;
                default:
                    //message.error(`API Error (${status}): ${errorMessage}`);
                    toast.error(`API Error (${status}): ${errorMessage}`);
            }
        } else if (error.request) {
            // The request was made but no response was received
            //message.error('Network Error Occurred');
            toast.error('Network Error Occurred');
        } else {
            // Something happened in setting up the request that triggered an Error
            //message.error(`An unexpected error occurred: ${error.message}`);
            toast.error(`An unexpected error occurred: ${error.message}`);
        }

        return Promise.reject(error); // Re-throw the error so downstream catch blocks can still handle it if needed
    }
);

export default axiosInstance;