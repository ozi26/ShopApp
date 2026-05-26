import mongoose from 'mongoose';
import { UserDoc , UserModel , AuthenticationService  } from '@mainshopapp/common';


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
            // This function is called when the document is converted to JSON (e.g., when sending a response). it does the following:
            // 1. It creates a new property id and assigns it the value of _id.
            // 2. It removes the _id property from the JSON output.
            // 3. It removes the __v property, which is used by Mongoose for versioning.
            // 4. It removes the password property to ensure that sensitive information is not exposed in the API response.
            transform(ret) {
            (ret as any).id = (ret as any)._id;
            delete (ret as any)._id;
            delete (ret as any).__v;
            delete (ret as any).password;
        }
    }
});

userSchema.pre('save', async function () {
    const authService = new AuthenticationService();
    if (this.isModified('password')) {
        const hashed = await authService.pwdToHash(this.get('password'));
        this.set('password', hashed);
    }
});

export const User = mongoose.model<UserDoc, UserModel>('User', userSchema);