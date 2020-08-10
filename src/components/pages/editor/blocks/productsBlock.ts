const productsClass = "loyalty-products-list"
const productItemClass = "loyalty-product"

// "categories" property is not (yet) used

function addProductsBlock(blockManager: any) {
    blockManager.add(productsClass, {
        label: `Products`,
        content: (`
            <div class="${productsClass}">
                <h2>Products</h2>
                {{#each products}}
                <div class="${productItemClass}">
                    <h3>{{name}}</h3>
                    {{#each images}}
                        <img src="{{this}}" width="100%" style="display: block; margin-left: auto; margin-right: auto;">
                    {{/each}}
                    <p>{{description}}</p>
                    <p>{{price}}</p>
                    <br/>
                </div>
                {{/each}}
            </div>
            `
        ),
    });
}

export {
    productsClass,
    productItemClass,
    addProductsBlock
}