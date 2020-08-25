/**
 * Elijah Cobb
 * elijah@elijahcobb.com
 * elijahcobb.com
 * github.com/elijahjcobb
 */

import * as WS from "ws";
import * as HTTP from "http";
import * as Crypto from "crypto";
import {ClCommander, CLRegistryStructure} from "@element-ts/chlorine";
import {Neon} from "@element-ts/neon";
import {LiSocket} from "./LiSocket";
import {
	ClCommandHandlerParam,
	ClCommandHandlerReturnPromisified,
	ClCommandHandlerStructure,
	ClCommandName
} from "@element-ts/chlorine/dts/ClRegistry";

export interface LiServerConfig {
	port: number;
	debug?: boolean;
}

export class LiServer<LC extends CLRegistryStructure<LC>, RC extends CLRegistryStructure<RC>> extends ClCommander<LC, RC, undefined> {

	private _server: WS.Server;
	private _logger: Neon;
	private _connections: Map<string, LiSocket<RC, LC>>;

	public constructor(config: LiServerConfig) {

		super(undefined);

		this._server = new WS.Server({port: config.port});
		this._connections = new Map<string, LiSocket<RC, LC>>();
		this._logger = new Neon();

		if (config.debug) {
			this._logger.enable();
			this._logger.setTitle("@element-ts/lithium-node LiServer");
		}

		this._server.on("connection", this.handleOnConnection.bind(this));
		this._server.on("error", this.handleOnError.bind(this));

	}

	private generateId(): string {
		let id: string = Crypto.randomBytes(8).toString("hex");
		while (this._connections.has(id)) id = Crypto.randomBytes(8).toString("hex");
		return id;
	}

	private handleOnConnection(socket: WS, request: HTTP.IncomingMessage): void {

		const id: string = this.generateId();

		socket.on("close", () => {
			this._logger.log(`Socket with id: '${id}' did close.`);
			this._connections.delete(id);
		});

		this._connections.set(id, new LiSocket<RC, LC>(socket));

	}

	private handleOnError(error: Error): void {

		this._logger.err(error);

	}

	public implement<C extends ClCommandName<LC>>(command: C, handler: ClCommandHandlerStructure<LC, RC, C, R>): void {

	}

	public invoke<C extends ClCommandName<RC>>(command: C, param: ClCommandHandlerParam<RC, C>): ClCommandHandlerReturnPromisified<RC, C> {

	}

}
