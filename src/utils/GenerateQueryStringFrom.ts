const generateQueryStringFrom = obj =>
    Object.keys(obj).map(
        (key,idx) =>{
            if(idx === 0){
                return `${key}=${obj[key]}`;
            }
            return `&${key}=${obj[key]}`;
        }).join('');

export default generateQueryStringFrom