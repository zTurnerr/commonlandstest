import { Box, HStack, Text } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Trash from '../Icons/Trash';

const FileList1 = ({ fileList = [], setFileList = () => {} }) => {
    const getFileName = (url) => {
        return url.split('/').pop();
    };

    return (
        <Box borderWidth={'1px'} borderColor={'gray.1200'} borderRadius={'8px'}>
            {fileList?.map((file, index) => (
                <HStack
                    key={index}
                    p="10px"
                    alignItems={'center'}
                    borderTopWidth={index === 0 ? 0 : '1px'}
                    borderColor={'gray.1200'}
                >
                    <Text flex={1}>{getFileName(file?.uri)}</Text>
                    <TouchableOpacity
                        onPress={() => {
                            const newFileList = fileList.filter((item, i) => i !== index);
                            setFileList(newFileList);
                        }}
                    >
                        <Trash />
                    </TouchableOpacity>
                </HStack>
            ))}
        </Box>
    );
};

export default FileList1;
