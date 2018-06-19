// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const knayi = require('knayi-myscript');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function convertText(text) {
    if (knayi.fontDetect(text) === 'zawgyi') {
        return knayi.fontConvert(text, 'unicode');
    } else if (knayi.fontDetect(text) === 'unicode') {
        return knayi.fontConvert(text, 'zawgyi');
    }
    return text;
};

function replaceSelection(editor, editorSelections) {
    let selectionContexts = editorSelections.map((selection) => {
        let selectionRange = new vscode.Range(selection.start, selection.end);
        let text = vscode.window.activeTextEditor.document.getText(selectionRange);
        return {
            selectionRange,
            text
        };
    });
    editor.edit((textEditorEdit) => {
        selectionContexts.forEach((selectionContext) => {
            textEditorEdit.replace(selectionContext.selectionRange, convertText(selectionContext.text));
        });
    });
};

function activate(context) {

    let disposable = vscode.commands.registerCommand('extension.convertZgUni', function () {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const editorSelections = editor.selections;
            replaceSelection(editor, editorSelections);
        }
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;