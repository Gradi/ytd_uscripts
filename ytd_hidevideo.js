// ==UserScript==
// @name         Youtube -- Hide video button.
// @namespace    http://tampermonkey.net/
// @version      2024-06-05
// @description  Add an easy to click button to hide YouTube video from recommended list.
// @author       KMaksim
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @match        https://www.youtube.com/
// @match        https://*.youtube.com/
// @match        https://youtu.be/
// @match        https://www.youtu.be/
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log('Youtube hide video button adder user script activated.');

    const attrName = 'e41c9ce94718402280d91bf19f9bd704';
    const attrValue = 'dd5b61ec57fa4cb5bda09c91097cc9f9';

    function getYtdPopupContainer() {
        return document
            .getElementsByTagName('body')?.[0]
            ?.getElementsByTagName('ytd-app')?.[0]
            ?.getElementsByTagName('ytd-popup-container')?.[0];
    }

    function onHideButtonClick(video, button) {
        const actionsMenu = video
                            ?.children[0]?.children[0]
                            ?.children[0]?.children[2]
                            ?.children[2]?.children[0]
                            ?.children[2]?.children[0];

        if (!actionsMenu) {
            console.log('Can\'t find action menu button for this video. Doing nothing.');
            return;
        }

        const maxAttempts = 10;
        const attemptRetryMs = 100;

        function tryClickButton(attempt) {
            if (attempt >= maxAttempts) {
                console.log('Could not click "Not interested" button.');
                return;
            }

            const notInterestedBtn = getYtdPopupContainer()
                              ?.children[1]?.children[0]
                              ?.children[0]?.children[0]
                              ?.children[5];

            if (notInterestedBtn) {
                notInterestedBtn.click();
                button.remove();
            }
            else {
                setTimeout(() => tryClickButton(attempt + 1), attemptRetryMs);
            }

        }
        actionsMenu.click();
        setTimeout(() => tryClickButton(0), attemptRetryMs);
    }

    function addStyles(element) {
        element.style.position = 'absolute';
        element.style.top = '0';
        element.style.left = '0';
        element.style.width = '25%';
        element.style.height = '25%';
        element.style.opacity = '75%';
        element.style.borderRadius = '10% 25%';
        element.style.fontSize = '2.5em';
    }

    function addHideButton(video) {
        if (!video.hasAttribute(attrName)) {
            const button = document.createElement('button');
            button.innerText = 'Hide';
            addStyles(button);
            button.addEventListener('click', function() { onHideButtonClick(video, button); });

            video.querySelector('#thumbnail').appendChild(button);
            video.setAttribute(attrName, attrValue);
        }
    }

    function findVideoThumbnails() {
        return document.querySelectorAll('#contents > ytd-rich-item-renderer');
    }

    function processCurrentPage() {
        for(const video of findVideoThumbnails()) {
            addHideButton(video);
        }
    }

    setInterval(processCurrentPage, 2000);
})();
