import { faceSearch } from '../../rest_client/apiClient';
import { showErr } from '../showErr';

export const _faceSearch = async (uri) => {
    try {
        let photo = {
            uri,
            type: 'image/jpeg',
            // name: `${data.fullName}.jpg`,
            name: 'test.jpg',
        };
        let form = new FormData();
        form.append('image', photo);
        let { data } = await faceSearch(form);
        if (data?.error_detail) {
            throw data.error_detail;
        }
        return data;
    } catch (error) {
        showErr(error);
        throw error;
    }
};
