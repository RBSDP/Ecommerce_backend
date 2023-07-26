class CustomError extends Error {
    constructor(message, code){
        super(message);
        this.code = code 
    }
}
// learn about error class in js mdn

export default CustomError