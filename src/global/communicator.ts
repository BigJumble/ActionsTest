import type { DataConnection, Peer as PeerTS } from "peerjs";
import { Peer } from "peerjs";
import type { Message, MetaMessage } from "@/types";
import { Dispatch, SetStateAction } from "react";

export class Communicator {
    static peer: PeerTS;
    static conn: DataConnection;
    static isOpen: boolean = false;
    static setMessages: Dispatch<SetStateAction<MetaMessage[]>>;

    static send(message: Message) {
        if (!this.isOpen) {
            console.log("No connection!");
            return;
        }

        this.conn.send(JSON.stringify(message));
    }
    static requestData(num: number) {
        if (!this.isOpen) {
            console.log("No connection!");
            return;
        }
        this.conn.send(num.toString());
    }

    static handleData(data: string) {
        console.log(`Received: ${data}\nfrom: ${this.conn.peer}`);
        if (data === "ping") {
            this.conn.send("pong");
            return;
        }
        const arrived = JSON.parse(data);
        if (Array.isArray(arrived)) {
            if (arrived.length > 0) {
                this.setMessages((lastdata) => [...lastdata, ...arrived]);
            }
        }
        else if (typeof arrived === 'object') {
            this.setMessages((lastdata) => [arrived, ...lastdata]);
        }
        // if(Array.isArray(arrived) || typeof arrived === 'object' && arrived !== null)

    }

    static handleConnectionOpen() {
        this.isOpen = true;
        this.requestData(0);
        // this.conn.send("hi!");
        this.conn.on('data', (data) => this.handleData(data as string));
    }

    static handlePeerOpen(id: string) {
        console.log(`My ID: ${id}`);
        this.conn = this.peer.connect("ouroboros-node-0-3c4n89384fyn73c4345");
        this.conn.on("open", () => this.handleConnectionOpen());
    }

    static {
        this.peer = new Peer({
            config: {
                'iceServers': [
                    { urls: "stun:stun.l.google.com:19302" },
                    { urls: "stun:stun.l.google.com:5349" },
                    { urls: "stun:stun1.l.google.com:3478" },
                    { urls: "stun:stun1.l.google.com:5349" },
                    // { urls: "stun:stun2.l.google.com:19302" },
                    // { urls: "stun:stun2.l.google.com:5349" },
                    // { urls: "stun:stun3.l.google.com:3478" },
                    // { urls: "stun:stun3.l.google.com:5349" },
                    // { urls: "stun:stun4.l.google.com:19302" },
                    // { urls: "stun:stun4.l.google.com:5349" }
                ]
            } /* Sample servers, please use appropriate ones */
        });

        this.peer.on('open', (id) => this.handlePeerOpen(id));
    }
}
// declare global {
//     interface Window {
//         Communicator: typeof Communicator;
//     }
// }

// window.Communicator = Communicator;