declare namespace Twitch {
  interface Embed {
    new (targetID: string, options: EmbedOptions): void;
  }

  interface EmbedOptions {
    width: string | number;
    height: string | number;
    channel: string;
    parent?: string[]; // Optional if embedded on other websites
    // Add more options as needed
    theme?: 'light' | 'dark';
  }
}

declare const Twitch: {
  Embed: Twitch.Embed;
};
