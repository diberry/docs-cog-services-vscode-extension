# Hello Code Sample

This is a Hello World example that shows you how to use VS Code API.

Guide for this sample: https://vscode-ext-docs.azurewebsites.net/api/hello-code/introduction.

## Demo

![demo](demo.gif)

## VS Code API

### `vscode` module

- [`commands.registerCommand`](https://code.visualstudio.com/docs/extensionAPI/vscode-api#commands.registerCommand)
- [`window.showInformationMessage`](https://code.visualstudio.com/docs/extensionAPI/vscode-api#window.showInformationMessage)

### Contribution Points

- [`contributes.commands`](https://code.visualstudio.com/docs/extensionAPI/extension-points#_contributescommands)

## Running the Sample

- Run `npm install` in terminal to install dependencies
- Run the `Run Extension` target in the Debug View. This will:
	- Start a task `npm: watch` to compile the code
	- Run the extension in a new VS Code window
