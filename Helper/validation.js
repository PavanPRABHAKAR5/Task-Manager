const fs = require('fs')

function inputValidation(postData){
    if((postData.hasOwnProperty('title') && postData.title.trim() !=="")&& (postData.hasOwnProperty('description') && postData.description.trim()!=="") 
    && (postData.hasOwnProperty('completed') && typeof postData.completed == 'boolean') ){
        // if(postData.title || postData.description && postData.completed  && typeof postData.completed == 'boolean'){
        return {
            status:true,
            message:"Validation success"
        }   
    }else{
        return {
            status:false,
            message:"Validation failed"
        }  
    }

}

module.exports = inputValidation;