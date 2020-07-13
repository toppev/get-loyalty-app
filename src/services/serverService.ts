import { get, post, SERVER_API_URL, setAPI_URL } from "../config/axios";
import { ServerSettings } from "../components/settings/SettingsPage";

/**
 * Also updates the API_URL
 */
async function getOrCreateServer(email: string, create: boolean) {
    const res = await post(`${SERVER_API_URL}/get_or_create/?create=${create}`, { email: email }, true)
    setAPI_URL(res.data.publicAddress)
    return { created: res.status === 201, ...res };
}

/**
 * Ping the server until it responds.
 */
function waitForServer(callback: () => any) {

    const sendRequest = () => {
        setTimeout(() => {
            get('/ping')
                .then(callback)
                .catch(sendRequest)
        }, 1000)
    }

    sendRequest()

}

function updateServer(data: ServerSettings) {
    return post(SERVER_API_URL + '/update', data, true)
}

export {
    getOrCreateServer,
    waitForServer,
    updateServer
}