export interface ISettings {
  coding: {
    repo: {
      github: {
        username: string;
        repo: string;
      };
    };
  };
  company: {
    name: string;
    desc: string;
    slogan: string;
  };
  product: {
    name: string;
    desc: string;

    share: {
      title: string;
      desc: string;
    };
  };
  teams: {
    id: string;
    name: string;
  }[];
}

export const settings: ISettings = {
  coding: {
    repo: {
      github: {
        username: "MarkShawn2020",
        repo: "ChatGPT-Web-Next",
      },
    },
  },
  company: {
    name: "CS魔法社",
    desc: "CS魔法社是一个AIGC社区",
    slogan: "释放无限AI魔力",
  },
  product: {
    name: "CS魔法社",
    desc: "CS魔法社是一个AIGC社区",

    share: {
      title: "CS魔法社",
      desc: `source: ${process.env.NEXT_PUBLIC_DOMAIN}`,
    },
  },
  teams: [
    {
      id: "mark",
      name: "南川",
    },
  ],
};
