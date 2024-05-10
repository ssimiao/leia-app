import {createSlice} from '@reduxjs/toolkit'
import * as RootNavigation from '../RootNavigation';
import * as InMemoryCache from '../../service/InMemoryStorageService'

const initialState = "https://www.freeiconspng.com/uploads/profile-icon-9.png"

export const avatarSlice = createSlice({
    name: 'avatar',
    initialState,
    reducers: {
        update: (state) => {
        },
        get: (state) => {

        }
    },
})

// Action creators are generated for each case reducer function
export const {update, get} = avatarSlice.actions

export default avatarSlice.reducer