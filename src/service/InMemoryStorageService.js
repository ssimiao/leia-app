import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (e) {
        console.log(e)
    }
}

export const storeJsonData = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {
        console.log(e)
    }
}

export const clearCache = () => {
    AsyncStorage.clear()
}

export const getData = (key) => {
    try {
        return AsyncStorage.getItem(key)
    } catch (e) {
        console.log(e)
    }
}

export const getDataInCache = async (key) => {
    try {
        return await AsyncStorage.getItem(key).then(
            data => {
                return data
            }
        )
    } catch (e) {
        console.log(e)
    }
}

export const getJsonData = (key, setData) => {
    AsyncStorage.getItem(key).then(
        data => {
            data != null ? setData(JSON.parse(data)) : setData(null)
        }
    ).catch(e => console.log(e))
}

export const getJson = (key) => {
    return AsyncStorage.getItem(key).then(
        data => {
            return  data != null ? JSON.parse(data) : null
        }
    )
}