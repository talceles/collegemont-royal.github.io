const input = document.getElementById("name");

input.onchange = function() {
    document.getElementById("nom").innerText = input.value;
}

const input2 = document.getElementById("poste");

input2.onchange = function() {
    document.getElementById("fonction").innerText = input2.value;
}

const button = document.getElementById("copy");

input2.onclick = function() {
    navigator.clipboard.write(document.getElementByTagName("signature"));
}