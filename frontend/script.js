document
    .getElementById("generateBtn")
    .addEventListener("click", () => {

        const prompt =
            document.getElementById("prompt").value;

        const image =
            document.getElementById("referenceImage").files[0];

        console.log("Prompt:", prompt);
        console.log("Reference Image:", image);

        alert("Generate button clicked");
    });