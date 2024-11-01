import useTranslate from '../../i18n/useTranslate';
import { Avatar, Box, ChevronRightIcon, HStack, Text, VStack } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import { EVENT_NAME } from '../../constants/eventName';

const UserItem1 = ({ user }) => {
    const onViewPhotoOfFace = () => {
        EventRegister.emit(EVENT_NAME.viewCreatorPhotoOfFace, {
            ...user,
            receiver: user?.user,
        });
    };

    const t = useTranslate();
    return (
        <Box>
            <HStack space={3}>
                <Box h="40px" w="40px" bg="gray.400" borderRadius={'100px'}>
                    <Avatar size={'40px'} source={{ uri: user?.user?.avatar }} />
                </Box>
                <VStack justifyContent={'center'}>
                    <Text fontSize={'14px'} fontWeight={600}>
                        {user?.user?.fullName}
                    </Text>
                    <Text color="gray.700">{user?.user?.phoneNumber}</Text>
                </VStack>
            </HStack>
            {user?.pof && (
                <TouchableOpacity
                    onPress={() => {
                        onViewPhotoOfFace();
                    }}
                >
                    <HStack space={2} px="52px" mt="5px" alignItems={'center'}>
                        <Text color="primary.600" fontWeight={600}>
                            {t('contract.viewPhotoOfFace')}
                        </Text>
                        <ChevronRightIcon color="primary.600" />
                    </HStack>
                </TouchableOpacity>
            )}
        </Box>
    );
};

export default UserItem1;
