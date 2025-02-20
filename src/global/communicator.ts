'use client'
import type { DataConnection, Peer as PeerTS } from "peerjs";
import { Peer } from "peerjs";
import type { Message, MetaMessage, ServerNodes } from "@/types";
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
        console.log(`Sending message: ${JSON.stringify(message)}`);
        this.conn.send(JSON.stringify(message));
    }
    static requestData(num: number) {
        if (!this.isOpen) {
            console.log("No connection!");
            return;
        }
        console.log(`Requesting data: ${num}`);
        
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

    static async getNodesID() {
        try {
            const response = await fetch('https://bigjumble.github.io/Ouroboros/nodes.json', {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            const data = await response.json();
            const nodes = data as ServerNodes;

            console.log(`Nodes: ${JSON.stringify(nodes)}`);
            const nodeKeys = Object.keys(nodes).map(Number);
            const latestNodeKey = Number(Math.max(...nodeKeys));
            const latestNode = nodes[latestNodeKey];
            
            const oldNodeKey = Number(Math.min(...nodeKeys));
            const oldNode = nodes[oldNodeKey];

            return {latestNode, oldNode};



        } catch (error) {
            // console.log(error);
            console.log(`Failed to get node data: ${error}`);
        }

        return null;
    }

    static async handlePeerOpen(id: string) {
        console.log(`My ID: ${id}`);
        const nodesID = await this.getNodesID();
        console.log(`Nodes IDs: ${nodesID}`);

        if (nodesID) {
            this.conn = this.peer.connect(nodesID.oldNode);

            this.peer.on("error", (error) => {
                console.log(error.message);
                if (error.message.includes("Could not connect to peer")) {
                    console.log("Failed to connect to old node, trying to connect to latest node");
                    this.conn = this.peer.connect(nodesID.latestNode);
                }
            });

            this.conn.on("open", () => this.handleConnectionOpen());
            this.conn.on("error", () => {
                console.log("CONNECTION ERROR HAPPENED!");
                this.cleanup();
            });
            this.conn.on("close", () => {
                console.log("CONNECTION TO SERVER CLOSED! RECONNECTING!");
                this.cleanup();
            }
            );
        }

        setTimeout(() => {
            if (!this.isOpen) {
                console.log("Connection failed, trying to connect again");
                this.cleanup();
            }
        }, 15000);
    }

    static {
        this.init();
    }

    static init() {
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

    static cleanup() {
        if (this.conn) {
            this.conn.close();
        }
        if (this.peer) {
            this.peer.destroy();
        }
        this.setMessages([]);
        this.isOpen = false;
        this.init();

    }
}
// declare global {
//     interface Window {
//         Communicator: typeof Communicator;
//     }
// }

// window.Communicator = Communicator;