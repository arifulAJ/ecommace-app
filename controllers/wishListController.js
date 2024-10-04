const jwt = require('jsonwebtoken');
const Response = require('../helpers/response');
const Product = require('../models/Product');
const Wishlist = require('../models/Wishlist');
const pagination = require('../helpers/pagination');
const WishListFolder = require('../models/WishListFolder');
const WishlistFolder = require('../models/WishListFolder');



const createWishList = async (req, res, next) => {
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        token = tokenWithBearer.slice(7);
    }

    if (!token) {
        return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.',status:'faield' }));
    }

    try {
        const {productId} = req.body;
        console.log(productId)
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Check if the product is already in the wishlist
        const wishlistItem = await Wishlist.findOne({ userId: decoded._id, productId: productId, });
        console.log(wishlistItem)

        if (wishlistItem) {
            // If the product is already in the wishlist, remove it
            await Wishlist.findByIdAndDelete(wishlistItem._id);
            await Product.findByIdAndUpdate(productId, { $set: { wishlist: false } });

            return res.status(200).json(Response({ statusCode: 200, status: "success", message: "Product removed from wishlist." }));
        } else {
            // If the product is not in the wishlist, add it
            const newWishlistItem = new Wishlist({ userId: decoded._id, productId: productId });
            await newWishlistItem.save();
            await Product.findByIdAndUpdate(productId, { $set: { wishlist: true } });

            return res.status(200).json(Response({ statusCode: 200, status: "success", message: "Product added to wishlist.",}));
        }
    } catch (error) {
        // Handle errors properly
        console.error(error);
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
    }
}

const getAllWishlist = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        token = tokenWithBearer.slice(7);
    }

    if (!token) {
        return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Fetch all wishlist items for the user
        const wishlistItems = await Wishlist.find({ userId: decoded._id })
            .populate({
                path: 'productId',
                populate: {
                    path: 'userId'
                }
            })
            .skip((page - 1) * limit)
            .limit(limit);

        if (wishlistItems.length === 0) {
            return res.status(404).json(Response({ statusCode: 404, status: "success", message: "You don't have any wishlist product." }));
        }

        // Fetch wishlist folder items
        const wishlistFolderItems = await WishlistFolder.find({ userId: decoded._id });

        // If `wishlistId` exists, extract wishlist IDs from wishlistFolderItems
        const wishlistFolderIds = wishlistFolderItems.flatMap(item => item.collectionOfProducts.map(product => product.wishlistId ? product.wishlistId.toString() : null)).filter(id => id !== null);

        // Filter out wishlist items that are not in the wishlistFolder collection
        const filteredWishlistItems = wishlistItems.filter(item => {
            // Check if any wishlist ID matches the current item's ID (i.e., it's in a wishlist folder)
            return !wishlistFolderIds.includes(item._id.toString());
        });

        if (filteredWishlistItems.length === 0) {
            return res.status(404).json(Response({ statusCode: 404, status: "success", message: "All wishlist items are already in folders." }));
        }

        // Pagination response
        const paginationOfProduct = pagination(filteredWishlistItems.length, limit, page);

        // Return filtered wishlist items
        res.status(200).json(Response({
            status: "ok",
            statusCode: 200,
            message: "Get all the wishlist items",
            data: filteredWishlistItems,
            pagination: paginationOfProduct
        }));
    } catch (error) {
        console.error(error);
        res.status(500).json(Response({ status: "failed", message: error.message, statusCode: 500 }));
    }
};


// const getAllWishlist = async (req, res, next) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const tokenWithBearer = req.headers.authorization;
//     let token;

//     if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
//         token = tokenWithBearer.slice(7);
//     }

//     if (!token) {
//         return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//         // Find all wishlist items for the user
//         const wishlistItems = await Wishlist.find({ userId: decoded._id }) .populate({
//             path: 'productId',
//             populate: {
//                 path: 'userId'
//             }
        
//         })
//             .skip((page - 1) * limit)
//             .limit(limit);

//         if (wishlistItems.length === 0) {
//             return res.status(404).json(Response({ statusCode: 404, status: "success", message: "You don't have any wishlist product." }));
//         }

//         // Fetch wishlist items from wishlistFolder collection
//         const wishlistFolderItems = await WishlistFolder.find({ userId: decoded._id });

//         // Extract wishlist IDs from wishlistFolderItems
// const wishlistFolderIds = wishlistFolderItems.flatMap(item => item.collectionOfProducts.map(product => product.wishlistId.toString()));

// // Filter out wishlist items that are not in the wishlistFolder collection
// const filteredWishlistItems = wishlistItems.filter(item => {
//     // Check if any wishlist ID matches the current item's ID
//     return !wishlistFolderIds.includes(item._id.toString());
// });
// if(filteredWishlistItems.length===0){
//     return res.status(404).json(Response({statusCode:404,status:"success",message:"you have data but in wishlist folder"}))
// }

//         const paginationOfProduct= pagination(filteredWishlistItems.length,limit,page)

//         console.log(wishlistFolderIds,filteredWishlistItems)
//         // Return the filtered wishlist items
//         res.status(200).json(Response({
//             status: "ok",
//             statusCode: 200,
//             message: "Get all the wishlist items",
//             data: filteredWishlistItems,
//             pagination:paginationOfProduct
//         }));
//     } catch (error) {
//         console.error(error);
//         res.status(500).json(Response({ status: "failed", message: error.message, statusCode: 500 }));
//     }
// }


// const createWishListCollection = async (req, res, next) => {
//     const tokenWithBearer = req.headers.authorization;
//     let token;

//     if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
//         token = tokenWithBearer.slice(7);
//     }

//     if (!token) {
//         return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//         const { wishlistTitle, collectionOfProducts } = req.body;

//         // Check if a wishlist folder with the same title already exists for the user
//         let wishlistFolder = await WishlistFolder.findOne({ userId: decoded._id, wishlistTitle });

//         if (wishlistFolder) {
//             // If the wishlist folder already exists, update its collectionOfProducts
//             wishlistFolder.collectionOfProducts = wishlistFolder.collectionOfProducts = wishlistFolder.collectionOfProducts.concat(collectionOfProducts);
//             ;
//             await wishlistFolder.save();
//         } else {
//             // If the wishlist folder doesn't exist, create a new one
//             wishlistFolder = await WishlistFolder.create({ userId: decoded._id, wishlistTitle, collectionOfProducts });
//         }

//         res.status(200).json(Response({ status: 'ok', statusCode: 200, message: 'Wishlist collection created/updated successfully.', data: wishlistFolder }));
//     } catch (error) {
//         res.status(500).json(Response({ status: 'failed', message: error.message, statusCode: 500 }));
//     }
// }

// get all wishlist by folder

// const createWishListCollection = async (req, res, next) => {
//     const tokenWithBearer = req.headers.authorization;
//     let token;

//     if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
//         token = tokenWithBearer.slice(7);
//     }

//     if (!token) {
//         return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//         const { wishlistTitle, collectionOfProducts } = req.body;

//         // Check if a wishlist folder with the same title already exists for the user
//         let wishlistFolder = await WishlistFolder.findOne({ userId: decoded._id, wishlistTitle });

//         if (wishlistFolder) {
//             // If the wishlist folder already exists, update its collectionOfProducts
//             collectionOfProducts.forEach(product => {
//                 const { wishlistId, collection } = product;

//                 // If `wishlistId` is provided, we only append it if it's not already in the collection
//                 if (wishlistId) {
//                     const existingWishlist = wishlistFolder.collectionOfProducts.find(p => p.wishlistId && p.wishlistId.equals(wishlistId));
//                     if (!existingWishlist) {
//                         wishlistFolder.collectionOfProducts.push(product);
//                     }
//                 }

//                 // If `collection` (product id) is provided, we append it if not already in the collection
//                 if (collection) {
//                     const existingProduct = wishlistFolder.collectionOfProducts.find(p => p.collection && p.collection.equals(collection));
//                     if (!existingProduct) {
//                         wishlistFolder.collectionOfProducts.push(product);
//                     }
//                 }
//             });

//             await wishlistFolder.save();
//         } else {
//             // If the wishlist folder doesn't exist, create a new one
//             wishlistFolder = await WishlistFolder.create({
//                 userId: decoded._id,
//                 wishlistTitle,
//                 collectionOfProducts
//             });
//         }

//         res.status(200).json(Response({ status: 'ok', statusCode: 200, message: 'Wishlist collection created/updated successfully.', data: wishlistFolder }));
//     } catch (error) {
//         res.status(500).json(Response({ status: 'failed', message: error.message, statusCode: 500 }));
//     }
// };

// const createWishListCollection = async (req, res, next) => {
//     const tokenWithBearer = req.headers.authorization;
//     let token;

//     if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
//         token = tokenWithBearer.slice(7);
//     }

//     if (!token) {
//         return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//         const { wishlistTitle, collectionOfProducts, collectionType } = req.body;

//         // Validate `collectionType` (either 'wishlistId' or 'collection')
//         if (!["wishlistId", "collection"].includes(collectionType)) {
//             return res.status(400).json(Response({ statusCode: 400, message: 'Invalid collection type. Must be either "wishlistId" or "collection".', status: 'failed' }));
//         }

//         // Check if a wishlist folder with the same title already exists for the user
//         let wishlistFolder = await WishlistFolder.findOne({ userId: decoded._id, wishlistTitle });

//         if (wishlistFolder) {
//             // If the wishlist folder already exists, update its collectionOfProducts
//             collectionOfProducts.forEach(product => {
//                 const { wishlistId, collection } = product;

//                 if (collectionType === 'wishlistId' && wishlistId) {
//                     // If `collectionType` is `wishlistId`, add wishlistId to the collection if not already present
//                     const existingWishlist = wishlistFolder.collectionOfProducts.find(p => p.wishlistId && p.wishlistId.equals(wishlistId));
//                     if (!existingWishlist) {
//                         wishlistFolder.collectionOfProducts.push(product);
//                     }
//                 } else if (collectionType === 'collection' && collection) {
//                     // If `collectionType` is `collection`, add the product to the collection if not already present
//                     const existingProduct = wishlistFolder.collectionOfProducts.find(p => p.collection && p.collection.equals(collection));
//                     if (!existingProduct) {
//                         wishlistFolder.collectionOfProducts.push(product);
//                     }
//                 }
//             });

//             wishlistFolder.collectionType = collectionType; // Update the collection type
//             await wishlistFolder.save();
//         } else {
//             // If the wishlist folder doesn't exist, create a new one
//             wishlistFolder = await WishlistFolder.create({
//                 userId: decoded._id,
//                 wishlistTitle,
//                 collectionOfProducts,
//                 collectionType // Set the collection type
//             });
//         }

//         res.status(200).json(Response({ status: 'ok', statusCode: 200, message: 'Wishlist collection created/updated successfully.', data: wishlistFolder }));
//     } catch (error) {
//         res.status(500).json(Response({ status: 'failed', message: error.message, statusCode: 500 }));
//     }
// };


const createWishListCollection = async (req, res, next) => {
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        token = tokenWithBearer.slice(7);
    }

    if (!token) {
        return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { wishlistTitle, collectionOfProducts, collectionType } = req.body;

        // Validate `collectionType` (either 'wishlistId' or 'collection')
        if (!["wishlistId", "collection"].includes(collectionType)) {
            return res.status(400).json(Response({ statusCode: 400, message: 'Invalid collection type. Must be either "wishlistId" or "collection".', status: 'failed' }));
        }

        // Check if a wishlist folder with the same title already exists for the user
        let wishlistFolder = await WishlistFolder.findOne({ userId: decoded._id, wishlistTitle });

        if (wishlistFolder) {
            // Check for duplicates before updating
            const duplicates = [];
            collectionOfProducts.forEach(product => {
                const { wishlistId, collection } = product;

                if (collectionType === 'wishlistId' && wishlistId) {
                    // If `collectionType` is `wishlistId`, check for duplicates
                    const existingWishlist = wishlistFolder.collectionOfProducts.some(p => p.wishlistId && p.wishlistId.equals(wishlistId));
                    if (existingWishlist) {
                        duplicates.push(wishlistId);
                    }
                } else if (collectionType === 'collection' && collection) {
                    // If `collectionType` is `collection`, check for duplicates
                    const existingProduct = wishlistFolder.collectionOfProducts.some(p => p.collection && p.collection.equals(collection));
                    if (existingProduct) {
                        duplicates.push(collection);
                    }
                }
            });

            if (duplicates.length > 0) {
                return res.status(400).json(Response({
                    status: 'failed',
                    statusCode: 400,
                    message: 'One or more products already exist in the collection folder.',
                    duplicates
                }));
            }

            // Add new products if no duplicates
            wishlistFolder.collectionOfProducts.push(...collectionOfProducts);
            wishlistFolder.collectionType = collectionType; // Update the collection type
            await wishlistFolder.save();
        } else {
            // If the wishlist folder doesn't exist, create a new one
            wishlistFolder = await WishlistFolder.create({
                userId: decoded._id,
                wishlistTitle,
                collectionOfProducts,
                collectionType // Set the collection type
            });
        }

        res.status(200).json(Response({ status: 'ok', statusCode: 200, message: 'Wishlist collection created/updated successfully.', data: wishlistFolder }));
    } catch (error) {
        res.status(500).json(Response({ status: 'failed', message: error.message, statusCode: 500 }));
    }
};


const showWishlistFolderByName = async (req, res) => {
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        token = tokenWithBearer.slice(7);
    }

    if (!token) {
        return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const { name } = req.query;

        if (!name) {
            return res.status(400).json(Response({ message: 'Folder name is required.' }));
        }

         
        // Find the wishlist folder by name
        let wishlistFolder = await WishlistFolder.findOne({ wishlistTitle: name, userId: decoded._id })
            // .populate({
            //     path: 'collectionOfProducts',
            //     populate: {
            //         path: 'wishlistId',
            //         match: { _id: { $ne: null } }, // Exclude wishlist items with null wishlistId
            //         populate: {
            //             path: 'productId',
            //             populate: {
            //                 path: 'userId'
            //             }
            //         }
            //     }
            // });
            .populate({
                path: 'collectionOfProducts',
                populate: [
                    {
                        path: 'wishlistId', // Populate `wishlistId` from Wishlist model
                        match: { _id: { $ne: null } }, // Exclude wishlist items with null wishlistId
                        populate: {
                            path: 'productId',
                            populate: { path: 'userId' }
                        }
                    },
                    {
                        path: 'collection', // Populate `collection` from Product model
                        model: 'Product',
                        populate: { path: 'userId' }, // Populate `userId` from Product model
                        // select: 'name price description userId', // Select specific fields from Product, including `userId`
                      }
                ]
            });

        if (!wishlistFolder) {
            return res.status(404).json(Response({ statusCode:404,message: 'Wishlist folder not found.' }));
        }


        // Filter out wishlist items with null wishlistId
        wishlistFolder.collectionOfProducts = wishlistFolder.collectionOfProducts.filter(product => product.wishlistId !== null);
         // If the length of collectionOfProducts is 0, delete the wishlistFolder document
         if (wishlistFolder.collectionOfProducts.length === 0) {
            await wishlistFolder.deleteOne();
            return res.status(200).json(Response({ message: 'Wishlist folder deleted.', data: null }));
        }

        // Save the updated wishlistFolder
        wishlistFolder = await wishlistFolder.save();

        return res.status(200).json(Response({ message: 'Wishlist folder found.', data: wishlistFolder }));
    } catch (error) {
        console.error('Error showing wishlist folder by name:', error);
        return res.status(500).json(Response({ message: error.message, }));
    }
};

// get all folder name

const getFoldername=async(req,res,next)=>{
    const tokenWithBearer = req.headers.authorization;
    let token;

    if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
        token = tokenWithBearer.slice(7);
    }

    if (!token) {
        return res.status(401).json(Response({ statusCode: 401, message: 'Token is missing.', status: 'failed' }));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const getFolder = await WishListFolder.find({ userId: decoded._id });

        if (getFolder.length === 0) {
            return res.status(404).json(Response({ message: 'Wishlist folders not found.', statusCode:404 }));
        }
          const names = getFolder.map(folder => folder.wishlistTitle);
            console.log(names);

        return res.status(200).json(Response({ message: 'Wishlist folder found.', data: names,statusCode:200 }));

        
    } catch (error) {
        return res.status(500).json(Response({ message: 'Internal server error.' }));

        
    }
}

module.exports={
    createWishList,
    getAllWishlist,
    createWishListCollection,
    showWishlistFolderByName,
    getFoldername
}