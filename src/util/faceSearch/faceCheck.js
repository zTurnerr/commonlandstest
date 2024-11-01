import { faceDetect } from '../../rest_client/apiClient';

export const checkFace = async (key) => {
    try {
        const formSubmit = {
            objectKey: key,
        };
        let { data } = await faceDetect(formSubmit);
        if (data?.error_code) {
            throw new Error(data?.error_detail || data?.error_message);
        }
        return data?.objectKey;
    } catch (error) {
        if (JSON.stringify(error?.message || error).includes('Something went wrong')) {
            throw new Error('Face check failed.');
        }
        throw error;
    }
};
