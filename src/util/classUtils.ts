/**
 * Recursively check if the element or any of its parents has the given classname
 */
function someParentHasClassname(element: any, classname: string): boolean {
    return element.className?.split(' ').indexOf(classname) >= 0 ||
        (element.parentNode && someParentHasClassname(element.parentNode, classname))
}

export {
    someParentHasClassname
}