import React, { useState, useEffect } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaStar, FaRegStar } from "react-icons/fa6";
// import { listComment } from "@/utils/contants/Comment";
import { FaQuoteRight } from "react-icons/fa6";
import { getTopReviews } from "@/api/review";

const ReComment = () => {

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const reviewRes = await getTopReviews(1, 10);
        setReviews(reviewRes.items || []);

      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="w-full px-[20px]  md:px-[50px] lg:px-[130px] py-[100px] bg-[#c8b7ad] bg-opacity-45 flex flex-col items-center justify-between gap-[20px]">
      <p
        data-aos="fade-down"
        className="w-fit text-[18px] text-[#ad7555] leading-[140%] font-semibold py-[2px] border-b-[2px] border-[#ad7555]"
      >
        Ý KIẾN KHÁCH HÀNG
      </p>
      <p
        data-aos="fade-down"
        className="text-[35px] md:text-[42px] leading-[140%] font-semibold"
      >
        Khách hàng nói gì về chúng tôi ?
      </p>
      <div
        data-aos="fade-up"
        className="mt-[50px] w-full flex justify-center items-center"
      >
        <Swiper
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 20000, disableOnInteraction: false }}
          modules={[Autoplay]}
          className="w-full flex justify-center items-center"
          breakpoints={{
            0: {
              slidesPerView: 1, // Mobile
            },
            768: {
              slidesPerView: 2, // Tablet
            },
            1280: {
              slidesPerView: 3, // Desktop
            },
          }}
        >
          {reviews.map((review, index) => (
            <SwiperSlide
              key={index}
              className="w-full flex justify-between items-center gap-5"
            >
              <div
                data-aos="fade-up"
                className="max-w-[350px] h-[290px] bg-white rounded-lg p-[20px] flex flex-col gap-[20px]"
              >
                {/* star */}
                <div className="flex items-center gap-[5px]">
                  {Array.from({ length: review.rating }, (_, i) => (
                    <FaStar key={i} className="text-[#ad7555] text-[20px]" />
                  ))}
                  {Array.from({ length: 5 - review.rating }, (_, i) => (
                    <FaRegStar key={i} className="text-[#ad7555] text-[20px]" />
                  ))}
                </div>

                <p className="leading-[140%] line-clamp-4 w-full break-words pb-[20px] border-b-[1px] border-[#dddcdb]">
                  {review.content}
                </p>

                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-[10px]">
                    <div className="border-4 rounded-full border-[#ad7555] p-2 bg-white">
                      <img
                        src="https://hoseiki.vn/wp-content/uploads/2025/03/hinh-cute-chibi-21.jpg"
                        alt="AnhMinhHoa"
                        className="w-[50px] h-[50px] object-cover rounded-full"
                      />
                    </div>
                    <div className="flex flex-col gap-[20px]">
                      <p className="text-[18px] md:text-[20px] leading-[140%] font-medium line-clamp-1">
                        {review.reviewerName}
                      </p>
                    </div>
                  </div>

                  <FaQuoteRight className="text-[30px] text-[#ad7555]" />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ReComment;
