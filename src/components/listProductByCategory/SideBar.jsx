import {
  listCategory,
  listColor,
  listStyle,
} from "@/utils/contants/SidebarCategory";
import React, { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { FaCaretUp } from "react-icons/fa";

const SideBar = () => {
  const categories = listCategory;
  const [openCategory, setOpenCategory] = useState([]);
  const [openFillterPrice, setOpenFillterPrice] = useState(true);
  const [openFillterColor, setOpenFillterColor] = useState(true);
  const [openFillterStyle, setOpenFillterStyle] = useState(true);
  const colors = listColor;
  const styles = listStyle;

  const toggleCategory = (id) => {
    if (openCategory.includes(id)) {
      setOpenCategory(openCategory.filter((catId) => catId !== id));
    } else {
      setOpenCategory([...openCategory, id]);
    }
  };

  return (
    <div className="w-full flex flex-col gap-[30px]">
      <div className="w-full border-[1px] border-[#efefef] rounded-[6px] p-[15px]">
        <p className="text-[20px] break-words font-medium leading-[140%] pb-[8px] border-b-[3px] border-[#ad7555] w-fit">
          Danh mục sản phẩm
        </p>
        {categories.map((category) => (
          <div key={category.id} className="w-full flex flex-col text-[16px]">
            <div className="w-full py-[5px] font-medium flex items-end justify-between hover:text-[#ad7555] cursor-pointer">
              <p className="break-words">{category.name}</p>
              {openCategory.includes(category.id) ? (
                <FaCaretUp onClick={() => toggleCategory(category.id)} />
              ) : (
                <FaCaretDown onClick={() => toggleCategory(category.id)} />
              )}
            </div>
            {openCategory.includes(category.id) && (
              <div className="w-full pl-[20px] break-words py-[5px] hover:text-[#ad7555]">
                {category.children.map((child) => (
                  <p key={child.id} className="cursor-pointer font-medium">
                    {child.name}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="w-full flex flex-col gap-[30px]">
        <div className="w-full flex items-end justify-between cursor-pointer">
          <p className="text-[20px] font-medium">Chọn mức giá</p>{" "}
          {openFillterPrice ? (
            <FaCaretDown onClick={() => setOpenFillterPrice(false)} />
          ) : (
            <FaCaretUp onClick={() => setOpenFillterPrice(true)} />
          )}
        </div>
        {openFillterPrice && (
          <div className="w-full flex flex-col gap-[20px]">
            <div className="flex items-center gap-[10px]">
              <input
                type="checkbox"
                name="price"
                className="w-[20px] h-[20px]"
              />
              <p className="font-medium hover:text-[#ad7555]">
                Giá dưới 1.000.000đ
              </p>
            </div>
            <div className="flex items-center gap-[10px]">
              <input
                type="checkbox"
                name="price"
                className="w-[20px] h-[20px]"
              />
              <p className="font-medium hover:text-[#ad7555]">
                1.000.000đ - 3.000.000đ
              </p>
            </div>
            <div className="flex items-center gap-[10px]">
              <input
                type="checkbox"
                name="price"
                className="w-[20px] h-[20px]"
              />
              <p className="font-medium hover:text-[#ad7555]">
                3.000.000đ - 6.000.000đ
              </p>
            </div>
            <div className="flex items-center gap-[10px]">
              <input
                type="checkbox"
                name="price"
                className="w-[20px] h-[20px]"
              />
              <p className="font-medium hover:text-[#ad7555]">
                6.000.000đ - 8.000.000đ
              </p>
            </div>
            <div className="flex items-center gap-[10px]">
              <input
                type="checkbox"
                name="price"
                className="w-[20px] h-[20px]"
              />
              <p className="font-medium hover:text-[#ad7555]">
                Giá trên 8.000.000đ
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="w-full flex flex-col gap-[20px]">
        <div className="w-full flex items-end justify-between cursor-pointer">
          <p className="text-[20px] font-medium">Màu phổ biến</p>{" "}
          {openFillterColor ? (
            <FaCaretDown onClick={() => setOpenFillterColor(false)} />
          ) : (
            <FaCaretUp onClick={() => setOpenFillterColor(true)} />
          )}
        </div>

        {openFillterColor && (
          <div className="w-full flex flex-wrap gap-[10px]">
            {colors.map((color) => (
              <div className="flex items-center gap-[10px] p-[7px] rounded-[8px] border-[1px] border-[#e9e9e9] hover:border-[#ad7555] cursor-pointer">
                <div
                  className="w-[20px] h-[20px] rounded-[8px] "
                  style={{ backgroundColor: color.color }}
                ></div>
                <p className="font-medium">{color.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-full flex flex-col gap-[20px]">
        <div className="w-full flex items-end justify-between cursor-pointer">
          <p className="text-[20px] font-medium">Kiểu dáng</p>{" "}
          {openFillterStyle ? (
            <FaCaretDown onClick={() => setOpenFillterStyle(false)} />
          ) : (
            <FaCaretUp onClick={() => setOpenFillterStyle(true)} />
          )}
        </div>

        {openFillterStyle && (
          <div className="w-full flex flex-col gap-[10px]">
            {styles.map((style) => (
              <div key={style.id} className="flex items-center gap-[10px]">
                <input type="checkbox" className="w-[20px] h-[20px]" />
                <p className="font-medium">{style.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
