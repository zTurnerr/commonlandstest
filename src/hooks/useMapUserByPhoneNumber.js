import { useEffect, useState } from 'react';
import { searchByPhone } from '../rest_client/apiClient';

/**
 * @typedef {{
 * fullName: string,
 * phoneNumber: string,
 * avatar: string,
 * }} UserWithInfo
 * @type {Record<string, User>}
 */
const cachedUsers = {};

/**
 * @typedef {{
 * phoneNumber: string,
 * }} User
 * @param {User[]} usersWithPhoneNumber
 * @returns {{
 * users: UserWithInfo[],
 * isLoading: boolean,
 * error: string | null
 * }}
 */
export default function useMapUserByPhoneNumber(usersWithPhoneNumber) {
    const [users, setUsers] = useState(() => usersWithPhoneNumber);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!usersWithPhoneNumber.length && !users.length) return;
        (async () => {
            try {
                setError(null);
                const users = await Promise.all(
                    usersWithPhoneNumber.map(async (user) => {
                        if (user.fullName && user.phoneNumber) return user;

                        if (cachedUsers[user.phoneNumber]) {
                            return {
                                ...user,
                                ...cachedUsers[user.phoneNumber],
                            };
                        }

                        const res = await searchByPhone({ phoneNumber: user.phoneNumber });
                        cachedUsers[user.phoneNumber] = res.data.user;

                        return {
                            ...res.data.user,
                            ...user,
                        };
                    }),
                );
                setUsers(users);
            } catch (error) {
                console.log(error);
                setError(error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [usersWithPhoneNumber]);

    return { users, isLoading, error };
}
