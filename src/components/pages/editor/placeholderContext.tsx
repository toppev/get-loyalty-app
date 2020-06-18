import { useContext } from "react";
import AppContext from "../../../context/AppContext";

function usePlaceholderContext() {

    const appContext = useContext(AppContext);

    const values = {
        business: appContext.business.public
    }

    return { appContext, values }
}

export {
    usePlaceholderContext
}