"use strict"

class utils{
    
    parseTags(texto){
        let etiquetas = texto.trim().split("@").filter(aux => aux !== "" );

        if(etiquetas.length > 5){
            return {tags: null};
        }
    
        return {tags: etiquetas};
    }
}


module.exports = utils;
