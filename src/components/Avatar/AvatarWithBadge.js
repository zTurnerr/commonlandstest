import { Box, Image } from 'native-base';
import React from 'react';

const AvatarWithBadge = ({ _container = {}, uri = '' }) => {
    return (
        <Box {..._container}>
            <Box bg="gray.400" w="30px" h="30px" borderRadius={'100px'}>
                <Image
                    source={{ uri }}
                    alt="image base"
                    resizeMode="cover"
                    h="full"
                    w="full"
                    borderRadius={'100px'}
                    borderWidth={'1px'}
                    borderColor={'white'}
                />
            </Box>
        </Box>
    );
};

export default AvatarWithBadge;
