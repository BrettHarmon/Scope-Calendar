import {AsyncStorage} from "react-native";

module.exports = {
    async get (key) {
        return await AsyncStorage.getItem(key)
            .catch(err => {
                throw new Error(`[react-native-storage-wrapper] - ${err}`);
            });
        },
    async set (key, value) {
        return await AsyncStorage.setItem(key, value)
            .catch(err => {
                throw new Error(`[react-native-storage-wrapper] - ${err}`);
            });
    },
    async del (key) {
        return await AsyncStorage.removeItem(key)
            .catch(err => {
                throw new Error(`[react-native-storage-wrapper] - ${err}`);
            });
    }
};
