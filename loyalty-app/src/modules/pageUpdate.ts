/**
 * This hook will make sure the page stays somewhat up to date
 */
export function usePageUpdates(refreshPages: () => any) {

  setTimeout(() => {
    // Can be improved in the future, enough good for now
    refreshPages()
  }, 1000 * 60 * 5)

}
