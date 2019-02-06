'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TocManager } from "docs-cog-services";


//https://medium.com/@the1mills/how-to-test-your-npm-module-without-publishing-it-every-5-minutes-1c4cb4b369be
// npm link docs-cog-services
// command palette - look for 'CogServKeyWords'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    /*
    ,
    "CogServKeyWords.key":"6fa5dc75f09b482c9826be2f4551af4a",
    "CogServKeywords.uri":"westus.api.cognitive.microsoft.com",
    "CogServKeywords.route":"/text/analytics/v2.0/keyPhrases"
    */

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "cogsvcs-keyphrases" is now active!');
    console.log("processs.versions = " + process.versions);
    console.log("__dirname = " + __dirname);

    let workSpaceConfiguration = vscode.workspace.getConfiguration('CogServKeyWords');

    if (!workSpaceConfiguration || !workSpaceConfiguration.key || !workSpaceConfiguration.uri || !workSpaceConfiguration.route){
        console.log("VSCode extension CogServKeyWords expected workspace settings but didn't find them.");
        return;
    }

    const config = {
        key: workSpaceConfiguration.key,
        uri: workSpaceConfiguration.uri,
        route: workSpaceConfiguration.route,
        filterout: workSpaceConfiguration.filterout,
        maxCount: workSpaceConfiguration.maxCount
    }

    console.log(config);

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.CogServKeyWords', () => {
        // The code you place here will be executed every time your command is executed

        let activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            return;
        }
        let doc = activeEditor.document;
        let tocMgr = new TocManager(config);
        let currentText = doc.getText();

        let tocInfo = {
            absolutePath:  doc.fileName,
            text:  currentText,
            isDirty: doc.isDirty
        };

        // remove only filter words but leave rest of keyword phrase
        let options = {
            "removeFromPhrase":true
        };

        console.log(JSON.stringify(tocInfo));

        tocMgr.getKeywordsAsync(tocInfo,null,options).then((newText) => {

            console.log("newtext");
            console.log(newText);

            activeEditor.edit(editBuilder => {

                // line 0, position 0, 
                // last line, last position
                let range = new vscode.Range(new vscode.Position(0,0),doc.lineAt(doc.lineCount-1).range.end);
                editBuilder.replace(range, newText);

                vscode.window.showInformationMessage("File contents have keywords now");

            });
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