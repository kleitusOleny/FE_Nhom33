import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {WebsocketInstance} from "@/socket/WebsocketInstance.ts";
// import {setConnected} from "@/redux/slices/socketSlice.ts";

export function useSocketConnection() {
    const dispatch = useDispatch()
    useEffect(() => {
        const ws = WebsocketInstance.getInstance()
        // ws.onInitConnection = () => dispatch(setConnected(true))
        // ws.onConnectionLost = () => dispatch(setConnected(false))
        // ws.onServerError = () => dispatch(setConnected(false))
        return () => {
            ws.onInitConnection = undefined
            ws.onConnectionLost = undefined
            ws.onServerError = undefined
        }
    }, [dispatch])
}