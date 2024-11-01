import { Box, Text } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { CLAIMANTS_OPTIONS } from '../../util/Constants';
import { TickCircle } from '../Icons';
import useTranslate from '../../i18n/useTranslate';

const ROLE = CLAIMANTS_OPTIONS;
const Index = ({ role = 'owner', setRole, ...others }) => {
    const t = useTranslate();

    const onPress = (role) => {
        setRole && setRole(role);
    };

    return (
        <Box {...others}>
            <Text fontWeight={700} fontSize={14} mb={'10px'}>
                {t('plot.selectYourRight')}
            </Text>
            {ROLE.map((_role) => {
                let active = _role.value === role;
                return (
                    <TouchableOpacity key={_role.value} onPress={() => onPress(_role.value)}>
                        <Box
                            borderRadius={'30px'}
                            bgColor={active ? 'primary.600' : 'white'}
                            borderWidth={1}
                            borderColor={active ? 'primary.600' : 'gray.400'}
                            flexDir={'row'}
                            pl={'20px'}
                            pr={'10px'}
                            py={'10px'}
                            mb={'10px'}
                        >
                            <Text
                                color={active ? 'white' : 'black'}
                                fontSize={14}
                                fontWeight={500}
                                flex={1}
                            >
                                {_role.label}
                            </Text>
                            {active && <TickCircle color={'white'} size="20" />}
                        </Box>
                    </TouchableOpacity>
                );
            })}
        </Box>
    );
};

export default Index;
