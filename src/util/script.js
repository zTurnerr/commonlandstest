/* eslint-disable no-undef */
/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */

import * as CardanoMessageSigning from '../libs/CardanoMessageSigning';
import * as HaskellShelley from '../libs/HaskellShelley';

// const HaskellShelley = {};
import Constants, { NETWORK_ID, NODE, getStorage, setStorage } from './Constants';
import { getSeedPhrase, updateSeedPhrase } from '../rest_client/apiClient';
import { getTransactions, getWrappedDocumentsContent } from '../libs/fuixlabs-documentor';

import { Alert } from 'react-native';
import { CLIENT_PATH } from '../libs/fuixlabs-documentor/rest/client.path';
import RNFetchBlob from 'react-native-fetch-blob';
// import {getDidDocument} from '../libs/fuixlabs-documentor/utils/document';
import { _pullNFTs } from '../libs/fuixlabs-documentor/rest/client.rest';
import axios from 'axios';
import bip39 from 'react-native-bip39';
import crypto from 'crypto';
import { deepUnsalt } from '../libs/fuixlabs-documentor/utils/data';
import { mnemonicToEntropy } from 'react-native-bip39';
import provider from '../util/provider';
import { searchDocument } from '../libs/fuixlabs-documentor/rest/client.rest';

const PASSWORD = 'commonlands';
const _getTransactions = getTransactions;
const STORAGE = Constants.STORAGE;
const ERROR_SV = 'Unable to fetch documents. Please try again later.';
function cryptoRandomString({ length }) {
    return crypto.randomBytes(length).toString('hex');
}

export const compact = (string = '', lg = 20, position) => {
    if (string?.length > lg) {
        if (position === 'end') {
            return string.substr(0, lg) + '...';
        }

        return (
            string.substring(0, lg / 2) +
            '...' +
            string.substring(string.length - lg / 2, string.length)
        );
    }

    return string;
};

export const encryptWithPassword = async (password = PASSWORD, rootKeyBytes) => {
    const rootKeyHex = Buffer.from(rootKeyBytes, 'hex').toString('hex');
    const passwordHex = Buffer.from(password).toString('hex');
    const salt = cryptoRandomString({ length: 2 * 16 });
    const nonce = cryptoRandomString({ length: 2 * 6 });
    return HaskellShelley.encrypt_with_password(passwordHex, salt, nonce, rootKeyHex);
};
// data is object {phoneNumber is required}
export const createWallet = async (data, seedPhrase, password = PASSWORD) => {
    try {
        let entropy = mnemonicToEntropy(seedPhrase);
        let rootKey = await HaskellShelley.Bip32PrivateKey.from_bip39_entropy(
            Buffer.from(entropy, 'hex'),
            Buffer.from(''),
        );
        let bytes = await rootKey.as_bytes();
        entropy = null;
        const encryptedRootKey = await encryptWithPassword(password, bytes);
        rootKey.free();
        rootKey = null;

        // await setStorage(STORAGE.encryptedKey, encryptedRootKey);
        let account = {
            ...data,
            [STORAGE.seedPhrase]: seedPhrase,
            [STORAGE.encryptedKey]: encryptedRootKey,
        };
        let index = await addAccountToStorage(account);
        await switchAccount(index);
        await setNetwork({
            id: NETWORK_ID.testnet,
            node: NODE.testnet,
        });
        // await setStorage(STORAGE.currency, 'usd');
        await createAccount(password, index);
        return true;
        // password = null;
    } catch (err) {}
};

export const createAccount = async (password = PASSWORD, index) => {
    let { accountKey, paymentKey, stakeKey } = await requestAccountKey(password);
    let firstParams = await accountKey.to_public();
    firstParams = await firstParams.as_bytes();
    const publicKey = Buffer.from(firstParams).toString('hex'); // BIP32 Public key
    const paymentKeyPub = await paymentKey.to_public();
    const stakeKeyPub = await stakeKey.to_public();

    accountKey.free();
    paymentKey.free();
    stakeKey.free();
    accountKey = null;
    paymentKey = null;
    stakeKey = null;
    let _paymentKey = await paymentKeyPub.hash();
    const paymentKeyHash = Buffer.from(await _paymentKey.to_bytes(), 'hex').toString('hex');
    let _stakeKeyPub = await stakeKeyPub.hash();
    const stakeKeyHash = Buffer.from(await _stakeKeyPub.to_bytes(), 'hex').toString('hex');
    //   let mainnet = await HaskellShelley.NetworkInfo;

    let f_p = await HaskellShelley.StakeCredential.from_keyhash(await paymentKeyPub.hash());
    let s_p = await HaskellShelley.StakeCredential.from_keyhash(await stakeKeyPub.hash());
    let paymentAddrMainnet = await HaskellShelley.BaseAddress.new(
        Constants.network.mainnet,
        f_p,
        s_p,
    );
    paymentAddrMainnet = await paymentAddrMainnet.to_address();
    paymentAddrMainnet = await paymentAddrMainnet.to_bech32();

    let rewardAddrMainnet = await HaskellShelley.RewardAddress.new(Constants.network.mainnet, s_p);
    rewardAddrMainnet = await rewardAddrMainnet.to_address();
    rewardAddrMainnet = await rewardAddrMainnet.to_bech32();

    let paymentAddrTestnet = await HaskellShelley.BaseAddress.new(
        Constants.network.testnet,
        f_p,
        s_p,
    );
    paymentAddrTestnet = await paymentAddrTestnet.to_address();
    paymentAddrTestnet = await paymentAddrTestnet.to_bech32();

    let rewardAddrTestnet = await HaskellShelley.RewardAddress.new(Constants.network.testnet, s_p);
    rewardAddrTestnet = await rewardAddrTestnet.to_address();
    rewardAddrTestnet = await rewardAddrTestnet.to_bech32();

    const networkDefault = {
        lovelace: null,
        minAda: 0,
        assets: [],
        history: { confirmed: [], details: {} },
    };

    const updateAccount = {
        index,
        publicKey,
        paymentKeyHash,
        stakeKeyHash,
        [NETWORK_ID.mainnet]: {
            ...networkDefault,
            paymentAddr: paymentAddrMainnet,
            rewardAddr: rewardAddrMainnet,
        },
        [NETWORK_ID.testnet]: {
            ...networkDefault,
            paymentAddr: paymentAddrTestnet,
            rewardAddr: rewardAddrTestnet,
        },
    };
    await updateAccountToStorage(updateAccount, index);
    // await setStorage(STORAGE.accounts, JSON.stringify({ ...newAccount }));
    return index;
};

//add or update account to storage width key is phoneNumber
export const addAccountToStorage = async (account) => {
    let accounts = await getAccounts();
    if (!accounts) {
        accounts = [];
    }
    let foundIndex = accounts.findIndex((i) => i.phoneNumber === account.phoneNumber);
    if (foundIndex >= 0) {
        accounts[foundIndex] = { ...accounts[foundIndex], ...account };
    } else {
        accounts.push(account);
    }
    await setStorage(STORAGE.accounts, JSON.stringify([...accounts]));
    return foundIndex >= 0 ? foundIndex : accounts.length - 1;
};
// update account to storage from index
export const updateAccountToStorage = async (account, index) => {
    let accounts = await getStorage(STORAGE.accounts);
    if (accounts) {
        accounts = JSON.parse(accounts);
    } else {
        accounts = [];
    }
    accounts[index] = { ...accounts[index], ...account };
    await setStorage(STORAGE.accounts, JSON.stringify([...accounts]));
};
export const requestAccountKey = async (password = PASSWORD) => {
    const currentAccount = await getCurrentAccount();
    let encryptedRootKey = currentAccount[STORAGE.encryptedKey];
    let accountKey = {};
    try {
        let decryptedHex = await decryptWithPassword(password, encryptedRootKey);
        if (!decryptedHex) {
            throw new Error('Incorrect Password');
        }
        accountKey = await HaskellShelley.Bip32PrivateKey.from_bytes(
            Buffer.from(decryptedHex, 'hex'),
        );
        accountKey = await accountKey.derive(harden(1852));
        accountKey = await accountKey.derive(harden(1815));
        accountKey = await accountKey.derive(harden(parseInt(0, 10)));
        // accountKey = await accountKey.derive(
        //     harden(parseInt(accountIndex, 10))
        // );
    } catch (e) {
        throw new Error(e.message);
    }
    let paymentKey = await accountKey.derive(0);
    paymentKey = await paymentKey.derive(0);
    paymentKey = await paymentKey.to_raw_key();
    let stakeKey = await accountKey.derive(2);
    stakeKey = await stakeKey.derive(0);
    stakeKey = await stakeKey.to_raw_key();
    return {
        accountKey,
        paymentKey,
        stakeKey,
    };
};

export const decryptWithPassword = async (password = PASSWORD, encryptedKeyHex) => {
    const passwordHex = Buffer.from(password).toString('hex');
    let decryptedHex;
    try {
        decryptedHex = await HaskellShelley.decrypt_with_password(passwordHex, encryptedKeyHex);
    } catch (err) {}
    return decryptedHex;
};

const harden = (num) => {
    return 0x80000000 + num;
};

export async function blockfrostRequest(endpoint, headers, body, signal) {
    const network = await getNetwork();
    let result;
    while (!result || result.status_code === 500) {
        if (result) {
            await delay(100);
        }
        const rawResult = await fetch(provider.api.base(network.node) + endpoint, {
            headers: {
                ...provider.api.key(network.id),
                ...provider.api.header,
                ...headers,
                'Cache-Control': 'no-cache',
            },
            method: body ? 'POST' : 'GET',
            body,
            signal,
        });
        result = await rawResult.json();
    }

    return result;
}

export const getNetwork = async () => {
    let network = await getStorage(STORAGE.network);
    if (network) {
        return JSON.parse(network);
    }
    return {
        id: NETWORK_ID.testnet,
        node: NODE.testnet,
    };
};

export const getAddress = async () => {
    const currentAccount = await getCurrentAccount();
    let f_p = await HaskellShelley.Address.from_bech32(currentAccount.paymentAddr);
    f_p = await f_p.to_bytes();
    const paymentAddr = await Buffer.from(f_p, 'hex').toString('hex');
    return paymentAddr;
};

export const getCurrentAccount = async () => {
    const currentAccountIndex = await getCurrentAccountIndex();
    const accounts = await getAccounts();
    const network = await getNetwork();
    if (!accounts) {
        return null;
    }
    return accountToNetworkSpecific(accounts[Number(currentAccountIndex)], network);
};

export const getCurrentAccountIndex = async () => getStorage(STORAGE.currentAccount);

export const getAccounts = async () => {
    let a = await getStorage(STORAGE.accounts);
    if (a) {
        return JSON.parse(a);
    }
    return null;
};

export const setNetwork = async (network) => {
    return setStorage(STORAGE.network, JSON.stringify(network));
};

export const switchAccount = async (accountIndex) => {
    await setStorage(STORAGE.currentAccount, accountIndex.toString());
    //   const address = await getAddress();
    return true;
};
const accountToNetworkSpecific = (account, network) => {
    if (!account[network.id]) {
        return account;
    }
    const assets = account[network.id].assets.length ? account[network.id].assets : [asset];
    const lovelace = account[network.id].lovelace;
    const history = account[network.id].history;
    const minAda = account[network.id].minAda;
    const collateral = account[network.id].collateral;
    const recentSendToAddresses = account[network.id].recentSendToAddresses;
    const paymentAddr = account[network.id].paymentAddr;
    const rewardAddr = account[network.id].rewardAddr;
    const notification = account.notification === undefined ? true : account.notification;
    return {
        ...account,
        notification,
        paymentAddr,
        rewardAddr,
        assets,
        lovelace,
        minAda,
        collateral,
        history,
        recentSendToAddresses,
    };
};

export const fetchPrice = async (currency) => {
    let price = await provider.api.price(currency);
    return price;
};

export const asset = {
    decimals: 6,
    name: 'ADA',
    unitName: '₳',
    amount: '0',
};

export const getBalance = async () => {
    const currentAccount = await getCurrentAccount();
    if (!currentAccount) {
        return { ...asset };
    }
    const result = await blockfrostRequest(`/addresses/${currentAccount.paymentAddr}`);
    if (result.error) {
        return { ...asset };
        // if (result.status_code === 400);
        // else if (result.status_code === 500) throw APIError.InternalError;
        // else return HaskellShelley.Value.new(HaskellShelley.BigNum.from_str('0'));
    }
    const value = await assetsToValue(result.amount);
    let coin = await value.coin();
    coin = await coin.to_str();
    let amount = await formatBigNumWithDecimals(coin, 6);
    return {
        ...asset,
        amount,
    };
};
export const assetsToValue = async (assets) => {
    const multiAsset = await HaskellShelley.MultiAsset.new();
    const lovelace = assets.find((_asset) => _asset.unit === 'lovelace');
    const policies = [
        ...new Set(
            assets
                .filter((_asset) => _asset.unit !== 'lovelace')
                .map((_asset) => _asset.unit.slice(0, 56)),
        ),
    ];
    policies.forEach(async (policy) => {
        const policyAssets = assets.filter((_asset) => _asset.unit.slice(0, 56) === policy);
        const assetsValue = await HaskellShelley.Assets.new();
        policyAssets.forEach(async (_asset) => {
            assetsValue.insert(
                await HaskellShelley.AssetName.new(Buffer.from(_asset.unit.slice(56), 'hex')),
                await HaskellShelley.BigNum.from_str(_asset.quantity),
            );
        });
        multiAsset.insert(
            await HaskellShelley.ScriptHash.from_bytes(Buffer.from(policy, 'hex')),
            assetsValue,
        );
    });
    const value = await HaskellShelley.Value.new(
        await HaskellShelley.BigNum.from_str(lovelace ? lovelace.quantity : '0'),
    );
    if (assets.length > 1 || !lovelace) {
        value.set_multiasset(multiAsset);
    }
    return value;
};

export const formatBigNumWithDecimals = async (num, decimals) => {
    let singleUnit = await HaskellShelley.BigNum.from_str('1' + '0'.repeat(decimals));
    singleUnit = await singleUnit.to_str();
    const wholeUnits = Math.floor(num / singleUnit);
    const fractionalUnits = num % singleUnit;
    return wholeUnits.toString() + '.' + fractionalUnits.toString().padStart(decimals, '');
};

export const loginAuthServer = async (params, access_token) => {
    let result;
    try {
        const rawResult = await axios.post(Constants.authServer + 'login', params, {
            withCredentials: true,
            header: {
                'Content-Type': 'application/json',
                Cookie: `access_token=${access_token}`,
            },
        });
        result = rawResult;
    } catch (err) {
        throw Error('Login Auth Failed ' + (err?.message || err));
    }
    if (!result) {
        throw Error('Login Auth Failed no result');
    }
    return result;
};
//need to update lib
export const getRandomNumber = async () => {
    let result;
    try {
        const rawResult = await fetch(Constants.authServer + 'getRandomNumber', {
            method: 'GET',
        });
        result = await rawResult.json();
    } catch (err) {
        throw Error('Get Random Number faild ' + err.message);
    }
    if (!result) {
        throw Error('Get Random Number faild');
    }
    return result;
};
//need to update lib
export const verifyAccessToken = async (access_token) => {
    let result;
    try {
        const rawResult = await fetch(Constants.authServer + 'getRandomNumber', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `access_token=${access_token}`,
            },
        });
        result = await rawResult.json();
    } catch (err) {
        throw new Error(err.message);
    }
    return result;
};

export const signData = async (address, payload, password = PASSWORD) => {
    try {
        let { paymentKey, stakeKey } = await requestAccountKey(password);
        let typeAddress = await getTypeAddress(address);
        const accountKey = typeAddress === 'payment' ? paymentKey : stakeKey;
        const publicKey = await accountKey.to_public();

        const protectedHeaders = await CardanoMessageSigning.HeaderMap.new();
        await protectedHeaders.set_algorithm_id(
            await CardanoMessageSigning.Label.from_algorithm_id(
                await CardanoMessageSigning.AlgorithmId.EdDSA,
            ),
        );
        await protectedHeaders.set_key_id(await publicKey.as_bytes());
        await protectedHeaders.set_header(
            await CardanoMessageSigning.Label.new_text('address'),
            await CardanoMessageSigning.CBORValue.new_bytes(Buffer.from(address, 'hex')),
        );
        const protectedSerialized =
            await CardanoMessageSigning.ProtectedHeaderMap.new(protectedHeaders);
        const unprotectedHeaders = await CardanoMessageSigning.HeaderMap.new();
        const headers = await CardanoMessageSigning.Headers.new(
            protectedSerialized,
            unprotectedHeaders,
        );
        const builder = await CardanoMessageSigning.COSESign1Builder.new(
            headers,
            Buffer.from(payload, 'hex'),
            false,
        );
        const toSign = await (await builder.make_data_to_sign()).to_bytes();
        const signedSigStruc = await (await accountKey.sign(toSign)).to_bytes();
        const coseSign1 = await builder.build(signedSigStruc);

        stakeKey.free();
        stakeKey = null;
        paymentKey.free();
        paymentKey = null;

        return Buffer.from(await coseSign1.to_bytes(), 'hex').toString('hex');
    } catch (err) {
        throw Error(err.message);
    }
};

export const signDataCIP30 = async (address, payload, password = PASSWORD) => {
    let { paymentKey, stakeKey } = await requestAccountKey(password);
    let typeAddress = await getTypeAddress(address);
    const accountKey = typeAddress === 'payment' ? paymentKey : stakeKey;
    const publicKey = await accountKey.to_public();
    const protectedHeaders = await CardanoMessageSigning.HeaderMap.new();
    await protectedHeaders.set_algorithm_id(
        await CardanoMessageSigning.Label.from_algorithm_id(
            await CardanoMessageSigning.AlgorithmId.EdDSA,
        ),
    );
    // protectedHeaders.set_key_id(publicKey.as_bytes()); // Removed to adhere to CIP-30
    await protectedHeaders.set_header(
        await CardanoMessageSigning.Label.new_text('address'),
        await CardanoMessageSigning.CBORValue.new_bytes(Buffer.from(address, 'hex')),
    );
    const protectedSerialized =
        await CardanoMessageSigning.ProtectedHeaderMap.new(protectedHeaders);
    const unprotectedHeaders = await CardanoMessageSigning.HeaderMap.new();
    const headers = await CardanoMessageSigning.Headers.new(
        protectedSerialized,
        unprotectedHeaders,
    );
    const builder = await CardanoMessageSigning.COSESign1Builder.new(
        headers,
        Buffer.from(payload, 'hex'),
        false,
    );
    const toSign = await (await builder.make_data_to_sign()).to_bytes();

    const signedSigStruc = await (await accountKey.sign(toSign)).to_bytes();
    const coseSign1 = await builder.build(signedSigStruc);

    stakeKey.free();
    stakeKey = null;
    paymentKey.free();
    paymentKey = null;

    const key = await CardanoMessageSigning.COSEKey.new(
        await CardanoMessageSigning.Label.from_key_type(await CardanoMessageSigning.KeyType.OKP),
    );
    await key.set_algorithm_id(
        await CardanoMessageSigning.Label.from_algorithm_id(
            await CardanoMessageSigning.AlgorithmId.EdDSA,
        ),
    );
    await key.set_header(
        await CardanoMessageSigning.Label.new_int(
            await CardanoMessageSigning.Int.new_negative(
                await CardanoMessageSigning.BigNum.from_str('1'),
            ),
        ),
        await CardanoMessageSigning.CBORValue.new_int(
            await CardanoMessageSigning.Int.new_i32(6), //CardanoMessageSigning.CurveType.Ed25519
        ),
    ); // crv (-1) set to Ed25519 (6)
    await key.set_header(
        await CardanoMessageSigning.Label.new_int(
            await CardanoMessageSigning.Int.new_negative(
                await CardanoMessageSigning.BigNum.from_str('2'),
            ),
        ),
        await CardanoMessageSigning.CBORValue.new_bytes(await publicKey.as_bytes()),
    ); // x (-2) set to public key

    return {
        signature: Buffer.from(await coseSign1.to_bytes()).toString('hex'),
        key: Buffer.from(await key.to_bytes()).toString('hex'),
    };
};

export const getTypeAddress = async (address) => {
    const baseAddr = await HaskellShelley.BaseAddress.from_address(
        await HaskellShelley.Address.from_bytes(Buffer.from(address, 'hex')),
    );
    const rewardAddr = await HaskellShelley.RewardAddress.from_address(
        await HaskellShelley.Address.from_bytes(Buffer.from(address, 'hex')),
    );
    if (baseAddr) {
        return 'payment';
    }
    if (rewardAddr) {
        return 'reward';
    }
    return null;
};

export const extractKeyHash = async (address) => {
    //TODO: implement for various address types
    if (!(await isValidAddressBytes(Buffer.from(address, 'hex')))) {
        throw 'DataSignError.InvalidFormat';
    }
    try {
        const baseAddr = await HaskellShelleyBaseAddress.from_address(
            await HaskellShelleyAddress.from_bytes(Buffer.from(address, 'hex')),
        );
        return baseAddr.payment_cred().to_keyhash().to_bech32('hbas_');
    } catch (e) {}
    try {
        const rewardAddr = HaskellShelleyRewardAddress.from_address(
            HaskellShelleyAddress.from_bytes(Buffer.from(address, 'hex')),
        );
        return rewardAddr.payment_cred().to_keyhash().to_bech32('hrew_');
    } catch (e) {}
    throw DataSignError.AddressNotPK;
};

const isValidAddressBytes = async (address) => {
    const network = await getNetwork();
    try {
        const addr = await HaskellShelley.Address.from_bytes(address);
        let net_id = await addr.network_id();
        if (
            (net_id === 1 && network.id === NETWORK_ID.mainnet) ||
            (net_id === 0 && network.id === NETWORK_ID.testnet)
        ) {
            return true;
        }
        return false;
    } catch (e) {}
    try {
        const addr = await HaskellShelley.ByronAddress.from_bytes(address);
        let net_id = await addr.network_id();
        if (
            (net_id === 1 && network.id === NETWORK_ID.mainnet) ||
            (net_id === 0 && network.id === NETWORK_ID.testnet)
        ) {
            return true;
        }
        return false;
    } catch (e) {}
    return false;
};

export const getTransitions = async () => {
    let _access_token = await getStorage(Constants.STORAGE.access_token);
    try {
        let address = await getAddress();
        let transition = await _getTransactions(address, _access_token);
        let data = await getWrappedDocumentsContent(transition, _access_token);
        data = data?.map((item, index) => ({
            ...deepUnsalt(item),
            status: transition[index]?.status,
        }));
        for (let i = 0; i < data.length; i++) {
            // let didDoc = await getDidDocument(data[i].data.fileName, _access_token);
            if (data[i]) {
                let { policy } = data[i]?.mintingNFTConfig;
                let history = await getHistory(policy?.id, _access_token);
                data[i] = { ...data[i], history };
            }
        }
        data.sort((a, b) => b.history[0] - a.history[0]);
        return data;
    } catch (err) {
        let message = err.message || err;

        Alert.alert('Error', ERROR_SV + ' ' + message, [
            {
                text: '',
                onPress: () => console.log('Ask me later pressed'),
            },
            {
                text: '',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
        throw new Error(message);
    }
};

export const searchTransition = async (searchString, pageNumber, access_token) => {
    try {
        let res = await searchDocument(searchString, pageNumber, access_token);
        let transactions = res.data.result;
        if (!transactions || !transactions.length) {
            return [];
        }
        // console.log('transition', transactions[0].data.fileName);
        // let data = await getWrappedDocumentsContent(transactions, access_token);

        let data = transactions?.map((item, index) => ({
            ...deepUnsalt(item),
            status: transactions[index]?.status,
        }));
        for (let i = 0; i < data.length; i++) {
            let { policy } = data[i]?.mintingNFTConfig;
            if (!policy) {
                throw new Error('mintingNFTConfig empty');
            }
            let history = await getHistory(policy?.id, access_token);
            data[i] = { ...data[i], history };
        }
        data.sort((a, b) => b.history[0] - a.history[0]);
        return data;
    } catch (err) {
        let message = err.message || err;
        Alert.alert('Error', ERROR_SV + ' ' + message, [
            {
                text: '',
                onPress: () => console.log('Ask me later pressed'),
            },
            {
                text: '',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
        throw new Error(message);
    }
};
export const getHistory = async (policyId, access_token) => {
    try {
        let res = await _pullNFTs(CLIENT_PATH.PULL_NFTS, { policyId }, access_token);
        let history = res?.data?.map((item) => {
            return item?.onchainMetadata ? item?.onchainMetadata?.timestamp : 0;
        });
        history.sort((a, b) => a - b);
        return history;
    } catch (err) {
        throw new Error('getHistory ' + err.message);
    }
};

export const downloadFileFromURI = async (uri, fileName, showAlert, callback) => {
    //download from uri
    // let uri =
    //   'https://firebasestorage.googleapis.com/v0/b/default-demo-app-9fa9.appspot.com/o/cover-letter_document.fl?alt=media&token=236fd392-e3c1-448d-bed7-233a2d8f8a1c';
    let RootDir = RNFetchBlob.fs.dirs.DownloadDir;
    let options = {
        fileCache: true,
        addAndroidDownloads: {
            path: RootDir + `/${fileName}`,
            description: 'downloading file...',
            notification: true,
            // useDownloadManager works with Android only
            useDownloadManager: true,
        },
    };
    return (
        RNFetchBlob.config(options)
            .fetch('GET', uri)
            .then((res) => {
                if (callback) {
                    callback(null, res);
                }
                if (showAlert) {
                    Alert.alert(
                        'Downloaded',
                        `File ${compact(fileName, 50)} saved at Download folder.`,
                        [
                            {
                                text: 'OK',
                                onPress: () => console.log('OK Pressed'),
                            },
                        ],
                    );
                }
                return res;
            })
            // Something went wrong:
            .catch((errorMessage) => {
                throw new Error(errorMessage);
                // error handling
            })
    );
};

export const getTemplate = async (data) => {
    return axios
        .post(Constants.templateServer, data, {
            header: {
                'Content-Type': 'application/json',
            },
        })
        .then((res) => {
            if (!res || res.data.error_code) {
                throw new Error(res.data.error_message);
            }
            return res.data;
        })
        .catch((err) => {
            throw new Error(err.message);
        });
};

const _getSeedPhrase = async () => {
    try {
        const response = await getSeedPhrase();
        if (response?.data) {
            const seedPhrase = response?.data?.seedPhrase;
            return seedPhrase;
        }
        return null;
    } catch (err) {
        console.log(err);
        return null;
    }
};
const createSeedPhraseAndAccountFromUserData = async (data) => {
    try {
        let seedPhrase = await bip39.generateMnemonic(256);
        let success = await createWallet(data, seedPhrase);
        return success;
    } catch (err) {
        return false;
    }
};
export const checkAndUpdateSeedPhrase = async () => {
    try {
        let seedPhraseSV = await _getSeedPhrase();
        let account = await getCurrentAccount();
        // missing seedPhrase on server and local
        if (!seedPhraseSV && !account?.seedPhrase) {
            console.log('missing seedPhrase on server and local');
            let success = await createSeedPhraseAndAccountFromUserData({
                phoneNumber: account.phoneNumber,
            });
            if (success) {
                account = await getCurrentAccount();
                let { paymentAddr, seedPhrase } = account;
                await updateSeedPhrase({
                    seedPhrase,
                    publicKey: paymentAddr,
                });
            }
            return;
        }
        // missing seedPhrase on server
        if (!seedPhraseSV) {
            console.log('missing seedPhrase on server');
            let { paymentAddr, seedPhrase } = account;
            await updateSeedPhrase({
                seedPhrase,
                publicKey: paymentAddr,
            });
            return;
        }
        // missing seedPhrase on local or seedPhrase on local not match with seedPhrase on server
        if (!account?.seedPhrase || account?.seedPhrase !== seedPhraseSV) {
            console.log('missing seedPhrase on local3');
            await createWallet(
                {
                    phoneNumber: account.phoneNumber,
                },
                seedPhraseSV,
            );

            return;
        }
        console.log('checkAndUpdateSeedPhrase done');
    } catch (err) {
        console.log('checkAndUpdateSeedPhrase error', err);
    }
};

export const handleUserData = async (userData) => {
    delete userData.seedPhrase;
    let accountIndex = await addAccountToStorage(userData);
    await switchAccount(accountIndex);
    checkAndUpdateSeedPhrase();
};

export const removeAccount = async (index) => {
    let accounts = await getAccounts();
    if (!accounts) {
        return;
    }
    accounts.splice(index, 1);
    await setStorage(STORAGE.accounts, JSON.stringify([...accounts]));
    return;
};
