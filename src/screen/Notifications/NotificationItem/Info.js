import { Box, HStack, Text } from 'native-base';

import React from 'react';
import moment from 'moment';
import ExpireTag from '../../../components/Tag/ExpireTag';

export default function Index({ data, btnGroup = null, expireTime }) {
    return (
        <Box {...styles.container} flex={1}>
            <Text {...styles.primary} color="black">
                {data.body}
            </Text>
            <HStack alignItems={'center'} space={2}>
                <Text {...styles.secondary}>
                    {moment(data.createdAt).format('MMM DD, YYYY, HH:mm')}
                </Text>
                {expireTime && <ExpireTag time={expireTime} />}
            </HStack>
            {btnGroup}
        </Box>
    );
}
const styles = {
    container: {
        flex: 1,
    },
    primary: {
        color: 'black',
        flex: 1,
    },
    secondary: {
        color: 'text.secondary',
    },
};
