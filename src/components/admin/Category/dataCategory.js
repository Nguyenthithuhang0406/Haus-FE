// danh sách phòng có sẵn
const rooms = [
  "Phòng ngủ",
  "Ngoài trời",
  "Phòng khách",
  "Nhà bếp & thiết bị",
  "Văn phòng tại nhà",
  "Phòng ăn",
  "Phòng trẻ em",
  "Phòng tắm",
];

const dummyData = [
  // Phòng ngủ
  {
    id: 1,
    code: "DM001",
    name: "Kệ lưu trữ & tủ đầu giường",
    room: "Phòng ngủ",
    description: "Kệ và tủ nhỏ gọn đặt cạnh giường, tiện lợi để đồ cá nhân",
  },
  {
    id: 2,
    code: "DM002",
    name: "Giường ngủ",
    room: "Phòng ngủ",
    description: "Giường ngủ gỗ cao cấp với thiết kế hiện đại",
  },
  {
    id: 3,
    code: "DM003",
    name: "Tủ quần áo",
    room: "Phòng ngủ",
    description: "Tủ quần áo rộng rãi, nhiều ngăn tiện lợi",
  },
  {
    id: 4,
    code: "DM004",
    name: "Bàn đầu giường",
    room: "Phòng ngủ",
    description: "Bàn nhỏ đặt cạnh giường để đèn ngủ và sách",
  },
  {
    id: 5,
    code: "DM005",
    name: "Bộ chăn ga gối",
    room: "Phòng ngủ",
    description: "Bộ chăn ga gối cao cấp, êm ái và thoáng mát",
  },

  // Ngoài trời
  {
    id: 6,
    code: "DM006",
    name: "Bàn ghế sân vườn",
    room: "Ngoài trời",
    description: "Bộ bàn ghế sân vườn chống nước, bền đẹp",
  },
  {
    id: 7,
    code: "DM007",
    name: "Dù che nắng",
    room: "Ngoài trời",
    description: "Dù che nắng lớn, dễ dàng gấp gọn",
  },
  {
    id: 8,
    code: "DM008",
    name: "Đèn ngoài trời",
    room: "Ngoài trời",
    description: "Đèn năng lượng mặt trời dùng cho sân vườn",
  },

  // Phòng khách
  {
    id: 9,
    code: "DM009",
    name: "Sofa & ghế bành",
    room: "Phòng khách",
    description: "Ghế sofa bọc vải cao cấp cho không gian phòng khách",
  },
  {
    id: 10,
    code: "DM010",
    name: "Bàn cà phê",
    room: "Phòng khách",
    description: "Bàn cà phê nhỏ gọn, phù hợp với sofa",
  },
  {
    id: 11,
    code: "DM011",
    name: "Tủ TV & kệ tường",
    room: "Phòng khách",
    description: "Tủ kệ gỗ tiện dụng cho TV và thiết bị giải trí",
  },

  // Nhà bếp & thiết bị
  {
    id: 12,
    code: "DM012",
    name: "Tủ bếp",
    room: "Nhà bếp & thiết bị",
    description: "Tủ bếp nhiều ngăn tiện lợi, chất liệu chống ẩm",
  },
  {
    id: 13,
    code: "DM013",
    name: "Dụng cụ nấu ăn",
    room: "Nhà bếp & thiết bị",
    description: "Bộ dụng cụ nấu ăn đầy đủ tiện lợi",
  },
  {
    id: 14,
    code: "DM014",
    name: "Đồ dùng nhà bếp",
    room: "Nhà bếp & thiết bị",
    description: "Các vật dụng tiện ích cho bếp ăn gia đình",
  },

  // Văn phòng tại nhà
  {
    id: 15,
    code: "DM015",
    name: "Bàn làm việc",
    room: "Văn phòng tại nhà",
    description: "Bàn làm việc gỗ công nghiệp chống trầy",
  },
  {
    id: 16,
    code: "DM016",
    name: "Ghế công thái học",
    room: "Văn phòng tại nhà",
    description: "Ghế văn phòng công thái học hỗ trợ cột sống",
  },
  {
    id: 17,
    code: "DM017",
    name: "Đèn bàn",
    room: "Văn phòng tại nhà",
    description: "Đèn bàn LED tiết kiệm điện, ánh sáng dịu nhẹ",
  },

  // Phòng ăn
  {
    id: 18,
    code: "DM018",
    name: "Bàn ăn",
    room: "Phòng ăn",
    description: "Bàn ăn gỗ tự nhiên 6 ghế hiện đại",
  },
  {
    id: 19,
    code: "DM019",
    name: "Ghế ăn",
    room: "Phòng ăn",
    description: "Ghế ăn êm ái, bọc nệm da dễ vệ sinh",
  },
  {
    id: 20,
    code: "DM020",
    name: "Tủ ly & tủ buffet",
    room: "Phòng ăn",
    description: "Tủ trưng bày ly tách và dụng cụ ăn uống",
  },

  // Phòng trẻ em
  {
    id: 21,
    code: "DM021",
    name: "Giường trẻ em",
    room: "Phòng trẻ em",
    description: "Giường trẻ em an toàn với thành chắn",
  },
  {
    id: 22,
    code: "DM022",
    name: "Bàn học cho bé",
    room: "Phòng trẻ em",
    description: "Bàn học nhỏ gọn, nhiều ngăn tiện lợi",
  },
  {
    id: 23,
    code: "DM023",
    name: "Đồ chơi & hộp đồ chơi",
    room: "Phòng trẻ em",
    description: "Hộp lưu trữ đồ chơi gọn gàng, an toàn",
  },

  // Phòng tắm
  {
    id: 24,
    code: "DM024",
    name: "Tủ & kệ nhà tắm",
    room: "Phòng tắm",
    description: "Kệ treo tường, tủ chứa đồ dùng phòng tắm",
  },
  {
    id: 25,
    code: "DM025",
    name: "Phụ kiện phòng tắm",
    room: "Phòng tắm",
    description: "Bộ phụ kiện inox chống gỉ cho phòng tắm",
  },
  {
    id: 26,
    code: "DM026",
    name: "Rèm và thảm nhà tắm",
    room: "Phòng tắm",
    description: "Rèm và thảm chống trượt tiện lợi",
  },
];

export { rooms, dummyData };
