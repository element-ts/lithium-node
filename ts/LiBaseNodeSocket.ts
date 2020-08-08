/**
 * Elijah Cobb
 * elijah@elijahcobb.com
 * elijahcobb.com
 * github.com/elijahjcobb
 */

import {
	LiCommandRegistry,
	LiCommandRegistryStructure,
	LiSocket
} from "@element-ts/lithium-core";
import * as WS from "ws";

export class LiBaseNodeSocket<
	LC extends LiCommandRegistryStructure<LC>,
	RC extends LiCommandRegistryStructure<RC>,
	SC extends LiCommandRegistryStructure<SC> = any
> extends LiSocket<LC, RC, SC> {

	public constructor(socket: WS, commandRegistry?: LiCommandRegistry<LC, RC>, id: string = "", onDidReceiveId: ((() => void) | undefined) = undefined, allowPeerToPeer: boolean = false, debug?: boolean) {

		super({
			close: (() => socket.close()),
			send: ((data, handler) => socket.send(data, handler)),
			onMessage: (handler: (data: string) => void): void => {
				socket.on("message", handler);
			},
			onError: (handler: (err: Error) => void): void => {
				socket.on("error", handler);
			},
			onClose: (handler: (code?: number, reason?: string) => void): void => {
				socket.on("close", handler);
			}
		}, commandRegistry, id, onDidReceiveId, allowPeerToPeer, debug);

	}

}
