import type { CategoryIconKey } from "../types/CategoryIconKey";

export type CategoryIconTemplate = {
  key: CategoryIconKey;
  label: string;
  hint: string;
};

export const defaultCategoryIconKey: CategoryIconKey = "seasoning-other";

export const categoryIconTemplates: CategoryIconTemplate[] = [
  {
    key: "soy-sauce",
    label: "醤油・つゆ系",
    hint: "醤油、めんつゆ、白だし"
  },
  {
    key: "mayo-sauce",
    label: "マヨ・ソース系",
    hint: "マヨネーズ、ケチャップ、ソース"
  },
  {
    key: "tube-condiment",
    label: "チューブ薬味",
    hint: "にんにく、しょうが、わさび"
  },
  {
    key: "dashi-powder",
    label: "だし・顆粒",
    hint: "顆粒だし、中華だし、コンソメ"
  },
  {
    key: "miso-paste",
    label: "味噌・ペースト",
    hint: "味噌、練りごま、豆板醤"
  },
  {
    key: "vinegar-sauce",
    label: "酢・ぽん酢・たれ",
    hint: "酢、ぽん酢、焼肉のたれ"
  },
  {
    key: "oil",
    label: "油・オイル",
    hint: "ごま油、オリーブオイル、サラダ油"
  },
  {
    key: "milk",
    label: "牛乳・乳飲料",
    hint: "牛乳、乳飲料、飲むヨーグルト"
  },
  {
    key: "drink",
    label: "飲料",
    hint: "お茶、水、ジュース"
  },
  {
    key: "seasoning-other",
    label: "その他",
    hint: "迷ったらここ"
  }
];

const categoryIconKeys = new Set<CategoryIconKey>(
  categoryIconTemplates.map((template) => template.key)
);

const keywordRules: { iconKey: CategoryIconKey; keywords: string[] }[] = [
  {
    iconKey: "tube-condiment",
    keywords: ["チューブ", "にんにく", "しょうが", "わさび", "からし"]
  },
  {
    iconKey: "milk",
    keywords: ["牛乳", "乳飲料", "ヨーグルト"]
  },
  {
    iconKey: "drink",
    keywords: ["飲料", "お茶", "水", "ジュース", "コーヒー"]
  },
  {
    iconKey: "mayo-sauce",
    keywords: ["マヨ", "ソース", "ケチャップ"]
  },
  {
    iconKey: "soy-sauce",
    keywords: ["醤油", "しょうゆ", "つゆ", "白だし"]
  },
  {
    iconKey: "dashi-powder",
    keywords: ["だし", "顆粒", "コンソメ"]
  },
  {
    iconKey: "miso-paste",
    keywords: ["味噌", "みそ", "ペースト", "豆板醤"]
  },
  {
    iconKey: "vinegar-sauce",
    keywords: ["酢", "ぽん酢", "たれ"]
  },
  {
    iconKey: "oil",
    keywords: ["油", "オイル"]
  },
  {
    iconKey: "seasoning-other",
    keywords: ["調味料"]
  }
];

export const isCategoryIconKey = (
  value: string | undefined
): value is CategoryIconKey => {
  return Boolean(value && categoryIconKeys.has(value as CategoryIconKey));
};

export const getCategoryIconTemplate = (
  iconKey: string | undefined
): CategoryIconTemplate => {
  return (
    categoryIconTemplates.find((template) => template.key === iconKey) ??
    categoryIconTemplates[categoryIconTemplates.length - 1]
  );
};

export const resolveCategoryIconKey = (
  categoryName: string,
  iconKey?: string
): CategoryIconKey => {
  if (isCategoryIconKey(iconKey)) {
    return iconKey;
  }

  return findCategoryIconKey(categoryName) ?? defaultCategoryIconKey;
};

const findCategoryIconKey = (searchableText: string) => {
  const normalizedCategoryName = searchableText.trim();
  const matchedRule = keywordRules.find((rule) =>
    rule.keywords.some((keyword) => normalizedCategoryName.includes(keyword))
  );

  return matchedRule?.iconKey;
};

export const resolvePocketItemCategoryIconKey = (input: {
  categoryName: string;
  itemName?: string;
  productDetail?: string;
  categoryIconKey?: string;
}): CategoryIconKey => {
  if (isCategoryIconKey(input.categoryIconKey)) {
    return input.categoryIconKey;
  }

  const searchableText = [
    input.categoryName,
    input.itemName,
    input.productDetail
  ]
    .filter(Boolean)
    .join(" ");

  return findCategoryIconKey(searchableText) ?? defaultCategoryIconKey;
};
