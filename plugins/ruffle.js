(function() {
    const scriptloaderscripttmpruffleScript = document.createElement('script');
    scriptloaderscripttmpruffleScript.src = 'https://unpkg.com/@ruffle-rs/ruffle';
    scriptloaderscripttmpruffleScript.onload = () => {
        const ruffle = window.RufflePlayer.new();
        window.addEventListener('load', () => {
            const flashObjects = document.querySelectorAll('object[type="application/x-shockwave-flash"], embed[type="application/x-shockwave-flash"]');
            flashObjects.forEach(obj => {
                const ruffleContainer = document.createElement('div');
                ruffleContainer.style.width = obj.width + 'px';
                ruffleContainer.style.height = obj.height + 'px';
                obj.parentNode.replaceChild(ruffleContainer, obj);

                ruffle.load(obj.getAttribute('data')).then(instance => {
                    instance.appendChild(ruffleContainer);
                });
            });
        });
    };
    document.head.appendChild(scriptloaderscripttmpruffleScript);
})();
