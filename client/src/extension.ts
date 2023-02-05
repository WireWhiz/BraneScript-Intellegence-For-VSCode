/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */


import { Socket } from 'net';
import * as vscode from 'vscode';
import { workspace, ExtensionContext } from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	StreamInfo,
	Message,
	ErrorAction,
	CloseAction
} from 'vscode-languageclient/node';

let client: LanguageClient;
let server : Socket

export function activate(context: ExtensionContext) {
	const serverOptions : ServerOptions = async ()  =>  {
		

		let resolve, reject;
		let streamInfo = new Promise<StreamInfo>(function(res, rej){
			resolve = res;
			reject = rej;
		});

		var attemptConnection = ()=>{
			server = new Socket({
				readable: true,
				writable: true
			});
	
			server.addListener('error', (err: Error)=>{
				vscode.window.showErrorMessage("Could not connect to lsp server!", {title: "Try again"}, {title: "Cancel"}).then((item)=>{
					if(item.title == "Try again") {
						attemptConnection();
					} else 
						reject(err);
				});
			});
	
			server.connect({
				port: 2001,
				host: 'localhost'
			}, ()=>{
				console.log("Connected to BS Intellegence server")
				resolve({
					writer: server,
					reader: server
				});
			});
		}
		attemptConnection();
		return streamInfo;
	};

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		documentSelector: [{ scheme: 'file', language: 'branescript' }],
		errorHandler: {
			error: function(error: Error, message: Message | undefined, count: number | undefined){
				console.log(message);
				return ErrorAction.Continue;
			},
			closed: function() {
				console.log("Connection was closed!")
				return CloseAction.Restart;
			}
		},
		progressOnInitialization: true
		// synchronize: {
		// 	// Notify the server about file changes to '.clientrc files contained in the workspace
		// 	fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		// }
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'BraneScriptIntelligence',
		'BraneScript Intelligence',
		serverOptions,
		clientOptions
	);
	
	client.start();
	console.log("BS Intelegence started");
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
