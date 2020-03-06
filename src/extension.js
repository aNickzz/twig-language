import vscode from 'vscode';
import snippetsArr from './hover/filters.json';
import functionsArr from './hover/functions.json';
import twigArr from './hover/twig.json';

const editor = vscode.workspace.getConfiguration('editor');
const config = vscode.workspace.getConfiguration('twig-language-2');

function createHover(snippet, type) {
	const example =
		typeof snippet.example == 'undefined' ? '' : snippet.example;
	const description =
		typeof snippet.description == 'undefined' ? '' : snippet.description;
	return new vscode.Hover({
		language: type,
		value: description + '\n\n' + example,
	});
}

function activate(context) {
	const active = vscode.window.activeTextEditor;
	if (!active || !active.document) return;

	registerDocType('twig');

	function registerDocType(type) {
		if (config.hover === true) {
			context.subscriptions.push(
				vscode.languages.registerHoverProvider(type, {
					provideHover(document, position) {
						const range = document.getWordRangeAtPosition(position);
						const word = document.getText(range);

						for (const snippet in snippetsArr) {
							if (
								snippetsArr[snippet].prefix == word ||
								snippetsArr[snippet].hover == word
							) {
								return createHover(snippetsArr[snippet], type);
							}
						}

						for (const snippet in functionsArr) {
							if (
								functionsArr[snippet].prefix == word ||
								functionsArr[snippet].hover == word
							) {
								return createHover(functionsArr[snippet], type);
							}
						}

						for (const snippet in twigArr) {
							if (
								twigArr[snippet].prefix == word ||
								twigArr[snippet].hover == word
							) {
								return createHover(twigArr[snippet], type);
							}
						}
					},
				})
			);
		}
	}
}

exports.activate = activate;
