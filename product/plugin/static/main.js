const initPlugin = (config) => {
    const define = (html) => {
        class MyComponent extends HTMLElement {
            constructor() {
                super();

                function jss(root) {
                    root.querySelector('#modal div').style.backgroundColor =
                        'lightblue';

                    root.querySelector('.image-wrapper').style.backgroundColor =
                        'green';
                }

                function applyCustomStyle(root, customStyleObject) {
                    const selectors = Object.keys(customStyleObject);

                    for (let selector of selectors) {
                        const selectorStyle = customStyleObject[selector];
                        let formattedStyle = '';
                        for (let [key, val] of Object.entries(selectorStyle)) {
                            formattedStyle += `${key}:${val};`;
                        }

                        root.querySelector(
                            selector,
                        ).style.cssText += formattedStyle;
                    }
                }

                let obj = {
                    a: 2,
                    b: 7,
                    c: -23,
                };

                const shadowRoot = this.attachShadow({ mode: 'open' });

                // Temporary wrapper element to extract fetched template.
                let tempElem = document.createElement('div');
                tempElem.innerHTML = html;

                let templateClone = tempElem.firstChild.content.cloneNode(true);

                // Get the elements we want.
                let modal = templateClone.getElementById('modal');
                let toggle = templateClone.getElementById('toggle');

                // Append toggle button to DOM.
                shadowRoot.appendChild(toggle);
                let toggleModal = () => {
                    if (shadowRoot.querySelector('#modal') != null) {
                        shadowRoot.removeChild(modal);
                    } else {
                        shadowRoot.appendChild(modal);
                        shadowRoot.querySelector('#modal').focus();
                        applyCustomStyle(shadowRoot, config);
                    }
                };

                // Open/close modal (Add or remove).
                toggle.addEventListener('click', () => {
                    toggleModal();
                });

                document.addEventListener('keydown', (ev) => {
                    if (ev.key === 'Escape') {
                        toggleModal();
                    }

                    document.removeEventListener('keydown', () => {});
                });

                const uploadField = document.getElementById('imageUpload');
                const imagePreview = templateClone.getElementById(
                    'imagePreview',
                );
                uploadField.removeEventListener('change', () => {});
                uploadField.addEventListener('change', () => {
                    const file = uploadField.files[0];
                    /* 2^10 = 1024,
					   2^20 = 2^10 * 2^10 = ~1000 * ~1000 ~= 1.000.000*/
                    const fileSize =
                        file.size / Math.pow(2, 20); /* Get file size in MB */
                    if (fileSize >= 0) {
                        toggleModal();

                        console.log(imagePreview);
                        imagePreview.src = window.URL.createObjectURL(file);
                    } else {
                        /* send the image */
                    }
                });
                //const upfile = templateClone.getElementById('upfile');
                const preview = templateClone.getElementById('imageUpload');
            }
        }

        customElements.define('plugin-modal', MyComponent);
    };

    fetch('plugin/plugin.html')
        .then((stream) => stream.text())
        .then((text) => {
            define(text);
        });

    return config;
};
