document.addEventListener("DOMContentLoaded", () => {
    const copyButton = document.getElementById("copyBtn");

    copyButton.addEventListener("click", function() {
        const text = editorInput.getValue();
        // Create a temporary textarea to hold the text and copy it
        const tempTextArea = document.createElement("textarea");
        tempTextArea.value = text;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand("copy");
        document.body.removeChild(tempTextArea);
    });
    
    const downBtn = document.getElementById("downBtn");

    downBtn.addEventListener("click", function() {
        // Get the content of CodeMirror
        const codeContent = editorInput.getValue();

        // Create a Blob with the content
        const blob = new Blob([codeContent], { type: "text/plain" });

        // Create a download link and simulate a click event
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = "code.txt"; // Set desired file name
        downloadLink.click();
    });


    const submitBtn = document.getElementById("submitBtn");
    
    submitBtn.addEventListener("click", async () => 
    {
        if(!isAllWhitespace(editorInput.getValue()))
        {
            console.log("Request Pending...");
            const codeInput = editorInput.getValue();
    
            const response = await fetch("/comment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ codeInput })
            });
    
            if (!response.ok) {
                // Handle error here
                console.log("Error in /comment request:", response.statusText);
                editorInput.setValue(editorInput.getValue()); // Set editorInput value to "Error"
                enableButton(); // Enable the button
                return;
            }
    
            const data = await response.json();
            if (data && data.commentedCode) {
                editorInput.setValue(data.commentedCode);
            }
        }
        enableButton();
    });
    
    
});

const myButton = document.getElementById('submitBtn');
let isButtonEnabled = true;

function isAllWhitespace(inputString) {
    return /^\s*$/.test(inputString);
}

myButton.addEventListener('click', () => {
    if (isButtonEnabled) {
        // Perform your action here
        console.log("Button clicked!");

        // Disable the button
        disableButton();
    }
});

function disableButton() {
    
    editorInput.setOption('readOnly', 'nocursor');
    // Display the loading element
    myButton.classList.add('disabled');
    myButton.disabled = true;
    isButtonEnabled = false;
    
}

function enableButton() {

    setTimeout(() => {
        editorInput.setOption('readOnly', false);
        myButton.classList.remove('disabled');
        myButton.disabled = false;
        isButtonEnabled = true;
    }, 300);

}

