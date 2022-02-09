import { useEffect, useState } from "react"


export function useIsMounted() {

  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    if (!mounted) setMounted(true)
    return () => setMounted(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    isMounted: mounted
  }

}
