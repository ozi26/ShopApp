import { Router, Response, Request, NextFunction } from 'express'
import { requireAuth, CustomError, BadRequestError } from '@mainshopapp/common'
import { buyerService } from './buyer.service'

const router = Router()

router.post('/cart/add', requireAuth as any, async (req: Request, res: Response, next: NextFunction) => {
    const { productId, quantity } = req.body;

    const result = await buyerService.addProductToCart({ productId, quantity, userId: req.currentUser!.userId  })

    if( result instanceof CustomError || 
        result instanceof Error) return next(result);

    req.session = { ...req.session, cartId: result._id }

    res.status(200).send(result)
})  


router.post('/cart/:cartId/product/:id/update-quantity', async (req: Request, res: Response, next: NextFunction) => {
    const { amount } = req.body;
    const { cartId, id: productId } = req.params

    // Validate that both IDs exist and are strings
    if (!cartId || Array.isArray(cartId)) {
        return next(new BadRequestError('Invalid cart ID'));
    }
    
    if (!productId || Array.isArray(productId)) {
        return next(new BadRequestError('Invalid product ID'));
    }

    const inc = req.body.inc === "true" ? true : req.body.inc === "false" ? false : null;
    if(inc === null) return next(new BadRequestError('inc should be either true or false'))

    const result = await buyerService.updateCartProductQuantity({ cartId, productId, options: { amount, inc } }) 

    if(result instanceof CustomError ||
        result instanceof Error) return next(result);

    res.status(200).send(result)
})

router.post('/cart/delete/product' , async (req: Request, res: Response, next: NextFunction) => {
    const { cartId, productId } = req.body;
    
    const result = await buyerService.removeProductFromCart({ cartId, productId });

    if(result instanceof CustomError ||
        result instanceof Error) return next(result);
    
    res.status(200).send(result)
})

router.post('/get/cart/', async (req: Request, res: Response, next: NextFunction) => {
    const cartId = req.body.cartId
    if(!cartId) return next(new BadRequestError('cartId is required!'))
    console.log(req.currentUser)

    const result = await buyerService.getCart(cartId, req.currentUser!.userId);

    if(result instanceof CustomError ||
        result instanceof Error) return next(result);

    res.status(200).send(result);
});

router.post('/payment/checkout/', async (req: Request, res: Response, next: NextFunction) => {
    const { cardToken } = req.body;

    const result = await buyerService.checkout(req.currentUser!.userId, cardToken, req.currentUser!.email);

    if(result instanceof CustomError) return next(result);

    res.status(200).json({ charge_id: result.id });
})

router.post('/payment/card/update', async (req: Request, res: Response, next: NextFunction) => {
    const { cardToken } = req.body

    const result: any = await buyerService.updateCustomerStripeCard(req.currentUser!.userId, cardToken)

    if(result instanceof CustomError ||
        result instanceof Error) return next(result);

    res.status(200).send(result)

})

export { router as buyerRouters }