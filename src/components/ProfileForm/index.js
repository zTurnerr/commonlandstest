import { Box, Input, Select, Text, useDisclose, useTheme } from 'native-base';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import useTranslate from '../../i18n/useTranslate';
import SelectSecretQuestion from '../SelectSecretQuestion';
import ModalChangePhoneNumber from './ModalChangePhoneNumber';

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
export default function Index({ onChangeData, data, isDisabled, isEdit, onSubmitPhoneNumber }) {
    const t = useTranslate();
    const { isOpen, onOpen, onClose } = useDisclose();
    const KEYS = [
        {
            label: t('profile.fullName'),
            key: 'fullName',
            type: 'string',
            placeholder: t('profile.enterFullName'),
        },
        {
            label: t('components.phoneNumber'),
            key: 'phoneNumber',
            type: 'phone',
            disabled: !isEdit,
            isReadOnly: true,
            placeholder: t('profile.enterNumberPhone'),
        },
        // {
        //     label: 'Email Address',
        //     key: 'email',
        //     type: 'string',
        //     placeholder: 'Enter email address',
        // },
        {
            label: t('profile.gender'),
            key: 'gender',
            type: 'select',
            options: [
                {
                    label: t('profile.male'),
                    value: 'male',
                },
                {
                    label: t('profile.female'),
                    value: 'female',
                },
                {
                    label: t('profile.nonbinary'),
                    value: 'non-binary',
                },
            ],
        },
        // {
        //     label: 'Address',
        //     key: 'address',
        //     type: 'string',
        //     placeholder: 'Enter address',
        // },
    ];

    const styles = StyleSheet.create({
        editButton: {
            position: 'absolute',
            top: 26,
            width: '100%',
        },
    });

    const renderInput = (item) => {
        switch (item.type) {
            case 'string':
                return (
                    <Container item={item} key={item.key}>
                        <Input
                            value={data[item.key]}
                            onChangeText={(text) => onChangeData({ ...data, [item.key]: text })}
                            w="full"
                            isDisabled={isDisabled}
                            placeholder={item.placeholder}
                        />
                    </Container>
                );
            case 'phone':
                return (
                    <Container item={item} key={item.key}>
                        <Input
                            value={data[item.key]}
                            onChangeText={(text) => onChangeData({ ...data, [item.key]: text })}
                            keyboardType="numeric"
                            w="full"
                            isDisabled={item.disabled || isDisabled}
                            placeholder={item.placeholder}
                            isReadOnly={item.isReadOnly}
                        />
                        {isEdit && (
                            <TouchableOpacity style={styles.editButton} onPress={onOpen}>
                                <Box height="48px" borderRadius="12px"></Box>
                            </TouchableOpacity>
                        )}
                    </Container>
                );
            case 'select':
                return (
                    <Container w="full" item={item} key={item.key}>
                        <Select
                            onValueChange={(value) => onChangeData({ ...data, [item.key]: value })}
                            selectedValue={data[item.key]}
                            isDisabled={isDisabled}
                            w="full"
                        >
                            {item.options.map((i) => {
                                return (
                                    <Select.Item key={i.value} label={i.label} value={i.value} />
                                );
                            })}
                        </Select>
                    </Container>
                );

            default:
                return null;
        }
    };

    return (
        <>
            {KEYS.map((item) => renderInput(item))}
            {!isEdit && (
                <SelectSecretQuestion onChange={onChangeData} data={data} isDisabled={isDisabled} />
            )}
            <ModalChangePhoneNumber
                isOpen={isOpen}
                onClose={onClose}
                onSubmit={onSubmitPhoneNumber}
                userPhoneNumber={data.phoneNumber}
            />
            {/* <GroupButtonUploadImage
                icon="file-image-plus-outline"
                title="Upload photos"
                description="Recommended PNG or JPEG files to upload"
                onFilesChange={(f) => {
                    onChangeFiles([...files, ...f]);
                }}
            /> */}

            {/* <Box mt="24px" w="full">
                <Text textAlign="left" fontWeight="600" mb="24px">
                    Photos uploaded
                </Text>
                <ScrollView horizontal overScrollMode="never">
                    {files.map((item) => {
                        return (
                            <ImageUpload
                                key={item.uri}
                                data={item}
                                onDelete={(f) => {
                                    onChangeFiles([
                                        ...files.filter(
                                            (i) => i.uri !== item.uri
                                        ),
                                    ]);
                                }}
                            />
                        );
                    })}
                </ScrollView>
            </Box> */}
        </>
    );
}
