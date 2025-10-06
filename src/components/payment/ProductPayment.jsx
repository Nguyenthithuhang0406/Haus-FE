import React, { useState } from 'react';
import { Link } from "react-router-dom";

const ProductPayment = ({ listProducts }) => {
    const [products, setProducts] = useState(
        listProducts.map(item => ({ ...item, quantity: 1 }))
    );
    const [shippingFee, setShippingFee] = useState(30000);

    const increaseQuantity = (index) => {
        const updated = [...products];
        updated[index].quantity += 1;
        setProducts(updated);
    };

    const decreaseQuantity = (index) => {
        const updated = [...products];
        if (updated[index].quantity > 1) {
            updated[index].quantity -= 1;
            setProducts(updated);
        }
    };

    const subtotal = products.reduce(
        (sum, item) => sum + item.variants[0].price * item.quantity,
        0
    );

    const total = subtotal + shippingFee;

    return (
        <div className="w-[600px] md:w-[500px] rounded-lg border border-gray-200 shadow-lg flex flex-col">
            <div className="p-5 flex-1 flex flex-col">
                <h2 className="text-[22px] text-[#ad7555] font-semibold pb-2 border-b">
                    {`Đơn hàng (${products.length} sản phẩm)`}
                </h2>

                <div className="max-h-72 overflow-y-auto pr-2 my-5 flex-1">
                    <ul>
                        {products.map((item, index) => (
                            <li key={index} className="flex mb-4 items-center">
                                <img
                                    src={item.variants[0].image}
                                    alt="anhminhhoa"
                                    className="w-20 h-20 object-cover mr-3 border border-gray-200"
                                />
                                <div className="flex-1 mt-3">
                                    <h3 className="font-medium">{item.name}</h3>
                                    <p className="text-gray-500">Màu: {item.variants[0].color}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <div className="flex items-center border border-gray-100 gap-1">
                                            <button
                                                onClick={() => decreaseQuantity(index)}
                                                className="px-2 border border-gray-200 shadow-lg rounded"
                                            >
                                                -
                                            </button>
                                            <p className="w-6 text-center mx-1">{item.quantity}</p>
                                            <button
                                                onClick={() => increaseQuantity(index)}
                                                className="px-2 border border-gray-200 shadow-lg rounded"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <p className="font-medium">
                                            {(item.variants[0].price * item.quantity).toLocaleString()} đ
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex justify-between border-t border-[#ad7555] pt-3 my-3 font-medium">
                    <span>Tạm tính:</span>
                    <span>{subtotal.toLocaleString()} đ</span>
                </div>
                <div className="flex justify-between pt-1 pb-5 border-b border-[#ad7555] font-medium">
                    <span>Phí vận chuyển:</span>
                    <span>{shippingFee.toLocaleString()} đ</span>
                </div>
                <div className="flex justify-between mt-8 pb-5 border-b border-[#ad7555] font-semibold">
                    <span>Tổng cộng:</span>
                    <span>{total.toLocaleString()} đ</span>
                </div>

                {/* Nút luôn ở dưới */}
                <div className="mt-auto pt-5 flex justify-between items-center">
                    <Link to="" className="text-[#ad7555]">
                        Quay lại giỏ hàng
                    </Link>
                    <button
                        className="px-5 py-2.5 bg-[#ad7555] hover:bg-[#945f46] text-white font-semibold rounded-xl shadow-md cursor-pointer"
                    >
                        Đặt hàng
                    </button>
                </div>
            </div>
        </div>

    );
};

export default ProductPayment;
