const Razorpay = require('razorpay');
const orderModel = require('../model/order');

exports.purchase = async (req, res) => {
    try {
        const rzp = new Razorpay({
            key_id: 'rzp_test_Zq3DEZ3JWPqQYJ',
            key_secret: 'tn5QQiKwSUnKNaintIDq7q1G',
        });

        const amount = 100.00;

        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Failed to create order', err });
            }

            try {
                await req.user.createOrder({ orderid: order.id, status: 'PENDING' });
                return res.status(201).json({ order, key_id: rzp.key_id });
            } catch (err) {
                console.log(err);
                return res.status(400).json({ message: 'Failed to create order', err });
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Something went wrong', err });
    }
};

exports.update = async (req, res) => {
    try {
        const { payment_id, order_id } = req.body;
        const order = await orderModel.findOne({ where: { orderid: order_id } });

        if (!order) { 
            return res.status(404).json({ message: 'Order not found' });
        } 
        console.log(("user "+req.user+"order"+order));
        await order.update({ paymentid: payment_id, status: 'SUCCESSFUL' });
        await req.user.update({ isprime: true });

        return res.status(202).json({ success: true, message: "Success" });
    } catch (err) {
        console.log(err);  
        return res.status(500).json({ message: 'Something went wrong', err });
    }
};






