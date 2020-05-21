const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40 ,'A tour name must have less or equal than 40 characters'],
        minlength: [10 , 'A tour must have more than 10 characters'],
       // validate: [validator.isAlpha,'Tour name must only contain characters']
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true ,' A tour must have a tour size']
    },
    difficulty: {
        type : String,
        required: [true ,'A tour must have a difficulty'],
        enum: {
            values:['easy' ,'medium','difficult'],
            message: 'Difficulty is either medium, difficult'
        }
    },

    ratingsAverage: {
        type: Number,
        default:4.5,
        min: [1, 'Ratings must be above 1.0'],
        max: [5, 'Ratings must be below 5.0'],
        set: val => Math.round(val *10 )/10 //Setter function that runs everytime ratings average is called

    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true,'A tour must have a price']
    },
   priceDiscount:{
        type: Number,
        validate:{
            //this only points to current doc on NEW document creation
            validator:  function(val){
                return val< this.price; 
            },
            message: 'discount price ({VALUE}) should be less than the regular price'
        }
    } ,
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
    },
    description:{
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        //GeoJSON
        type:{
     type:String,
     default: 'Point',
     enum:['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
        guides: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            }          //Expect the type of each element to be of the mongo db in the document     
        ],
    },
    {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
    }
);

tourSchema.index({price: 1 , ratingsAverage : -1});
tourSchema.index({slug: 1});
tourSchema.index({startLocation: '2dsphere'});
tourSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7;
});
//Virtual populate
tourSchema.virtual('reviews' ,{
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
});
//DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save' ,function(next){ //IN this middleware we have access to the currently processed document 
this.slug = slugify(this.name,{lower: true});
next();
});

tourSchema.pre(/^find/ , function(next){

    this.populate({   //This points to the curent query
        path: 'guides',
        select: '-__v -passwordChangedAt'
    });
    next();
})
// tourSchema.pre('save', async function(next){
//     const guidesPromises = this.guides.map(async id=> await User.findById(id));
//   this.guides =   await Promise.all(guidesPromises);
// });

//tourSchema.pre('save',function(next){
  //  console.log('Will save document....');
    //next();
//})
//tourSchema.post('save' , function(doc,next){
  //  console.log(doc);
    //next();
//})

//QUERY middleware

tourSchema.pre(/^find/, function(next){ //Using regular expressions to tell the middleware that all find methods should be considered
    this.find({ secretTour: {$ne: true}});
    this.start = Date.now();                            //This keyword points to the current query unlike the pre middleware in save which pointed to the current document which is being processed
    next();                     
});

tourSchema.post(/^find/ ,function(docs ,next){
    console.log(`Query Took ${Date.now()-this.start} milliseconds!`);
   // console.log(docs);                                                    //Causing the docs to be logged in the console
    next();
})


//Aggregation middleware
// tourSchema.pre('aggregate',function(next){
//     this.pipeline().unshift({$match:{secretTour:{$ne:true}}});
//     console.log(this.pipeline());
//     next();
// })
const Tour = mongoose.model('Tour', tourSchema);


module.exports =Tour;