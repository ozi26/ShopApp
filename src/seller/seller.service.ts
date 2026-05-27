import { ProductService, productService } from "./product/product.service";
import { CreateProductDTO, UpdateProductDTO, DeleteProductDTO, AddImagesDTO, DeleteImagesDTO } from './dtos/product.dto'
import { BadRequestError, NotAuthorizedError, } from '@mainshopapp/common'

export class SellerService {
    constructor(
        public productService: ProductService
    ) {}

    async addProduct(createProductDto: CreateProductDTO) {
        return await this.productService.create(createProductDto)
    }

    async updateProduct(updateProductDto: UpdateProductDTO){
        const product = await this.productService.getOneById(updateProductDto.productId);
        if(!product) return new BadRequestError('product not found!')
        if(product.user.toString() !== updateProductDto.userId){
            return new NotAuthorizedError()
        }

        return await this.productService.updateProduct(updateProductDto);
    }

    async deleteProduct(deleteProductDto: DeleteProductDTO) {
        const product = await this.productService.getOneById(deleteProductDto.productId);
        if(!product) return new BadRequestError('product not found!');
        if(product.user.toString() !== deleteProductDto.userId){
            return new NotAuthorizedError()
        }

        return await this.productService.deleteProduct(deleteProductDto)
    }

    async addProductImages(addImagesDto: AddImagesDTO) {
        const product = await this.productService.getOneById(addImagesDto.productId);
        if(!product) return new BadRequestError('product not found!');
        if(product.user.toString() !== addImagesDto.userId){
            return new NotAuthorizedError()
        }

        return await this.productService.addImages(addImagesDto)
    }

    async deleteProductImages(deleteImagesDto: DeleteImagesDTO) {
        const product = await this.productService.getOneById(deleteImagesDto.productId);
        if(!product) return new BadRequestError('product not found!');
        if(product.user.toString() !== deleteImagesDto.userId){
            return new NotAuthorizedError()
        }

        return await this.productService.deleteImages(deleteImagesDto)
    }
}

export const sellerService = new SellerService(productService)