// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */


function reformat(string) {
	var inputValue = string.toString();

	// Brand sierotki
	// var brandName = document.getElementById("brand").value;

	// const brandRegex = new RegExp(brandName);
	// console.log(brandRegex);

	// const space = / /g;
	// var reformatedBrand = brandName.replace(space, "&nbsp;");
	// console.log(reformatedBrand);

	// var reformated = inputValue.replace(brandRegex, reformatedBrand);

	const sierotki =
	/ i | a | z | w | oraz | lub | u | I | A | Z | W | ORAZ | LUB | U | o | O | od | do | OD | DO | to | TO |[0-9] | za | ZA /g;
	const literka_a = /, a |, A /g;
	const short_dash = /-/g;
	const long_dash_space = / – /g;

	var reformated = inputValue.replace(sierotki, (t1) => {
		var val = t1.slice(0, -1);
		return `${val}&nbsp;`;
	});

	reformated = reformated.replace(short_dash, (t2) => {
		var val = t2.slice(0, -1);
		return `${val}&#8209;`;
	});

	reformated = reformated.replace(long_dash_space, "&nbsp;&mdash;&nbsp;");

	reformated = reformated.replace(literka_a, (t2) => {
		var val = t2.slice(0, -1);
		return `${val}&nbsp;`;
	});

	// For strong use @@some text@@
	var occurances = [...reformated.matchAll(/\@{2}(.*?)\@{2}/g)]
	occurances.forEach(occurance => {
		reformated = reformated.replace(occurance[0], `<strong>${occurance[1]}</strong>`)
	})

	return reformated;
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
		let htmlFile  = editor.document.getText()

		let DOM = new JSDOM(htmlFile, {
			contentType: "text/html",
			includeNodeLocations: true,
		  });
		
		let body = DOM.window.document.getElementsByTagName('body')[0]
		let bodyStringified = body.outerHTML
		let changes = [...bodyStringified.matchAll(/>[\s\S]*?</gmi)]
		changes = changes.map(element => element[0])
		let results = changes.filter(element => !element.match(/>[\s]*?</gmi))
		// console.log(results)
		let trimmedResults = []
		results.forEach(element => {
			trimmedResults.push(element.replace(/\s+/g, ' '))
		})
		// console.log(trimmedResults)
		bodyStringified = bodyStringified.replace(/\s+/g, ' ')
		bodyStringified = bodyStringified.replace(/>\s+</g, '><')
		for(var i = 0; i < results.length; i++){
			var text = trimmedResults[i]
			var text = text.slice(1, text.length-1)
			console.log(text)
			
			bodyStringified = bodyStringified.replace(`${trimmedResults[i]}`, `>${reformat(text)}<`)
		}
		bodyStringified = bodyStringified.replace(/></g, '>\n<')
		console.log(bodyStringified)
		body.outerHTML = bodyStringified
		edit.insert(editor.selection.active, DOM.window.document.documentElement.outerHTML)
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from HTML Text Formater!');
	});

	context.subscriptions.push(disposable);
}


// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
