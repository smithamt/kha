import Client from "@/models/client";
import TrashModel from "@/models/trashes";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const response = await TrashModel.findAll({
      where: { isPublic: true, fromModel: "clients" },
      include: [
        {
          model: Client,
          as: "client",
          attributes: ["_id", "_id", "name", "email"],
        },
        {
          model: User,
          as: "user",
          attributes: ["_id", "_id", "name", "email"],
        },
      ],
    });

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch count" },
      { status: 500 }
    );
  }
}
