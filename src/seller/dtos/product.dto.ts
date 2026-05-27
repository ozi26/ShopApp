import { Request } from 'express';

export interface CreateProductDTO { 
    title: string;
    price: number;
    userId: string;
    files: Request['files'];
}

export interface UpdateProductDTO {
    userId: string;
    productId: string;
    title: string;
    price: number;
}

export interface DeleteProductDTO {
    userId: string;
    productId: string;
}

export interface AddImagesDTO {
    userId: string;
    productId: string;
    files: Request['files'];
}

export interface DeleteImagesDTO {
    userId: string;
    productId: string;
    imagesIds: string[];
}

