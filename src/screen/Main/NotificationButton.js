import { Notification } from 'iconsax-react-native';
import { Box, Text } from 'native-base';
import React from 'react';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';

export default function Index({ focused, colorFocus, color }) {
    const { totalUnReads } = useShallowEqualSelector((state) => ({
        totalUnReads: state.notifications.totalUnReads,
    }));
    return (
        <Box>
            <Notification
                color={focused ? colorFocus : color}
                variant={focused ? 'Bold' : 'Outline'}
            />
            {totalUnReads > 0 && (
                <Box
                    minW="20px"
                    h="20px"
                    borderRadius="10px"
                    position="absolute"
                    left="10px"
                    top="-4px"
                    alignItems="center"
                    justifyContent="center"
                    bgColor="warning.500"
                    p="2px"
                    px="6px"
                >
                    <Text color="white" fontSize="10px" fontWeight="500">
                        {totalUnReads > 99 ? '99+' : totalUnReads}
                    </Text>
                </Box>
            )}
        </Box>
    );
}
