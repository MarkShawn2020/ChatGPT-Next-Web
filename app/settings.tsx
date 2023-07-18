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

const COMPANY_NAME = "Oyo!";
const COMPANY_DESC = "释放无限 AI 魔力";
const PRODUCT_NAME = COMPANY_NAME; // 单一产品下保持一致
const PRODUCT_DESC = COMPANY_DESC;

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
    name: COMPANY_NAME,
    desc: COMPANY_DESC,
    slogan: "释放无限AI魔力",
  },
  product: {
    name: PRODUCT_NAME,
    desc: PRODUCT_DESC,

    share: {
      title: PRODUCT_NAME,
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
