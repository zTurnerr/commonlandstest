import { Box, CheckCircleIcon, useTheme } from 'native-base';
import React from 'react';
import Clock3 from '../Icons/Clock3';

const TimeLineApprovePending = ({ data, RenderItem }) => {
    const { colors } = useTheme();
    return (
        <Box mt={'10px'}>
            {data?.map((item, index) => (
                <Box key={index}>
                    {index > 0 && (
                        <Box ml={'7px'} my={'4px'} w={'1px'} h={'19px'} bgColor={'gray.1400'}></Box>
                    )}
                    <Box flexDir={'row'} alignItems={'center'}>
                        {item._status === 'pending' ? (
                            <Clock3
                                color={colors.appColors?.primaryYellow}
                                width="14"
                                height="14"
                            />
                        ) : (
                            <CheckCircleIcon color={colors?.primary[600]} size={14} />
                        )}
                        {RenderItem && <RenderItem item={item} />}
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default TimeLineApprovePending;
