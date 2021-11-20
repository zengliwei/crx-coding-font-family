const getCurrentTab = async function () {
    return new Promise(function (resolve) {
        window['chrome']['tabs']['query']({active: true, currentWindow: true}, function (tabs) {
            resolve(tabs[0]);
        });
    });
};

const sendMessage = async function (tab, message) {
    return new Promise(function (resolve) {
        window['chrome']['tabs']['sendMessage'](tab.id, message, function (response) {
            resolve(response);
        });
    });
};

const executeContentScript = async function (command, params) {
    return await sendMessage(await getCurrentTab(), {
        command: command,
        params: params
    });
};

const getFormData = function (form) {
    let data = {};

    let inputElements = form.getElementsByTagName('input');
    for (let i = 0; i < inputElements.length; i++) {
        switch (inputElements[i].type) {
            case 'hidden':
            case 'password':
            case 'text':
                data[inputElements[i].name] = inputElements[i].value;
                break;

            case 'radio':
                if (inputElements[i].checked) {
                    data[inputElements[i].name] = inputElements[i].value;
                }
                break;

            case 'checkbox':
                if (inputElements[i].checked) {
                    if (data[inputElements[i].name] === undefined) {
                        data[inputElements[i].name] = [];
                    }
                    data[inputElements[i].name].push(inputElements[i].value);
                }
                break;
        }
    }

    let selectElements = form.getElementsByTagName('select');
    for (let i = 0; i < selectElements.length; i++) {
        data[inputElements[i].name] = inputElements[i].value;
    }

    let textareaElements = form.getElementsByTagName('textarea');
    for (let i = 0; i < textareaElements.length; i++) {
        data[inputElements[i].name] = inputElements[i].value;
    }

    return data;
};

(async function () {
    let location = await executeContentScript('getLocation'),
        storageKey = 'my-font-family-selector::' + location.host + location.pathname,
        query = {};

    query[storageKey] = null;
    window['chrome']['storage']['local'].get(query, function (result) {
        const selector = result[storageKey];
        if (selector) {
            document.getElementById('selector').value = selector;
        }
    });
})();

document.getElementById('form').onsubmit = function (evt) {
    (async function () {
        await executeContentScript('updateSelector', [getFormData(evt.target)['selector']]);
    })();
    return false;
};
