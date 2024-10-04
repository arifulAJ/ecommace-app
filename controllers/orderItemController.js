const Response = require("../helpers/response");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");





const createOrderItmes = async (req, res) => {
    try {
        const { items } = req.body;

        // Get the token from the request headers
        const tokenWithBearer = req.headers.authorization;
        let token;

        if (tokenWithBearer && tokenWithBearer.startsWith('Bearer ')) {
            token = tokenWithBearer.slice(7);
        }

        if (!token) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Token is missing.',
                status: 'failed'
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Generate a unique order code
        function generateOrderCode() {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
            let code = '#';

            for (let i = 0; i < 6; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                code += characters[randomIndex];
            }

            return code;
        }

        const orderCode = generateOrderCode();

        // Create an initial order item
        const orderItems = await OrderItem.create({
            orederedProduct: items,
            orderId: orderCode
        });

        // Find the order item by orderId
        const orderItemsId = await OrderItem.findOne({ orderId: orderCode });
        if (!orderItemsId) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Order item not found',
                status: 'failed'
            });
        }

        const itemsOrdered = await OrderItem.findById(orderItemsId._id);
        if (!itemsOrdered) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Items ordered not found',
                status: 'failed'
            });
        }

        let invalidQuantitiesFound = false;
        let insufficientProductName = '';

        // Process each ordered product
        for (const product of itemsOrdered.orederedProduct) {
            const existingProduct = await Product.findById(product.productId);
            if (!existingProduct) {
                console.log(`Product with ID ${product.productId} not found`);
                continue;
            }

            const variant = existingProduct.variants.find(v => v.size === product.productSize);
            if (!variant) {
                console.log(`Variant with size ${product.productSize} not found for product ${product.productId}`);
                return res.status(404).json({
                    statusCode: 404,
                    message: `Select the Product size of ${existingProduct.name}`,
                    status: 'failed'
                });
            }

            // Parse and update inventoryQuantity
            const updatedQuantity = parseInt(variant.inventoryQuantity, 10) - parseInt(product.quantity, 10);
            console.log(updatedQuantity, "--------------------product quantity");

            if (updatedQuantity < 0) {
                invalidQuantitiesFound = true;
                insufficientProductName = existingProduct.name;
                console.error(`Insufficient quantity for product ${existingProduct.name}`);
                break; // Stop further processing
            }

            // Update the product's variant inventoryQuantity
            await Product.findByIdAndUpdate(
                product.productId,
                {
                    $set: {
                        'variants.$[elem].inventoryQuantity': updatedQuantity
                    }
                },
                {
                    arrayFilters: [{ 'elem.size': product.productSize }],
                    new: true
                }
            );
        }

        if (invalidQuantitiesFound) {
            return res.status(404).json({
                statusCode: 404,
                message: `Cannot complete order due to insufficient quantities for product: ${insufficientProductName}`,
                status: 'failed'
            });
        }

        return res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Items processed successfully",
            data: orderItems
        });

    } catch (error) {
        console.error('Error processing items:', error);
        return res.status(500).json({
            statusCode: 500,
            status: "failed",
            message: error.message
        });
    }
};



module.exports={
    createOrderItmes
}