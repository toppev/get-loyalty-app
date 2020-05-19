import { useState } from "react";


export default function useSearch<T>(initialSearchString?: string) {

    const [search, setSearch] = useState(initialSearchString);

    const searchFilter = (item: any) => search?.length ? JSON.stringify(item).toLowerCase().includes(search) : true;

    return { search, setSearch, searchFilter }
}