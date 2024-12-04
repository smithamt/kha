import { getUser } from "@/auth/user";
import Client from "@/models/client";
import DeviceModel from "@/models/devices";
import { actions, ADMIN, roles } from "@/roles";
import { notFound } from "next/navigation";
import CreateDeviceClient from "./client";

async function CreatePlan({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user) return;
  const foundRole = roles.find((r) => r.name === user.role);
  if (ADMIN !== user.role && !foundRole?.plans.includes(actions.CREATE))
    return notFound();

  const clients = await Client.findAll({ attributes: ["name", "_id"] });

  const edit = searchParams.edit as string;
  let data;
  if (edit) {
    data = await DeviceModel.findByPk(Number(edit));
  }

  return (
    <CreateDeviceClient
      clients={JSON.stringify(clients)}
      edit={JSON.stringify(data || {})}
    />
  );
}

export default CreatePlan;
