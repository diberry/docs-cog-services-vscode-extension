'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { MarkdownFileManager } from "docs-cog-services";


//https://medium.com/@the1mills/how-to-test-your-npm-module-without-publishing-it-every-5-minutes-1c4cb4b369be
// npm link docs-cog-services
// command palette - look for 'CogServKeyWords'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "cogsvcs-keyphrases" is now active!');
    console.log(process.versions);

    //const key=String("200639587e7c4b99a60986332d6f9b39");
    //const uri=String("westus.api.cognitive.microsoft.com");
    //const route=String("/text/analytics/v2.0/keyPhrases");

    const config = {
        key: vscode.workspace.getConfiguration().get("CogServKeyWords.key"),
        uri: vscode.workspace.getConfiguration().get("CogServKeyWords.uri"),
        route: vscode.workspace.getConfiguration().get("CogServKeyWords.route")
    }

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.CogServKeyWords', () => {
        // The code you place here will be executed every time your command is executed

        let activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            return;
        }
        let text = activeEditor.document.getText();

        let docFileMgr = new MarkdownFileManager();
        
        docFileMgr.processFile(text,config).then((response) => {
            vscode.window.showInformationMessage(response.join(","));
        }).catch((err) => {
			console.log(err);
		});

    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
    console.log("deactivate");
}