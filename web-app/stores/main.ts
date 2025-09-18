interface FooterTab {
  name: string;
  icon: string;
  isDisable?: boolean;
}

interface StepLists {
  name: string;
  subName?: string;
  icon: string;
  queryParam: string;
  isStudy?: boolean;
  isDisable?: boolean;
  isDisableSemester?: boolean;
  isDisableVacation?: boolean;
}

const footerTabs: FooterTab[] = [
  { name: "hp_and_goal", icon: "target" },
  { name: "study", icon: "game" },
  { name: "result", icon: "result" },
];

const stepStudyList: StepLists[] = [
  {
    name: "มัธยมศึกษาตอนต้น",
    icon: "menu_book",
    queryParam: "middle",
    isStudy: true,
  },
  {
    name: "มัธยมศึกษาตอนปลาย",
    icon: "business_center",
    queryParam: "high",
    isStudy: true,
  },
  {
    name: "มหาวิทยาลัย",
    icon: "school",
    queryParam: "university",
    isStudy: true,
  },
];

const stepWorkList: StepLists[] = [
  {
    name: "วัยทำงาน",
    subName: "(อายุ 23-26 ปี)",
    icon: "business_center",
    queryParam: "23to26",
  },
  {
    name: "วัยทำงาน",
    subName: "(อายุ 27-30 ปี)",
    icon: "business_center",
    queryParam: "27to30",
  },
];

const stepWorkStableList: StepLists[] = [
  {
    name: "วัยมั่นคง",
    subName: "(อายุ 31-40 ปี)",
    icon: "business_center",
    queryParam: "31to40",
  },
  {
    name: "วัยมั่นคง",
    subName: "(อายุ 41-50 ปี)",
    icon: "business_center",
    queryParam: "41to50",
  },
  {
    name: "วัยมั่นคง",
    subName: "(อายุ 51-60 ปี)",
    icon: "business_center",
    queryParam: "51to60",
  },
];

const colorsChart: string[] = [
  "#C13C27",
  "#1C1A52",
  "#FFDC00",
  "#33C0D4",
  "#F15A24",
  "#2B2C7B",
  "#232323",
  "#419744",
];

export {
  footerTabs,
  stepStudyList,
  stepWorkList,
  stepWorkStableList,
  colorsChart,
};
export type { FooterTab, StepLists };
