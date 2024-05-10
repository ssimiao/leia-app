import {api, setToken} from "./UserService";
import {login} from "../app/reducers/loginSlice";
import {showMessage} from "react-native-flash-message";
import {StatusBar} from "react-native";
import {getJson} from "./InMemoryStorageService";
import * as InMemoryCache from "../service/InMemoryStorageService"
import {create} from 'apisauce'


export const apiPredictBook = create({
    baseURL: 'https://leia-ia.onrender.com',
    headers: {
        "Content-Type": "application/json"
    }
})

export function getStudentGroup(id, setLoading, setStudentGroup) {
    api.get(
        "/users/"+ id + "/groups",
        body
    ).then(response => {
        if (response.ok) {
            setStudentGroup(response.data)
        } 
        setLoading(false)
    }).catch(error => console.log(error));
}

export function getPredictBook(text) {
    return apiPredictBook.post(
        "/predict",
        {
            excerpt : text
        }
    )
}