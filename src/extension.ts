// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

import * as vscode from 'vscode';
import {TextAnalytics} from "docs-cog-services";

async function getKeyPhrases(text:string):Promise<String> {

    // Get Keyphrases
    const key=String("");
    const uri=String("westus.api.cognitive.microsoft.com");
    const route=String("/text/analytics/v2.0/keyPhrases");

    let docEnhanceWithCogServices = new TextAnalytics(key, uri, route);
    let keyPhrases = await docEnhanceWithCogServices.getKeyPhrase("Deep in the heart of Texas");
    
	if(keyPhrases && keyPhrases.documents && keyPhrases.documents.length>0 && keyPhrases.documents[0].keyPhrases && keyPhrases.documents[0].keyPhrases.length>0)
	{
		return keyPhrases.documents[0].keyPhrases[0] || "";
	}
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "hellocode-sample" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloCode', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
        getKeyPhrases("Deep in the heart of Texas").then( (keyPhrases) => {
			// Display a message box to the user
			let answer:string = keyPhrases as string;
			console.log(answer);
            vscode.window.showInformationMessage(answer);
        }).catch((err) => {
			console.log(err);
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
