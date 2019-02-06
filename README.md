# Docs Text Analytics Sample


## Set up workspace preferences

Add workspace preferences for Text Analytics:

"CogServKeyWords.key":"6fa5dc75f09...6be2f4551af4a",
"CogServKeywords.uri":"westus.api.cognitive.microsoft.com",
"CogServKeywords.route":"/text/analytics/v2.0/keyPhrases"

## Running the Sample

Windows only for now

- Change values in .env for text analytics
- Run `npm install` in terminal to install dependencies
- Run the `Run Extension` target in the Debug View. This will:
	- Start a task `npm: watch` to compile the code
	- Run the extension in a new VS Code window

## Running in debug

Compile so that /out directory is created:

`npm run compile`

This creates the /out directory but throws errors. 
