import { useEffect, useState } from "react"


export default function useSearch(initialSearchString?: string) {

  const [search, setSearch] = useState(initialSearchString)

  useEffect(() => {
    let tmp = search?.toLocaleLowerCase()
    if (tmp !== search) {
      setSearch(tmp)
    }
  }, [search])

  const searchFilter = (item: any) => search?.length ? JSON.stringify(item).toLowerCase().includes(search) : true

  return { search, setSearch, searchFilter }
}
