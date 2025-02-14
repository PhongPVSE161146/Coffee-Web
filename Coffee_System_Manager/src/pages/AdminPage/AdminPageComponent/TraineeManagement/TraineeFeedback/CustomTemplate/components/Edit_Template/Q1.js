import { instance } from './instan'



// Fetch a specific template by ID for editing
export const getTemplateById = async (templateId) => {
    try {
        const token = sessionStorage.getItem('accessToken');

        if (!token) {
            throw new Error('Token is missing, please log in again');
        }

        const response = await instance.get(`/v1/feedback-template/${templateId}`, {
            headers: {
                Authorization: `Bearer ${token}`,

            }
        });

        return response;  // Return the template data
    } catch (error) {
        //console.error('Error fetching template by ID:', error.message);
        throw error;
    }
};



export const updateTemplateById = async (id, updatedTemplate) => {
    try {
        const token = sessionStorage.getItem("accessToken");

        if (!token) {
            throw new Error("Authentication token is missing. Please log in again.");
        }

        const response = await instance.put(
            `/v1/feedback-template/${id}`,
            updatedTemplate,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        //console.log("Response from server:", response); // Debugging log

        // Return the full response if data is undefined
        return response.data || response; // Ensure you return some data
    } catch (error) {
        //console.error("Error in updateTemplateById:", error.message);
        throw error; // Re-throw error for caller to handle
    }
};


export const addNewTemplate = (payload, token) => {
    return instance.post('/v1/feedback-template/create-template', payload, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};