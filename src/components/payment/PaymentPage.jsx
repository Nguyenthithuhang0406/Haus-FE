import React from 'react'
import DeliveryAddress from './DeliveryAddress'
import PaymentMethod from './PaymentMethod'
import ProductPayment from './ProductPayment'
import Header from '@/components/commons/Header'
import Footer from '@/components/commons/Footer'
const dummyProducts = [
    {
        id: 1,
        code: "SP001",
        name: "Ghế có tay vịn BONHOLMEN",
        category: "Kệ lưu trữ & tủ đầu giường",
        image: [
            "https://bizweb.dktcdn.net/thumb/large/100/570/902/products/sp20-4.jpg?v=1746439987253",
        ],
        shortDesc: "Ghế ngoài trời chắc chắn",
        detailDesc: `<p>
         <b>Ghế có tay vịn BONDHOLMEN</b> từ IKEA mang đến sự kết hợp hoàn hảo giữa
        <i>phong cách hiện đại</i> và sự thoải mái tối ưu cho không gian ngoài trời của bạn.
      </p>
      <p>
        Với thiết kế độc đáo, khung nhôm chắc chắn được sơn tĩnh điện màu be trang nhã
        và mặt ngồi, lưng tựa được đan bằng các sợi polyester bền bỉ.
      </p>
      <ul>
        <li>Chiều rộng: 61 cm</li>
        <li>Chiều sâu: 69 cm</li>
        <li>Chiều cao: 81 cm</li>
        <li>Chiều rộng mặt ngồi: 48 cm</li>
        <li>Chiều sâu mặt ngồi: 50 cm</li>
        <li>Chiều cao mặt ngồi: 42 cm</li>
        <li>Chiều cao tay vịn: 63 cm</li>
      </ul>
      `,
        price: 3500000,
        stock: 11,
        variants: [
            {
                id: 101,
                color: "Be",
                price: 3500000,
                stock: 5,
                image:
                    "https://bizweb.dktcdn.net/thumb/large/100/570/902/products/sp20-4.jpg?v=1746439987253",
            },
            {
                id: 102,
                color: "Đen",
                price: 3600000,
                stock: 6,
                image:
                    "https://bizweb.dktcdn.net/thumb/large/100/570/902/products/sp18.jpg?v=1746437935323",
            },
        ],
    },
    {
        id: 2,
        code: "SP002",
        name: "Ghế có tay vịn TARNO",
        category: "Kệ lưu trữ & tủ đầu giường",
        image: [
            "https://bizweb.dktcdn.net/thumb/large/100/570/902/products/sp18.jpg?v=1746437935323",
        ],
        shortDesc: "Ghế gỗ gấp tiện lợi",
        detailDesc: `<p>
         <b>Ghế có tay vịn BONDHOLMEN</b> từ IKEA mang đến sự kết hợp hoàn hảo giữa
        <i>phong cách hiện đại</i> và sự thoải mái tối ưu cho không gian ngoài trời của bạn.
      </p>
      <p>
        Với thiết kế độc đáo, khung nhôm chắc chắn được sơn tĩnh điện màu be trang nhã
        và mặt ngồi, lưng tựa được đan bằng các sợi polyester bền bỉ.
      </p>
      <ul>
        <li>Chiều rộng: 61 cm</li>
        <li>Chiều sâu: 69 cm</li>
        <li>Chiều cao: 81 cm</li>
        <li>Chiều rộng mặt ngồi: 48 cm</li>
        <li>Chiều sâu mặt ngồi: 50 cm</li>
        <li>Chiều cao mặt ngồi: 42 cm</li>
        <li>Chiều cao tay vịn: 63 cm</li>
      </ul>
      `,
        price: 1000000,
        stock: 12,
        variants: [
            {
                id: 101,
                color: "Be",
                price: 3500000,
                stock: 5,
                image:
                    "https://bizweb.dktcdn.net/thumb/large/100/570/902/products/sp20-4.jpg?v=1746439987253",
            },
            {
                id: 102,
                color: "Đen",
                price: 3600000,
                stock: 6,
                image:
                    "https://bizweb.dktcdn.net/thumb/large/100/570/902/products/sp20-4-black.jpg?v=1746439987253",
            },
        ],
    },
    {
        id: 3,
        code: "SP002",
        name: "Ghế có tay vịn TARNO",
        category: "Kệ lưu trữ & tủ đầu giường",
        image: [
            "https://bizweb.dktcdn.net/thumb/large/100/570/902/products/sp18.jpg?v=1746437935323",
        ],
        shortDesc: "Ghế gỗ gấp tiện lợi",
        detailDesc: `<p>
         <b>Ghế có tay vịn BONDHOLMEN</b> từ IKEA mang đến sự kết hợp hoàn hảo giữa
        <i>phong cách hiện đại</i> và sự thoải mái tối ưu cho không gian ngoài trời của bạn.
      </p>
      <p>
        Với thiết kế độc đáo, khung nhôm chắc chắn được sơn tĩnh điện màu be trang nhã
        và mặt ngồi, lưng tựa được đan bằng các sợi polyester bền bỉ.
      </p>
      <ul>
        <li>Chiều rộng: 61 cm</li>
        <li>Chiều sâu: 69 cm</li>
        <li>Chiều cao: 81 cm</li>
        <li>Chiều rộng mặt ngồi: 48 cm</li>
        <li>Chiều sâu mặt ngồi: 50 cm</li>
        <li>Chiều cao mặt ngồi: 42 cm</li>
        <li>Chiều cao tay vịn: 63 cm</li>
      </ul>
      `,
        price: 1000000,
        stock: 12,
        variants: [
            {
                id: 101,
                color: "Be",
                price: 3500000,
                stock: 5,
                image:
                    "https://bizweb.dktcdn.net/thumb/large/100/570/902/products/sp20-4.jpg?v=1746439987253",
            },
            {
                id: 102,
                color: "Đen",
                price: 3600000,
                stock: 6,
                image:
                    "https://bizweb.dktcdn.net/thumb/large/100/570/902/products/sp20-4-black.jpg?v=1746439987253",
            },
        ],
    },
    {
        id: 4,
        code: "SP002",
        name: "Ghế có tay vịn TARNO",
        category: "Kệ lưu trữ & tủ đầu giường",
        image: [
            "https://bizweb.dktcdn.net/thumb/large/100/570/902/products/sp18.jpg?v=1746437935323",
        ],
        shortDesc: "Ghế gỗ gấp tiện lợi",
        detailDesc: `<p>
         <b>Ghế có tay vịn BONDHOLMEN</b> từ IKEA mang đến sự kết hợp hoàn hảo giữa
        <i>phong cách hiện đại</i> và sự thoải mái tối ưu cho không gian ngoài trời của bạn.
      </p>
      <p>
        Với thiết kế độc đáo, khung nhôm chắc chắn được sơn tĩnh điện màu be trang nhã
        và mặt ngồi, lưng tựa được đan bằng các sợi polyester bền bỉ.
      </p>
      <ul>
        <li>Chiều rộng: 61 cm</li>
        <li>Chiều sâu: 69 cm</li>
        <li>Chiều cao: 81 cm</li>
        <li>Chiều rộng mặt ngồi: 48 cm</li>
        <li>Chiều sâu mặt ngồi: 50 cm</li>
        <li>Chiều cao mặt ngồi: 42 cm</li>
        <li>Chiều cao tay vịn: 63 cm</li>
      </ul>
      `,
        price: 1000000,
        stock: 12,
        variants: [
            {
                id: 101,
                color: "Be",
                price: 3500000,
                stock: 5,
                image:
                    "https://bizweb.dktcdn.net/thumb/large/100/570/902/products/sp20-4.jpg?v=1746439987253",
            },
            {
                id: 102,
                color: "Đen",
                price: 3600000,
                stock: 6,
                image:
                    "https://bizweb.dktcdn.net/thumb/large/100/570/902/products/sp20-4-black.jpg?v=1746439987253",
            },
        ],
    },
]

const PaymentPage = () => {
    return (
        <>
            <Header />
            <div className="max-w-[1400px] mx-auto p-5 flex flex-col md:flex-row gap-5 pt-[180px] pb-[50px]">
                <div className="flex-1 flex flex-col justify-between items-center md:items-start min-w-[300px]">
                    <DeliveryAddress />
                    <PaymentMethod />
                </div>
                <div className="w-full md:w-[500px] flex justify-center items-center">
                    <ProductPayment listProducts={dummyProducts} />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default PaymentPage
