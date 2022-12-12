const regularExpression = RegExp(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/)

export const ValidateForm = (error ) => {
    let checkValidation = true;

    Object.values(error).forEach(val => {
        //debugger;
        if (val && typeof val ==='string' &&  val.length > 0) {
            checkValidation = false
            return false;
        } 
        else if (val && typeof val ==='number' &&  val <= 0) {
            checkValidation = false
            return false;
        }
    });    

    return checkValidation;
};