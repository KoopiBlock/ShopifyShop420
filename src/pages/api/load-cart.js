import { postToShopify } from '../../utils/shopify';


export default async function handler(_req, res) {

    //IMPOTRANT!

    // eather nextjs or postman do some buggy shit and retrun the id with gid:/ instead of gid://
    // check here if cartId returns something else throught our own api, slice would needed to be altere

    const { cartId } = _req.query
    
    const cartNum = cartId.slice(19)
    const  realCartId  = `gid://shopify/Cart/${cartNum}`


    console.log ( realCartId )
    console.log(cartNum)


    const data = await postToShopify({
        query: `
        query GetCart($realCartId: ID!) {
          cart(id: $realCartId) {
            checkoutUrl
            estimatedCost {
              totalAmount {
                amount
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  estimatedCost {
                    subtotalAmount {
                      amount
                      currencyCode
                    }
                    totalAmount {
                      amount
                      currencyCode
                    }
                  }
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      product {
                        title

                       	images(first: 1) {
                					edges {
                  					node {
                    					url
                    					altText
                              }
                            }
                          }
                      }
                      priceV2 {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
        }
        `,
        variables: { realCartId },
      });

      console.log('hello there',data)
      console.log('hello there2',realCartId)
    
    
    res.status(200).json({ body: data, query: cartId});
    
}


/*
      query GetCart($cartId: ID!) {
        cart(id: $cartId) {
          checkoutUrl
          estimatedCost {
            totalAmount {
              amount
            }
          }
          lines(first: 100) {
            edges {
              node {
                quantity
                estimatedCost {
                  subtotalAmount {
                    amount
                    currencyCode
                  }
                  totalAmount {
                    amount
                    currencyCode
                  }
                }
                merchandise {
                  ... on ProductVariant {
                    title
                    product {
                      title
                    }
                    priceV2 {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
*/