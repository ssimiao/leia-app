import {create} from 'apisauce'
import {login} from '../app/reducers/loginSlice';
import * as RootNavigation from '../app/RootNavigation';
import {showMessage, hideMessage} from "react-native-flash-message";
import {Platform, StatusBar} from 'react-native';
import {storeData, storeJsonData, getData, getJsonData, clearCache, getDataInCache} from './InMemoryStorageService';
import * as InMemoryCache from "../service/InMemoryStorageService"


export const api = create({
    baseURL: 'https://leia-back.onrender.com/v1',
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 15000
})

export async function setToken() {
    let token;
    await getData("token_session").then(response => {
        console.log(response)
        token = response
    })
    api.setHeaders({'Authorization': "Bearer " + token})
}

export function showMessageDefault(message) {
    showMessage({
        message: message,
        type: "default",
        backgroundColor: "#041838",
    });
}

function loadUserInfo(responseUser) {
    if(responseUser.data.user.user_type === "Aluno") 
        return getUserRead(responseUser.data.id)
    else 
        return getStudentGroup(responseUser.data.id)
    
}

export function loginRequest(body, dispatch, setLoading) {
    clearCache();
    api.post(
        "/login?process=java",
        body
    ).then(async response => {
        if (response.ok) {
            storeJsonData("user_id",response.data)
            await getUser(response.data.id).then(responseUser => {
                    if (responseUser.ok) {
                        loadUserInfo(responseUser).then(response => {
                            if(response.ok) {
                                RootNavigation.navigate("MainTab", responseUser.data)
                            }
                            else {
                                showMessageDefault("Erro ao carregar informações do usuário")
                            }
                        })
                    } else {
                        showMessageDefault("Erro ao carregar informações do usuário")
                    }
                })
        } else {
            showMessageDefault("Erro no login");
        }
        setLoading(false)
        console.log(response)
    }).catch(e => {
        setLoading(false)
    });
}

export function registerRequest(body, setLoading, clear) {
    console.log(body)
    setLoading(true)
    api.post(
        "/users?process=java",
        body
    ).then(response => {
        if (response.ok) {
            showMessageDefault("Usuario criado!");
            
            RootNavigation.navigate("Login", {isRegisterUser: true})
        } else {
            showMessageDefault("Falha no cadastro do usuário, tente novamente em alguns segundos.");
        }

        console.log(response)
        clear()
        setLoading(false)
    }).catch(error => console.log(error));
}

export function changeUserAttribute(body, id, setLoading, setSum, toggleModal) {
    console.log(body)
    api.patch(
        "/users/"+ id + "/characters",
        body
    ).then(response => {
        if (response.ok) {
            setSum(0)
            getUser(id)
            showMessageDefault("Atributo alterado com sucesso!");
        } else {
            showMessageDefault("Falha ao alterar atributo");
        }

        console.log(response)
        setLoading(false)
        toggleModal({})
    }).catch(error => console.log(error));
}

export function updateBookReading(body, userId, setLoading, setSumAttribute, toogleModal) {
    api.patch(
        "/users/"+ userId + "/reads",
        body
    ).then(response => {
        if (response.ok) {
            getUserRead(userId)
            showMessageDefault("Leitura atualizado com sucesso!");
        } else {
            showMessageDefault("Falha ao atualizar leitura");
        }

        setLoading(false)
        setSumAttribute(0)
        toogleModal({})
    }).catch(error => console.log(error));
}

export async function createGroup(body, userId, setLoading) {
    return await api.post(
        "/users/"+ userId + "/groups",
        body
    ).then(response => {
        if (response.ok) {
            showMessageDefault("Grupo criado com sucesso!");
            getStudentGroup(userId).then(() => setLoading(false))
        } else {
            showMessageDefault("Falha ao criar grupo");
            setLoading(false)
        }
    })
}

export async function addUserToGroup(body, userId, groupId, setGroup, setLoading, setModal) {
    return await api.patch(
        "/users/"+ userId + "/groups",
        body
    ).then(response => {
        console.log(body)
        console.log(response.data)
        if (response.ok) {
            showMessageDefault("Usuarios adicionados");
            setModal(false)
            getStudentGroup(userId).then(() => {
                getStudentGroupById(userId, groupId, setGroup)
            })
        } else {
            showMessageDefault("Falha ao adicionar usuarios no grupo");
        }
    })
}

export async function addBookToGroup(body, userId, groupId, setGroup, setLoading) {
    return await api.put(
        "/users/"+ userId + "/groups",
        body
    ).then(response => {
        console.log(response.data)
        if (response.ok) {
            showMessageDefault("Livro adicionado ao grupo");
            storeJsonData("book_recommended", response.data)
            getStudentGroup(userId).then(() => {
                getStudentGroupById(userId, groupId, setGroup)
            })
            if (response.data.user_type === "Professor")
                RootNavigation.navigate("GenerateGame")
        } else {
            showMessageDefault("Falha ao adicionar livro no grupo");
        }
    })
}

export function updateUserInfo(body, setLoading) {
    api.put(
        "/users",
        body
    ).then(response => {
        if (response.ok) {
            //storeJsonData("char", response.data)
            showMessageDefault("Dados atualizados com sucesso!");
        } else {
            showMessageDefault("Falha ao atualizar dados");
        }
        setLoading(false)
        console.log(response)
    })
}

export function updatePassword(body, setLoading, setPasswordModalVisible) {
    api.patch(
        "/users",
        body
    ).then(response => {
        if (response.ok) {
            showMessageDefault("Dados atualizados com sucesso!");
            setPasswordModalVisible(false)
        } else {
            showMessageDefault("Falha ao atualizar dados");
        }
    })
}

export function updatePasswordForget(body, setLoading) {
    api.patch(
        `/users?otp=${body.otp}&email=${body.email}`,
        body
    ).then(response => {
        if (response.ok) {
            showMessageDefault("Senha recuperada com sucesso!");
        } else {
            showMessageDefault("Falha ao atualizar dados");
        }
        setLoading(false)
    })
}

export function sendEmailAndGetCode(param, setLoading, setCode) {
    api.patch(
        `/forget?email=${param}&q=${param}`
    ).then(response => {
        console.log(response)
        if (response.ok) {
            setLoading(false)
            setCode(response.data.code)
        } else {
            showMessageDefault("Ocorreu um erro ao tentar mandar um email para o usuário")
        }
    })
}

export function validateCode(param, code, setLoading, setValid) {
    api.get(
        `/forget?email=${param}&q=${param}&otp=${code}`
    ).then(response => {
        console.log(response)
        if (response.ok) {
            setLoading(false)
            setValid(response.data.valid)
        } else {
            showMessageDefault("Ocorreu um erro ao tentar mandar um email para o usuário")
        }
    })
}

export async function resolveChallenge(readId, userId) {
    api.patch(
        "/reads/"+ readId + "/challenges",
        {
            'data': 'desafio resolvido'
        }
    ).then(response => {
        console.log("enviou requisição")
        if (response.ok) {
            setTimeout(() => {
                getUser(userId)
            }, 500);
            setTimeout(() => {
                getUserRead(userId)
            }, 1000);
            setTimeout(() => {
                captureChallengeResult(userId, "W")
                RootNavigation.navigate('CharacterRpg')
            }, 1500);
        } else {
            showMessageDefault("A resposta estava correta mas não conseguimos processa-lá");
        }

        console.log(response)
    }).catch(error => console.log(error));
}

export async function getUser(id) {
    return await api.get(
        "/users/" + id + "/characters"
    ).then(response => {
        if (response.ok) {
            console.log(JSON.stringify(response.data))
            storeJsonData("char", response.data)
        }

        console.log(response)
        return response
    })
}

export async function updatePotionVitality(id, setLoading) {
    return await api.patch(
        "/users/" + id + "/characters/action"
    ).then(response => {
        if (response.ok) {
            getUser(id)
            showMessageDefault("Vitalidade aumentada em 1 coração");
        } else {
            showMessageDefault("Falha ao aumentar vitalidade");
        }

        console.log(response)
        setLoading(false)
    })
}

export async function captureChallengeResult(id, result) {
    return await api.put(
        "/users/" + id + "/characters/action",
        {
            "result": result
        }
    ).then(response => {
        console.log(response)
    })
}

export async function getUserClasses(id) {
    //await setToken()
    return await api.get(
        "/users/" + id + "/characters/classes"
    ).then(response => {
        if (response.ok) 
            storeJsonData("classes", response.data)
        return response
    })
}

export async function setUserClasses(id, classeChoose) {
    //await setToken()
    return await api.patch(
        "/users/" + id + "/characters/classes",
        {
            classe: classeChoose
        }
    ).then(response => {
        if (response.ok) {
            storeJsonData("classes", response.data)
            showMessageDefault("Classe atualizada com sucesso")
        }
        else
            showMessageDefault("Falha ao atualizar classe")
        return response
    })
}

export async function getUserRead(id) {
    //await setToken()
    return await api.get(
        "/users/" + id + "/reads"
    ).then(response => {
        if (response.ok) 
            storeJsonData("reads", response.data)

        console.log(response)
        return response
    })
}

export async function getStudentGroup(id) {
    return await api.get(
        "/users/" + id + "/groups"
    ).then(response => {
        if (response.ok) {
            storeJsonData("studentGroup", response.data)
        }   
        return response
    })
}

export async function getStudentGroupById(id, idGroup, setGroup) {
    return await api.get(
        "/users/" + id + "/groups/" + idGroup
    ).then(response => {
        if (response.ok) {
            setGroup({data: response.data})
            storeJsonData("groupInfo", response.data)
        }

        return response
    })
}

export async function postBook(isbn, text, setLoading) {
    //await setToken()

    InMemoryCache.getJson("user_id").then(user => 
        api.post(
            "/books",
            {
                "isbn": isbn,
                "user_id": user.id,
                "text": text
            }
        ).then(response => {
            if (response.ok) { 
                storeJsonData("book_recommended", response.data)
                RootNavigation.navigate("GenerateGame")
            }
            else
                showMessageDefault("Erro ao recomendar livro")

            setLoading(false)
            return response
        })
    )
}

export async function addBookToUserRead(isbn, setLoading, setBook) {
    //await setToken()

    InMemoryCache.getJson("user_id").then(user => 
        api.post(
            "/users/" + user.id + "/reads",
            {
                "isbn": isbn,
            }
        ).then(response => {
            console.log(response)
            if (response.ok) { 
                getUserRead(user.id)
                showMessageDefault("Adicionou livro com sucesso")
                setBook({})
            }
            else
                showMessageDefault("Erro ao adicionar livro")

            setLoading(false)
            return response
        })
    )
}

export async function getBook(value, setLoading) {
    //await setToken()

    api.get(
        "/books?isbn=" + value + "&q=" + value
    ).then(response => {
        if (response.ok) { 
            storeJsonData("search_book", response.data)
        }
        else
            showMessageDefault("Erro ao buscar livro")

        console.log(response.data)
        setLoading(false)
        return response
    })
}

export async function getBookshelf() {
    return api.get(
        "/books"
    )
}

export async function postBookChallenge(body, setLoading) {
    InMemoryCache.getJson("book_recommended").then(recommended => {
        InMemoryCache.getJson("user_id").then(user => {
            body.user_id = user.id
            api.post(
                "/books/" + recommended.id_book + "/challenges",
                body
            ).then(response => {
                console.log(response)
                if (response.ok) { 
                    showMessageDefault("Desafio adicionado ao livro")
                    RootNavigation.navigate("CharacterRpg")
                }
                else
                    showMessageDefault("Erro ao adicionar um desafio")
    
                setLoading(false)
                return response
            })
        })
    })
}

export async function patchUser(username, body) {
    await setToken()
    api.patch(
        "/users/" + username,
        body
    ).then(response => {
        if (response.ok)
            return response.data
    });
}

export async function getUserAvatar(username) {
    await setToken()
    return await api.get(
        `/users/${username}/images`
    ).then(response => {
        if (response.ok)
            storeData("user_avatar", response.data.image_encoded)

        return response;
    });
}

export async function setUserAvatar(username, photo, setAvatar) {
    await setToken()
    const photoEncoded = photo.assets[0].base64
    api.post(
        `/users/${username}/images`,
        {
            data: photoEncoded
        }
    ).then(response => {
        if (response.ok) {
            storeData("user_avatar", photoEncoded)
            setAvatar(`data:image/jpeg;base64,${photoEncoded}`)
        }
        else
            console.log(response)
    });
}

const createFormData = (photo, body = {}) => {
    const data = new FormData();
    let uri = Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri;
    const splitUri = uri.split("/");
    console.log(splitUri[splitUri.length - 1])
    data.append('file',
        uri, splitUri[splitUri.length - 1]);

    console.log(data)
    return data;
};

export function avatarRendering(avatarLoading, avatar, default_avatar, setAvatar) {
    if (avatar === default_avatar && !avatarLoading) {
        avatarLoading = true;
        getDataInCache("user_avatar")
            .then(data => {
                setAvatar(`data:image/jpeg;base64,${data}`)
                avatarLoading = false;
            })
    }
}



