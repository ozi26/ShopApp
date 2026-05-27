import { ProductModel , uploadDir } from "@mainshopapp/common";
import { Product } from "./product.model";
import { CreateProductDTO , DeleteProductDTO, UpdateProductDTO, AddImagesDTO, DeleteImagesDTO } from '../dtos/product.dto' 
import fs from 'fs'
import path from 'path'

export class ProductService {
    constructor(public productModel: ProductModel) {}

    async getOneById(productId: string) {
        return await this.productModel.findById(productId)
    }

    async create(createProductDto: CreateProductDTO) {
        const images = this.generateProductImages(createProductDto.files);
        const product = new this.productModel({
            title: createProductDto.title,
            price: createProductDto.price,
            user: createProductDto.userId,
            images: images
        })

        return await product.save()
    }

    async updateProduct(updateProductDto: UpdateProductDTO) {
        return await this.productModel.findOneAndUpdate({ _id: updateProductDto.productId },
            { $set: { title: updateProductDto.title, price: updateProductDto.price } }, { new: true })
    }

    async deleteProduct(deleteProductDto: DeleteProductDTO) {
        return await this.productModel.findOneAndRemove({ _id: deleteProductDto.productId })
    }

    async addImages(addImagesDto: AddImagesDTO) {
        const images = this.generateProductImages(addImagesDto.files);
        return await this.productModel.findOneAndUpdate({ _id: addImagesDto.productId }, 
            { $push: { images: { $each: images }  } }, { new: true })
    }

    async deleteImages(deleteImagesDto: DeleteImagesDTO) {
        return await this.productModel.findOneAndUpdate({ _id: deleteImagesDto.productId },
            { $pull: { images: { _id: { $in: deleteImagesDto.imagesIds } } } }, { new: true })
    }

    generateBase64Url(contentType: string, buffer: Buffer) {
        return `data:${contentType};base64,${buffer.toString('base64')}`
    }

    generateProductImages(files: CreateProductDTO['files']): Array<{ src: string }> {
        let images: Array<Express.Multer.File>;

        if(typeof files === "object") {
            images = Object.values(files).flat()
        } else {
            images = files ? [...files] : []
        }

        return images.map((file: Express.Multer.File) => {
            let srcObj = { src: this.generateBase64Url(file.mimetype, fs.readFileSync(path.join(uploadDir + file.filename))) }
            fs.unlink(path.join(uploadDir + file.filename ), () => {})
            return srcObj
        })
    }
}

export const productService = new ProductService(Product)
