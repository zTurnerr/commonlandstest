import { postImageS3 } from '../rest_client/apiClient';
import { showErr } from '../util/showErr';

const useUploadImg = () => {
    const initDataSubmit = async ({ imageUri }) => {
        try {
            let photo = {
                uri: imageUri,
                type: 'image/jpeg',
                name: 'photoOfFace.jpg',
            };

            let form = new FormData();
            form.append('image', photo);
            return form;
        } catch (err) {
            throw err;
        }
    };

    const uploadImg = async (imgUri, func = postImageS3) => {
        try {
            let formData = await initDataSubmit({ imageUri: imgUri });
            let { data } = await func(formData, null, null);
            return data?.imageAWSKey || '';
        } catch (error) {
            showErr(error);
            return '';
        }
    };

    return { uploadImg };
};

export default useUploadImg;
