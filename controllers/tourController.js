// const Tour = require('./../models/tourModel');
// const APIFeatures = require('./../utils/apiFeatures');
// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');


// exports.aliasTopTours = (req,res,next)=>{
// req.query.limit = '5';
// req.query.sort= '-ratingsAverage,price';
// req.query.fields ='name,price,ratingsAverage,summary,difficulty';
// next();
// };

// //const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// //MiddleWare to check ID and automatically sideLine Them


     
// exports.getAllTours = catchAsync(async(req,res,next) =>{

//     console.log(req.query);

//     //BUILD THE QUERY
//     //1A) filtering
//   //  const queryObj = {...req.query}; //Using the apread operator to copy the query from postman and make a refrence of it in query object 
//   //  const excludedFields = ['page','sort','limit','fields']; //Excluding the fields we don not want
//    // excludedFields.forEach(el => delete queryObj[el]); //Parsing through each refrenced method in the queryObj
    
//     //1B)Advaced filtering
//   //  let queryStr = JSON.stringify(queryObj); //Using let so that we can have outside the block{}scope
//   //  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=>`$${match}`);


//   //  let query =  Tour.find(JSON.parse(queryStr));//Converting the String to Object
    
//     //2) Sorting
//     //if(req.query.sort){
//    //     const sortBy = req.query.sort.split(',').join(' ');
//      //   query = query.sort(sortBy);
//    // }else{
//     //    query = query.sort('-createdAt');
//    // }

//     //3)Field Limiting
//    // if(req.query.fields){
//      //   const fields = req.query.fields.split(',').join(' ');
//        // query = query.select(fields);
//    // }else{
//      //   query = query.select('-__v')
//     //}

//         // 4)Pagination
//        // const page = req.query.page * 1 || 1;
//        // const limit = req.query.limit * 1 || 100;
//         //const skip = (page -1 ) * limit; 
//         //query = query.skip(skip).limit(limit);
         
//         //if(req.query.page){
//           //  const numTours = await Tour.countDocuments();
//             //if(skip >= numTours) throw new Error('This page does not exist');
//         //}
     
//     //EXECUTE THE QUERY
//     const features = new APIFeatures(Tour.find(),req.query).filter().sort().limitFields().paginate();
//     const tours = await features.query;

//     //SEND RESPONSE
//     res.status(200).json({
//         status: 'success',
//        results: tours.length,
//         data: {
//             tours
//         }


//     });
// });


  

// exports.createTour = catchAsync(async (req,res,next) =>{

//     const newTour = await Tour.create(req.body )
//     res.status(201).json({
//          status: 'success',
//         data: {
//            tour: newTour
//        }
//      });
//     });

// exports.updateTour = catchAsync(async (req,res,next) => {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body,  {
//          new: true,
//          runValidators: true
//      });

//      if(!tour){
//         return next(new AppError('No tour found with that ID',404))
//      }
//     res.status(200).json({
//         status: 'Success',
//         data: {
//             tour
//         }
//     });

//  });

// exports.getTour = catchAsync(async (req,res,next) =>{

//      const tour = await Tour.findById(req.params.id);
//      // Another way Tour.findOne({_id: req.params.id})

//      if(!tour){
//         return next(new AppError('No tour foucnd with that ID',404))
//      }
//         res.status(200).json({
//             status: 'success',
//             data: {
//                 tour
//             }  
//         });
// });

// exports.deleteTour = catchAsync(async (req,res,next) => {
//     const tour = await Tour.findByIdAndDelete(req.params.id);

//     if(!tour){
//         return next(new AppError('No tour foucnd with that ID',404))
//      }
//     res.status(204).json({
//         status: 'Success',
//         data: null
        
//     });
// });

// exports.getTourStats = catchAsync(async(req,res,next) => {
// const stats = await Tour.aggregate([
//     {
//     $match: {ratingsAverage: {$gte: 4.5} }
//     },
//     {
//     $group: {
//         _id: {$toUpper: '$difficulty'},
//         numTours: { $sum: 1},
//         numRatings: {$sum: '$ratingsQuantity'},
//         avgRating: { $avg: '$ratingsAverage'},
//         avgPrice: { $avg: '$price'},
//         minPrice: { $min: '$price'},
//         maxPrice: { $max: '$price'}
//     }  
//     },
//     {
//         $sort: {avgPrice: 1}
//     }  
//  ]);
//  res.status(200).json({
//      status: 'success',
//      data: {
//          stats
//      }
//  });
 
// });

// exports.getMonthlyPlan = catchAsync(async(req,res,next) =>{
//         const year = req.params.year *1;
//         const plan = await Tour.aggregate([
//             {
//                 $unwind: '$startDates'
//             },
//             {
//                 $match: {
//                     startDates:{
//                         $gte: new Date(`${year}-01-01`),
//                         $lte: new Date(`${year}-12-31`),
//                     }
//                 }
//             },
//             {
//                 $group: {
//                     _id: { $month : '$startDates'},
//                     numTourStarts: { $sum :1},
//                     tours: {$push: '$name'}
//                 }
//             },
//             {
//                 $addFields: { month: '$_id'}
//             },
//             {
//                 $project:{
//                     _id: 0
//                 }
//             },
//             {
//                 $sort: {numTourStarts: -1 }
//             },
//             {
//                 $limit: 12
//             }
//         ]);

//         res.status(200).json({
//             status: 'success',
//             data: {
//                 plan
//             }
//         });
// });

const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');



exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = factory.getAll(Tour);

exports.getTour =factory.getOne(Tour, {path: 'reviews'});
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null
//   });
// });

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({  
    status: 'success',
    data: {
      plan
    }
  });
});

exports.getToursWithin= catchAsync(async(req,res,next) => {
  const {distance, latlng, unit} =req.params;
  const [lat, lng] = latlng.split(',');
const radius = unit === 'mi' ? distance /3963.2 : distance /6378.1;
  if(!lat || !lng){
next(new AppError('Please provide latitude and longitude in format lat ,lng', 400));
  }

const tours = await Tour.find({startLocation: { $geoWithin: {$centerSphere:[[lng,lat],radius] } }});
res.status(200).json({
    status: 'success',
    results: tours.length, 
    data:{
      data: tours
    }
  });
  
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const {distance, latlng, unit} =req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier =unit ==='mi' ? 0.000621371 : 0.001;

  if(!lat || !lng){
next(new AppError('Please provide latitude and longitude in format lat ,lng', 400));
  }

const distances =  await Tour.aggregate([
  { 
    $geoNear:{
      near:{
        type: 'Point',
        coordinates: [lng*1, lat*1]
      },
      distanceField: 'distance',
      distanceMultiplier: multiplier
    }
  },
  {
    $project:{
      distance: 1,
      name: 1
    }
  }
]);

res.status(200).json({
  status: 'success',
  data:{
    data: distances
   }
 });
})


