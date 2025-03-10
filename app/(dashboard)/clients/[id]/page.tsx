import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Client from "@/models/client";
import Device from "@/models/devices";
import User from "@/models/user";
import Link from "next/link";
import { notFound } from "next/navigation";
import DefaultDataShow from "../../_components/default/show";
import ClientDetailHeader from "./header";

async function ClientDetail({ params }: { params: { id: string } }) {
  const client = await Client.findByPk(params.id, {
    include: { model: User, as: "created_by", attributes: ["id", "email"] },
  });

  if (!client) return notFound();

  const devices = await Device.findAll({
    where: { client_id: client.id },
    attributes: ["id", "email"],
  });

  return (
    <div className="w-full p-4 overflow-y-auto h-full">
      <Card className="max-w-[700px] h-auto mx-auto min-h-full p-0 w-full">
        <ClientDetailHeader />
        <CardContent className="p-4">
          <Link
            className={cn(
              buttonVariants({ variant: "outline", className: "mb-2" })
            )}
            href={`/devices/create?client_id=${client.id}`}
          >
            Add New Device
          </Link>
          <DefaultDataShow data={JSON.stringify(client)} />
        </CardContent>
        <pre>{JSON.stringify(devices, null, 2)}</pre>
      </Card>
    </div>
  );
}

export default ClientDetail;
