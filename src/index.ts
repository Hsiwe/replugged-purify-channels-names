import { Injector, webpack } from "replugged";

const inject = new Injector();

export async function start(): Promise<void> {
  const channelModule = await webpack.waitForProps("getGuildChannelsVersion");

  inject.after(channelModule as any, "getMutableBasicGuildChannelsForGuild", async (_, res) => {
    try {
      const allChannels: [string, { name: string }][] = Object.entries(res);
      allChannels.forEach(([_, channel]) => {
        channel.name = channel.name.replaceAll(
          /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g,
          "",
        );
      });
      return res;
    } catch (_) {
      return res;
    }
  });
}

export function stop(): void {
  inject.uninjectAll();
}
