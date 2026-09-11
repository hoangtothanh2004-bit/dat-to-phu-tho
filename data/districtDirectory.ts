export interface DistrictAttraction {
  name: string;
  category: string;
  desc: string;
  location?: string;
  icon: string;
}

export interface DistrictCulinary {
  dish: string;
  desc: string;
  places?: string; // Địa chỉ / quán ăn nổi tiếng
  tips?: string;
}

export interface DistrictInfo {
  id: string;
  name: string;
  oldName: string;
  province: "Phú Thọ" | "Vĩnh Phúc" | "Hòa Bình";
  title: string;
  intro: string;
  keywords: string[];
  attractions: DistrictAttraction[];
  culinary: DistrictCulinary[];
  recommendedStay?: string;
  comboActionValue: string;
  comboActionLabel: string;
}

export const DISTRICT_DATABASE: Record<string, DistrictInfo> = {
  // =========================================================================
  // 1. TỈNH PHÚ THỌ (13 ĐƠN VỊ HÀNH CHÍNH CŨ / HIỆN HỮU)
  // =========================================================================
  "viet-tri": {
    id: "viet-tri",
    name: "TP. Việt Trì",
    oldName: "Việt Trì cũ",
    province: "Phú Thọ",
    title: "TP. Việt Trì – Đô thị ngã ba sông & Kinh đô Văn Lang cội nguồn",
    intro: "TP. Việt Trì là trung tâm chính trị, kinh tế, văn hóa của tỉnh Phú Thọ, thành phố lễ hội cội nguồn dân tộc với quần thể Đền Hùng linh thiêng và di sản Hát Xoan nhân loại.",
    keywords: ["việt trì", "viet tri", "tp việt trì", "thành phố việt trì", "đền hùng", "den hung", "hùng lô", "hung lo", "hồ văn lang", "bến gót", "bạch hạc", "việt trì cũ"],
    attractions: [
      { name: "Khu di tích lịch sử Quốc gia đặc biệt Đền Hùng", category: "Tâm linh - lịch sử", desc: "Quần thể đền thờ 18 đời Vua Hùng trên núi Nghĩa Lĩnh linh thiêng: Đền Hạ, Đền Trung, Đền Thượng, Lăng Hùng Vương và Đền Giếng.", location: "xã Hy Cương, thành phố Việt Trì, tỉnh Phú Thọ", icon: "🏛️" },
      { name: "Làng cổ & Đình cổ Hùng Lô", category: "Văn hóa - di sản", desc: "Quần thể kiến trúc gỗ hơn 300 năm tuổi với nghệ thuật chạm khắc tinh xảo, cái nôi thưởng thức Di sản văn hóa phi vật thể Hát Xoan UNESCO.", location: "phường Vân Phú, tỉnh Phú Thọ", icon: "🎶" },
      { name: "Công viên Văn Lang & Cầu đi bộ biểu tượng", category: "Check-in - giải trí", desc: "Hồ nước thơ mộng giữa lòng thành phố, biểu tượng cầu đi bộ nghệ thuật lung linh ánh sáng và quảng trường nhạc nước về đêm.", icon: "🌉" },
      { name: "Đền Tam Giang & Bến Gót (Ngã ba sông Bạch Hạc)", category: "Di tích - tâm linh", desc: "Nơi hội tụ của 3 dòng sông Hồng - sông Lô - sông Đà, gắn liền với huyền tích phong thủy Đất Tổ và đền thờ Thổ Lệnh Đại Vương.", location: "Phường Thanh Miếu, tỉnh Phú Thọ", icon: "⛵" },
      { name: "Đền Quốc Tổ Lạc Long Quân", category: "Tâm linh cội nguồn", desc: "Tọa lạc trên đồi Sim uy nghi, công trình kiến trúc truyền thống phụng thờ Đức Quốc Tổ Lạc Long Quân.", icon: "🛕" },
    ],
    culinary: [
      { dish: "Cá lăng & Cá ngạnh sông Lô (nướng than, lẩu om chuối đậu)", desc: "Cá da trơn săn chắc béo ngậy được đánh bắt tại ngã ba sông, ướp riềng mẻ nướng than hoa hoặc om chuối đậu thơm lừng.", places: "Quán Cá Hạc Trì (398 Lạc Long Quân), Nhà hàng Cá Lăng Sông Lô (Bến Gót)" },
      { dish: "Bánh tai Phú Thọ (Bánh Hòn)", desc: "Bánh bột gạo tẻ dẻo thơm hình cánh tai heo bọc nhân thịt nạc mỡ xào hành tiêu thơm phức, ăn lúc vừa hấp nóng hổi.", places: "Bánh tai Bà Định Gia Cẩm (Đường Hàn Thuyên, P. Tân Dân), Chợ Trung tâm Việt Trì" },
      { dish: "Bún riêu cua đồng phố cổ Việt Trì", desc: "Nước dùng cua đồng ngọt thanh đậm đà kèm riêu cua béo ngậy, đậu phụ rán giòn và rau sống tươi mát.", places: "Phố ẩm thực Nguyễn Du, P. Nông Trang" },
    ],
    recommendedStay: "Khách sạn Mường Thanh Luxury Phú Thọ (5 sao), Khách sạn Sài Gòn - Phú Thọ (4 sao)",
    comboActionValue: "plan_viet_tri_combo",
    comboActionLabel: "✨ Lên lịch trình trọn gói TP. Việt Trì (1N / 2N1Đ)",
  },

  "thi-xa-phu-tho": {
    id: "thi-xa-phu-tho",
    name: "Thị xã Phú Thọ",
    oldName: "Thị xã Phú Thọ cũ",
    province: "Phú Thọ",
    title: "Thị xã Phú Thọ – Đô thị cổ trầm mặc & Nét đẹp trăm năm",
    intro: "Thị xã Phú Thọ là một trong những đô thị cổ nhất miền Bắc, từng là tỉnh lỵ với nét kiến trúc thuộc địa Pháp cổ kính, di tích tâm linh và các làng nghề truyền thống lâu đời.",
    keywords: ["thị xã phú thọ", "thi xa phu tho", "tx phú thọ", "tx phu tho", "thị xã phú thọ cũ", "hà thạch", "sai nga", "thanh minh"],
    attractions: [
      { name: "Đền Trình Hưng Hóa & Đền Du Yến", category: "Tâm linh lịch sử", desc: "Ngôi đền cổ kính linh thiêng phụng thờ các bậc tiền nhân có công khai phá và bảo vệ vùng đất Hưng Hóa xưa.", icon: "🏛️" },
      { name: "Làng nghề nón lá Sai Nga", category: "Làng nghề truyền thống", desc: "Làng nghề chằm nón lá trắng tinh khôi nổi tiếng miền trung du, du khách được trải nghiệm chuốt lá, khâu nón cùng nghệ nhân.", icon: "👒" },
      { name: "Văn miếu Hà Thạch & Chùa Phổ Quang", category: "Văn hóa tâm linh", desc: "Nơi tôn vinh truyền thống hiếu học xứ Đoài cổ kính với cây muỗm cổ thụ hàng trăm năm tuổi.", icon: "⛩️" },
      { name: "Khu phố cổ & Ga thị xã Phú Thọ", category: "Kiến trúc hoài niệm", desc: "Những dãy nhà rêu phong mái ngói phong cách Đông Dương và nhà ga xe lửa lịch sử xây dựng từ đầu thế kỷ 20.", icon: "🚂" },
    ],
    culinary: [
      { dish: "Bánh tai truyền thống Thị xã Phú Thọ", desc: "Chiếc bánh tai nóng hổi mềm dẻo, thơm ngậy mùi mỡ hành tiêu, món quà sáng thân thương của người dân Đất Tổ.", places: "Chợ thị xã Phú Thọ, ngã tư Ba Bậc" },
      { dish: "Bánh cuốn chả nướng than hoa Lê Đồng", desc: "Bánh tráng tay mỏng tang mềm mướt, chả miếng nướng than hoa thơm nức mũi chấm nước mắm chua ngọt ấm nóng.", places: "Phố Lê Đồng, P. Âu Cơ, TX. Phú Thọ" },
      { dish: "Thịt trâu xào lá lồm", desc: "Thịt trâu tươi thái mỏng xào cùng lá lồm (lá chua) rừng tạo nên vị chua thanh lạ miệng, thịt mềm ngọt đậm đà.", places: "Các nhà hàng ẩm thực dân tộc ven đường 35m" },
    ],
    recommendedStay: "Khách sạn Hồng Ngọc, Khách sạn Hoàng Long TX Phú Thọ",
    comboActionValue: "plan_tx_phu_tho_combo",
    comboActionLabel: "✨ Lên lịch trình khám phá Thị xã Phú Thọ",
  },

  "lam-thao": {
    id: "lam-thao",
    name: "Huyện Lâm Thao",
    oldName: "Lâm Thao cũ",
    province: "Phú Thọ",
    title: "Huyện Lâm Thao – Vùng đất học danh hương, làng cổ ven sông Thao",
    intro: "Huyện Lâm Thao nằm bên tả ngạn sông Thao (sông Hồng), là cái nôi khảo cổ học Sơn Vi, vùng đất học khoa bảng với làng cổ Xuân Lũng, lễ hội Trò Trám và các làng nghề ẩm thực trứ danh.",
    keywords: ["lâm thao", "lam thao", "huyện lâm thao", "lâm thao cũ", "sơn vi", "xuân lũng", "bánh dòng", "tứ xã", "trò trám", "dục mỹ"],
    attractions: [
      { name: "Di chỉ khảo cổ học Quốc gia Sơn Vi", category: "Lịch sử khảo cổ", desc: "Nơi phát hiện dấu tích người nguyên thủy thời đại đồ đá cũ cách đây hàng vạn năm, cái nôi đầu tiên của nền văn minh tiền sử Việt Nam.", icon: "🏺" },
      { name: "Làng cổ & Chùa Phổ Quang Xuân Lũng", category: "Di tích văn hóa", desc: "Ngôi làng cổ danh hương có chùa Phổ Quang lưu giữ Bàn thờ Phật bằng đá hoa sen thời Trần - Bảo vật Quốc gia vô giá.", icon: "🛕" },
      { name: "Miếu Trò Đền Xa (Lễ hội Trò Trám Tứ Xã)", category: "Lễ hội phồn thực", desc: "Nơi diễn ra lễ hội 'Linh tinh tình phộc' độc nhất vô nhị vào đêm 11 rạng sáng 12 tháng Giêng âm lịch cầu mùa màng sinh sôi.", icon: "🎭" },
      { name: "Đền Chu Hóa & Cụm di tích Bác Hồ về thăm", category: "Lịch sử cách mạng", desc: "Địa danh lịch sử gắn liền với những mốc son kháng chiến hào hùng của quân dân Đất Tổ.", icon: "⭐" },
    ],
    culinary: [
      { dish: "Bánh giò & Bánh chưng làng Dòng (Xuân Lũng)", desc: "Bánh làm từ gạo nếp cái hoa vàng dẻo thơm ngào ngạt, nhân thịt nạc mỡ đỗ xanh tiêu sọ đậm đà, gói lá dong xanh mướt.", places: "Làng nghề bánh làng Dòng, xã Xuân Lũng" },
      { dish: "Tương Dục Mỹ (Cao Xá)", desc: "Nước tương truyền thống ủ từ đỗ tương rang vàng, mốc xôi nếp và nước mưa tinh khiết, thơm nức sánh vàng như mật ong.", places: "Xã Cao Xá, Lâm Thao" },
      { dish: "Chuối phấn Hồng Đà & Nem chua Phủ Đức", desc: "Chuối phấn chín vàng thơm ngọt thanh tao và nem chua lá ổi giòn sần sật khai vị tiệc xuân.", places: "Chợ Phủ, xã Tiên Kiên" },
    ],
    recommendedStay: "Nghỉ tại TP. Việt Trì (cách Lâm Thao chỉ 8-10 km)",
    comboActionValue: "plan_lam_thao_combo",
    comboActionLabel: "✨ Lên lịch trình khám phá di sản Lâm Thao",
  },

  "phu-ninh": {
    id: "phu-ninh",
    name: "Huyện Phù Ninh",
    oldName: "Phù Ninh cũ",
    province: "Phú Thọ",
    title: "Huyện Phù Ninh – Xứ chè cọ ngút ngàn & Cội nguồn Hát Xoan An Thái",
    intro: "Phù Ninh tiếp giáp Việt Trì về phía Bắc, nổi tiếng với những đồi chè xanh mướt trải dài bên dòng sông Lô, các phường Xoan cổ linh thiêng và ẩm thực đồng quê phong phú.",
    keywords: ["phù ninh", "phu ninh", "huyện phù ninh", "phù ninh cũ", "an thái", "chùa lộc vân", "đền nhà bà", "rươi sông lô", "trạm thản"],
    attractions: [
      { name: "Làng cổ An Thái (Một trong 4 phường Xoan gốc)", category: "Di sản phi vật thể", desc: "Cái nôi thực hành Hát Xoan cửa đình nguyên bản, nơi du khách được giao lưu cùng các nghệ nhân, đào trùm Xoan cao tuổi.", icon: "🎶" },
      { name: "Chùa Lộc Vân & Đền Nhà Bà", category: "Tâm linh cổ tự", desc: "Cụm di tích linh thiêng rợp bóng cây cổ thụ phụng thờ các vị thần bảo hộ bờ cõi non sông Đất Tổ.", icon: "⛩️" },
      { name: "Đồi chè bát úp Phú Lộc & Trạm Thản", category: "Sinh thái check-in", desc: "Những đồi chè xanh bạt ngàn thẳng tắp, không khí trong lành, điểm chụp ảnh dã ngoại lý tưởng ven quốc lộ 2.", icon: "🍃" },
      { name: "Chiến thắng Chân Mộng - Trạm Thản", category: "Lịch sử kháng chiến", desc: "Địa danh ghi dấu chiến công vang dội của bộ đội ta tiêu diệt đoàn xe cơ giới thực dân Pháp năm 1952.", icon: "🚩" },
    ],
    culinary: [
      { dish: "Rươi sông Lô (An Đạo)", desc: "Sản vật quý hiếm xuất hiện theo con nước cuối thu đầu đông, chả rươi vỏ quýt nướng thơm lừng cả khúc sông.", places: "Xã An Đạo, ven bến sông Lô" },
      { dish: "Thịt lợn đồi quay giòn bì mắc khén", desc: "Thịt lợn bản nuôi tự nhiên ướp gia vị núi rừng, quay trên than củi vàng ruộm, da giòn rụm thịt mềm ngọt chấm tương ớt.", places: "Khu vực ngã ba Phú Lộc, TT. Phong Châu" },
      { dish: "Chè xanh búp Phù Ninh", desc: "Nước chè xanh trong vắt màu vàng mật ong, tiền chát hậu ngọt đậm đà, uống ấm bụng sảng khoái.", places: "Các hợp tác xã chè Phú Lộc" },
    ],
    recommendedStay: "Khách sạn Phương Nam, Nhà nghỉ du lịch TT. Phong Châu",
    comboActionValue: "plan_phu_ninh_combo",
    comboActionLabel: "✨ Lên tour trải nghiệm đồi chè & Xoan Phù Ninh",
  },

  "ha-hoa": {
    id: "ha-hoa",
    name: "Huyện Hạ Hòa",
    oldName: "Hạ Hòa cũ",
    province: "Phú Thọ",
    title: "Huyện Hạ Hòa – Cội nguồn Mẹ Âu Cơ & Vịnh nước ngọc Ao Châu",
    intro: "Hạ Hòa nằm ở phía Tây Bắc tỉnh Phú Thọ bên sông Thao, nổi tiếng với Đền Mẫu Âu Cơ linh thiêng và Đầm Ao Châu được ví như 'Vịnh Hạ Long trên núi' với 99 ngách nước.",
    keywords: ["hạ hòa", "ha hoa", "huyện hạ hòa", "hạ hòa cũ", "âu cơ", "đền mẫu âu cơ", "đầm ao châu", "ao châu", "ao giời suối tiên", "hiền lương", "quân khê"],
    attractions: [
      { name: "Khu di tích lịch sử Đền Mẫu Âu Cơ (Hiền Lương)", category: "Tâm linh cội nguồn", desc: "Nơi phụng thờ Mẹ Tiên Âu Cơ sinh ra bọc trăm trứng, ngày mùng 7 tháng Giêng lễ hội chính thu hút vạn du khách hướng về nguồn cội.", icon: "🛕" },
      { name: "Danh thắng Đầm Ao Châu (99 ngách nước)", category: "Sinh thái danh thắng", desc: "Đầm nước tự nhiên rộng hơn 300ha với làn nước trong xanh phẳng lặng uốn lượn quanh các đồi chè, đồi cọ trù phú.", location: "xã Hạ Hòa, tỉnh Phú Thọ", icon: "🏞️" },
      { name: "Thác Ao Giời – Suối Tiên (Quân Khê)", category: "Thiên nhiên kỳ vĩ", desc: "Bắt nguồn từ đỉnh núi Nả cao vút đổ xuống qua nhiều tầng thác bọt tung trắng xóa, suối nước mát lạnh giữa rừng nguyên sinh.", location: "xã Hiền Lương, tỉnh Phú Thọ", icon: "🌊" },
      { name: "Chùa Linh Long", category: "Tâm linh thanh tịnh", desc: "Ngôi cổ tự nằm ẩn mình giữa khung cảnh núi rừng thanh tịnh, nơi chiêm bái cầu an tĩnh tâm.", icon: "⛩️" },
    ],
    culinary: [
      { dish: "Ốc cọ Hạ Hòa & Chè cọ Hiền Lương", desc: "Ốc béo múp sống trong đầm cọ om sả ớt hoặc luộc lá gừng, cùng món quả cọ ỏm bùi ngậy vàng óng như mật.", places: "Khu vực cổng Đền Mẫu Âu Cơ, xã Hiền Lương" },
      { dish: "Cá đầm Ao Châu nướng que củi", desc: "Cá chép, cá mè đầm nước ngọt tự nhiên thịt thơm ngọt không tanh, kẹp que tre nướng than hồng chấm muối ớt.", places: "Các nhà bè sinh thái quanh đầm Ao Châu" },
      { dish: "Gà đồi thả vườn đầm sen", desc: "Gà thả đồi tự kiếm ăn chắc thịt, luộc rắc lá chanh hoặc rang muối đậm đà dư vị núi rừng.", places: "Nhà hàng Ao Châu, TT. Hạ Hòa" },
    ],
    recommendedStay: "Nhà nghỉ sinh thái quanh Đầm Ao Châu, Khách sạn Hương Sen TT. Hạ Hòa",
    comboActionValue: "plan_ha_hoa_combo",
    comboActionLabel: "✨ Lên lịch trình Đền Mẫu Âu Cơ & Đầm Ao Châu",
  },

  "doan-hung": {
    id: "doan-hung",
    name: "Huyện Đoan Hùng",
    oldName: "Đoan Hùng cũ",
    province: "Phú Thọ",
    title: "Huyện Đoan Hùng – Vương quốc bưởi tiến Vua & Hào khí sông Lô",
    intro: "Đoan Hùng nằm ở ngã ba ranh giới giữa Phú Thọ, Tuyên Quang và Yên Bái, nơi hợp lưu của sông Chảy vào sông Lô, nổi tiếng với giống bưởi quý tiến Vua và chiến thắng sông Lô lịch sử.",
    keywords: ["đoan hùng", "doan hung", "huyện đoan hùng", "đoan hùng cũ", "bưởi đoan hùng", "bưởi sửu", "bằng luân", "chí đám", "chiến thắng sông lô", "sông lô đoan hùng", "tượng đài chiến thắng"],
    attractions: [
      { name: "Vườn bưởi di sản Bằng Luân & Chí Đám", category: "Nông nghiệp sinh thái", desc: "Những vườn bưởi cổ thụ trĩu quả vàng ươm tỏa hương thơm ngát, du khách được tự tay hái bưởi và thưởng thức tép bưởi mọng nước ngọt lịm.", icon: "🍈" },
      { name: "Tượng đài Chiến thắng Sông Lô (Núi Đồn)", category: "Di tích lịch sử", desc: "Công trình tưởng niệm chiến công vang dội của quân và dân ta đánh chìm đoàn tàu chiến Pháp trên sông Lô mùa thu đông 1947.", icon: "🎖️" },
      { name: "Chùa Đại Bi (Đoan Hùng)", category: "Cổ tự tâm linh", desc: "Ngôi chùa cổ kính linh thiêng với kiến trúc gỗ truyền thống và không gian thanh tịnh soi bóng bên dòng sông.", icon: "⛩️" },
      { name: "Cửa sông Chảy đổ vào sông Lô", category: "Cảnh quan sông nước", desc: "Khung cảnh non nước hữu tình nơi hai dòng phù sa đỏ và nước trong xanh giao hòa tuyệt đẹp.", icon: "🏞️" },
    ],
    culinary: [
      { dish: "Bưởi Đoan Hùng (Bưởi Sửu & Bưởi Bằng Luân)", desc: "Giống bưởi đặc sản tiến Vua nức tiếng: vỏ mỏng vàng ươm, tép bưởi róc mọng nước, vị ngọt thanh mát tan trên đầu lưỡi, để hàng tháng vỏ héo càng ngon ngọt.", places: "Vườn bưởi Bằng Luân, Chợ Đoan Hùng, Dọc QL2" },
      { dish: "Cá sông Lô nướng than hoa (Cá ngạnh, cá chình)", desc: "Cá sông Chảy, sông Lô tự nhiên thịt ngọt đậm, nướng than hoa hoặc om riềng mẻ ăn kèm rau rừng.", places: "Nhà hàng Sông Lô, TT. Đoan Hùng" },
      { dish: "Bánh cuốn Đoan Hùng chả nướng", desc: "Bánh cuốn mỏng thơm mùi gạo quê, chả nướng thơm lừng chấm nước mắm cà cuống truyền thống.", places: "Dãy ẩm thực gần tượng đài Chiến thắng Sông Lô" },
    ],
    recommendedStay: "Khách sạn Sông Lô Đoan Hùng, Nhà nghỉ Hoàng Long QL2",
    comboActionValue: "plan_doan_hung_combo",
    comboActionLabel: "✨ Lên tour hái bưởi & ngắm sông Lô Đoan Hùng",
  },

  "cam-khe": {
    id: "cam-khe",
    name: "Huyện Cẩm Khê",
    oldName: "Cẩm Khê cũ",
    province: "Phú Thọ",
    title: "Huyện Cẩm Khê – Miền sinh thái đầm Rộc Trịnh & Đất cá thính trứ danh",
    intro: "Huyện Cẩm Khê nằm ở trung tâm hữu ngạn sông Thao, nổi tiếng với di tích Căn cứ kháng chiến Tiên Động, Chùa Bồng Lai cổ kính, đầm nước sinh thái Rộc Trịnh và đặc sản cá thính nức tiếng gần xa.",
    keywords: ["cẩm khê", "cam khe", "huyện cẩm khê", "cẩm khê cũ", "cá thính", "tiên động", "chùa bồng lai", "rộc trịnh", "sông thao", "vạn thắng"],
    attractions: [
      { name: "Đầm sinh thái Rộc Trịnh", category: "Sinh thái hoang sơ", desc: "Khu đầm ngập nước tự nhiên rộng lớn hoang sơ với các loài chim nước, hoa súng bạt ngàn và cảnh hoàng hôn tĩnh lặng tuyệt đẹp.", icon: "🪷" },
      { name: "Chùa Bồng Lai (Cẩm Khê)", category: "Cổ tự tâm linh", desc: "Ngôi cổ tự có cảnh quan non nước u tịch, nơi cầu an và tìm lại sự bình yên trong tâm hồn giữa miền quê Đất Tổ.", icon: "🛕" },
      { name: "Khu di tích Căn cứ kháng chiến Tiên Động", category: "Lịch sử cách mạng", desc: "Căn cứ địa vững chắc trong phong trào Cần Vương chống Pháp của nghĩa quân cụ Nguyễn Quang Bích.", icon: "🚩" },
      { name: "Chiến khu Vạn Thắng & Đình Phú Lạc", category: "Di tích lịch sử", desc: "Nơi ghi dấu truyền thống bất khuất của quân dân Cẩm Khê trong thời kỳ giành độc lập dân tộc.", icon: "🏛️" },
    ],
    culinary: [
      { dish: "Cá thính Cẩm Khê (Cá thính chua mặn ủ thính ngô)", desc: "Đặc sản nức danh: cá mè hoặc cá trôi tươi làm sạch, ướp muối hạt và thính ngô rang vàng ươm, ủ trong chum sành gài thanh tre. Khi nướng than hoa dậy mùi thơm nức mũi bùi béo khó quên.", places: "Làng nghề cá thính Cẩm Khê, các hộ dân xã Tiên Lương, Tuy Lộc" },
      { dish: "Thịt trâu nướng niêu đất & xào rau muống", desc: "Thịt trâu giật tươi nướng trong niêu đất giữ trọn vị ngọt mềm và hương thơm của sả ớt hạt tiêu.", places: "Nhà hàng Trâu Vàng, TT. Cẩm Khê" },
      { dish: "Bánh đúc Cẩm Khê chấm tương", desc: "Bánh đúc lạc dẻo quánh bùi bùi, xắn từng miếng chấm ngập bát tương nếp thơm ngọt dịu dàng.", places: "Chợ hoa thị trấn Cẩm Khê" },
    ],
    recommendedStay: "Nhà nghỉ Cẩm Khê Center, Khách sạn Thanh Bình TT. Cẩm Khê",
    comboActionValue: "plan_cam_khe_combo",
    comboActionLabel: "✨ Lên lịch trình khám phá văn hóa & ẩm thực Cẩm Khê",
  },

  "thanh-ba": {
    id: "thanh-ba",
    name: "Huyện Thanh Ba",
    oldName: "Thanh Ba cũ",
    province: "Phú Thọ",
    title: "Huyện Thanh Ba – Xứ đồi chè búp tím & Đầm sen Vân Hội mênh mang",
    intro: "Huyện Thanh Ba được thiên nhiên ưu đãi với vùng hồ đầm sinh thái rộng lớn, đặc biệt là đầm sen Vân Hội bát ngát và giống chè búp tím quý hiếm có hàm lượng dinh dưỡng cao.",
    keywords: ["thanh ba", "thanh ba cũ", "huyện thanh ba", "vân hội", "đầm vân hội", "chè búp tím", "chùa bút", "quảng nạp"],
    attractions: [
      { name: "Khu du lịch sinh thái Đầm Vân Hội", category: "Sinh thái hồ nước", desc: "Mặt hồ phẳng lặng rộng hàng trăm hecta được bao bọc bởi đồi cây xanh ngút ngàn, mùa hè hoa sen nở tỏa hương thơm ngát đón khách chèo thuyền ngắm cảnh.", icon: "🪷" },
      { name: "Đồi chè búp tím Thanh Ba", category: "Nông nghiệp độc đáo", desc: "Giống chè quý hiếm với những búp chè màu tím biếc độc đáo, nguồn dược liệu quý chống lão hóa và điểm chụp ảnh check-in mới lạ.", icon: "🍃" },
      { name: "Chùa Bút (Chùa Cổ Am)", category: "Tâm linh cổ kính", desc: "Ngôi chùa tọa lạc trên đỉnh đồi cao phong cảnh hữu tình, nơi lưu giữ nhiều pho tượng cổ và chuông đồng trăm năm.", icon: "⛩️" },
      { name: "Di tích Chiến khu cách mạng Thanh Ba", category: "Lịch sử hào hùng", desc: "Gắn liền với những ngày đầu xây dựng căn cứ địa vũ trang kháng chiến của quân và dân tỉnh Phú Thọ.", icon: "⭐" },
    ],
    culinary: [
      { dish: "Cá mè đầm Vân Hội om dưa & nướng trui", desc: "Cá mè sống tự nhiên trong đầm nước sâu thịt trắng ngọt không mỡ, om dưa chua hoặc nướng than rơm thơm bùi.", places: "Các nhà hàng sinh thái ven đầm Vân Hội" },
      { dish: "Trà búp tím Thanh Ba pha mật ong", desc: "Nước trà pha ra có màu tím phớt hồng thanh nhã, vị ngọt sâu lắng giàu polyphenol rất tốt cho sức khỏe tim mạch.", places: "HTX Chè Búp Tím Thanh Ba" },
      { dish: "Gà chạy đồi nướng than hoa", desc: "Gà đồi thả tự do trên các đồi chè săn chắc thơm ngon, tẩm ướp mật ong rừng và lá chanh nướng than hồng giòn da ngọt thịt.", places: "Khu ẩm thực đầm Vân Hội" },
    ],
    recommendedStay: "Homestay sinh thái Đầm Vân Hội, Nhà nghỉ trung tâm TT. Thanh Ba",
    comboActionValue: "plan_thanh_ba_combo",
    comboActionLabel: "✨ Lên tour chèo thuyền Đầm Vân Hội & Thưởng trà tím",
  },

  "tam-nong": {
    id: "tam-nong",
    name: "Huyện Tam Nông",
    oldName: "Tam Nông cũ",
    province: "Phú Thọ",
    title: "Huyện Tam Nông – Khu nghỉ dưỡng Vườn Vua & Miền đầm Bạch Thủy",
    intro: "Tam Nông nằm ở ngã ba ranh giới giữa sông Đà và sông Hồng, nổi tiếng với quần thể nghỉ dưỡng khoáng nóng Vườn Vua Resort ven đầm sen Bạch Thủy và các di tích lịch sử Hưng Hóa cổ kính.",
    keywords: ["tam nông", "tam nong", "huyện tam nông", "tam nông cũ", "vườn vua", "vuon vua", "vườn vua resort", "bạch thủy", "đầm sen bạch thủy", "phúc thánh", "bánh hòn"],
    attractions: [
      { name: "Khu nghỉ dưỡng Vườn Vua Resort & Villas", category: "Nghỉ dưỡng 5 sao", desc: "Quần thể biệt thự phong cách làng quê châu Âu và phố cổ bên đầm sen Bạch Thủy thơm ngát, tắm khoáng nóng Onsen, chèo kayak và đạp xe ngắm cảnh.", icon: "🏰" },
      { name: "Đầm sen tự nhiên Bạch Thủy", category: "Thiên nhiên sinh thái", desc: "Đầm sen tự nhiên lớn bậc nhất miền Bắc, mùa hè hoa sen hồng nở ngút ngàn đến tận chân núi Ba Vì phía xa.", icon: "🪷" },
      { name: "Chùa Phúc Thánh & Căn cứ Hưng Hóa", category: "Tâm linh lịch sử", desc: "Di tích lịch sử văn hóa cấp Quốc gia thờ phụng anh linh các vị tướng lĩnh thời Trần và phong trào Cần Vương.", icon: "🏛️" },
      { name: "Cầu Trung Hà ngắm hoàng hôn ngã ba sông", category: "Check-in cảnh quan", desc: "Cây cầu nối Phú Thọ và Hà Nội bắc qua dòng sông Đà cuộn sóng, điểm dừng chân ngắm ráng chiều hoàng hôn buông lãng mạn.", icon: "🌅" },
    ],
    culinary: [
      { dish: "Bánh hòn Tam Nông (xã Dân Quyền)", desc: "Bánh làm từ bột gạo tẻ trộn mỡ hành, nhân thịt ba chỉ mộc nhĩ nêm tiêu thơm nức, luộc chín béo ngậy chấm mắm ớt ăn mãi không ngán.", places: "Làng nghề bánh hòn xã Dân Quyền, TT. Hưng Hóa" },
      { dish: "Cá lăng đầm Bạch Thủy om chuối đậu", desc: "Cá lăng tươi sống béo ngậy om cùng chuối xanh, đậu nướng và mẻ nghệ vàng ươm thơm lừng ăn kèm bún tươi.", places: "Nhà hàng Golden Lotus bên trong Vườn Vua Resort" },
      { dish: "Thịt lợn cỏ quay lá móc mật", desc: "Lợn cỏ thả vườn thịt ngọt săn chắc, nhồi lá móc mật nướng than hoa da giòn tan như bánh đa.", places: "Dọc tuyến quốc lộ 32 đoạn qua Tam Nông" },
    ],
    recommendedStay: "Vườn Vua Resort & Villas (Khu nghỉ dưỡng tiêu chuẩn 4-5 sao), Khách sạn Sao Mai Tam Nông",
    comboActionValue: "plan_tam_nong_combo",
    comboActionLabel: "✨ Lên lịch trình nghỉ dưỡng Vườn Vua Tam Nông (2N1Đ)",
  },

  "thanh-thuy": {
    id: "thanh-thuy",
    name: "Huyện Thanh Thủy",
    oldName: "Thanh Thủy cũ",
    province: "Phú Thọ",
    title: "Huyện Thanh Thủy – Thiên đường khoáng nóng Radon & Sinh thái Đảo Ngọc Xanh",
    intro: "Thanh Thủy là thủ phủ nghỉ dưỡng chăm sóc sức khỏe của miền Bắc với mỏ khoáng nóng Radon tự nhiên quý hiếm chuẩn Onsen Nhật Bản, khu vui chơi Đảo Ngọc Xanh và đền thờ Thánh Tản Viên.",
    keywords: ["thanh thủy", "thanh thuy", "huyện thanh thủy", "thanh thủy cũ", "suối khoáng nóng", "khoáng nóng thanh thủy", "đảo ngọc xanh", "đền lăng sương", "onsen", "wyndham", "tre nguồn", "bamboo"],
    attractions: [
      { name: "Khu nghỉ dưỡng Suối khoáng nóng Radon (Wyndham / Bamboo / Tre Nguồn)", category: "Nghỉ dưỡng khoáng nóng", desc: "Ngâm tắm dòng nước khoáng Radon tự nhiên quý hiếm 45-55 độ C, xông hơi đá muối Himalaya thải độc và chăm sóc sức khỏe toàn diện.", icon: "♨️" },
      { name: "Khu du lịch sinh thái Đảo Ngọc Xanh", category: "Công viên giải trí", desc: "Tổ hợp vui chơi lớn nhất vùng ven sông Đà: công viên nước, vòng quay mặt trời, rạp chiếu phim 7D, các trò chơi cảm giác mạnh và công viên khủng long.", icon: "🏝️" },
      { name: "Khu di tích lịch sử Đền Lăng Sương", category: "Tâm linh linh thiêng", desc: "Ngôi đền duy nhất thờ toàn gia Đức Thánh Tản Viên (Sơn Tinh) cùng thân mẫu Quốc Mẫu Đinh Thị Đen giữa non xanh nước biếc.", icon: "⛩️" },
      { name: "Cung đường đê sông Đà ngắm hoàng hôn Ba Vì", category: "Cảnh quan ngắm cảnh", desc: "Tuyến đường ven sông Đà lộng gió, đối diện dãy núi Ba Vì sừng sững, điểm dừng chân ngắm ráng chiều tuyệt mỹ.", icon: "🌇" },
    ],
    culinary: [
      { dish: "Cá ngạnh & Cá lăng sông Đà nướng than hoa", desc: "Cá sông tự nhiên tươi rói ướp riềng mẻ ớt cay nướng vàng trên than củi, chấm muối ớt tiêu chanh ăn kèm rau thơm tươi ngọt.", places: "Nhà hàng Cá Sông Đà Thanh Thủy, Nhà hàng Bamboo Resort" },
      { dish: "Gà đồi nướng than hoa & Dê núi sông Đà", desc: "Thịt gà đồi nướng thơm ngọt săn chắc cùng các món dê núi tái chanh, dê nướng tảng nóng hổi.", places: "Phố ẩm thực đường tỉnh DT317, thị trấn Thanh Thủy" },
      { dish: "Thịt chua Thanh Thủy cuốn lá sung", desc: "Thịt lợn sạch ủ thính ngô thơm giòn sần sật, ăn kèm lá sung đinh lăng chấm tương ớt cay ấm nồng.", places: "Các cửa hàng đặc sản dọc phố du lịch Onsen" },
    ],
    recommendedStay: "Wyndham Lynn Times Thanh Thủy (5 sao), Bamboo Resort (4 sao), Tre Nguồn Resort (3 sao)",
    comboActionValue: "plan_thanh_thuy_combo",
    comboActionLabel: "✨ Lên lịch trình nghỉ dưỡng khoáng nóng Thanh Thủy (2N1Đ / 3N2Đ)",
  },

  "thanh-son": {
    id: "thanh-son",
    name: "Huyện Thanh Sơn",
    oldName: "Thanh Sơn cũ",
    province: "Phú Thọ",
    title: "Huyện Thanh Sơn – Cửa ngõ văn hóa Mường & Thủ phủ Thịt chua Đất Tổ",
    intro: "Thanh Sơn là cửa ngõ Tây Nam Phú Thọ, nơi hội tụ nét đẹp văn hóa người Mường bản địa, các dòng suối thác nguyên sơ và món đặc sản Thịt chua nức tiếng khắp cả nước.",
    keywords: ["thanh sơn", "thanh son", "huyện thanh sơn", "thanh sơn cũ", "thịt chua thanh sơn", "nghị thịnh", "thác chòi", "cự thắng", "văn hóa mường"],
    attractions: [
      { name: "Làng nghề & Điểm trải nghiệm Thịt chua Thanh Sơn (Nghị Thịnh / Điệp Đào)", category: "Trải nghiệm làng nghề", desc: "Tham quan quy trình ủ men thính ngô truyền thống của người Mường, tự tay đóng ống giang lá chuối và thưởng thức thịt chua tươi ngon.", icon: "🥩" },
      { name: "Thác Chòi (Cự Thắng)", category: "Thiên nhiên cắm trại", desc: "Dòng thác trong vắt đổ xuống qua các phiến đá phẳng giữa rừng đại ngàn, điểm lý tưởng cho dã ngoại picnic, cắm trại và tắm suối mát lạnh.", icon: "🏞️" },
      { name: "Bản văn hóa Mường nguyên sơ Cự Đồng", category: "Du lịch cộng đồng", desc: "Những nếp nhà sàn gỗ mái lá đơn sơ, trải nghiệm giã gạo nhảy sạp, nghe hát Ví hát Rang và thưởng thức rượu hoẵng men lá.", icon: "🏡" },
      { name: "Cửa ngõ tiếp giáp Đồi chè Long Cốc", category: "Cung đường check-in", desc: "Tuyến đường uốn lượn qua các thung lũng lúa xanh mướt nối liền Thanh Sơn lên thiên đường săn mây Long Cốc.", location: "xã Long Cốc, tỉnh Phú Thọ", icon: "🍃" },
    ],
    culinary: [
      { dish: "Thịt chua Thanh Sơn truyền thống (Nghị Thịnh / Điệp Đào)", desc: "Sản vật OCOP trứ danh: thịt lợn tươi thái mỏng ủ men thính ngô thơm nức, cuốn lá sung, lá ổi, đinh lăng chấm tương ớt cay nồng đậm vị.", places: "Cơ sở Thịt chua Nghị Thịnh (Khu Ba Mỏ), Cơ sở Điệp Đào, TT. Thanh Sơn" },
      { dish: "Rêu đá suối nướng bản Mường", desc: "Rêu non mọc trên đá suối nguồn được giã sạch, ướp hạt dổi mắc khén sả ớt, gói lá chuối nướng vùi tro than thơm ngào ngạt.", places: "Các bản văn hóa Mường Cự Thắng, Cự Đồng" },
      { dish: "Cơm lam & Rượu hoẵng men lá", desc: "Cơm nếp dẻo thơm nướng ống nứa chấm muối vừng cùng chén rượu hoẵng ngọt êm ru lòng người.", places: "Nhà hàng ẩm thực Mường Đất Tổ, TT. Thanh Sơn" },
    ],
    recommendedStay: "Khách sạn Thanh Sơn Plaza, Homestay nhà sàn Bản Mường",
    comboActionValue: "plan_thanh_son_combo",
    comboActionLabel: "✨ Lên lịch trình khám phá văn hóa & ẩm thực Thanh Sơn",
  },

  "tan-son": {
    id: "tan-son",
    name: "Huyện Tân Sơn",
    oldName: "Tân Sơn cũ",
    province: "Phú Thọ",
    title: "Huyện Tân Sơn – Ốc đảo chè Long Cốc & Vườn quốc gia Xuân Sơn đại ngàn",
    intro: "Tân Sơn là huyện vùng cao hùng vĩ nhất Phú Thọ, sở hữu 'ốc đảo chè đẹp nhất Việt Nam' Long Cốc với hàng trăm quả đồi bát úp nhấp nhô và VQG Xuân Sơn hoang sơ kỳ vĩ.",
    keywords: ["tân sơn", "tan son", "huyện tân sơn", "tân sơn cũ", "long cốc", "long coc", "đồi chè long cốc", "xuân sơn", "xuan son", "vườn quốc gia xuân sơn", "hang lạng", "bản cỏi", "bản dù", "gà nhiều cựa"],
    attractions: [
      { name: "Đồi chè bát úp Long Cốc (Ốc đảo chè đẹp nhất Việt Nam)", category: "Kỳ quan thiên nhiên", desc: "Hàng trăm quả đồi chè hình bát úp tròn xoe nhấp nhô giữa thung lũng, buổi sớm mây mù bồng bềnh tựa chốn bồng lai tiên cảnh.", location: "xã Long Cốc, tỉnh Phú Thọ", icon: "🍃" },
      { name: "Vườn quốc gia Xuân Sơn", category: "Rừng nguyên sinh", desc: "Lá phổi xanh ngút ngàn với hệ sinh thái rừng nhiệt đới trên núi đá vôi nguyên sinh, sông suối trong veo mát lạnh quanh năm.", location: "xã Xuân Đài, tỉnh Phú Thọ", icon: "🌲" },
      { name: "Hang Lạng & Hang Na kỳ vĩ", category: "Hang động thạch nhũ", desc: "Hệ thống hang ngầm xuyên lòng núi đá vôi dài hàng ngàn mét với muôn vàn thạch nhũ lấp lánh như cung điện dưới lòng đất.", location: "xã Xuân Đài, tỉnh Phú Thọ", icon: "🦇" },
      { name: "Bản Cỏi & Bản Dù văn hóa Dao Tiền", category: "Bản làng cộng đồng", desc: "Bản làng người Dao Tiền và người Mường mộc mạc bên suối, nơi lưu giữ phong tục thêu váy chàm dệt thổ cẩm và nghề nuôi gà chín cựa.", icon: "🏡" },
    ],
    culinary: [
      { dish: "Gà chín cựa (gà nhiều cựa) Xuân Sơn tiến Vua", desc: "Giống gà quý hiếm trong truyền thuyết Sơn Tinh - Thủy Tinh, thịt ngọt thơm đậm đà, da giòn sần sật luộc rắc lá chanh hoặc nướng than hoa.", places: "Các homestay bản Cỏi, bản Dù VQG Xuân Sơn" },
      { dish: "Vịt suối nướng than hoa & Lợn lửng cắp nách", desc: "Vịt bơi suối thịt ngọt không mỡ tẩm ướp hạt dổi mắc khén nướng vàng ruộm trên than củi.", places: "Homestay Lâm Xuân Cỏi, Homestay Quỳnh Nga Long Cốc" },
      { dish: "Rau dớn rừng xào tỏi & Canh măng đắng", desc: "Rau dớn hái bên bờ suối non giòn xanh mướt xào tỏi thơm phức, đượm vị núi rừng nguyên sinh.", places: "Tất cả các bản homestay Tân Sơn" },
    ],
    recommendedStay: "Homestay Long Cốc (Homestay Quỳnh Nga, Homestay Đồi Chè), Homestay Bản Cỏi VQG Xuân Sơn",
    comboActionValue: "plan_long_coc",
    comboActionLabel: "✨ Lên tour săn mây Long Cốc & Khám phá Xuân Sơn (2N1Đ)",
  },

  "yen-lap": {
    id: "yen-lap",
    name: "Huyện Yên Lập",
    oldName: "Yên Lập cũ",
    province: "Phú Thọ",
    title: "Huyện Yên Lập – Miền xanh lòng hồ Ly thơ mộng & Núi rừng nguyên sơ",
    intro: "Yên Lập là huyện miền núi phía Tây Phú Thọ, nổi tiếng với hồ Ly (hồ Thượng Long) làn nước xanh biếc như ngọc bích phẳng lặng giữa thung lũng và bản sắc văn hóa Mường, Dao đậm đà.",
    keywords: ["yên lập", "yen lap", "huyện yên lập", "yên lập cũ", "hồ ly", "hồ thượng long", "ho ly", "thượng long", "núi rừng yên lập"],
    attractions: [
      { name: "Khu du lịch sinh thái Hồ Ly (Hồ Thượng Long)", category: "Sinh thái hồ nước", desc: "Hồ nước ngọt nhân tạo lớn nhất vùng với mặt nước trong xanh phẳng lặng như gương, cây cầu treo sắt bắc qua eo hồ tuyệt đẹp như tranh thủy mặc.", icon: "🌊" },
      { name: "Rừng phòng hộ Yên Lập & Suối đá Thượng Long", category: "Thiên nhiên hoang sơ", desc: "Những vạt rừng xanh thẳm, dòng suối mát lành róc rách qua ghềnh đá, điểm trekking dã ngoại dành cho người yêu thiên nhiên.", icon: "🌲" },
      { name: "Bản văn hóa Mường - Dao Yên Lập", category: "Văn hóa bản sắc", desc: "Trải nghiệm đời sống sinh hoạt chân tình của đồng bào dân tộc thiểu số, phong tục cúng rừng và làn điệu cồng chiêng rộn rã.", icon: "🏡" },
    ],
    culinary: [
      { dish: "Cá hồ Ly nướng que than củi", desc: "Cá mè, cá trắm bắt tươi từ lòng hồ Ly thịt săn ngọt, nướng than củi mộc mạc chấm muối ớt cay xè.", places: "Các quán ăn ven bến đò Hồ Ly, xã Thượng Long" },
      { dish: "Thịt lợn đen treo gác bếp chấm chẩm chéo", desc: "Thịt lợn bản ướp gia vị hong khói bếp củi thơm mùi gỗ rừng, thái lát mỏng nhắm cùng rượu ngô men lá.", places: "Chợ huyện Yên Lập, xã Thượng Long" },
      { dish: "Xôi ngũ sắc & Măng nứa luộc chấm muối vừng", desc: "Nếp nương dẻo quánh đồ lá cẩm lá gấc rực rỡ sắc màu cùng đĩa măng nứa ngọt lịm vừa hái trên nương.", places: "Các hộ làm du lịch cộng đồng Yên Lập" },
    ],
    recommendedStay: "Nhà nghỉ sinh thái ven hồ Ly, Nhà nghỉ trung tâm TT. Yên Lập",
    comboActionValue: "plan_yen_lap_combo",
    comboActionLabel: "✨ Lên lịch trình check-in Hồ Ly & Núi rừng Yên Lập",
  },

  // =========================================================================
  // 2. TỈNH VĨNH PHÚC (9 ĐƠN VỊ HÀNH CHÍNH CŨ / HIỆN HỮU)
  // =========================================================================
  "vinh-yen": {
    id: "vinh-yen",
    name: "TP. Vĩnh Yên",
    oldName: "Vĩnh Yên cũ",
    province: "Vĩnh Phúc",
    title: "TP. Vĩnh Yên – Trái tim đô thị Đầm Vạc & Cổ tự thanh tịnh",
    intro: "TP. Vĩnh Yên là trung tâm tỉnh lỵ Vĩnh Phúc, nổi danh với thắng cảnh Đầm Vạc mênh mông, chùa Tích Sơn nghìn năm tuổi và nền ẩm thực thủy sản đầm nước ngọt phong phú.",
    keywords: ["vĩnh yên", "vinh yen", "tp vĩnh yên", "thành phố vĩnh yên", "đầm vạc", "dam vac", "chùa tích sơn", "chùa hà tiên", "quảng trường vĩnh yên"],
    attractions: [
      { name: "Khu du lịch sinh thái Đầm Vạc", category: "Sinh thái hồ nước", desc: "Hồ đầm tự nhiên lớn ví như viên ngọc bích giữa lòng thành phố, có sân golf Đầm Vạc chuẩn quốc tế và khu nghỉ dưỡng sinh thái ven hồ.", icon: "🦢" },
      { name: "Chùa Tích Sơn cổ tự", category: "Cổ tự tâm linh", desc: "Ngôi chùa cổ kính xây dựng từ thời Hậu Lê rợp bóng bồ đề, di tích kiến trúc nghệ thuật cấp Quốc gia linh thiêng.", icon: "🛕" },
      { name: "Chùa Hà Tiên (Chùa Phật giáo lớn)", category: "Tâm linh danh thắng", desc: "Quần thể chùa nguy nga hoành tráng trên đồi cao với tháp Phật 9 tầng và không gian tâm linh thanh tịnh.", location: "Phường Vĩnh Yên, tỉnh Phú Thọ", icon: "⛩️" },
      { name: "Quảng trường Hồ Chí Minh & Phố đi bộ Vĩnh Yên", category: "Check-in đô thị", desc: "Không gian sinh hoạt cộng đồng sôi động về đêm với nhạc nước, ẩm thực đường phố và các quán cà phê hiện đại.", icon: "🌆" },
    ],
    culinary: [
      { dish: "Tép dầu Đầm Vạc kho tương", desc: "Đặc sản dân dã nức tiếng: tép tươi rói bắt từ Đầm Vạc kho nhừ với tương nếp gừng ớt, cắn ngập miệng bùi béo ngọt xương thơm lừng.", places: "Các nhà hàng quanh hồ Đầm Vạc, đường Lý Bôn" },
      { dish: "Chả trai Đầm Vạc nướng than hoa", desc: "Thịt trai đầm băm nhỏ trộn mộc nhĩ nạc mỡ hành hoa bọc lá lốt nướng xèo xèo thơm ngát.", places: "Nhà hàng Đầm Vạc, P. Ngô Quyền" },
      { dish: "Bánh cuốn nấm gà phố cổ Vĩnh Yên", desc: "Bánh cuốn mỏng dẻo nhân thịt băm mộc nhĩ nấm hương ăn kèm nước dùng gà ngọt thấu xương.", places: "Dãy quán phố cổ Chiền, P. Ngô Quyền" },
    ],
    recommendedStay: "Khách sạn DIC Star Vĩnh Yên (5 sao), Sông Hồng Resort (4 sao bên Đầm Vạc)",
    comboActionValue: "plan_vinh_yen_combo",
    comboActionLabel: "✨ Lên lịch trình TP. Vĩnh Yên & Đầm Vạc (1N / 2N1Đ)",
  },

  "phuc-yen": {
    id: "phuc-yen",
    name: "TP. Phúc Yên",
    oldName: "Phúc Yên cũ",
    province: "Vĩnh Phúc",
    title: "TP. Phúc Yên – Thiên đường nghỉ dưỡng Đại Lải & Rừng thông lãng mạn",
    intro: "TP. Phúc Yên là cửa ngõ giáp Hà Nội, nổi tiếng với hồ Đại Lải mênh mông, quần thể nghỉ dưỡng nghệ thuật Flamingo Đại Lải đẳng cấp và đặc sản thịt trâu tươi nướng tảng.",
    keywords: ["phúc yên", "phuc yen", "tp phúc yên", "thành phố phúc yên", "đại lải", "dai lai", "hồ đại lải", "flamingo đại lải", "ngọc thanh"],
    attractions: [
      { name: "Khu du lịch Hồ Đại Lải & Flamingo Đại Lải Resort", category: "Nghỉ dưỡng đẳng cấp", desc: "Khu resort nghệ thuật ven hồ Đại Lải với rừng thông xanh mướt, biệt thự trên bán đảo, bảo tàng nghệ thuật trong rừng và chèo kayak.", location: "Phường Xuân Hòa, tỉnh Phú Thọ", icon: "🌲" },
      { name: "Đảo Ngọc (Đảo Chim hồ Đại Lải)", category: "Sinh thái ngắm cảnh", desc: "Hòn đảo xanh giữa lòng hồ Đại Lải nơi hàng vạn cánh chim về trú ngụ, không gian hoang sơ lãng mạn thanh bình.", location: "Phường Xuân Hòa, tỉnh Phú Thọ", icon: "🏝️" },
      { name: "Chiến khu cách mạng Ngọc Thanh", category: "Di tích lịch sử", desc: "Khu căn cứ địa kháng chiến kiên cường giữa thung lũng đồi núi rợp bóng rừng thông và suối Reo.", icon: "🚩" },
    ],
    culinary: [
      { dish: "Thịt trâu tươi nướng tảng Đại Lải", desc: "Thịt trâu giật tươi nguyên tảng nướng trên than hoa hồng rực, ngoài se chín vàng trong ngọt mềm mọng nước chấm tương bần muối ớt.", places: "Nhà hàng Trâu Phi Xuyên Đại Lải, Nhà hàng Trâu Gió Đồng (Nguyễn Tất Thành)" },
      { dish: "Cá lăng nướng hồ Đại Lải", desc: "Cá lăng đầm nước sâu thịt béo ngậy ướp riềng mẻ nướng than ăn kèm bánh tráng cuốn rau rừng.", places: "Dọc trục đường ven hồ Đại Lải, xã Ngọc Thanh" },
      { dish: "Gà đồi bọc đất sét nướng củi", desc: "Gà thả đồi thịt dai ngọt bọc đất sét nướng củi giữ nguyên tinh túy vị ngọt tự nhiên của núi đồi.", places: "Khu du lịch sinh thái Ngọc Thanh" },
    ],
    recommendedStay: "Flamingo Đại Lải Resort (5 sao), Paradise Dai Lai Resort",
    comboActionValue: "plan_phuc_yen_combo",
    comboActionLabel: "✨ Lên lịch trình nghỉ dưỡng Hồ Đại Lải (2N1Đ / 3N2Đ)",
  },

  "tam-dao": {
    id: "tam-dao",
    name: "Huyện Tam Đảo",
    oldName: "Tam Đảo cũ",
    province: "Vĩnh Phúc",
    title: "Huyện Tam Đảo – Thị trấn trong sương & Danh thắng Tây Thiên huyền ảo",
    intro: "Tam Đảo tọa lạc ở độ cao hơn 900m trên dãy núi Tam Đảo với khí hậu 4 mùa trong một ngày, thị trấn sương mờ phong cách châu Âu và quần thể danh thắng tâm linh Tây Thiên.",
    keywords: ["tam đảo", "tam dao", "huyện tam đảo", "tam đảo cũ", "tây thiên", "tay thien", "nhà thờ đá tam đảo", "quán gió", "cầu mây", "thác bạc", "đại bảo tháp mandala"],
    attractions: [
      { name: "Nhà thờ Đá cổ & Quảng trường trung tâm Tam Đảo", category: "Kiến trúc Gothic", desc: "Kiến trúc đá thời Pháp cổ kính đứng uy nghiêm giữa màn sương mù, biểu tượng check-in số một của thị trấn Tam Đảo.", location: "xã Tam Đảo, tỉnh Phú Thọ", icon: "🏰" },
      { name: "Cổng Trời, Cầu Mây & Quán Gió Tam Đảo", category: "Săn mây - ngắm cảnh", desc: "Điểm ngắm mây và hoàng hôn ngoạn mục, ôm trọn thung lũng bồng bềnh mây trắng và thưởng thức ly cà phê ấm nóng.", location: "xã Tam Đảo, tỉnh Phú Thọ", icon: "☁️" },
      { name: "Thác Bạc Tam Đảo", category: "Thiên nhiên hùng vĩ", desc: "Dòng thác trắng xóa ẩn mình giữa rừng sâu xanh biếc, không khí mát rượi quanh năm.", location: "xã Tam Đảo, tỉnh Phú Thọ", icon: "🌊" },
      { name: "Quần thể Danh thắng & Cáp treo Tây Thiên", category: "Tâm linh quốc gia", desc: "Nơi giao thoa giữa tín ngưỡng thờ Quốc Mẫu Tây Thiên và Phật giáo Trúc Lâm, Đại bảo tháp Mandala và đền Thượng uy nghiêm.", location: "xã Đại Đình, tỉnh Phú Thọ", icon: "🛕" },
    ],
    culinary: [
      { dish: "Ngọn su su Tam Đảo xào tỏi / luộc chấm muối vừng", desc: "Đặc sản số một: ngọn su su non mơn mởn trồng trên núi mây quanh năm giòn sần sật, ngọt lịm tự nhiên xào tỏi thơm phức.", places: "Phúc Hương Viên Tam Đảo, Nhà hàng Hải Yến, Chợ đêm Tam Đảo" },
      { dish: "Gà đồi Tam Đảo bọc giấy bạc nướng than", desc: "Gà đồi thả sườn dốc thịt ngọt chắc, ướp tiêu rừng và lá chanh nướng than hoa thơm nức mũi.", places: "Khu chợ đêm ẩm thực trung tâm thị trấn" },
      { dish: "Thịt lợn mán xiên que nướng hạt dổi", desc: "Xiên thịt lợn mán ướp gia vị mắc khén hạt dổi nướng xèo xèo thơm phức giữa không khí se lạnh mây mù.", places: "Phố nướng chợ đêm Tam Đảo" },
    ],
    recommendedStay: "Venus Hotel Tam Đảo (4 sao), Tam Đảo Hideaway Homestay, Khách sạn Mela",
    comboActionValue: "plan_tam_dao_combo",
    comboActionLabel: "✨ Lên lịch trình khám phá Tam Đảo & Tây Thiên (2N1Đ / 3N2Đ)",
  },

  "binh-xuyen": {
    id: "binh-xuyen",
    name: "Huyện Bình Xuyên",
    oldName: "Bình Xuyên cũ",
    province: "Vĩnh Phúc",
    title: "Huyện Bình Xuyên – Làng gốm cổ Hương Canh & Bánh hòn nức tiếng",
    intro: "Bình Xuyên nằm ở phía Đông Nam Vĩnh Phúc, nổi danh với làng nghề gốm sành Hương Canh hơn 300 năm tuổi giữ trọn chất đất mộc mạc và món bánh hòn, bánh nẳng ngọt bùi.",
    keywords: ["bình xuyên", "binh xuyen", "huyện bình xuyên", "bình xuyên cũ", "hương canh", "gốm hương canh", "bánh hòn hương canh", "hồ gia khau"],
    attractions: [
      { name: "Làng nghề Gốm cổ Hương Canh", category: "Làng nghề di sản", desc: "Làng gốm sành nức tiếng hàng trăm năm: chum, vại, ấm chén gốm mộc không tráng men mà nước không ngấm, tiếng gõ kêu đanh như chuông đồng.", location: "xã Bình Nguyên, tỉnh Phú Thọ", icon: "🏺" },
      { name: "Cụm di tích Đình Hương Canh cổ kính", category: "Kiến trúc nghệ thuật", desc: "Ngôi đình cổ thời Hậu Lê với nghệ thuật chạm khắc gỗ tinh xảo bậc nhất xứ Đoài.", location: "xã Bình Nguyên, tỉnh Phú Thọ", icon: "🏛️" },
      { name: "Hồ Gia Khau sinh thái", category: "Thiên nhiên dã ngoại", desc: "Hồ nước yên bình rợp bóng cây xanh, điểm câu cá dã ngoại cuối tuần của người dân địa phương.", icon: "🎣" },
    ],
    culinary: [
      { dish: "Bánh hòn Hương Canh", desc: "Bánh làm từ bột gạo tẻ dẻo thơm, nhân thịt lợn băm mộc nhĩ hành hoa, ăn lúc nóng béo ngậy mềm môi chấm nước mắm tiêu ớt.", places: "Chợ Cánh, TT. Hương Canh" },
      { dish: "Bánh nẳng Hương Canh chấm mật mía", desc: "Bánh ngâm nước tro thảo mộc trong veo màu hổ phách, dẻo quánh thanh mát chấm mật mía ngọt ngào.", places: "Làng nghề Hương Canh" },
      { dish: "Rượu gốm chum sành Hương Canh", desc: "Rượu nếp cái hoa vàng hạ thổ trong chum gốm Hương Canh nhiều năm thơm nồng êm dịu.", places: "Các lò gốm Hương Canh" },
    ],
    recommendedStay: "Nghỉ tại TP. Vĩnh Yên hoặc Phúc Yên (chỉ cách 5-7 km)",
    comboActionValue: "plan_binh_xuyen_combo",
    comboActionLabel: "✨ Lên tour trải nghiệm làm gốm & ẩm thực Hương Canh",
  },

  "vinh-tuong": {
    id: "vinh-tuong",
    name: "Huyện Vĩnh Tường",
    oldName: "Vĩnh Tường cũ",
    province: "Vĩnh Phúc",
    title: "Huyện Vĩnh Tường – Vùng đầm Rưng trù phú & Làng nghề xứ Đoài",
    intro: "Vĩnh Tường nằm ven bờ sông Hồng trù phú phù sa, nổi tiếng với đầm sinh thái Đầm Rưng, làng rèn Lý Nhân, di tích Đình Thổ Tang cổ kính và đặc sản bánh trùng mật mía.",
    keywords: ["vĩnh tường", "vinh tuong", "huyện vĩnh tường", "vĩnh tường cũ", "đầm rưng", "thổ tang", "đình thổ tang", "lý nhân", "bánh trùng mật mía", "vĩnh thịnh"],
    attractions: [
      { name: "Khu du lịch sinh thái Đầm Rưng", category: "Sinh thái hồ nước", desc: "Đầm nước ngọt tự nhiên mênh mông, không khí trong lành với các dịch vụ chèo thuyền, câu cá thư giãn cuối tuần.", icon: "🏞️" },
      { name: "Đình Thổ Tang & Chùa Tùng Vân", category: "Di tích quốc gia", desc: "Ngôi đình làng cổ kính bậc nhất xứ Đoài với những bức phù điêu gỗ thế kỷ 17 chạm trổ sinh hoạt dân gian sống động.", icon: "🛕" },
      { name: "Làng rèn truyền thống Lý Nhân", category: "Làng nghề thủ công", desc: "Làng nghề rèn sắt dao kéo thủ công hàng trăm năm tuổi lửa đỏ bập bùng suốt ngày đêm.", icon: "⚒️" },
    ],
    culinary: [
      { dish: "Bánh trùng mật mía Vĩnh Tường", desc: "Bánh bột nếp trắng mềm thả trong nước mật mía vàng óng sủi tăm gừng già thơm cay ấm nồng, rắc vừng rang bùi béo.", places: "Chợ Thổ Tang, TT. Tứ Trưng" },
      { dish: "Sữa tươi & Sữa chua nếp cẩm Vĩnh Thịnh", desc: "Thủ phủ bò sữa Vĩnh Phúc với dòng sữa tươi nguyên chất thơm ngậy, sữa chua nhà làm tươi ngon bổ dưỡng.", places: "Vùng chăn nuôi bò sữa xã Vĩnh Thịnh" },
      { dish: "Đậu phụ làng Rùa nướng than hoa", desc: "Bìa đậu mềm mượt nướng trên than hoa phồng rộp chấm mắm tôm chanh ớt ngon khó cưỡng.", places: "Xã Tuân Chính, Vĩnh Tường" },
    ],
    recommendedStay: "Nhà nghỉ trung tâm thị trấn Vĩnh Tường, Khách sạn Thổ Tang",
    comboActionValue: "plan_vinh_tuong_combo",
    comboActionLabel: "✨ Lên lịch trình khám phá Đầm Rưng & Làng cổ Thổ Tang",
  },

  "yen-lac": {
    id: "yen-lac",
    name: "Huyện Yên Lạc",
    oldName: "Yên Lạc cũ",
    province: "Vĩnh Phúc",
    title: "Huyện Yên Lạc – Di chỉ khảo cổ Đồng Đậu & Làng nghề mộc mỹ nghệ",
    intro: "Yên Lạc là cái nôi khảo cổ học Đồng Đậu tiêu biểu cho 4 giai đoạn văn hóa tiền sử sông Hồng, vùng đồng bằng trù phú với các làng nghề mộc truyền thống lâu đời.",
    keywords: ["yên lạc", "yen lac", "huyện yên lạc", "yên lạc cũ", "đồng đậu", "di chỉ đồng đậu", "tề lỗ", "chùa biện sơn"],
    attractions: [
      { name: "Di chỉ khảo cổ học Quốc gia Đồng Đậu", category: "Di tích tiền sử", desc: "Nơi lưu giữ các tầng văn hóa Phùng Nguyên - Đồng Đậu - Gò Mun - Đông Sơn với rìu đồng, thạp đồng chứng minh cội nguồn dân tộc.", location: "xã Yên Lạc, tỉnh Phú Thọ", icon: "🏺" },
      { name: "Chùa Biện Sơn & Đền Tranh", category: "Tâm linh cổ tự", desc: "Cụm di tích cổ kính rợp bóng cây cổ thụ lưu giữ nhiều bia đá, hoành phi câu đối quý thời Lê - Nguyễn.", icon: "⛩️" },
      { name: "Làng nghề mộc mỹ nghệ Tề Lỗ & Đồng Văn", category: "Làng nghề truyền thống", desc: "Nơi các nghệ nhân chạm khắc đồ gỗ mỹ nghệ tinh xảo phục vụ khắp các tỉnh miền Bắc.", icon: "🪵" },
    ],
    culinary: [
      { dish: "Rượu nếp Yên Lạc hạ thổ", desc: "Rượu ủ từ men thuốc bắc và gạo nếp cái bãi bồi, hạ thổ chum sành uống êm ru không đau đầu.", places: "Làng nghề rượu Yên Lạc" },
      { dish: "Bánh gai làng Yên Lạc", desc: "Vỏ bánh đen nhánh dẻo quánh mùi lá gai, nhân đậu xanh dừa nạo thịt mỡ đường phèn thơm ngọt đậm đà.", places: "Chợ Lạc Xuyên, TT. Yên Lạc" },
      { dish: "Cá chép sông Hồng om dưa", desc: "Cá chép sông đánh bắt từ các bãi bồi ven đê om cùng dưa muối giòn chua nóng hổi.", places: "Các nhà hàng ven đê tả sông Hồng" },
    ],
    recommendedStay: "Nghỉ tại TP. Vĩnh Yên (cách Yên Lạc chỉ 7 km)",
    comboActionValue: "plan_yen_lac_combo",
    comboActionLabel: "✨ Lên tour tìm hiểu Di chỉ Đồng Đậu & Yên Lạc",
  },

  "lap-thach": {
    id: "lap-thach",
    name: "Huyện Lập Thạch",
    oldName: "Lập Thạch cũ",
    province: "Vĩnh Phúc",
    title: "Huyện Lập Thạch – Đất Cá thính chua thơm lừng & Tháp gốm Chùa Trò",
    intro: "Lập Thạch nằm ở vùng bán sơn địa phía Tây Vĩnh Phúc, nổi danh với di sản ẩm thực Cá thính chua muối thính ngô nức tiếng và di tích Tháp gốm men Chùa Trò - Bảo vật Quốc gia.",
    keywords: ["lập thạch", "lap thach", "huyện lập thạch", "lập thạch cũ", "cá thính lập thạch", "tháp chùa trò", "trần nguyên hãn", "đền trần nguyên hãn"],
    attractions: [
      { name: "Đền thờ Tả Tướng quốc Trần Nguyên Hãn", category: "Lịch sử anh hùng", desc: "Di tích lịch sử Quốc gia phụng thờ vị tướng tài ba có công lớn cùng Lê Lợi đánh tan giặc Minh trong khởi nghĩa Lam Sơn.", icon: "🏛️" },
      { name: "Tháp gốm men Chùa Trò (Bảo vật Quốc gia)", category: "Bảo vật vô giá", desc: "Cổ tháp bằng gốm tráng men thời Trần tinh xảo tuyệt mỹ, kiệt tác nghệ thuật kiến trúc Phật giáo cổ xưa.", icon: "🛕" },
      { name: "Đồi Sáng Lập Thạch & Làng mây tre đan Triệu Đề", category: "Sinh thái làng nghề", desc: "Khung cảnh đồi cọ thanh bình và làng nghề đan lát mây tre truyền thống khéo léo.", icon: "🧺" },
    ],
    culinary: [
      { dish: "Cá thính Lập Thạch (Món quà ẩm thực trứ danh)", desc: "Cá thính ngon bậc nhất miền Bắc: cá trôi, cá mè được ướp muối vừa vặn, bóp thính ngô rang thơm vàng rồi ủ trong chum sành gài thanh tre. Khi nướng lên mùi thính thơm nức bùi ngậy tê tái đầu lưỡi.", places: "Làng cá thính Văn Quán, Chợ Lập Thạch, Dọc đường tỉnh 305" },
      { dish: "Bánh gạo Tiên Lữ", desc: "Bánh làm từ bột gạo giã tay mịn màng, nướng than hoa phồng xốp giòn rụm chấm nước mật ấm nóng.", places: "Xã Tiên Lữ, Lập Thạch" },
      { dish: "Chè kho Lập Thạch", desc: "Chè đậu xanh mịn màng ngọt thanh rắc vừng rang, món quà cúng gia tiên linh thiêng ngày Tết.", places: "Chợ hoa thị trấn Lập Thạch" },
    ],
    recommendedStay: "Nhà nghỉ Hoàng Anh TT. Lập Thạch, Nhà khách Lập Thạch",
    comboActionValue: "plan_lap_thach_combo",
    comboActionLabel: "✨ Lên lịch trình trải nghiệm văn hóa & Cá thính Lập Thạch",
  },

  "song-lo": {
    id: "song-lo",
    name: "Huyện Sông Lô",
    oldName: "Sông Lô cũ",
    province: "Vĩnh Phúc",
    title: "Huyện Sông Lô – Danh thắng Núi Sáng Thác Bay & Thiền viện Tuệ Đức",
    intro: "Sông Lô là huyện vùng núi phía Tây Bắc Vĩnh Phúc tựa lưng vào dãy núi Sáng hùng vĩ nhìn ra dòng sông Lô lịch sử, nổi bật với Thác Bay kỳ ảo và Thiền viện Trúc Lâm Tuệ Đức.",
    keywords: ["sông lô", "song lo", "huyện sông lô", "sông lô cũ", "núi sáng", "thác bay", "tuệ đức", "thiền viện tuệ đức", "hang đề thám"],
    attractions: [
      { name: "Quần thể Danh thắng Núi Sáng – Thác Bay", category: "Thiên nhiên hoang sơ", desc: "Đỉnh núi Sáng cao hơn 600m với Thác Bay nước đổ từ lưng trời tung bọt trắng xóa giữa rừng đại ngàn, điểm trekking tuyệt mỹ.", icon: "🌊" },
      { name: "Thiền viện Trúc Lâm Tuệ Đức", category: "Thiền phái Trúc Lâm", desc: "Ngôi thiền viện thanh tịnh tựa lưng vào sườn núi Sáng nhìn ra thung lũng, nơi chiêm bái tu tập tĩnh tại tâm hồn.", icon: "⛩️" },
      { name: "Bến phà Then ven sông Lô & Hang Đề Thám", category: "Lịch sử cảnh quan", desc: "Địa danh lịch sử thơ mộng nối liền Vĩnh Phúc và Phú Thọ qua làn nước xanh mát của dòng sông Lô.", icon: "⛵" },
    ],
    culinary: [
      { dish: "Canh rau sắng núi Sáng", desc: "Lá rau sắng mọc tự nhiên trên các vách núi đá vôi nấu canh tép hoặc thịt nạc có vị ngọt đậm đà khó tả.", places: "Các quán ăn chân núi Sáng, xã Đồng Quế" },
      { dish: "Cá sông Lô nướng ống tre", desc: "Cá bắt từ lòng sông Lô ướp hạt dổi sả ớt nhồi trong ống tre nướng than hồng thơm ngọt nguyên vị.", places: "Khu vực bến đò Then, xã Yên Thạch" },
      { dish: "Chè hoa vàng Sông Lô", desc: "Loài hoa dược liệu quý mệnh danh 'nữ hoàng trà', nước pha vàng óng vị ngọt hậu thanh lọc cơ thể.", places: "HTX Dược liệu Sông Lô" },
    ],
    recommendedStay: "Homestay sinh thái chân núi Sáng, Nhà nghỉ TT. Tam Sơn",
    comboActionValue: "plan_song_lo_combo",
    comboActionLabel: "✨ Lên tour trekking Núi Sáng & Thiền viện Tuệ Đức",
  },

  "tam-duong": {
    id: "tam-duong",
    name: "Huyện Tam Dương",
    oldName: "Tam Dương cũ",
    province: "Vĩnh Phúc",
    title: "Huyện Tam Dương – Vườn quả Hướng Đạo & Rừng cò thanh bình",
    intro: "Tam Dương là vùng bán sơn địa màu mỡ tiếp giáp Tam Đảo, nổi tiếng với giống gà đồi Tam Dương thả vườn chắc thịt, vùng dứa đồi Hướng Đạo ngọt mát và các di tích cổ.",
    keywords: ["tam dương", "tam duong", "huyện tam dương", "tam dương cũ", "hướng đạo", "dứa hướng đạo", "gà đồi tam dương"],
    attractions: [
      { name: "Vườn đồi dứa Hướng Đạo bạt ngàn", category: "Nông nghiệp check-in", desc: "Những nương dứa xanh mát trải dài khắp các triền đồi, mùa quả chín vàng rực tỏa hương thơm lừng, điểm check-in nông trại mới lạ.", icon: "🍍" },
      { name: "Chùa Quảng Đức & Cổ tự Tam Dương", category: "Tâm linh thanh tịnh", desc: "Ngôi chùa cổ kính nằm bình yên giữa làng quê thanh bình rợp bóng đa cổ thụ.", icon: "🛕" },
      { name: "Khu sinh thái đồi gò Tam Dương", category: "Dã ngoại sinh thái", desc: "Không gian vườn đồi cây trái xanh tươi, thích hợp cho các buổi dã ngoại cắm trại gia đình.", icon: "🌳" },
    ],
    culinary: [
      { dish: "Gà đồi Tam Dương nướng mật ong", desc: "Gà nuôi thả tự do trên các triền đồi sỏi ăn ngô thóc, thịt dai ngọt tự nhiên phết mật ong nướng vàng óng.", places: "Các nhà hàng đồi gò xã Hợp Thịnh, TT. Hợp Hòa" },
      { dish: "Dứa chín đồi Hướng Đạo", desc: "Dứa mật quả to mắt căng vàng ươm, vị ngọt đậm đà nhiều nước ăn giải nhiệt ngày hè.", places: "Dọc tuyến quốc lộ 2C đoạn qua Hướng Đạo" },
      { dish: "Bánh hòn Tam Dương chấm muối ớt", desc: "Món bánh dân dã béo bùi từ bột nếp và đỗ xanh nhân thịt thơm phức.", places: "Chợ trung tâm Hợp Hòa" },
    ],
    recommendedStay: "Nghỉ tại TP. Vĩnh Yên (chỉ cách 5 km)",
    comboActionValue: "plan_tam_duong_combo",
    comboActionLabel: "✨ Lên lịch trình khám phá nông trại Tam Dương",
  },

  // =========================================================================
  // 3. TỈNH HÒA BÌNH (10 ĐƠN VỊ HÀNH CHÍNH CŨ / HIỆN HỮU)
  // =========================================================================
  "tp-hoa-binh": {
    id: "tp-hoa-binh",
    name: "TP. Hòa Bình",
    oldName: "TP. Hòa Bình cũ",
    province: "Hòa Bình",
    title: "TP. Hòa Bình – Công trình Thủy điện thế kỷ & Bảo tàng Văn hóa Mường",
    intro: "TP. Hòa Bình là thủ phủ xứ Mường bên dòng sông Đà hùng vĩ, nổi danh với Nhà máy Thủy điện Hòa Bình lịch sử, Tượng đài Bác Hồ và Bảo tàng Không gian Văn hóa Mường độc đáo.",
    keywords: ["tp hòa bình", "hòa bình", "hoa binh", "thành phố hòa bình", "tp hòa bình cũ", "thủy điện hòa bình", "bảo tàng mường", "giang mỗ", "sông đà"],
    attractions: [
      { name: "Nhà máy Thủy điện Hòa Bình (Công trình thế kỷ)", category: "Công trình lịch sử", desc: "Kỳ tích chinh phục sông Đà với đập xả tràn khổng lồ, hầm tổ máy phát điện ngầm trong lòng núi và Tượng đài Bác Hồ uy nghi cao 18m.", location: "phường Thống Nhất, tỉnh Phú Thọ", icon: "⚡" },
      { name: "Bảo tàng Không gian Văn hóa Mường", category: "Văn hóa dân tộc", desc: "Quần thể nhà sàn cổ tái hiện trọn vẹn đời sống văn hóa, phong tục, trang phục và công cụ lao động 4 tầng lớp xã hội Mường.", location: "Số 202 đường Tây Tiến, phường Thái Bình, tỉnh Phú Thọ", icon: "🏛️" },
      { name: "Bản du lịch văn hóa Giang Mỗ (dưới chân núi Mỗ)", category: "Bản làng cộng đồng", desc: "Hơn 100 nếp nhà sàn Mường cổ nguyên vẹn nép mình bên sườn núi đá vôi, trải nghiệm giã gạo nhảy sạp và nghe hát sắc bùa.", icon: "🏡" },
      { name: "Đền Chúa Thác Bờ (Cảng Thung Nai)", category: "Tâm linh linh thiêng", desc: "Nơi phụng thờ Bà chúa Thác Bờ Đinh Thị Vân giúp vua Lê Lợi dẹp loạn giữ yên bờ cõi.", location: "xóm Săng Bờ, xã Tiền Phong, tỉnh Phú Thọ", icon: "⛩️" },
    ],
    culinary: [
      { dish: "Cá lăng & Cá chiên sông Đà nướng than hoa", desc: "Cá tươi ngon bắt từ dòng nước xiết sông Đà thịt săn giòn béo ngậy, nướng than hoa thơm lừng chấm muối ớt hạt dổi cay nồng.", places: "Nhà hàng Cá Sông Đà Hòa Bình, Bếp Mường Thái Bình (Đường Tây Tiến)" },
      { dish: "Cỗ lá lợn mán hạt dổi xứ Mường", desc: "Mâm cỗ lá chuối hột bày các món lợn mán luộc, nướng than hoa, lòng dồi, dồi sụn chấm muối ớt hạt dổi thơm lừng ngào ngạt.", places: "Bản Giang Mỗ, Nhà hàng Vua Cá Sông Đà" },
      { dish: "Chả lá bưởi nướng than hoa", desc: "Thịt lợn băm nhỏ ướp hạt dổi cuộn trong lá bưởi tươi nướng chín giòn thơm the the tinh dầu bưởi lạ miệng.", places: "Các quán ẩm thực dân tộc chân dốc Cun" },
    ],
    recommendedStay: "Khách sạn Grand Hotel Hòa Bình (4 sao), Khách sạn Sakura TP. Hòa Bình",
    comboActionValue: "plan_tp_hoa_binh_combo",
    comboActionLabel: "✨ Lên lịch trình TP. Hòa Bình & Thủy điện sông Đà (1N / 2N1Đ)",
  },

  "mai-chau": {
    id: "mai-chau",
    name: "Huyện Mai Châu",
    oldName: "Mai Châu cũ",
    province: "Hòa Bình",
    title: "Huyện Mai Châu – Thung lũng Bản Lác thanh bình & Đèo Thung Khe mây phủ",
    intro: "Mai Châu là thung lũng thơ mộng của đồng bào dân tộc Thái, nơi có những nếp nhà sàn thanh bình giữa đồng lúa bát ngát, đèo Đá Trắng mây phủ quanh năm và thiên đường săn mây Hang Kia - Pà Cò.",
    keywords: ["mai châu", "mai chau", "huyện mai châu", "mai châu cũ", "bản lác", "ban lac", "thung khe", "đèo đá trắng", "hang kia", "pà cò", "cơm lam mai châu"],
    attractions: [
      { name: "Bản Lác 1 & Bản Lác 2 (Bản du lịch cộng đồng người Thái)", category: "Văn hóa cộng đồng", desc: "Những nếp nhà sàn gỗ cao ráo mộc mạc, đạp xe giữa thung lũng lúa xanh mướt, dệt thổ cẩm và thưởng thức múa xòe bên ánh lửa trại.", location: "xã Mai Châu, tỉnh Phú Thọ", icon: "🏡" },
      { name: "Đèo Thung Khe (Đèo Đá Trắng mây phủ quanh năm)", category: "Check-in thiên nhiên", desc: "Vách đá trắng muốt tựa tuyết phủ châu Âu quanh năm mây mù lượn lờ, điểm dừng chân ngắm trọn thung lũng Mai Châu từ trên cao.", location: "xã Mường Bi, tỉnh Phú Thọ", icon: "⛰️" },
      { name: "Điểm săn mây Hang Kia – Pà Cò", category: "Săn mây ngoạn mục", desc: "Biển mây trắng xóa bồng bềnh mỗi sớm mai ở độ cao 1.200m và chợ phiên H'Mông rực rỡ sắc màu thổ cẩm vào sáng chủ nhật.", location: "xã Pà Cò, tỉnh Phú Thọ", icon: "☁️" },
      { name: "Thác Gò Lào & Bản Pom Coọng", category: "Thiên nhiên hoang sơ", desc: "Dòng thác trắng xóa đổ giữa rừng trúc xanh rì và bản làng Pom Coọng thanh bình êm ả.", location: "xã Mai Châu, tỉnh Phú Thọ", icon: "🌊" },
    ],
    culinary: [
      { dish: "Cơm lam nếp nương Mai Châu & Xôi ngũ sắc", desc: "Gạo nếp nương thơm dẻo ngâm nước suối nướng trong ống tre nứa non trên than hồng chấm muối vừng ngọt bùi mê mẩn.", places: "Bếp Thái Bản Lác 1, Hợp tác xã du lịch cộng đồng Bản Lác" },
      { dish: "Cá suối nướng Pa pỉnh tộp ướp mắc khén", desc: "Cá suối tươi mổ lưng ướp hạt mắc khén, ớt, thì là kẹp thanh tre nướng vàng ruộm đậm đà phong vị Thái.", places: "Các homestay tại Bản Lác, Pom Coọng" },
      { dish: "Thịt lợn bản mán xiên que nướng than", desc: "Thịt lợn thả rông bì dày giòn, mỡ thơm không ngấy nướng than hoa thơm lừng ăn kèm xôi nương.", places: "Chợ đêm Bản Lác, khu ẩm thực Thung Khe" },
    ],
    recommendedStay: "Mai Châu Ecolodge (4 sao), Bakhan Village Resort, Homestay nhà sàn Bản Lác",
    comboActionValue: "plan_mai_chau_combo",
    comboActionLabel: "✨ Lên lịch trình thung lũng Bản Lác Mai Châu (2N1Đ / 3N2Đ)",
  },

  "kim-boi": {
    id: "kim-boi",
    name: "Huyện Kim Bôi",
    oldName: "Kim Bôi cũ",
    province: "Hòa Bình",
    title: "Huyện Kim Bôi – Dòng suối khoáng nóng tự nhiên & Nghỉ dưỡng Serena Resort",
    intro: "Kim Bôi là vùng thung lũng yên bình với nguồn suối khoáng nóng tự nhiên chảy ra từ lòng đất đá vôi hàng triệu năm, nổi tiếng với các khu nghỉ dưỡng sinh thái chữa lành như Serena Resort.",
    keywords: ["kim bôi", "kim boi", "huyện kim bôi", "kim bôi cũ", "khoáng nóng kim bôi", "suối khoáng kim bôi", "serena resort", "serena kim bôi", "thác bạc kim bôi"],
    attractions: [
      { name: "Khu du lịch Suối khoáng nóng Kim Bôi tự nhiên", category: "Nghỉ dưỡng khoáng nóng", desc: "Nguồn nước khoáng ấm tự nhiên 34-36 độ C dồi dào khoáng chất, ngâm tắm thư giãn phục hồi cơ thể và chữa các bệnh xương khớp.", icon: "♨️" },
      { name: "Serena Resort Kim Bôi (Khu nghỉ dưỡng 4 sao)", category: "Resort sinh thái", desc: "Quần thể nghỉ dưỡng phong cách mộc mạc tre nứa bên dòng sông Bôi hiền hòa, bể tắm Onsen Nhật Bản và biệt thự nhà sàn sang trọng.", icon: "🏰" },
      { name: "Thác Bạc Kim Bôi & Cửu Thác Tú Sơn", category: "Thiên nhiên hoang sơ", desc: "Quần thể 9 tầng thác nước tuyệt đẹp giữa khu bảo tồn thiên nhiên rừng nguyên sinh rợp bóng cây cổ thụ.", icon: "🌊" },
    ],
    culinary: [
      { dish: "Măng chua nấu thịt gà đồi Kim Bôi", desc: "Măng củ tươi muối chua thanh dịu nấu cùng thịt gà đồi thả vườn dai ngọt tạo nên bát canh chua nóng hổi giải nhiệt cực đã.", places: "Nhà hàng Nón Serena Resort, Quán Cơm Mường Bo" },
      { dish: "Thịt lợn rừng nướng hạt dổi lá móc mật", desc: "Thịt lợn rừng nạc săn chắc ướp hạt dổi thơm phức nướng than hoa chấm muối ớt xanh.", places: "Các nhà hàng quanh khu suối khoáng nóng TT. Bo" },
      { dish: "Cơm lam khoáng nóng & Dê núi xào lăn", desc: "Ống cơm lam dẻo thơm nấu chín bằng hơi khoáng nóng cùng đĩa dê núi xào lăn đậm đà.", places: "Khu du lịch Khoáng nóng Kim Bôi" },
    ],
    recommendedStay: "Serena Resort Kim Bôi (Resort 4 sao cao cấp), Khách sạn Công Đoàn Suối Khoáng Kim Bôi",
    comboActionValue: "plan_kim_boi_combo",
    comboActionLabel: "✨ Lên lịch trình nghỉ dưỡng khoáng nóng Kim Bôi (2N1Đ)",
  },

  "cao-phong": {
    id: "cao-phong",
    name: "Huyện Cao Phong",
    oldName: "Cao Phong cũ",
    province: "Hòa Bình",
    title: "Huyện Cao Phong – Vịnh Hạ Long trên núi Thung Nai & Vương quốc cam ngọt",
    intro: "Cao Phong nổi tiếng cả nước với thương hiệu cam đồi ngọt mọng và khu du lịch lòng hồ sông Đà Thung Nai - được ví như 'Vịnh Hạ Long trên núi' với hàng trăm đảo nổi xanh biếc.",
    keywords: ["cao phong", "cao phong cũ", "huyện cao phong", "thung nai", "thung nai sông đà", "đền thác bờ", "cam cao phong", "động thác bờ"],
    attractions: [
      { name: "Khu du lịch lòng hồ Sông Đà Thung Nai (Vịnh Hạ Long trên núi)", category: "Kỳ quan sông hồ", desc: "Mặt hồ sông Đà mênh mông nước xanh màu ngọc bích, hàng trăm hòn đảo đá vôi bồng bềnh trong sương sớm, đi thuyền ngoạn cảnh kỳ thú.", icon: "⛵" },
      { name: "Đền Chúa Thác Bờ & Động Thác Bờ linh thiêng", category: "Tâm linh danh thắng", desc: "Ngôi đền nổi tiếng linh thiêng bên vách đá lòng hồ, hang động lung linh kỳ ảo với hàng ngàn khối thạch nhũ muôn hình vạn trạng.", location: "Xã Thung Nai, tỉnh Phú Thọ", icon: "🛕" },
      { name: "Vườn cam đồi Cao Phong bạt ngàn", category: "Nông nghiệp sinh thái", desc: "Những thung lũng cam trĩu quả vàng ươm vào mùa thu đông, du khách được tự tay hái cam và thưởng thức vị ngọt thơm ngọt lịm.", icon: "🍊" },
      { name: "Quần thể Hang động Núi Đầu Rồng", category: "Danh thắng hang động", desc: "Quần thể hang động tự nhiên với động Hoa Sơn, động Thanh Thủy mang vẻ đẹp huyền bí kỳ vĩ.", icon: "🦇" },
    ],
    culinary: [
      { dish: "Cam Cao Phong (Cam lòng vàng & Cam V2)", desc: "Trái cam đồi đất đỏ bazan mọng nước ngọt đậm, tép cam vàng óng tỏa hương thơm thanh mát nức tiếng gần xa.", places: "Dọc quốc lộ 6 đoạn qua huyện Cao Phong, các vườn cam xã Thu Phong" },
      { dish: "Cá sông Đà nướng que tre tại Thung Nai", desc: "Cá mương, cá thiểu, cá lăng tươi rói kẹp thanh nứa nướng xèo xèo ngay trên mạn thuyền thưởng thức giữa lòng hồ biếc xanh.", places: "Bến cảng Thung Nai, Đảo Dừa Thung Nai" },
      { dish: "Gà đồi hấp lá chanh & Canh măng nõn", desc: "Thịt gà đồi thả nương chắc nịch luộc chấm muối tiêu chanh ớt ăn cùng bát canh măng đắng ngọt thanh tao.", places: "Các nhà bè sinh thái lòng hồ Thung Nai" },
    ],
    recommendedStay: "Nhà nghỉ Đảo Dừa Thung Nai, Cối Xay Gió Homestay Thung Nai",
    comboActionValue: "plan_cao_phong_combo",
    comboActionLabel: "✨ Lên tour du thuyền lòng hồ Thung Nai & Hái cam Cao Phong",
  },

  "luong-son": {
    id: "luong-son",
    name: "Huyện Lương Sơn",
    oldName: "Lương Sơn cũ",
    province: "Hòa Bình",
    title: "Huyện Lương Sơn – Cửa ngõ xứ Mường & Khu nghỉ dưỡng sinh thái xanh",
    intro: "Lương Sơn là cửa ngõ phía Đông của tỉnh Hòa Bình tiếp giáp Hà Nội, nơi tập trung nhiều khu nghỉ dưỡng resort xanh mát, danh thắng Động Đá Bạc và ẩm thực thịt trâu lá lồm hấp dẫn.",
    keywords: ["lương sơn", "luong son", "huyện lương sơn", "lương sơn cũ", "động đá bạc", "ivory resort", "sân golf phượng hoàng", "thịt trâu lá lồm"],
    attractions: [
      { name: "Động Đá Bạc (Di tích danh thắng Quốc gia)", category: "Hang động thạch nhũ", desc: "Quần thể hang động dài hàng trăm mét với vòm hang cao rộng lấp lánh thạch nhũ như rèm ngọc, hoa đá muôn màu kỳ ảo.", icon: "🦇" },
      { name: "Khu nghỉ dưỡng Ivory Villas & Resort", category: "Nghỉ dưỡng 5 sao", desc: "Quần thể biệt thự nghỉ dưỡng lưng tựa núi mặt hướng thung lũng mây xanh, bể bơi vô cực và ẩm thực Tây Bắc cao cấp.", icon: "🏰" },
      { name: "Sân golf Phượng Hoàng (Phoenix Golf Club)", category: "Thể thao đẳng cấp", desc: "Sân golf 54 lỗ lớn bậc nhất Đông Nam Á giữa phong cảnh núi đá vôi hùng vĩ được mệnh danh là 'Hạ Long cạn'.", icon: "⛳" },
      { name: "Suối Ngọc Vua Bà", category: "Sinh thái dã ngoại", desc: "Dòng suối mát lạnh róc rách chảy qua đồi thông và ghềnh đá, điểm dã ngoại cắm trại cuối tuần gần gũi thiên nhiên.", icon: "🌲" },
    ],
    culinary: [
      { dish: "Thịt trâu nấu lá lồm Lương Sơn", desc: "Thịt trâu tươi bắp giòn thái mỏng ninh cùng lá lồm chua thanh tự nhiên tạo nên hương vị đặc trưng quyến rũ khó quên.", places: "Các nhà hàng ẩm thực Mường dọc QL6, TT. Lương Sơn" },
      { dish: "Gà đồi Lương Sơn nướng than hoa", desc: "Gà nuôi thả sườn đồi thịt thơm ngọt săn chắc nướng than củi phết mật ong thơm ngào ngạt.", places: "Nhà hàng Gà Đồi Lương Sơn, xã Lâm Sơn" },
      { dish: "Cơm lam hạt dổi chấm muối vừng", desc: "Cơm lam dẻo thơm ấm nóng ăn cùng muối vừng lạc bùi béo mang đậm phong vị Tây Bắc.", places: "Khu chợ thị trấn Lương Sơn" },
    ],
    recommendedStay: "Ivory Villas & Resort (5 sao), Beverly Hill Lương Sơn Resort",
    comboActionValue: "plan_luong_son_combo",
    comboActionLabel: "✨ Lên lịch trình nghỉ dưỡng sinh thái Lương Sơn (2N1Đ)",
  },

  "da-bac": {
    id: "da-bac",
    name: "Huyện Đà Bắc",
    oldName: "Đà Bắc cũ",
    province: "Hòa Bình",
    title: "Huyện Đà Bắc – Cung đường trekking lòng hồ sông Đà & Bản sắc Mường Dao",
    intro: "Đà Bắc là vùng núi cao hoang sơ tuyệt mỹ ven hồ sông Đà, nổi tiếng với mô hình du lịch cộng đồng Đà Bắc CBT đạt giải thưởng ASEAN, vịnh Ngòi Hoa và trải nghiệm chèo kayak lòng hồ.",
    keywords: ["đà bắc", "da bac", "huyện đà bắc", "đà bắc cũ", "đá bia", "ké", "hiền lương", "tiền phong", "vịnh ngòi hoa", "cbt đà bắc"],
    attractions: [
      { name: "Điểm du lịch cộng đồng Đá Bia (xã Tiền Phong)", category: "Du lịch cộng đồng", desc: "Bản làng người Mường Ảu ven hồ sông Đà đạt giải thưởng du lịch cộng đồng ASEAN, nơi gìn giữ phong tục 'quán tự giác' và chèo kayak lòng hồ.", icon: "🏡" },
      { name: "Bản du lịch Ké & Mó Hẻm (xã Hiền Lương)", category: "Sinh thái bản làng", desc: "Nếp nhà sàn xinh xắn nép mình bên vịnh nước trong xanh, tắm suối đầu nguồn và đi bộ trekking rừng trúc.", icon: "🛶" },
      { name: "Vịnh Ngòi Hoa & Đảo ngọc lòng hồ Đà Bắc", category: "Cảnh quan sông hồ", desc: "Vịnh nước tĩnh lặng tuyệt đẹp giữa các hòn đảo nổi, bơi bè mảng và cắm trại ngắm hoàng hôn đỏ rực buông xuống mặt hồ.", icon: "⛵" },
      { name: "Trekking rừng già Pu Canh", category: "Khám phá mạo hiểm", desc: "Cung đường rừng nguyên sinh dành cho người yêu thích trekking mạo hiểm hít thở không khí trong lành.", icon: "🥾" },
    ],
    culinary: [
      { dish: "Cá hồ sông Đà kẹp thanh tre nướng mọi", desc: "Cá bắt tươi từ hồ kẹp que tre nướng trên than củi không tẩm ướp để giữ trọn vị ngọt thanh béo tự nhiên của cá sông Đà.", places: "Homestay Đá Bia, Homestay Hữu Thảo xã Tiền Phong" },
      { dish: "Thịt chua người Dao Đà Bắc", desc: "Thịt lợn ướp thính bột gạo và men lá rừng ủ chua giòn lạ miệng khác biệt với thịt chua đồng bằng.", places: "Các bản làng người Dao xã Cao Sơn" },
      { dish: "Gà đen đồi núi H'Mông nấu gừng", desc: "Thịt gà đen xương đen chắc ngọt nấu canh gừng ấm nồng bổ dưỡng cho sức khỏe sau chuyến trekking.", places: "Homestay Ké Hiền Lương" },
    ],
    recommendedStay: "Homestay Đá Bia CBT, Homestay Ké Hiền Lương, Lake View Đà Bắc Homestay",
    comboActionValue: "plan_da_bac_combo",
    comboActionLabel: "✨ Lên tour trải nghiệm du lịch cộng đồng Đà Bắc CBT (2N1Đ / 3N2Đ)",
  },

  "tan-lac": {
    id: "tan-lac",
    name: "Huyện Tân Lạc",
    oldName: "Tân Lạc cũ",
    province: "Hòa Bình",
    title: "Huyện Tân Lạc – Thủ phủ Mường Bi cổ xưa & Nóc nhà sương mù Lũng Vân",
    intro: "Tân Lạc là trung tâm của xứ Mường Bi (vùng Mường lớn nhất trong tứ đại Mường xứ Hòa: Bi, Vang, Thàng, Động), nổi tiếng với đỉnh mây mù Lũng Vân và danh thắng Động Nam Sơn.",
    keywords: ["tân lạc", "tan lac", "huyện tân lạc", "tân lạc cũ", "mường bi", "lũng vân", "lung van", "động nam sơn", "nam sơn"],
    attractions: [
      { name: "Khu sinh thái săn mây Lũng Vân ('Nóc nhà xứ Mường')", category: "Săn mây huyền ảo", desc: "Nằm ở độ cao 1.200m quanh năm mây mù bao phủ, thung lũng của những người sống thọ trăm tuổi và ruộng bậc thang uốn lượn.", icon: "☁️" },
      { name: "Danh thắng Động Nam Sơn", category: "Kiệt tác hang động", desc: "Hang động tự nhiên đẹp bậc nhất Hòa Bình với những cột thạch nhũ khổng lồ và hồ nước ngầm trong vắt phản chiếu nhũ đá lộng lẫy.", icon: "🪨" },
      { name: "Thung lũng văn hóa Mường Bi", category: "Cội nguồn văn hóa", desc: "Cái nôi văn hóa Mường cổ kính với Mo Mường, cồng chiêng, hát Đang và những nếp nhà sàn truyền thống bền vững trăm năm.", icon: "🛕" },
    ],
    culinary: [
      { dish: "Cơm nếp nương Mường Bi thơm dẻo", desc: "Hạt nếp nương tròn mẩy dẻo quánh đồ trong chõ gỗ thơm nức mũi chấm muối vừng lạc bùi ngậy.", places: "Các homestay tại thung lũng Lũng Vân" },
      { dish: "Rau rừng đồ xào lòng gà", desc: "Các loại rau rừng tươi non: tầm bóp, rau dớn, lá lốt rừng đồ chín mềm xào lòng gà đậm đà đưa cơm.", places: "Quán ẩm thực Mường Bi ven QL6" },
      { dish: "Canh rau sắng núi đá vôi", desc: "Rau sắng mọc tự nhiên trên các vách đá vôi nấu canh thịt nạc ngọt đậm đà hiếm nơi nào có được.", places: "Khu vực ngã ba Mãn Đức, TT. Tân Lạc" },
    ],
    recommendedStay: "Lũng Vân Cloud Homestay, Nhà sàn Mường Bi Tân Lạc",
    comboActionValue: "plan_tan_lac_combo",
    comboActionLabel: "✨ Lên lịch trình săn mây Lũng Vân & Khám phá Mường Bi",
  },

  "lac-son": {
    id: "lac-son",
    name: "Huyện Lạc Sơn",
    oldName: "Lạc Sơn cũ",
    province: "Hòa Bình",
    title: "Huyện Lạc Sơn – Tuyệt tác Thác Mu ba tầng & Đồi cỏ Miền Đồi bạt ngàn",
    intro: "Lạc Sơn nằm ở trung tâm vùng Mường Vang, sở hữu danh thắng Thác Mu ba tầng nước đổ bọt trắng xóa tuyệt đẹp giữa đại ngàn và đồi cỏ Miền Đồi thảo nguyên bao la.",
    keywords: ["lạc sơn", "lac son", "huyện lạc sơn", "lạc sơn cũ", "thác mu", "thac mu", "miền đồi", "mường vang", "hang mãn nguyện"],
    attractions: [
      { name: "Khu du lịch sinh thái Thác Mu (xã Tự Do)", category: "Thiên nhiên kỳ vĩ", desc: "Tuyệt tác thác nước 3 tầng đổ từ vách núi đá cao vút tung bọt trắng xóa, dòng suối dưới chân thác trong vắt mát lạnh giải nhiệt mùa hè.", location: "Xã Mường Thàng, tỉnh Phú Thọ", icon: "🌊" },
      { name: "Đồi cỏ thảo nguyên Miền Đồi", category: "Thảo nguyên check-in", desc: "Những đồi cỏ xanh ngút ngàn tựa thảo nguyên Thụy Sĩ, không gian lộng gió lý tưởng cho cắm trại ngắm sao và chụp ảnh.", icon: "🌱" },
      { name: "Hang Mãn Nguyện & Suối khoáng Vó Đùn", category: "Hang động danh thắng", desc: "Hang động nguyên sơ với thạch nhũ lung linh và dòng suối nước khoáng ấm tự nhiên chảy quanh năm.", icon: "🦇" },
    ],
    culinary: [
      { dish: "Măng đắng Lạc Sơn nướng than chấm chẩm chéo", desc: "Măng củ tươi vùi tro than hồng nướng chín thơm phức, vị đắng ngọt đầu lưỡi chấm chẩm chéo hạt dổi ngon ngất ngây.", places: "Chợ Vụ Bản, các quán ăn chân Thác Mu" },
      { dish: "Rượu cần Mường Vang ngọt nồng êm ái", desc: "Rượu cần ủ men lá trấu gạo nếp nương thơm ngọt ngào, nét đẹp văn hóa gắn kết tình làng nghĩa xóm.", places: "Các hộ làm rượu cần truyền thống xã Nhân Nghĩa" },
      { dish: "Gà đồi Thác Mu hấp mỡ hành", desc: "Gà thả nương chắc thịt hấp mỡ hành thơm nức béo ngậy chấm muối tiêu chanh ớt.", places: "Nhà sàn sinh thái Thác Mu, xã Tự Do" },
    ],
    recommendedStay: "Thác Mu Homestay, Suối Mu Lodge, Khách sạn Vụ Bản TT. Lạc Sơn",
    comboActionValue: "plan_lac_son_combo",
    comboActionLabel: "✨ Lên tour tắm thác Mu & Cắm trại đồi cỏ Miền Đồi",
  },

  "lac-thuy": {
    id: "lac-thuy",
    name: "Huyện Lạc Thủy",
    oldName: "Lạc Thủy cũ",
    province: "Hòa Bình",
    title: "Huyện Lạc Thủy – Danh thắng Quần thể Chùa Tiên Đầm Đa & Dê núi trứ danh",
    intro: "Lạc Thủy nằm ở phía Đông Nam tỉnh Hòa Bình tiếp giáp Hà Nam và Ninh Bình, nổi danh với Quần thể di tích danh thắng Chùa Tiên - Đầm Đa huyền ảo và di tích Nhà máy in tiền đầu tiên của Việt Nam.",
    keywords: ["lạc thủy", "lac thuy", "huyện lạc thủy", "lạc thủy cũ", "chùa tiên", "đầm đa", "chùa tiên đầm đa", "chi nê", "nhà máy in tiền chi nê", "dê núi lạc thủy"],
    attractions: [
      { name: "Quần thể Di tích & Danh thắng Chùa Tiên – Đầm Đa", category: "Tâm linh hang động", desc: "Quần thể hơn 20 đền chùa và hang động thạch nhũ kỳ vĩ phụng thờ Mẫu Âu Cơ, Mẫu Thượng Ngàn, Tam Tòa Thánh Mẫu thu hút hàng vạn khách hành hương.", location: "thôn Lão Nội, xã Lạc Thủy, tỉnh Phú Thọ", icon: "🛕" },
      { name: "Khu di tích Nhà máy in tiền Chi Nê", category: "Di tích lịch sử", desc: "Nơi Chính phủ Cách mạng lâm thời đặt nhà máy in đồng tiền tài chính Việt Nam đầu tiên năm 1946 tại đồn điền Chi Nê của nhà tư sản yêu nước Đỗ Đình Thiện.", location: "xã Lạc Thủy, tỉnh Phú Thọ", icon: "🏦" },
      { name: "Động Thủy Tiên & Động Tam Tòa", category: "Kỳ quan thạch nhũ", desc: "Hệ thống thạch nhũ đá vôi lung linh huyền ảo như chốn bồng lai tiên cảnh dưới lòng đất.", icon: "⛩️" },
    ],
    culinary: [
      { dish: "Dê núi Lạc Thủy (tái chanh, xào lăn, nướng tảng)", desc: "Dê thả tự nhiên trên núi đá vôi ăn lá thuốc rừng thịt săn chắc ngọt lịm không hôi, chấm tương bần gừng ớt ngon tuyệt hảo.", places: "Nhà hàng Dê Núi Đầm Đa, Nhà hàng Hưng Thơm Chi Nê" },
      { dish: "Cơm lam Chùa Tiên & Gà đồi thả vườn", desc: "Cơm lam ống nứa thơm dẻo ăn cùng đĩa gà đồi rang muối đậm đà dư vị núi rừng.", places: "Dãy quán ẩm thực quanh cổng Chùa Tiên, xã Phú Nghĩa" },
      { dish: "Rượu nếp Đầm Đa hạ thổ", desc: "Rượu nếp ủ men lá truyền thống chưng cất thủ công thơm nồng êm ru.", places: "Các hộ dân khu di tích Chùa Tiên" },
    ],
    recommendedStay: "Nhà khách Chùa Tiên Đầm Đa, Khách sạn Hoàng Long TT. Chi Nê",
    comboActionValue: "plan_lac_thuy_combo",
    comboActionLabel: "✨ Lên tour chiêm bái Chùa Tiên & Thưởng thức Dê núi Lạc Thủy",
  },

  "yen-thuy": {
    id: "yen-thuy",
    name: "Huyện Yên Thủy",
    oldName: "Yên Thủy cũ",
    province: "Hòa Bình",
    title: "Huyện Yên Thủy – Độc đáo Chùa Hang trong lòng núi & Cây đa nghìn tuổi",
    intro: "Yên Thủy nằm giáp ranh Vườn QG Cúc Phương, vùng đất thanh bình với ngôi chùa Hang kỳ bí tọa lạc trong lòng núi đá vôi mát lạnh và cây đa cổ thụ khổng lồ hơn 800 năm tuổi.",
    keywords: ["yên thủy", "yen thuy", "huyện yên thủy", "yên thủy cũ", "chùa hang yên thủy", "cây đa xóm rộc", "yên trị"],
    attractions: [
      { name: "Di tích Danh thắng Chùa Hang (Yên Trị)", category: "Cổ tự trong hang", desc: "Ngôi chùa độc đáo tọa lạc trọn vẹn trong lòng hang đá vôi mát lạnh, nơi thờ Phật và các vị thánh linh thiêng rợp bóng cây xanh.", icon: "🛕" },
      { name: "Cây đa nghìn tuổi xóm Rộc (xã Hữu Kiệm)", category: "Cây di sản khổng lồ", desc: "Cây đa cổ thụ hơn 800 năm tuổi với chu vi gốc hàng chục mét, tán lá xòe rộng che mát cả góc làng quê thanh bình.", icon: "🌳" },
      { name: "Khu bảo tồn thiên nhiên tiếp giáp VQG Cúc Phương", category: "Sinh thái rừng già", desc: "Vùng đệm rừng nguyên sinh xanh mát với nhiều loài động thực vật quý hiếm và không khí trong lành.", icon: "🌲" },
    ],
    culinary: [
      { dish: "Thịt lợn bản xào hạt dổi mắc khén", desc: "Thịt lợn bản Mường nạc mỡ đan xen xào cùng hạt dổi thơm nồng ăn với cơm gạo mới thơm dẻo.", places: "Nhà hàng ẩm thực Mường TT. Hàng Trạm" },
      { dish: "Măng nứa tươi luộc chấm chẩm chéo", desc: "Măng nứa vừa hái trên nương luộc chín tới ngọt giòn chấm chẩm chéo cay xè ngon tuyệt đỉnh.", places: "Chợ trung tâm Hàng Trạm, Yên Thủy" },
      { dish: "Bánh chưng gù Yên Thủy", desc: "Bánh nếp nương gói lá dong xanh nhân đỗ xanh thịt mỡ đậm đà hương vị Tết truyền thống người Mường.", places: "Làng nghề xã Yên Trị" },
    ],
    recommendedStay: "Nhà nghỉ trung tâm thị trấn Hàng Trạm, Homestay sinh thái Yên Trị",
    comboActionValue: "plan_yen_thuy_combo",
    comboActionLabel: "✨ Lên lịch trình khám phá Chùa Hang & Yên Thủy",
  },
};

export function findDistrictByQuery(text: string): DistrictInfo | undefined {
  const lower = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đ]/g, "d");

  // Specific districts (not the provincial capitals whose names can overlap with the province)
  const specificDistricts = Object.values(DISTRICT_DATABASE).filter(
    (d) => d.id !== "tp-hoa-binh" && d.id !== "vinh-yen" && d.id !== "viet-tri"
  );
  const capitalDistricts = Object.values(DISTRICT_DATABASE).filter(
    (d) => d.id === "tp-hoa-binh" || d.id === "vinh-yen" || d.id === "viet-tri"
  );

  // 1. First priority: Check all specific non-capital districts (e.g. Đà Bắc, Lạc Thủy, Cẩm Khê, Đoan Hùng...)
  const candidates: Array<{ info: DistrictInfo; kw: string; length: number }> = [];

  for (const info of specificDistricts) {
    for (const kw of info.keywords) {
      const normKw = kw
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đ]/g, "d");
      const regex = new RegExp(`\\b${normKw.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`);
      if (regex.test(lower) || lower.includes(normKw)) {
        candidates.push({ info, kw: normKw, length: normKw.length });
      }
    }
  }

  if (candidates.length > 0) {
    candidates.sort((a, b) => b.length - a.length);
    return candidates[0].info;
  }

  // 2. Second priority: Capital cities (TP. Hòa Bình, TP. Vĩnh Yên, TP. Việt Trì)
  const capitalCandidates: Array<{ info: DistrictInfo; kw: string; length: number }> = [];
  for (const info of capitalDistricts) {
    for (const kw of info.keywords) {
      const normKw = kw
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đ]/g, "d");
      const regex = new RegExp(`\\b${normKw.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`);
      if (regex.test(lower) || lower.includes(normKw)) {
        capitalCandidates.push({ info, kw: normKw, length: normKw.length });
      }
    }
  }

  if (capitalCandidates.length > 0) {
    capitalCandidates.sort((a, b) => b.length - a.length);
    return capitalCandidates[0].info;
  }

  return undefined;
}
