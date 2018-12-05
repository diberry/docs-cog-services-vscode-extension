'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {TextAnalytics} from "docs-cog-services";
import * as _ from "underscore";
import {Readable} from "stream";

//https://medium.com/@the1mills/how-to-test-your-npm-module-without-publishing-it-every-5-minutes-1c4cb4b369be
// npm link docs-cog-services
// command palette - look for 'CogServKeyWords'


class Headers{
    found: boolean=false;
    hOne: String[]=[];
    hTwo: String[]=[];
    hThree: String[]=[];
    hFour: String[]=[];
    hFive: String[]=[];
    hSix: String[]=[];
    hAllInOrder:String[]=[];
}

async function getKeyPhrases(text:String,config:any):Promise<String[]> {

    console.log(config);

    if(config.key=="undefined" || config.uri=="undefined" || config.route=="undefined"){
        let errorMsg = "required Text Analytics params are missing";
        console.log(errorMsg);
        return Promise.reject(errorMsg);
    } 

    let docEnhanceWithCogServices = new TextAnalytics(config.key, config.uri, config.route);
    let keyPhrases = await docEnhanceWithCogServices.getKeyPhrase(text);
    
    return keyPhrases.documents[0].keyPhrases.slice(1,50);
}

function getHeaders(text:String):Headers{
    
        // get headers from doc
        let match = text.match(/^#{1,6}(.*)/gm) || null;

        let docHeaders = new Headers();

        if(match === null){
            console.error("Cog svcs keyphrases: no headers (H*) found.");
            return docHeaders;
        };

        // sort headers by h depth
        match.forEach((match, index, array) => {

            if(match.substring(0,6)==='######') {
                docHeaders.found=true;
                docHeaders.hSix.push(match.substring(6,match.length).trim());
            } else if(match.substring(0,5)==='#####') {
                docHeaders.found=true;
                docHeaders.hFive.push(match.substring(5,match.length).trim());
            } else if(match.substring(0,4)==='####') {
                docHeaders.found=true;
                docHeaders.hFour.push(match.substring(4,match.length).trim())
            } else if(match.substring(0,3)==='###') {
                docHeaders.found=true;
                docHeaders.hThree.push(match.substring(3,match.length).trim());
            } else if(match.substring(0,2)==='##') {
                docHeaders.found=true;
                if ((match.substring(2,match.length).trim().toLowerCase()) != "next steps") docHeaders.hTwo.push(match.substring(2,match.length).trim());
            } else if(match.substring(0,1)==='#') {
                docHeaders.found=true;
                docHeaders.hOne.push(match.substring(1,match.length).trim());
            } else {
                console.log("match didn't match " + match);
            }

        });

        // sort alphabetically
        docHeaders.hTwo.sort();
        docHeaders.hThree.sort();
        docHeaders.hFour.sort();
        docHeaders.hFive.sort();
        docHeaders.hSix.sort();

        // easier to do here than later
        docHeaders.hAllInOrder.push(...docHeaders.hOne);
        docHeaders.hAllInOrder.push(...docHeaders.hTwo);
        docHeaders.hAllInOrder.push(...docHeaders.hThree);
        docHeaders.hAllInOrder.push(...docHeaders.hFour);
        docHeaders.hAllInOrder.push(...docHeaders.hFive);
        docHeaders.hAllInOrder.push(...docHeaders.hSix);

        return docHeaders;

}

// Remove all keyphrases where they match with existing headers
// because headers are already filterable - no need to duplicate effort
function removeHeadersFromKeyphrases(headers:Headers,keyphrases:String[]):String[]{

    if(!headers || headers.found===false) return keyphrases;

    let intersection =  _.intersection(headers.hAllInOrder,keyphrases)

    keyphrases = keyphrases.filter((phrase)=> {
        if(intersection.indexOf(phrase)==-1){
            return phrase;
        } else {
            console.log("don't return " + phrase);
        };
    });
    return keyphrases;
}

// add displayName to metadata with top N values
/*
function addMetadataToTOCYMLtext:string, displayName:String):string{

    let indexOfMetadata = text.indexOf('ms.author');
    text = text.slice(0,indexOfMetadata) + displayName + text.slice(indexOfMetadata,text.length);
    console.log(text);
    return text;
}
*/

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

        const headersArray:Headers = getHeaders(text);

        getKeyPhrases(text, config).then( (keyPhrases) => {
            // Display a message box to the user
            // bottom right window

            // remove headers, take top N keyword phrases. 
            let finalKeyPhraseList = removeHeadersFromKeyphrases(headersArray,keyPhrases).slice(0,5);
            
            console.log(finalKeyPhraseList.join(","));

            // add keyphrases back to doc as displayName
            //addMetadataToTOCYML(text, "displayName: " + finalKeyPhraseList.join(",") + "\n\r");
            //vscode.window.showInformationMessage(finalKeyPhraseList.join(","));
            vscode.window.showInformationMessage(finalKeyPhraseList.join(","));
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