export default interface RequestError {
    /**
     * Message to display
     */
    message?: string
    /**
     * Detailed error
     */
    error?: any
    /**
     * Callback to call to retry the
     */
    retry?: () => any

    clearError?: () => any
}