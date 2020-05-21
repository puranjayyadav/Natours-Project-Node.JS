class APIFeatures{
    constructor(query,queryString){  //Function gets called everytime APIFeatures class is called
        this.query = query;
        this.queryString = queryString;
    }
    filter(){
  const queryObj = {...this.queryString}; //Using the apread operator to copy the query from postman and make a refrence of it in query object 
   const excludedFields = ['page','sort','limit','fields']; //Excluding the fields we don not want
    excludedFields.forEach(el => delete queryObj[el]); //Parsing through each refrenced method in the queryObj
    
   // 1B)Advaced filtering
    let queryStr = JSON.stringify(queryObj); //Using let so that we can have outside the block{}scope
   queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=>`$${match}`);

        this.query= this.query.find(JSON.parse(queryStr));
   //let query =  Tour.find(JSON.parse(queryStr)); //Converting the String to Object
    return this;
    }

    sort(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }else{
            this.query = this.query.sort('-createdAt');
        }
    return this;
    }
    limitFields(){
    if(this.queryString.fields){
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
    }else{
        this.query = this.query.select('-__v')
    }
    return this;
    }
    paginate(){
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page -1 ) * limit; 
    this.query = this.query.skip(skip).limit(limit);
     
   return this;
    }
}

module.exports = APIFeatures;