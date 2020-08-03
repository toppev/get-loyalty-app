import { get, post, SERVER_API_URL, setBackendUrl } from "../config/axios";
import { ServerSettings } from "../components/settings/SettingsPage";

/**
 * Also updates the backendUrl
 */
async function getOrCreateServer(email: string, create: boolean) {
    const res = await post(`${SERVER_API_URL}/server/get_or_create/?create=${create}`, { email: email }, true)
    const deleted = res.data.serverDeleted
    if (deleted) {
        throw new Error(typeof deleted == "string" ?
            deleted : 'Seems like your data was deleted. Perhaps your plan expired?' +
            'Please be in contact if you would like to restore and upgrade your plan.')
    }
    setBackendUrl(res.data.publicAddress)
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
                .catch(() => setTimeout(sendRequest, 2000))
        }, 1000)
    }

    setTimeout(sendRequest, 200)

}

function updateServer(data: ServerSettings) {
    return post(`${SERVER_API_URL}/server/update`, data, true)
}

function updateServerOwner(data: { email: string, updated: { email: string } }) {
    return post(`${SERVER_API_URL}/user/update`, data, true)
}

export {
    getOrCreateServer,
    waitForServer,
    updateServer,
    updateServerOwner
}