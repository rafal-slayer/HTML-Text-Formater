// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const jsdom = require("jsdom");
const { text } = require('stream/consumers');
const { format } = require('path');
const { JSDOM } = jsdom;
const beautify = require("js-beautify").html;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

function reformat(string) {
	var inputValue = `${string.toString()}`;

	// Brand sierotki
	// var brandName = document.getElementById("brand").value;

	// const brandRegex = new RegExp(brandName);
	// console.log(brandRegex);

	// const space = / /g;
	// var reformatedBrand = brandName.replace(space, "&nbsp;");
	// console.log(reformatedBrand);

	// var reformated = inputValue.replace(brandRegex, reformatedBrand);

	const sierotki =
	/ i | a | z | w | oraz | lub | u | I | A | Z | W | ORAZ | LUB | U | o | O | od | do | OD | DO | to | TO | za | ZA /g;
	const cyferki = /[0-9] /g;
	const literka_a = /, a |, A /g;
	const short_dash = /-/g;
	const long_dash_space = / – /g;

	// console.log([...inputValue.matchAll(sierotki)])

	// console.log("przed" + reformated)
	var reformated = inputValue.replace(sierotki, (t1) => {
		var val = t1.slice(0, -1);
		return `${val}&nbsp;`;
	});
	// console.log("po 1" + reformated)
	var reformated = reformated.replace(cyferki, (t2) => {
		var val = t2.slice(0, -1);
		return `${val}&nbsp;`;
	});
	// console.log("po 2" + reformated)

	reformated = reformated.replace(short_dash, (t3) => {
		var val = t3.slice(0, -1);
		return `${val}&#8209;`;
	});

	reformated = reformated.replace(long_dash_space, "&nbsp;&mdash;&nbsp;");

	reformated = reformated.replace(literka_a, (t2) => {
		var val = t2.slice(0, -1);
		return `${val}&nbsp;`;
	});

	return reformated
}

function textNodesUnder(node){
	var all = [];
	
	for (node=node.firstChild;node;node=node.nextSibling){
		if (node.nodeType==3) all.push(node);
		else all = all.concat(textNodesUnder(node));
	}

	return all;
}

function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "html-text-formater" is now active!');
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerTextEditorCommand('html-text-formater.formatHTMLFile', (editor, edit) => {
		// The code you place here will be executed every time your command is executed
		if(editor.document.languageId.toLowerCase() != "html"){
			vscode.window.showErrorMessage('Błędne rozszerzenie pliku!')
			return 1;
		}

		let htmlFile  = editor.document.getText()

		let DOM = new JSDOM(htmlFile, {
			contentType: "text/html",
			includeNodeLocations: true,
		  });

		let body = DOM.window.document.body

		// getting a list of text nodes and filtering out whitespace only ones
		let textNodes = textNodesUnder(body)
		.filter( node => {
			return !node.textContent.match(/^\s*$/)
		})

		// going throught each text node
		for(let textNode of textNodes){

			if(textNode.parentElement.className.match(/cm-card-(data|version|index|ean|date-production)/g) || textNode.parentElement.nodeName.toUpperCase() == 'SCRIPT' ){
				continue;
			}

			// removing any unnecessary special characters
			textNode.textContent = textNode.textContent
			.replaceAll('&nbsp;',' ')
			.replaceAll('&#8209;', '-')
			.replaceAll('&mdash;', '-')
			.replaceAll(' ', ' ')
			.replaceAll('‑', '-')
			.replaceAll('—', '-')

			// getting only text (no whitespaces) that's going to be replaced
			let textToReplace = textNode.textContent.trim()
			
			// removing any whitespace duplicates and new line characters
			let inlineText = textToReplace.replaceAll(/\s+/g,' ').trim()
			
			// replacing text in text node with a formatted version
			textNode.textContent = textNode.textContent.replace(textToReplace, reformat(inlineText))
		}
		
		// the program changes all '&' to '&amp;' so we undo that change
		body.innerHTML = body.innerHTML.replaceAll('&amp;', '&')
		vscode.window.activeTextEditor.edit(builder => {
			const doc = vscode.window.activeTextEditor.document;
			builder.replace(new vscode.Range(doc.lineAt(0).range.start, doc.lineAt(doc.lineCount - 1).range.end), `<!DOCTYPE HTML>\n<html lang="pl-PL">\n${DOM.window.document.documentElement.innerHTML}\n</html>`);
		});
		
		// Display a message box to the user after successfully running the extension
		vscode.window.showInformationMessage('WHOOSH!');
	});

	context.subscriptions.push(disposable);
}


// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
