import { Injector, webpack } from "replugged";

interface Channel {
  name: string;
}

const inject = new Injector();

const EMOJI_REGEX =
  /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;

export async function start(): Promise<void> {
  const channelModule = await webpack.waitForProps<{
    getMutableBasicGuildChannelsForGuild(): Record<string, Channel>;
  }>("getMutableBasicGuildChannelsForGuild");

  inject.after(channelModule, "getMutableBasicGuildChannelsForGuild", (_, res) => {
    try {
      const allChannels = Object.entries(res);
      allChannels.forEach(([_, channel]) => {
        channel.name = channel.name.replaceAll(EMOJI_REGEX, "");
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
