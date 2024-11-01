import { Box, Input, Select, Text, useTheme } from 'native-base';
import React from 'react';
import useTranslate from '../../i18n/useTranslate';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';

const labelStyle = {
    marginBottom: '8px',
    fontWeight: 'bold',
};

const Container = ({ children, item, ...other }) => {
    const theme = useTheme();
    let _styles = {};
    if (item.disabled) {
        _styles.color = theme.input._disabled.color;
    }
    return (
        <Box mt="24px" {...other}>
            <Text style={_styles} {...labelStyle}>
                {item.label}
            </Text>
            {children}
        </Box>
    );
};
export default function Index({ onChange, data, isDisabled, ...other }) {
    const secretQuestion = useShallowEqualSelector((state) => state.settings.secretQuestion);
    const t = useTranslate();
    return (
        <Container
            item={{
                label: t('components.securityQuestion'),
            }}
            w="full"
            mb="12px"
            {...other}
        >
            <Select
                onValueChange={(value) => onChange({ ...data, secretQuestion: value })}
                selectedValue={data.secretQuestion}
                isDisabled={isDisabled}
                w="full"
            >
                {secretQuestion?.map((i) => {
                    return <Select.Item key={i.id} label={i.question} value={i.id} />;
                })}
            </Select>
            <Input
                value={data.secretAnswer}
                onChangeText={(text) => onChange({ ...data, secretAnswer: text })}
                w="full"
                mt="12px"
                isDisabled={isDisabled}
                placeholder={t('components.securityAnswer')}
            />
        </Container>
    );
}
