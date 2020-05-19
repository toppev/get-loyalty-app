export default interface RequestError {
    /**
     * Message to display
     */
    message?: string
    /**
     * Detailed error
     */
    error?: Error
    /**
     * Callback to call to retry the
     */
    retry?: () => any

    clearError?: () => any
}