import { get, post, SERVER_API_URL, setBackendUrl } from "../config/axios";
import { ServerSettings } from "../components/settings/SettingsPage";

/**
 * Also updates the backendUrl
 */
async function getOrCreateServer(data: { email: string, token?: string }, create: boolean) {
    if (process.env.NODE_ENV === "development") {
        return { created: true }
    }

    const res = await post(`${SERVER_API_URL}/server/get_or_create/?create=${create}`, data, true)
    const deleted = res.data.serverDeleted
    if (deleted) {
        throw new Error(typeof deleted == "string" ?
            deleted : 'Seems like your data was deleted. Perhaps your plan expired?' +
            'Please be in contact if you would like to restore and upgrade your plan.')
    }
    setBackendUrl(res.data.apiendpoint)
    return { created: res.status === 201, ...res };
}

function updateServer(data: ServerSettings) {
    return post(`${SERVER_API_URL}/server/update`, data, true)
}

function updateServerOwner(data: { email: string, updated: { email: string } }) {
    return post(`${SERVER_API_URL}/user/update`, data, true)
}


/**
 * Ping the server until it responds.
 */
function waitForServer(callback: () => any) {

    const sendRequest = () => {
        setTimeout(() => {
            get('/ping')
                .then(callback)
                .catch(() => setTimeout(sendRequest, 5000))
        }, 500)
    }

    sendRequest()

}

export {
    getOrCreateServer,
    updateServer,
    updateServerOwner,
    waitForServer
}