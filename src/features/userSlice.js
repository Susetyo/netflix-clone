import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        subscriptionRol: null,
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
        },
        changeSubscription: (state, action) => {
            state.subscriptionRole = action.payload;
        },
    },
});

export const { login, logout, changeSubscription } = userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectSubscriptionRole = (state) => state.user.subscriptionRole;
export default userSlice.reducer;
