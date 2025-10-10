import bcryptjs from "bcryptjs";

export const passwordHashing = async (password) => {
    try {
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        return error;
    }
}

export const passwordComparison = async (password, hashedPassword) => {
    try {
        const isMatch = await bcryptjs.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        return error;
    }
}