import type { DataConnection, Peer as PeerTS } from "peerjs";
import { Peer } from "peerjs";
import type { Message } from "@/types";
export class Communicator{
    static peer: PeerTS;
    static conn: DataConnection;
    static isOpen: boolean = false;

    static send(message:Message)
    {
        if(!this.isOpen) {
            console.log("No connection!");
            return;
        }

        this.conn.send(JSON.stringify(message));
    }
    static{
        this.peer = new Peer({
            config: {'iceServers': [
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
            ]} /* Sample servers, please use appropriate ones */
          });
        
        this.peer.on('open', (id) => {
            console.log(`My ID: ${id}`);
            this.conn = this.peer.connect("ouroboros-node-0-3c4n89384fyn73c4345");
            this.conn.on("open", () => {
                this.isOpen=true;
                // this.conn.send("hi!");
                this.conn.on('data', (data) => {
                    console.log(`Received: ${data}\nfrom: ${this.conn.peer}`);
                });
            });

        });
    }

}