import { useNavigation } from '@react-navigation/native';
import { Avatar, Box, Flex, HStack, Image, Text, useTheme } from 'native-base';
import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import AgentHeader from '../../../components/Header/AgentHeader';
import Setting2 from '../../../components/Icons/Setting2';
import SearchBoxContract from '../../../components/SearchBox/SearchBoxContract';
import useContractFilter from '../../../hooks/useContractFilter';
import useTranslate from '../../../i18n/useTranslate';
import Images from '../../../themes/Images';

const HeaderContract = ({
    // listContract,
    user,
    onPressAvatar,
    addContract,
    // openModalStatus,
    maxAmount,
}) => {
    const theme = useTheme();
    const navigation = useNavigation();
    const contractFilterHook = useContractFilter();

    const t = useTranslate();
    return (
        <Flex>
            <AgentHeader />
            <Box
                paddingX={'16px'}
                pb={'20px'}
                shadow={1}
                backgroundColor={theme.colors.appColors.white}
            >
                <Box
                    flexDirection={'row'}
                    alignItems="center"
                    justifyContent={'space-between'}
                    backgroundColor={theme.colors.appColors.white}
                    pt={'10px'}
                >
                    <Box flexDirection={'row'} alignItems={'center'}>
                        <TouchableOpacity onPress={onPressAvatar}>
                            <Avatar size={'34px'} source={{ uri: user.avatar }} />
                        </TouchableOpacity>
                        <Text fontSize={'14px'} ml={'10px'} fontWeight={'500'}>
                            {t('components.contracts')}
                        </Text>
                    </Box>
                    <TouchableOpacity onPress={addContract}>
                        <Image alt="android" source={Images.icAddContract} />
                    </TouchableOpacity>
                </Box>
                <HStack alignItems={'center'} mt="18px">
                    <SearchBoxContract
                        onFocus={() => {
                            navigation.navigate('SearchContract');
                        }}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('FilterContract', { maxAmount });
                        }}
                    >
                        <Box px="15px">
                            <Box>
                                {!contractFilterHook.isInitState() && (
                                    <Box
                                        bg="primary.600"
                                        position="absolute"
                                        top="0px"
                                        zIndex={1}
                                        right="0px"
                                        w="12px"
                                        h="12px"
                                        borderRadius={'100px'}
                                        borderWidth={'1px'}
                                        borderColor={'white'}
                                    ></Box>
                                )}
                                <Setting2 />
                            </Box>
                        </Box>
                    </TouchableOpacity>
                </HStack>
            </Box>
        </Flex>
    );
};

export default memo(HeaderContract);
