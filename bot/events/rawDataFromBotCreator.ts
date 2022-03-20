import ExtendedClient from "../extendedClient";

export default async (client: ExtendedClient, data: any) => {
  try {
    const JsonRaw = JSON.parse(String(data));
     if (JsonRaw.id === client?.user?.id && JsonRaw.event === "stop"){
      await client?.user?.setActivity(`${client.user?.username} is Stoping...`);
    }
  } catch (e){
    await client?.user?.setActivity("Got an error ...");
  }
  
};
