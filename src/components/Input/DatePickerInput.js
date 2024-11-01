import moment from 'moment';
import { Box, HStack, Text } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import CalendarFilled from '../Icons/CalenderFilled';

const DatePickerInput = ({ onPress = () => {}, value }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <HStack
                p="12px"
                borderColor={'#DCDCDE'}
                borderRadius={'8px'}
                borderWidth={1}
                justifyContent={'space-between'}
            >
                <Text color="gray.600">
                    {value ? moment(value).format('MMM DD, YYYY') : 'Select'}
                </Text>
                <Box>
                    <CalendarFilled />
                </Box>
            </HStack>
        </TouchableOpacity>
    );
};

export default DatePickerInput;
