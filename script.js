console.log("Welcome to the Coding Challenge site!");

document.addEventListener('DOMContentLoaded', () => {
    const runCodeBtn = document.getElementById('run-code-btn');
    const codeEditor = document.getElementById('code-editor');

    if (runCodeBtn && codeEditor) {
        runCodeBtn.addEventListener('click', () => {
            const userCode = codeEditor.value;
            console.log("Running user code:");
            console.log(userCode);
            // In the future, this is where we would execute the code
            // and interact with the turtle canvas.
            alert("Check the console to see your code!");
        });
    }
});
