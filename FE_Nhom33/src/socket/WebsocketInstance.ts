import type {WsReceiveMessage, WsReceiveMsgPayloadMap} from "@/socket/types/WebSocketMessageReceive"
import type {WsSendMsgPayloadMap} from "@/socket/types/WebsocketMessageSend";
import type {WebSocketEvent} from "@/socket/types/WebSoketMessage"

type WsCallback<K extends keyof WsReceiveMsgPayloadMap> = (
    data: WsReceiveMessage<K>
) => void;

export class WebsocketInstance {
    private static instance: WebsocketInstance
    private static BASE_URL = "wss://chat.longapp.io.vn/chat/chat"
    private socket: WebSocket | null = null
    private subscriber: Map<string, Function[]> = new Map()
    private queue: string[] = []
    public onInitConnection?: () => void
    public onConnectionLost?: (code: number) => void
    public onServerError?: () => void

    private constructor() {
        this.connect()
    }

    public static getInstance() {
        if (!WebsocketInstance.instance) {
            WebsocketInstance.instance = new WebsocketInstance()
        }
        return WebsocketInstance.instance
    }

    public connect(url: string = WebsocketInstance.BASE_URL) {
        if (this.socket &&
            (this.socket.readyState === WebSocket.OPEN ||
                this.socket.readyState === WebSocket.CONNECTING)) return
        this.socket = new WebSocket(url)
        this.socket.onopen = () => {
            console.log("Connected to server successfully!")

            if (this.onInitConnection) {
                this.onInitConnection()
            }
        }

        this.socket.onmessage = (event: MessageEvent) => {
            try {
                console.log(event.data)
                const response = JSON.parse(event.data)
                const messageEvent = response.event as WebSocketEvent
                this.emit(messageEvent, response)
            } catch (error) {
                console.log(error)
            }
        }

        this.socket.onclose = (event: CloseEvent) => {
            console.log("Connection closed", event.code, event.reason)
            if (this.onConnectionLost) {
                this.onConnectionLost(event.code)
            }
            this.socket = null;
        }

        this.socket.onerror = (error: Event) => {
            console.log("Server error", error)
            if (this.onServerError) {
                this.onServerError()
            }
        }
    }

    public send<K extends WebSocketEvent>(
        event: K,
        data: WsSendMsgPayloadMap[K]
    ) {
        const raw = JSON.stringify({action: "onchat", data: {event, data}})
        if (this.socket?.readyState === WebSocket.OPEN) this.socket.send(raw)
        else if (this.socket?.readyState === WebSocket.CONNECTING) this.queue.push(raw)
    }

    public subscribe<K extends WebSocketEvent>(
        event: K,
        callback: WsCallback<K>
    ) {
        if (!this.subscriber.has(event)) {
            this.subscriber.set(event, [])
        }
        this.subscriber.get(event)?.push(callback)

        return () => this.unsubscribe(event, callback)
    }

    private unsubscribe<K extends WebSocketEvent>(
        event: K,
        callback: WsCallback<K>
    ) {
        const listener = this.subscriber.get(event)
        if (listener) {
            this.subscriber.set(event, listener.filter(cb => cb !== callback))
        }
    }

    private emit<K extends WebSocketEvent>(
        event: K,
        data: WsReceiveMessage<K>
    ) {
        const listener = this.subscriber.get(event)
        if (listener) {
            listener.forEach(cb => cb(data))
        }
    }

    get getSocket() {
        return this.socket
    }

}