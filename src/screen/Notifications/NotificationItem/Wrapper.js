import { Box } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { notificationsSliceActions } from '../../../redux/reducer/notifications';
import { markReadNotification } from '../../../rest_client/apiClient';

export default function Index({ data, children, onPress, willReadMessage = true }) {
    const dispatch = useDispatch();

    const _onPress = async () => {
        onPress && onPress();
        if (data.isRead) return;
        if (!willReadMessage) return;
        try {
            await markReadNotification({ notificationIDs: [data._id] });
            dispatch(notificationsSliceActions.markRead({ id: data._id }));
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <TouchableOpacity onPress={_onPress}>
            <Box
                p="12px"
                borderBottomColor="gray.400"
                borderBottomWidth="1px"
                flexDirection="row"
                bgColor={data.isRead ? 'white' : '#5EC4AC1A'}
                display="flex"
            >
                {children}
            </Box>
        </TouchableOpacity>
    );
}
