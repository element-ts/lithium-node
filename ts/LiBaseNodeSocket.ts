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

	private socket: WS;

	public constructor(socket: WS, commandRegistry?: LiCommandRegistry<LC, RC>, id: string = "", onDidReceiveId: ((() => void) | undefined) = undefined, allowPeerToPeer: boolean = false, debug?: boolean) {

		super(commandRegistry, id, onDidReceiveId, allowPeerToPeer, debug);

		this.socket = socket;
		this.socket.on("message", this.handleOnMessage);
		this.socket.on("error", this.handleOnError);
		this.socket.on("close", this.handleOnClose);

	}

	protected handleClose(): void {
		this.socket.close();
	}

	protected handleSend(data: string, handler: (err?: Error) => void) {
		this.socket.send(data, handler);
	}

}
