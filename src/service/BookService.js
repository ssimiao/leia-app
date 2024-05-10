import {api, setToken} from "./UserService";
import {login} from "../app/reducers/loginSlice";
import {showMessage} from "react-native-flash-message";
import {StatusBar} from "react-native";
import {getJson} from "./InMemoryStorageService";
import * as InMemoryCache from "../service/InMemoryStorageService"

export async function searchBookOpenLibrary(params) {
    await setToken()
    return await api.get(
        "/books?title=" + params.title + "&isbn=" + params.isbn
    );
}

export async function getScore(params) {
    return await api.post(
        "/score?isbn=" + params.isbn,
        {
            'data': params.text
        }
    );
}

export function getBookQuestions(params, setLoading) {
    console.log(params)
    api.setHeaders({'Authorization': localStorage.getItem("token_session")})
    api.get(
        "/books/" + params.book_id + "/questions"
    ).then(response => {
        if (response.ok) {
            patchBookReading(params, )
        } else {

        }
        setLoading(false)
    });
}

export function patchUserBookAnswers(params, body, setLoading) {
    console.log(params)
    api.setHeaders({'Authorization': localStorage.getItem("token_session")})
    api.patch(
        "users/"+ params.user + "/books/" + params.book_id + "/questions"
    ).then(response => {
        if (response.ok) {

        } else {

        }
        setLoading(false)
    });
}

export async function patchBookReading(isbn, body) {
    await setToken();
    let user = await getJson("user").then(data => {
        return data
    })
    return api.patch(
        "/readings/" + user.username + "-" + isbn,
        body
    )
}

export async function getUserBooks() {
    await setToken()
    let user = await getJson("user").then(data => {
        return data
    })

    return api.get(
        `/users/${user.username}/books`
    ).then(response => {
        console.log(response)
        if (response.ok) {
            InMemoryCache.storeJsonData("user_books",response.data)
            return response.data
        } else {
        }
    });
}