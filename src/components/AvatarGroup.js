import { Avatar, Box, Image } from 'native-base';
import React from 'react';
import Images from '../themes/Images';

export default function AvatarGroup(props) {
    const { data, isShowVerified = true } = props || {};
    return (
        <Box flexDirection={'row'} alignItems={'center'} ml={'16px'}>
            {data?.map((item, index) => {
                return (
                    <Box key={index}>
                        <Avatar.Group>
                            <Avatar source={{ uri: item?.avatar }} />
                        </Avatar.Group>
                        {item?.isVerified && isShowVerified && (
                            <Box
                                bottom={'-5px'}
                                position={'absolute'}
                                right={'14px'}
                                w={'16px'}
                                h={'16px'}
                                justifyContent={'center'}
                                alignItems={'center'}
                                borderRadius={'10px'}
                                borderWidth={'1px'}
                                borderColor={'white'}
                                backgroundColor="#5ec4ac"
                            >
                                <Image
                                    alt="android"
                                    w={'14px'}
                                    h={'14px'}
                                    source={Images.icChecked}
                                />
                            </Box>
                        )}
                    </Box>
                );
            })}
        </Box>
    );
}
