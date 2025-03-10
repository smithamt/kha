import { useInfiniteData } from "@/app/hooks/useInfiniteData";
import ShowNoText from "@/components/app/nodata";
import { Button } from "@/components/ui/button";
import useClickOutside from "@/hooks/outside";
import { Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import SpinLoading from "@/components/loadings/spinloading";
import { Label } from "@/components/ui/label";
import CreateClientForm from "../../clients/create/form";
import Client from "@/models/client";
import { useSheet2 } from "@/app/contexts/sheet2";

function Clients({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value: string;
}) {
  const [open, setOpen] = useState(false);
  const [client, setClient] = useState<Client | null>(null);
  const [inputValue, setInputValue] = useState("");
  const outSideRef = useRef(null);
  const {
    loading,
    data: clients,
    queryKey,
    count,
    lastElementRef,
  } = useInfiniteData<Client>({
    keys: "clients",
    size: 20,
    params: { search: inputValue },
  });

  useClickOutside(outSideRef, () => setOpen(false));
  const { setOpen: setSheet, setContent, setClassName } = useSheet2();
  const openClient = () => {
    console.log("open client");
    setSheet(true);
    setClassName("p-0 min-w-[600px]");
    setContent(
      <CreateClientForm
        onSuccess={(client) => {
          setSheet(false);
          console.log("client", client);
          if (client) {
            setClient(client);
            onChange(client.id);
          }
        }}
        defaultValues={{ name: inputValue }}
      />
    );
  };

  return (
    <div className="relative">
      {client ? (
        <div className="cart-bg rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <Label className="text-blue-500 text-lg">
              {client.first_name} {client.last_name}
            </Label>
            <Button
              size={"icon"}
              variant={"outline"}
              className="w-6 h-6"
              onClick={() => setClient(null)}
            >
              <X className="w-4" />
            </Button>
          </div>
          <p>{client.email}</p>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full border rounded-md p-1 pl-2">
          <input
            onFocus={() => setOpen(true)}
            placeholder="Enter the name"
            className="flex-1"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
          <Button
            onClick={openClient}
            type="button"
            className="p-1"
            size={"icon"}
          >
            <Plus className="w-4" />
          </Button>
        </div>
      )}
      {open && (
        <div
          ref={outSideRef}
          className="p-1 absolute cart-bg w-[600px] max-h-[250px] overflow-y-auto border z-10 rounded-lg shadow-md"
        >
          {!clients.length && (
            <ShowNoText className="flex flex-col gap-2">
              {loading ? <SpinLoading className="" /> : "Nothing found"}
              <Button onClick={openClient} type="button">
                Create plan
              </Button>
            </ShowNoText>
          )}
          {clients.map((client, index) => (
            <div
              className="p-2 hover rounded-sm"
              onClick={() => {
                onChange(client.id);
                setClient(client);
                setOpen(false);
              }}
              key={index}
            >
              {client.first_name} {client.last_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Clients;
