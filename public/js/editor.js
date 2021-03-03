var showSourceCode = false;
var isEditMode = true;

function enableEditMode() {
    richTextField.document.designMode = 'On';
}

function execCmd(command) {
    richTextField.document.execCommand(command, false, null);
}

function execCommandWithArg(command, arg) {
    richTextField.document.execCommand(command, false, arg);
}

function toggleSource() {
    if(showSourceCode) {
        richTextField.document.getElementsByTagName('body')[0].innerHTML = richTextField.document.getElementsByTagName('body')[0].textContent;
        showSourceCode = false;
    } else {
        richTextField.document.getElementsByTagName('body')[0].textContent = richTextField.document.getElementsByTagName('body')[0].innerHTML;
        showSourceCode = true;
    }
}

function toggleEdit(argument) {
    if(isEditMode) {
        richTextField.document.designMode = 'Off';
        isEditMode = false;
    } else {
        richTextField.document.designMode = 'On';
        isEditMode = true;
    }
}

function submitContent() {
    document.getElementById("body").value = richTextField.document.body.innerHTML;
}