import { Router, Response, Request, NextFunction } from "express";
import { BadRequestError, Uploader, UploaderMiddlewareOptions, requireAuth , CustomError } from "@mainshopapp/common";
import { sellerService } from './seller.service';


const uploader = new Uploader();

const middlewareOptions: UploaderMiddlewareOptions = {
    types: ['image/png', 'image/jpeg'],
    fieldName: 'image'
}

const multipeFilesMiddleware = uploader.uploadMultipleFiles(middlewareOptions);

const router = Router()

router.post('/product/new', requireAuth as any,  multipeFilesMiddleware as any , async (req: Request, res: Response, next: NextFunction) => {
    const { title, price } = req.body;

    if (!req.files || req.files.length === 0) return next(new BadRequestError('images are required'));

    if (req.uploaderError) return next(new BadRequestError(req.uploaderError.message));

    const product = await sellerService.addProduct({
        title,
        price,
        userId: req.currentUser!.userId,
        files: req.files,
    });

    res.status(201).send(product);
});



router.post('/product/:id/update', requireAuth as any ,async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // Validate that id exists and is a string
    if (!id || Array.isArray(id)) {
        return next(new BadRequestError('Invalid product ID'));
    }

    const { title, price } = req.body;

    const result = await sellerService.updateProduct({ title, price, userId: req.currentUser!.userId, productId: id })

    if(result instanceof CustomError ) return next(result);

    res.status(200).send(result)
} )

router.delete("/product/:id/delete", requireAuth as any, async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // Validate that id exists and is a string
    if (!id || Array.isArray(id)) {
         return next(new BadRequestError('Invalid product ID'));
    }

    const result = await sellerService.deleteProduct({ productId: id, userId: req.currentUser!.userId })
    if(result instanceof CustomError ) return next(result);

    res.status(200).send(true)
})

router.post("/product/:id/add-images", requireAuth as any, multipeFilesMiddleware as any, async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    // Validate that id exists and is a string
    if (!id || Array.isArray(id)) {
        return next(new BadRequestError('Invalid product ID'));
    }

    if(!req.files) return next(new BadRequestError('images are required'))

    if(req.uploaderError) return next(new BadRequestError(req.uploaderError.message));
    
    const result = await sellerService.addProductImages({ productId: id, userId: req.currentUser!.userId, files: req.files })
    if(result instanceof CustomError ) return next(result);

    res.status(200).send(result)
})

router.post('/product/:id/delete-images', requireAuth as any, async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // Validate that id exists and is a string
    if (!id || Array.isArray(id)) {
        return next(new BadRequestError('Invalid product ID'));
    }

    const { imagesIds } = req.body
    const result = await sellerService.deleteProductImages({ productId: id, userId: req.currentUser!.userId, imagesIds  })

    if(result instanceof CustomError ) return next(result);

    res.status(200).send(result)
})



export { router as sellerRouters }
