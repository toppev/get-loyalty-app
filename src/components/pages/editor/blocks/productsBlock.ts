const productsClass = "loyalty-products-list"
const productItemClass = "loyalty-product"

// "categories" property is not (yet) used

function addProductsBlock(blockManager: any) {
    blockManager.add(productsClass, {
        label: `Products`,
        content: (`
            <div class="${productsClass}" style="text-align: center">
                <h2>
                    <b>Products</b> ({{products.length}})
                </h2>
                <p>{{#each products}}</p>
                <div class="${productItemClass}">
                    <h3>{{name}}</h3>
                    <p>{{#each images}}</p>
                        <img src="{{this}}" width="100%" style="display: block; margin-left: auto; margin-right: auto;">
                    <p>{{/each}}</p>
                    <p>{{description}}</p>
                    <p>{{price}}</p>
                    <br/>
                </div>
                <p>{{/each}}</p>
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