import { NextResponse } from "next/server";

export type OrderItem = {
  dishName: string;
  sellerName: string;
  sellerPhone?: string;
  sellerAddress?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  season?: string;
};

export type OrderData = {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  note?: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
  status: "Chờ xác nhận" | "Đang chuẩn bị" | "Đang giao hàng" | "Đã hoàn thành";
};

// In-memory order cache for fast admin viewing
const globalOrders: OrderData[] = [];

export async function GET() {
  return NextResponse.json({
    success: true,
    orders: globalOrders,
    count: globalOrders.length,
  });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, orderId, status } = body;
    const targetId = id || orderId;

    if (!targetId || !status) {
      return NextResponse.json(
        { success: false, error: "Thiếu mã đơn hàng hoặc trạng thái mới." },
        { status: 400 }
      );
    }

    const orderIndex = globalOrders.findIndex((o) => o.id === targetId);
    if (orderIndex !== -1) {
      globalOrders[orderIndex].status = status;
    }

    return NextResponse.json({
      success: true,
      id: targetId,
      status,
      message: `Đã cập nhật trạng thái đơn ${targetId} sang [${status}]`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Lỗi cập nhật đơn hàng: " + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, phone, address, note, items, totalAmount } = body;

    if (!customerName || !phone || !items || !items.length) {
      return NextResponse.json(
        { success: false, error: "Thiếu thông tin người đặt hoặc danh sách món hàng." },
        { status: 400 }
      );
    }

    const orderId = `DT-${Date.now().toString().slice(-6)}`;
    const nowIso = new Date().toISOString();
    const formattedDate = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Bangkok" });

    const newOrder: OrderData = {
      id: orderId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: (address || "Giao tại khách sạn / điểm hẹn").trim(),
      note: (note || "Không có").trim(),
      items: items.map((it: any) => ({
        dishName: it.dishName || it.dish?.name || "Đặc sản",
        sellerName: it.sellerName || it.seller?.name || "Cơ sở OCOP Đất Tổ",
        sellerPhone: it.sellerPhone || it.seller?.phone || "",
        sellerAddress: it.sellerAddress || it.seller?.address || "",
        quantity: Number(it.quantity) || 1,
        unitPrice: Number(it.unitPrice || it.seller?.price) || 0,
        totalPrice: (Number(it.unitPrice || it.seller?.price) || 0) * (Number(it.quantity) || 1),
      })),
      totalAmount: Number(totalAmount) || 0,
      createdAt: formattedDate,
      status: "Chờ xác nhận",
    };

    globalOrders.unshift(newOrder);

    // 1. Đồng bộ Google Sheets nếu có Webhook URL
    const googleSheetWebhook = process.env.GOOGLE_SHEET_WEBHOOK_URL || body.customSheetWebhook;
    let sheetSyncStatus = "Đã lưu vào bộ quản lý đơn hàng hệ thống";

    if (googleSheetWebhook) {
      try {
        const sheetPayload = {
          orderId: newOrder.id,
          orderTime: formattedDate,
          customerName: newOrder.customerName,
          phone: newOrder.phone,
          deliveryAddress: newOrder.address,
          note: newOrder.note,
          itemsDetail: newOrder.items
            .map((i) => `${i.dishName} (${i.sellerName}) x${i.quantity} [${i.totalPrice.toLocaleString("vi-VN")}đ]`)
            .join("; "),
          sellersList: Array.from(new Set(newOrder.items.map((i) => i.sellerName))).join(", "),
          totalAmount: newOrder.totalAmount,
          status: newOrder.status,
        };

        const res = await fetch(googleSheetWebhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sheetPayload),
        });

        if (res.ok) {
          sheetSyncStatus = "Đã đồng bộ tự động lên Google Sheets thành công";
        }
      } catch (err) {
        console.error("Lỗi đồng bộ Google Sheets:", err);
      }
    }

    // 2. Tạo nội dung thông báo gửi Doanh nghiệp / Chủ cơ sở OCOP
    const merchantNotifications = newOrder.items.map((item) => {
      const msg = `🔔 [ĐẤT TỔ TRAVEL] ĐƠN HÀNG MỚI #${newOrder.id}
Kính gửi: ${item.sellerName}
---------------------------------
• Món đặt: ${item.dishName}
• Số lượng: ${item.quantity} phần
• Thành tiền: ${item.totalPrice.toLocaleString("vi-VN")}đ
---------------------------------
• Khách hàng: ${newOrder.customerName}
• Số điện thoại: ${newOrder.phone}
• Địa chỉ giao: ${newOrder.address}
• Ghi chú khách: ${newOrder.note}
• Thời gian đặt: ${formattedDate}
---------------------------------
Quý cơ sở vui lòng chuẩn bị hàng và liên hệ khách để giao đúng hẹn!`;

      return {
        sellerName: item.sellerName,
        sellerPhone: item.sellerPhone,
        message: msg,
        zaloUrl: item.sellerPhone
          ? `https://zalo.me/${item.sellerPhone.replace(/\D/g, "")}`
          : undefined,
      };
    });

    return NextResponse.json({
      success: true,
      order: newOrder,
      sheetSyncStatus,
      merchantNotifications,
    });
  } catch (error: any) {
    console.error("Order API Error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể xử lý đơn hàng: " + error.message },
      { status: 500 }
    );
  }
}
