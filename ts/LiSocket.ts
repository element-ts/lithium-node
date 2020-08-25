/**
 * Elijah Cobb
 * elijah@elijahcobb.com
 * elijahcobb.com
 * github.com/elijahjcobb
 */

import {ClCommander, CLRegistryStructure} from "@element-ts/chlorine";
import * as WS from "ws";
import {OStandardType} from "@element-ts/oxygen";
import {Neon} from "@element-ts/neon";

export interface LiSocketConfig {
	address: string;
	debug?: boolean;
}

export class LiSocket<LC extends CLRegistryStructure<LC>, RC extends CLRegistryStructure<RC>> extends ClCommander<LC, RC, any> {

	private _socket: WS;
	private _logger: Neon;

	public constructor(socket: WS, config?: LiSocketConfig) {

		super(undefined, {debug: config?.debug});

		this._socket = socket;
		this._logger = new Neon();

		if (config?.debug) {
			this._logger.enable();
			this._logger.setTitle("@element-ts/lithium-node LiSocket");
		}

		this._socket.on("open", this.handleOnOpen.bind(this));
		this._socket.on("message", this.handleOnMessage.bind(this));
		this._socket.on("close", this.handleOnClose.bind(this));
		this._socket.on("error", this.handleOnError.bind(this));

	}

	private handleOnOpen(): void {
		this._logger.log("Socket did establish connection.");
	}

	private handleOnMessage(data: WS.Data): void {
		const message = OStandardType.string.verify(data);
		if (!message) {
			this._logger.err("Received message that was not a string.");
			return;
		}
		this.receive(message).catch(this._logger.err);
	}

	private handleOnClose(code: number, reason: string): void {
		this._logger.err(`(${code}): ${reason}`);
		this._logger.err(`Socket closed.`);
	}

	private handleOnError(error: Error): void {
		this._logger.err(error);
	}

	protected send(packet: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this._socket.send(packet,  err => {
				if (err) return reject(err);
				resolve();
			});
		});
	}

	public static init<LC extends CLRegistryStructure<LC>, RC extends CLRegistryStructure<RC>>(config: LiSocketConfig): LiSocket<LC, RC> {
		return new LiSocket<LC, RC>(new WS(config.address), config);
	}

}
