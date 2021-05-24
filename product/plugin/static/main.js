const hello = 'hiiii';

function grayscale(canvas) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < imageData.data.length; i += 4) {
        let avg =
            (imageData.data[i] +
                imageData.data[i + 1] +
                imageData.data[i + 2]) /
            3;

        imageData.data[i] = avg;
        imageData.data[i + 1] = avg;
        imageData.data[i + 2] = avg;
    }

    ctx.putImageData(imageData, 0, 0);
    console.log('grey');
}

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

                        root.querySelector(selector).style.cssText +=
                            formattedStyle;
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
                        applyCustomStyle(shadowRoot, config.style);
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

                templateClone
                    .getElementById('cancelModal')
                    .addEventListener('click', () => toggleModal());

                const uploadField = document.getElementById('imageUpload');
                // const imagePreview = templateClone.getElementById(
                //     'imagePreview',
                // );
                const canvas = templateClone.getElementById('imagePreview');
                const sendBtn = templateClone.getElementById('send-image');

                let payload = {};

                let transcoder = jpeg();

                let customSetting = templateClone
                    .getElementById('custom-preset-settings')
                    .querySelectorAll('[type="radio"]');

                console.log(customSetting[0].value);

                let qualitySettings = {
                    sampling: [4, 4, 4],
                    qualityLuma: 100,
                    qualityChroma: 100,
                };

                customSetting[0].addEventListener('checked', () => {
                    qualitySettings.sampling = [4, 4, 4];
                    transcoder
                        .encode(fileUrl, 100, 100, [4, 4, 4])
                        .then((x) => {
                            transcoder.decode(x, canvas);
                            console.log("Done! Preset: 'default'");
                        });
                });

                customSetting[1].addEventListener('checked', () => {
                    qualitySettings.sampling = [4, 2, 2];
                    transcoder
                        .encode(fileUrl, 100, 100, [4, 2, 2])
                        .then((x) => {
                            transcoder.decode(x, canvas);
                            console.log("Done! Preset: 'default'");
                        });
                });

                customSetting[2].addEventListener('checked', () => {
                    qualitySettings.sampling = [4, 2, 1];
                    transcoder
                        .encode(fileUrl, 100, 100, [4, 2, 1])
                        .then((x) => {
                            transcoder.decode(x, canvas);
                            console.log("Done! Preset: 'default'");
                        });
                });

                sendBtn.addEventListener('click', () => {
                    config.onSend(payload);

                    transcoder.close();
                    toggleModal();
                });

                let presetOptions = templateClone.getElementById('compSelect');
                const qualityConfig = {
                    preset: 'default',
                };

                const image = new Image();

                const optionsWrapper = templateClone.querySelector(
                    '[class="options-wrapper"]',
                );

                //let ctx = canvas.getContext("2d");

                presetOptions.addEventListener('change', (ev) => {
                    let value = ev.target.value;
                    qualityConfig.preset = value;
                    console.log(qualityConfig.preset);
                    ev.preventDefault();

                    let fileUrl = window.URL.createObjectURL(
                        uploadField.files[0],
                    );

                    switch (qualityConfig.preset) {
                        case 'high':
                            {
                                transcoder
                                    .encode(fileUrl, 100, 50, [4, 4, 4])
                                    .then((x) => {
                                        transcoder.decode(x, canvas);
                                        console.log("Done! Preset: 'high'");
                                    });
                                optionsWrapper.style.width = 0;
                            }
                            break;
                        case 'medium':
                            {
                                transcoder
                                    .encode(fileUrl, 100, 100, [4, 2, 2])
                                    .then((x) => {
                                        transcoder.decode(x, canvas);
                                        console.log("Done! Preset: 'medium'");
                                    });
                                optionsWrapper.style.width = 0;
                            }
                            break;
                        case 'low':
                            {
                                transcoder
                                    .encode(fileUrl, 50, 25, [4, 2, 0])
                                    .then((x) => {
                                        transcoder.decode(x, canvas);
                                        console.log("Done! Preset: 'low'");
                                    });
                                optionsWrapper.style.width = 0;
                            }
                            break;
                        case 'custom':
                            {
                                transcoder
                                    .encode(fileUrl, 10, 10, [4, 4, 1])
                                    .then((x) => {
                                        transcoder.decode(x, canvas);
                                        console.log("Done! Preset: 'custom'");
                                    });
                                optionsWrapper.style.width = '100%';
                            }
                            break;
                        default:
                            {
                                transcoder
                                    .encode(fileUrl, 100, 100, [4, 2, 0])
                                    .then((x) => {
                                        transcoder.decode(x, canvas);
                                        console.log("Done! Preset: 'default'");
                                    });
                                optionsWrapper.style.width = 0;
                            }
                            break;
                    }
                });

                uploadField.removeEventListener('change', () => {});
                uploadField.addEventListener('change', () => {
                    const file = uploadField.files[0];
                    let fileUrl = window.URL.createObjectURL(file);
                    /* 2^10 = 1024,
                       2^20 = 2^10 * 2^10 = ~1000 * ~1000 ~= 1.000.000*/
                    const fileSize =
                        file.size / Math.pow(2, 20); /* Get file size in MB */
                    if (fileSize >= 0) {
                        toggleModal();

                        //const ctx = canvas.getContext('2d');
                        //const gpu = new GPU({ canvas });

                        image.onload = () => {
                            canvas.width = image.width;
                            canvas.height = image.height;

                            transcoder
                                .encode(fileUrl, 100, 100, [4, 2, 1])
                                .then((x) => {
                                    transcoder.decode(x, canvas);

                                    payload = x;
                                });
                            optionsWrapper.style.width = 0;
                        };

                        image.crossOrigin = 'anonymous';
                        image.src = window.URL.createObjectURL(file);
                    } else {
                        /* send the image */
                    }
                });
                //const upfile = templateClone.getElementById('upfile');
                //const preview = templateClone.getElementById('imageUpload');
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
