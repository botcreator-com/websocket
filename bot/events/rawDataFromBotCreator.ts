import ExtendedClient from "../extendedClient";

export default async (client: ExtendedClient, data: any) => {
     if (data.id === client?.user?.id && data.event === "stop"){
      await client?.user?.setActivity(`${client.user?.username} is Stoping...`);
    }
  
};
