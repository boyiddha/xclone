import { NextResponse } from "next/server";
import * as notificationService from "@/services/notificationService";

export async function createNotification(req) {
  try {
    const data = await req.json();
    await notificationService.createNotificationService(data);
    return NextResponse.json(
      { message: "Notification created" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function getNotifications(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const notifications = await notificationService.getNotificationsService(
      userId
    );
    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function updateNotification(req) {
  try {
    const { searchParams } = new URL(req.url);
    const notifId = searchParams.get("notifId");
    const { isRead } = await req.json();

    const updatedNotification =
      await notificationService.updateNotificationService(notifId, isRead);
    return NextResponse.json(updatedNotification, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
