import { useMediaQuery } from "react-responsive"

export default function useIsMobile() {
  return useMediaQuery({ query: '(max-width: 1224px)' })
}
