import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    username: string | null;
    reLoginCode: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    username: localStorage.getItem("username"),
    reLoginCode: localStorage.getItem("re_login_code"),
    isAuthenticated: Boolean(
        localStorage.getItem("username") && localStorage.getItem("re_login_code")
    ),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
            state.loading = false;
        },
        loginSuccess(
            state,
            action: PayloadAction<{ username: string; reLoginCode: string }>
        ) {
            state.username = action.payload.username;
            state.reLoginCode = action.payload.reLoginCode;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
            localStorage.setItem("username", action.payload.username);
            localStorage.setItem("re_login_code", action.payload.reLoginCode);
        },
        registerSuccess(state) {
            state.loading = false;
            state.error = null;
        },
        logout(state) {
            state.username = null;
            state.reLoginCode = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            localStorage.removeItem("username");
            localStorage.removeItem("re_login_code");
        },
    },
});

export const { setLoading, setError, loginSuccess, registerSuccess, logout } =
    authSlice.actions;

export default authSlice.reducer;