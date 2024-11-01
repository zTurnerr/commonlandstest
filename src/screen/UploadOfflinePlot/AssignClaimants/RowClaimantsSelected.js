import { CheckIcon, ChevronDownIcon, Select } from 'native-base';
import React from 'react';
import { CLAIMANTS_OPTIONS } from '../../../util/Constants';
import UserRow from '../../CreatePlot/InvitePeople/UserRow';

const Role = CLAIMANTS_OPTIONS;

const RowClaimantsSelected = ({ children, info, button, type, roleSelected, setRoleSelected }) => {
    return (
        <UserRow
            bg="white"
            info={info}
            type={type}
            mb="6px"
            px="12px"
            py="15px"
            alignItems="flex-start"
            button={button}
            owner
        >
            {children ? (
                children
            ) : (
                <Select
                    selectedValue={roleSelected}
                    minW={'140'}
                    onValueChange={(itemValue) => setRoleSelected(itemValue, info?.phoneNumber)}
                    _selectedItem={{
                        bg: 'primary.600',
                        endIcon: <CheckIcon size={5} color="white" />,
                        _text: {
                            color: 'white',
                        },
                    }}
                    mt={'10px'}
                    borderWidth={'1.5'}
                    borderColor={'gray.2300'}
                    dropdownIcon={<ChevronDownIcon size={5} mr={'10px'} />}
                >
                    {Role.map((_role) => (
                        <Select.Item key={_role.value} label={_role.label} value={_role.value} />
                    ))}
                </Select>
            )}
        </UserRow>
    );
};

export default RowClaimantsSelected;
