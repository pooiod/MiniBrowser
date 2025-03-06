setTimeout(function() {
    console.log("Starting JSON viewer");
    var raw = document.body.innerText.trim();
    console.log("Raw text:", raw);
    var jsonData;
    try {
        jsonData = JSON.parse(raw);
        console.log("Valid JSON found");
    } catch (e) {
        console.log("Not valid JSON");
        return;
    }
    document.body.innerHTML = "";
    document.body.style.margin = "0px"; 

    var togglePrettify = document.createElement("button");
    togglePrettify.innerText = "Toggle Prettify";
    document.body.appendChild(togglePrettify);

    var toggleWrap = document.createElement("button");
    toggleWrap.innerText = "Toggle Word Wrap";
    document.body.appendChild(toggleWrap);

    var container = document.createElement("div");
    container.style.cssText = "width: calc(100vw - 65px); height: calc(100vh - 85px); margin: 10px; padding: 20px; overflow: auto; border: 1px solid #ccc; border-radius: 10px; background-color: #f9f9f9;";
    document.body.appendChild(container);

    var pre = document.createElement("pre");
    pre.style.cssText = "font-family: monospace; white-space: pre-wrap; word-wrap: break-word;";
    container.appendChild(pre);

    var compact = JSON.stringify(jsonData);
    var pretty = JSON.stringify(jsonData, null, 2);
    var currentPrettify = false;
    var currentWrap = true;

    function highlightJSON(json) {
        if (typeof json !== "string") {
            json = JSON.stringify(json, null, 2);
        }
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
            var cls = "json-number";
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = "json-key";
                } else {
                    cls = "json-string";
                }
            } else if (/true|false/.test(match)) {
                cls = "json-boolean";
            } else if (/null/.test(match)) {
                cls = "json-null";
            }
            return '<span class="' + cls + '">' + match + "</span>";
        });
    }

    function render() {
        var jsonToDisplay = currentPrettify ? pretty : compact;
        pre.innerHTML = highlightJSON(jsonToDisplay);
        console.log("Rendered JSON with prettify:", currentPrettify);
        pre.style.whiteSpace = currentWrap ? "pre-wrap" : "pre";
        console.log("Rendered with word wrap:", currentWrap);
    }

    togglePrettify.addEventListener("click", function() {
        currentPrettify = !currentPrettify;
        render();
        console.log("Toggled prettify:", currentPrettify);
    });

    toggleWrap.addEventListener("click", function() {
        currentWrap = !currentWrap;
        render();
        console.log("Toggled word wrap:", currentWrap);
    });

    var style = document.createElement("style");
    style.innerHTML = ".json-string{color:#6A8759} .json-number{color:#6897BB} .json-boolean{color:#9876AA} .json-null{color:#808080} .json-key{color:#CC7832}";
    document.head.appendChild(style);

    render();
    console.log("JSON viewer loaded");
}, 1000);
