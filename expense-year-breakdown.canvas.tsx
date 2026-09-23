import {
  BarChart,
  Callout,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  PieChart,
  Stack,
  Stat,
  Table,
  Text,
} from "cursor/canvas";

// @generated-data-start
type Item = [string, string];
type Category = { name: string; amount: number; pct: number; count: number };
type Bucket = { label: string; count: number; amount: number };
type Detail = { name: string; meta: string; rows: Item[] };
type LargeTxn = {
  date: string;
  amount: number;
  category: string;
  platform: string;
  label: string;
};
type BucketCategory = {
  label: string;
  count: number;
  amount: number;
  categories: Category[];
};
type MonthPayload = {
  key: string;
  title: string;
  subtitle: string;
  txnCount: number;
  total: number;
  dailyAvg: number;
  maxTxn: number;
  top2Pct: number;
  peakNote: string;
  dateRange: string;
  categories: Category[];
  daily: number[];
  amountBuckets: Bucket[];
  amountBucketsMerged: Bucket[];
  details: Detail[];
};

const YEAR_META = {
  "title": "2025.08–2026.08 纯花销汇总",
  "subtitle": "已剔除转账/房租/取现/理财等 93 笔，共 164,453.59 元",
  "dateRange": "2025-08-01 ~ 2026-08-31",
  "txnCount": 1431,
  "total": 142147.31,
  "monthlyAvg": 10934.41,
  "maxMonthTotal": 18927.07,
  "maxMonthLabel": "2025-09",
  "top2Pct": 37.4,
  "top2Label": "游戏动漫+交通出行",
  "monthCount": 13,
  "largeTxnCount": 51,
  "largeTxnTotal": 73683.96
};

const MONTHLY_TOTALS: { label: string; total: number; count: number }[] = [
  {
    "label": "2025-08",
    "total": 6732.56,
    "count": 126
  },
  {
    "label": "2025-09",
    "total": 18927.07,
    "count": 103
  },
  {
    "label": "2025-10",
    "total": 10200.53,
    "count": 131
  },
  {
    "label": "2025-11",
    "total": 7853.02,
    "count": 129
  },
  {
    "label": "2025-12",
    "total": 8327.15,
    "count": 98
  },
  {
    "label": "2026-01",
    "total": 9659.31,
    "count": 116
  },
  {
    "label": "2026-02",
    "total": 12916.27,
    "count": 112
  },
  {
    "label": "2026-03",
    "total": 17425.15,
    "count": 104
  },
  {
    "label": "2026-04",
    "total": 13046.94,
    "count": 87
  },
  {
    "label": "2026-05",
    "total": 7289.01,
    "count": 108
  },
  {
    "label": "2026-06",
    "total": 13729.1,
    "count": 111
  },
  {
    "label": "2026-07",
    "total": 8635.89,
    "count": 111
  },
  {
    "label": "2026-08",
    "total": 7405.31,
    "count": 95
  }
];

const YEAR_CATEGORIES: Category[] = [
  {
    "name": "游戏动漫",
    "amount": 18069.61,
    "pct": 12.7,
    "count": 153
  },
  {
    "name": "交通出行",
    "amount": 35077.42,
    "pct": 24.7,
    "count": 201
  },
  {
    "name": "购物消费",
    "amount": 36481.06,
    "pct": 25.7,
    "count": 243
  },
  {
    "name": "餐饮食品",
    "amount": 19266.32,
    "pct": 13.6,
    "count": 325
  },
  {
    "name": "会员订阅",
    "amount": 7038.61,
    "pct": 5.0,
    "count": 219
  },
  {
    "name": "通讯话费",
    "amount": 1556.44,
    "pct": 1.1,
    "count": 11
  },
  {
    "name": "生活缴费",
    "amount": 2239.5,
    "pct": 1.6,
    "count": 22
  },
  {
    "name": "医疗健康",
    "amount": 6562.82,
    "pct": 4.6,
    "count": 23
  },
  {
    "name": "教育学习",
    "amount": 11118.8,
    "pct": 7.8,
    "count": 14
  },
  {
    "name": "其他",
    "amount": 4736.73,
    "pct": 3.3,
    "count": 220
  }
];

const YEAR_AMOUNT_BUCKETS: Bucket[] = [
  {
    "label": "0–30",
    "count": 786,
    "amount": 9921.78
  },
  {
    "label": "30–50",
    "count": 211,
    "amount": 7810.15
  },
  {
    "label": "50–100",
    "count": 196,
    "amount": 13578.33
  },
  {
    "label": "100–200",
    "count": 114,
    "amount": 15700.36
  },
  {
    "label": "200–300",
    "count": 43,
    "amount": 10652.68
  },
  {
    "label": "300–500",
    "count": 30,
    "amount": 10800.05
  },
  {
    "label": "500–800",
    "count": 17,
    "amount": 11471.78
  },
  {
    "label": "800–1000",
    "count": 9,
    "amount": 7912.69
  },
  {
    "label": "1000+",
    "count": 25,
    "amount": 54299.49
  }
];

const YEAR_AMOUNT_BUCKETS_MERGED: Bucket[] = [
  {
    "label": "0–50",
    "count": 997,
    "amount": 17731.93
  },
  {
    "label": "50–200",
    "count": 310,
    "amount": 29278.69
  },
  {
    "label": "200–500",
    "count": 73,
    "amount": 21452.73
  },
  {
    "label": "500+",
    "count": 51,
    "amount": 73683.96
  }
];

const YEAR_BUCKET_CATEGORIES: BucketCategory[] = [
  {
    "label": "0–30",
    "count": 786,
    "amount": 9921.78,
    "categories": [
      {
        "name": "餐饮食品",
        "amount": 2622.97,
        "pct": 26.4,
        "count": 207
      },
      {
        "name": "其他",
        "amount": 2071.24,
        "pct": 20.9,
        "count": 166
      },
      {
        "name": "会员订阅",
        "amount": 2023.77,
        "pct": 20.4,
        "count": 158
      },
      {
        "name": "交通出行",
        "amount": 1585.4,
        "pct": 16.0,
        "count": 123
      },
      {
        "name": "购物消费",
        "amount": 1215.46,
        "pct": 12.3,
        "count": 95
      },
      {
        "name": "游戏动漫",
        "amount": 191.3,
        "pct": 1.9,
        "count": 15
      },
      {
        "name": "医疗健康",
        "amount": 127.73,
        "pct": 1.3,
        "count": 13
      },
      {
        "name": "教育学习",
        "amount": 43.91,
        "pct": 0.4,
        "count": 7
      },
      {
        "name": "生活缴费",
        "amount": 40.0,
        "pct": 0.4,
        "count": 2
      }
    ]
  },
  {
    "label": "30–50",
    "count": 211,
    "amount": 7810.15,
    "categories": [
      {
        "name": "购物消费",
        "amount": 1808.53,
        "pct": 23.2,
        "count": 46
      },
      {
        "name": "游戏动漫",
        "amount": 1680.2,
        "pct": 21.5,
        "count": 49
      },
      {
        "name": "餐饮食品",
        "amount": 1470.6,
        "pct": 18.8,
        "count": 39
      },
      {
        "name": "其他",
        "amount": 1272.98,
        "pct": 16.3,
        "count": 35
      },
      {
        "name": "交通出行",
        "amount": 1094.11,
        "pct": 14.0,
        "count": 28
      },
      {
        "name": "会员订阅",
        "amount": 337.0,
        "pct": 4.3,
        "count": 10
      },
      {
        "name": "教育学习",
        "amount": 109.89,
        "pct": 1.4,
        "count": 3
      },
      {
        "name": "医疗健康",
        "amount": 36.84,
        "pct": 0.5,
        "count": 1
      }
    ]
  },
  {
    "label": "50–100",
    "count": 196,
    "amount": 13578.33,
    "categories": [
      {
        "name": "游戏动漫",
        "amount": 3587.86,
        "pct": 26.4,
        "count": 47
      },
      {
        "name": "购物消费",
        "amount": 2939.26,
        "pct": 21.6,
        "count": 41
      },
      {
        "name": "餐饮食品",
        "amount": 2195.87,
        "pct": 16.2,
        "count": 33
      },
      {
        "name": "会员订阅",
        "amount": 1978.45,
        "pct": 14.6,
        "count": 32
      },
      {
        "name": "其他",
        "amount": 999.81,
        "pct": 7.4,
        "count": 16
      },
      {
        "name": "交通出行",
        "amount": 912.44,
        "pct": 6.7,
        "count": 13
      },
      {
        "name": "通讯话费",
        "amount": 659.84,
        "pct": 4.9,
        "count": 8
      },
      {
        "name": "生活缴费",
        "amount": 200.0,
        "pct": 1.5,
        "count": 4
      },
      {
        "name": "医疗健康",
        "amount": 54.8,
        "pct": 0.4,
        "count": 1
      },
      {
        "name": "教育学习",
        "amount": 50.0,
        "pct": 0.4,
        "count": 1
      }
    ]
  },
  {
    "label": "100–200",
    "count": 114,
    "amount": 15700.36,
    "categories": [
      {
        "name": "购物消费",
        "amount": 3997.28,
        "pct": 25.5,
        "count": 27
      },
      {
        "name": "游戏动漫",
        "amount": 3074.68,
        "pct": 19.6,
        "count": 21
      },
      {
        "name": "餐饮食品",
        "amount": 2815.75,
        "pct": 17.9,
        "count": 20
      },
      {
        "name": "会员订阅",
        "amount": 2356.39,
        "pct": 15.0,
        "count": 18
      },
      {
        "name": "生活缴费",
        "amount": 1399.5,
        "pct": 8.9,
        "count": 13
      },
      {
        "name": "交通出行",
        "amount": 1350.06,
        "pct": 8.6,
        "count": 10
      },
      {
        "name": "其他",
        "amount": 392.7,
        "pct": 2.5,
        "count": 3
      },
      {
        "name": "医疗健康",
        "amount": 314.0,
        "pct": 2.0,
        "count": 2
      }
    ]
  },
  {
    "label": "200–300",
    "count": 43,
    "amount": 10652.68,
    "categories": [
      {
        "name": "购物消费",
        "amount": 2879.12,
        "pct": 27.0,
        "count": 11
      },
      {
        "name": "餐饮食品",
        "amount": 2697.34,
        "pct": 25.3,
        "count": 11
      },
      {
        "name": "游戏动漫",
        "amount": 2438.75,
        "pct": 22.9,
        "count": 10
      },
      {
        "name": "通讯话费",
        "amount": 896.6,
        "pct": 8.4,
        "count": 3
      },
      {
        "name": "交通出行",
        "amount": 660.0,
        "pct": 6.2,
        "count": 3
      },
      {
        "name": "生活缴费",
        "amount": 600.0,
        "pct": 5.6,
        "count": 3
      },
      {
        "name": "医疗健康",
        "amount": 480.87,
        "pct": 4.5,
        "count": 2
      }
    ]
  },
  {
    "label": "300–500",
    "count": 30,
    "amount": 10800.05,
    "categories": [
      {
        "name": "购物消费",
        "amount": 4200.29,
        "pct": 38.9,
        "count": 11
      },
      {
        "name": "餐饮食品",
        "amount": 2802.19,
        "pct": 25.9,
        "count": 8
      },
      {
        "name": "游戏动漫",
        "amount": 1608.57,
        "pct": 14.9,
        "count": 5
      },
      {
        "name": "交通出行",
        "amount": 1486.0,
        "pct": 13.8,
        "count": 4
      },
      {
        "name": "教育学习",
        "amount": 360.0,
        "pct": 3.3,
        "count": 1
      },
      {
        "name": "会员订阅",
        "amount": 343.0,
        "pct": 3.2,
        "count": 1
      }
    ]
  },
  {
    "label": "500–800",
    "count": 17,
    "amount": 11471.78,
    "categories": [
      {
        "name": "购物消费",
        "amount": 4140.12,
        "pct": 36.1,
        "count": 6
      },
      {
        "name": "餐饮食品",
        "amount": 3761.41,
        "pct": 32.8,
        "count": 6
      },
      {
        "name": "交通出行",
        "amount": 2058.0,
        "pct": 17.9,
        "count": 3
      },
      {
        "name": "游戏动漫",
        "amount": 1512.25,
        "pct": 13.2,
        "count": 2
      }
    ]
  },
  {
    "label": "800–1000",
    "count": 9,
    "amount": 7912.69,
    "categories": [
      {
        "name": "交通出行",
        "amount": 4346.5,
        "pct": 54.9,
        "count": 5
      },
      {
        "name": "游戏动漫",
        "amount": 2666.0,
        "pct": 33.7,
        "count": 3
      },
      {
        "name": "餐饮食品",
        "amount": 900.19,
        "pct": 11.4,
        "count": 1
      }
    ]
  },
  {
    "label": "1000+",
    "count": 25,
    "amount": 54299.49,
    "categories": [
      {
        "name": "交通出行",
        "amount": 21584.91,
        "pct": 39.8,
        "count": 12
      },
      {
        "name": "购物消费",
        "amount": 15301.0,
        "pct": 28.2,
        "count": 6
      },
      {
        "name": "教育学习",
        "amount": 10555.0,
        "pct": 19.4,
        "count": 2
      },
      {
        "name": "医疗健康",
        "amount": 5548.58,
        "pct": 10.2,
        "count": 4
      },
      {
        "name": "游戏动漫",
        "amount": 1310.0,
        "pct": 2.4,
        "count": 1
      }
    ]
  }
];

const YEAR_BUCKET_CATEGORIES_MERGED: BucketCategory[] = [
  {
    "label": "0–50",
    "count": 997,
    "amount": 17731.93,
    "categories": [
      {
        "name": "餐饮食品",
        "amount": 4093.57,
        "pct": 23.1,
        "count": 246
      },
      {
        "name": "其他",
        "amount": 3344.22,
        "pct": 18.9,
        "count": 201
      },
      {
        "name": "购物消费",
        "amount": 3023.99,
        "pct": 17.1,
        "count": 141
      },
      {
        "name": "交通出行",
        "amount": 2679.51,
        "pct": 15.1,
        "count": 151
      },
      {
        "name": "会员订阅",
        "amount": 2360.77,
        "pct": 13.3,
        "count": 168
      },
      {
        "name": "游戏动漫",
        "amount": 1871.5,
        "pct": 10.6,
        "count": 64
      },
      {
        "name": "医疗健康",
        "amount": 164.57,
        "pct": 0.9,
        "count": 14
      },
      {
        "name": "教育学习",
        "amount": 153.8,
        "pct": 0.9,
        "count": 10
      },
      {
        "name": "生活缴费",
        "amount": 40.0,
        "pct": 0.2,
        "count": 2
      }
    ]
  },
  {
    "label": "50–200",
    "count": 310,
    "amount": 29278.69,
    "categories": [
      {
        "name": "购物消费",
        "amount": 6936.54,
        "pct": 23.7,
        "count": 68
      },
      {
        "name": "游戏动漫",
        "amount": 6662.54,
        "pct": 22.8,
        "count": 68
      },
      {
        "name": "餐饮食品",
        "amount": 5011.62,
        "pct": 17.1,
        "count": 53
      },
      {
        "name": "会员订阅",
        "amount": 4334.84,
        "pct": 14.8,
        "count": 50
      },
      {
        "name": "交通出行",
        "amount": 2262.5,
        "pct": 7.7,
        "count": 23
      },
      {
        "name": "生活缴费",
        "amount": 1599.5,
        "pct": 5.5,
        "count": 17
      },
      {
        "name": "其他",
        "amount": 1392.51,
        "pct": 4.8,
        "count": 19
      },
      {
        "name": "通讯话费",
        "amount": 659.84,
        "pct": 2.3,
        "count": 8
      },
      {
        "name": "医疗健康",
        "amount": 368.8,
        "pct": 1.3,
        "count": 3
      },
      {
        "name": "教育学习",
        "amount": 50.0,
        "pct": 0.2,
        "count": 1
      }
    ]
  },
  {
    "label": "200–500",
    "count": 73,
    "amount": 21452.73,
    "categories": [
      {
        "name": "购物消费",
        "amount": 7079.41,
        "pct": 33.0,
        "count": 22
      },
      {
        "name": "餐饮食品",
        "amount": 5499.53,
        "pct": 25.6,
        "count": 19
      },
      {
        "name": "游戏动漫",
        "amount": 4047.32,
        "pct": 18.9,
        "count": 15
      },
      {
        "name": "交通出行",
        "amount": 2146.0,
        "pct": 10.0,
        "count": 7
      },
      {
        "name": "通讯话费",
        "amount": 896.6,
        "pct": 4.2,
        "count": 3
      },
      {
        "name": "生活缴费",
        "amount": 600.0,
        "pct": 2.8,
        "count": 3
      },
      {
        "name": "医疗健康",
        "amount": 480.87,
        "pct": 2.2,
        "count": 2
      },
      {
        "name": "教育学习",
        "amount": 360.0,
        "pct": 1.7,
        "count": 1
      },
      {
        "name": "会员订阅",
        "amount": 343.0,
        "pct": 1.6,
        "count": 1
      }
    ]
  },
  {
    "label": "500+",
    "count": 51,
    "amount": 73683.96,
    "categories": [
      {
        "name": "交通出行",
        "amount": 27989.41,
        "pct": 38.0,
        "count": 20
      },
      {
        "name": "购物消费",
        "amount": 19441.12,
        "pct": 26.4,
        "count": 12
      },
      {
        "name": "教育学习",
        "amount": 10555.0,
        "pct": 14.3,
        "count": 2
      },
      {
        "name": "医疗健康",
        "amount": 5548.58,
        "pct": 7.5,
        "count": 4
      },
      {
        "name": "游戏动漫",
        "amount": 5488.25,
        "pct": 7.4,
        "count": 6
      },
      {
        "name": "餐饮食品",
        "amount": 4661.6,
        "pct": 6.3,
        "count": 7
      }
    ]
  }
];

const LARGE_TXNS: LargeTxn[] = [
  {
    "date": "2025-09-01",
    "amount": 9299.0,
    "category": "购物消费",
    "platform": "支付宝",
    "label": "09-01 英伟达nvidia 5070 5080 5090…"
  },
  {
    "date": "2026-06-29",
    "amount": 5575.0,
    "category": "教育学习",
    "platform": "支付宝",
    "label": "06-29 小沫ROS智能体机器人课程机器人实物"
  },
  {
    "date": "2026-03-23",
    "amount": 4980.0,
    "category": "教育学习",
    "platform": "支付宝",
    "label": "03-23 AI大模型应用开发实战训练营-第22期"
  },
  {
    "date": "2026-04-17",
    "amount": 3160.0,
    "category": "交通出行",
    "platform": "微信",
    "label": "04-17 1132545340780458"
  },
  {
    "date": "2026-04-17",
    "amount": 2164.84,
    "category": "交通出行",
    "platform": "微信",
    "label": "04-17 商旅协议酒店订单"
  },
  {
    "date": "2026-03-16",
    "amount": 2050.0,
    "category": "交通出行",
    "platform": "微信",
    "label": "03-16 机票订单"
  },
  {
    "date": "2025-11-17",
    "amount": 2023.0,
    "category": "交通出行",
    "platform": "微信",
    "label": "11-17 去哪儿订单"
  },
  {
    "date": "2025-08-31",
    "amount": 1920.0,
    "category": "交通出行",
    "platform": "微信",
    "label": "08-31 机票订单"
  },
  {
    "date": "2026-04-17",
    "amount": 1898.49,
    "category": "交通出行",
    "platform": "微信",
    "label": "04-17 商旅协议酒店订单"
  },
  {
    "date": "2026-07-10",
    "amount": 1709.0,
    "category": "交通出行",
    "platform": "微信",
    "label": "07-10 机票订单"
  },
  {
    "date": "2025-12-11",
    "amount": 1579.58,
    "category": "医疗健康",
    "platform": "微信",
    "label": "12-11 湖州师范学院医学院附属鑫达医院-医学美容中心-大…"
  },
  {
    "date": "2025-10-02",
    "amount": 1528.0,
    "category": "购物消费",
    "platform": "支付宝",
    "label": "10-02 微软surface proX高通蛟龙的平板电脑 …"
  },
  {
    "date": "2025-10-05",
    "amount": 1452.0,
    "category": "交通出行",
    "platform": "微信",
    "label": "10-05 先住后付"
  },
  {
    "date": "2026-08-07",
    "amount": 1389.9,
    "category": "交通出行",
    "platform": "微信",
    "label": "08-07 机票订单"
  },
  {
    "date": "2026-01-28",
    "amount": 1325.0,
    "category": "交通出行",
    "platform": "微信",
    "label": "01-28 机票订单"
  },
  {
    "date": "2025-11-05",
    "amount": 1323.0,
    "category": "医疗健康",
    "platform": "微信",
    "label": "11-05 北京市顺义区板桥社区卫生服务中心"
  },
  {
    "date": "2026-01-14",
    "amount": 1323.0,
    "category": "医疗健康",
    "platform": "微信",
    "label": "01-14 北京市顺义区板桥社区卫生服务中心"
  },
  {
    "date": "2026-05-27",
    "amount": 1323.0,
    "category": "医疗健康",
    "platform": "微信",
    "label": "05-27 移动支付"
  },
  {
    "date": "2026-02-05",
    "amount": 1310.0,
    "category": "游戏动漫",
    "platform": "支付宝",
    "label": "02-05 全新现货 WAVE RURUDO 伊芙 CARN…"
  },
  {
    "date": "2026-05-18",
    "amount": 1301.0,
    "category": "购物消费",
    "platform": "支付宝",
    "label": "05-18 中国黄金足金999四叶草黄金项链女款纯金吊坠52…"
  },
  {
    "date": "2025-12-22",
    "amount": 1248.34,
    "category": "交通出行",
    "platform": "微信",
    "label": "12-22 机票订单"
  },
  {
    "date": "2026-04-17",
    "amount": 1244.34,
    "category": "交通出行",
    "platform": "微信",
    "label": "04-17 商旅协议酒店订单"
  },
  {
    "date": "2025-10-06",
    "amount": 1129.0,
    "category": "购物消费",
    "platform": "微信",
    "label": "10-06 商户单号XP212510061520023098…"
  },
  {
    "date": "2026-02-02",
    "amount": 1044.0,
    "category": "购物消费",
    "platform": "微信",
    "label": "02-02 LF2273738011873200591_商品…"
  },
  {
    "date": "2026-03-29",
    "amount": 1000.0,
    "category": "购物消费",
    "platform": "微信",
    "label": "03-29 北京MIRA HAIR造型"
  },
  {
    "date": "2025-09-24",
    "amount": 970.0,
    "category": "交通出行",
    "platform": "微信",
    "label": "09-24 机票订单"
  },
  {
    "date": "2026-02-10",
    "amount": 920.5,
    "category": "交通出行",
    "platform": "微信",
    "label": "02-10 成都东北京西"
  },
  {
    "date": "2026-03-27",
    "amount": 916.0,
    "category": "游戏动漫",
    "platform": "支付宝",
    "label": "03-27 补款链接 GSC 胜利女神新的希望 妮姬 NIK…"
  },
  {
    "date": "2026-02-03",
    "amount": 912.0,
    "category": "游戏动漫",
    "platform": "支付宝",
    "label": "02-03 闲置OMAHA MANTA 1/7手办，带原包装…"
  },
  {
    "date": "2025-12-15",
    "amount": 900.19,
    "category": "餐饮食品",
    "platform": "中国银行",
    "label": "12-15 网上快捷支付"
  },
  {
    "date": "2025-09-17",
    "amount": 840.0,
    "category": "交通出行",
    "platform": "微信",
    "label": "09-17 机票订单"
  },
  {
    "date": "2025-09-04",
    "amount": 838.0,
    "category": "游戏动漫",
    "platform": "支付宝",
    "label": "09-04 【米哈游/崩坏：星穹铁道/尾款】三月七1/7比例…"
  },
  {
    "date": "2025-09-23",
    "amount": 808.0,
    "category": "交通出行",
    "platform": "微信",
    "label": "09-23 成都东北京丰台"
  },
  {
    "date": "2025-09-23",
    "amount": 808.0,
    "category": "交通出行",
    "platform": "微信",
    "label": "09-23 成都东北京丰台"
  },
  {
    "date": "2025-10-02",
    "amount": 799.0,
    "category": "购物消费",
    "platform": "支付宝",
    "label": "10-02 微软Surface Pro11/10/9/8/X…"
  },
  {
    "date": "2026-01-19",
    "amount": 793.25,
    "category": "游戏动漫",
    "platform": "支付宝",
    "label": "01-19 GSAS NIKKE：胜利女神 红莲 比例手办 …"
  },
  {
    "date": "2026-01-04",
    "amount": 784.0,
    "category": "交通出行",
    "platform": "微信",
    "label": "01-04 先住后付"
  },
  {
    "date": "2026-03-01",
    "amount": 766.69,
    "category": "购物消费",
    "platform": "中国银行",
    "label": "03-01 网上快捷支付"
  },
  {
    "date": "2026-06-27",
    "amount": 737.32,
    "category": "餐饮食品",
    "platform": "招商银行",
    "label": "06-27 银联无卡自助消费 （特约）美团"
  },
  {
    "date": "2026-08-05",
    "amount": 719.0,
    "category": "游戏动漫",
    "platform": "支付宝",
    "label": "08-05 【绝区零/三Z/尾款】阵营系列 艾莲 1/7手办…"
  },
  {
    "date": "2025-09-30",
    "amount": 711.9,
    "category": "购物消费",
    "platform": "支付宝",
    "label": "09-30 surface go2 奔腾4425y处理器，8…"
  },
  {
    "date": "2026-03-06",
    "amount": 678.0,
    "category": "餐饮食品",
    "platform": "中国银行",
    "label": "03-06 网上快捷支付"
  },
  {
    "date": "2026-08-25",
    "amount": 678.0,
    "category": "交通出行",
    "platform": "微信",
    "label": "08-25 商旅会员酒店订单"
  },
  {
    "date": "2026-06-15",
    "amount": 673.53,
    "category": "购物消费",
    "platform": "中国银行",
    "label": "06-15 网上快捷支付"
  },
  {
    "date": "2026-01-01",
    "amount": 629.0,
    "category": "购物消费",
    "platform": "支付宝",
    "label": "01-01 无印良品MUJI-北京祥云小镇-POS1"
  },
  {
    "date": "2026-02-03",
    "amount": 603.09,
    "category": "餐饮食品",
    "platform": "支付宝",
    "label": "02-03 【优惠价】马年限定超级新品东阿阿胶桃花姬阿胶糕礼…"
  },
  {
    "date": "2026-07-27",
    "amount": 596.0,
    "category": "交通出行",
    "platform": "微信",
    "label": "07-27 如家neo酒店南京新街口汉中路店"
  },
  {
    "date": "2026-01-16",
    "amount": 589.0,
    "category": "餐饮食品",
    "platform": "微信",
    "label": "01-16 团购-大众点评微信小程序-26011611200…"
  },
  {
    "date": "2025-09-26",
    "amount": 581.0,
    "category": "餐饮食品",
    "platform": "微信",
    "label": "09-26 团购-250926111004000013003…"
  },
  {
    "date": "2026-03-06",
    "amount": 573.0,
    "category": "餐饮食品",
    "platform": "微信",
    "label": "03-06 美团收银909700210119870696"
  },
  {
    "date": "2025-10-31",
    "amount": 560.0,
    "category": "购物消费",
    "platform": "支付宝",
    "label": "10-31 光威龙武16gx2 4000频率"
  }
];

const MONTHS: MonthPayload[] = [
  {
    "key": "2025-08",
    "title": "2025 年 8 月 纯花销占比",
    "subtitle": "已剔除转账/房租/取现/理财等 6 笔，共 2,334.40 元",
    "txnCount": 126,
    "total": 6732.56,
    "dailyAvg": 217.18,
    "maxTxn": 1920.0,
    "top2Pct": 42.6,
    "peakNote": "08-31 2,261.10 · 08-07 512.40 · 08-22 490.00",
    "dateRange": "2025-08-01 ~ 2025-08-31",
    "categories": [
      {
        "name": "游戏动漫",
        "amount": 799.92,
        "pct": 11.9,
        "count": 14
      },
      {
        "name": "交通出行",
        "amount": 2068.76,
        "pct": 30.7,
        "count": 8
      },
      {
        "name": "购物消费",
        "amount": 887.21,
        "pct": 13.2,
        "count": 22
      },
      {
        "name": "餐饮食品",
        "amount": 1747.64,
        "pct": 26.0,
        "count": 42
      },
      {
        "name": "会员订阅",
        "amount": 392.41,
        "pct": 5.8,
        "count": 16
      },
      {
        "name": "生活缴费",
        "amount": 200.0,
        "pct": 3.0,
        "count": 1
      },
      {
        "name": "医疗健康",
        "amount": 244.87,
        "pct": 3.6,
        "count": 1
      },
      {
        "name": "教育学习",
        "amount": 30.0,
        "pct": 0.4,
        "count": 1
      },
      {
        "name": "其他",
        "amount": 361.75,
        "pct": 5.4,
        "count": 21
      }
    ],
    "daily": [
      57.5,
      403.59,
      150.55,
      378.2,
      98.08,
      74.78,
      512.4,
      57.2,
      212.64,
      189.1,
      103.1,
      11.0,
      34.99,
      39.56,
      164.87,
      112.42,
      128.07,
      97.75,
      17.36,
      7.76,
      0.0,
      490.0,
      123.62,
      353.23,
      178.33,
      91.81,
      28.0,
      2.12,
      251.77,
      101.66,
      2261.1
    ],
    "amountBuckets": [
      {
        "label": "0–30",
        "count": 71,
        "amount": 965.15
      },
      {
        "label": "30–50",
        "count": 27,
        "amount": 993.95
      },
      {
        "label": "50–100",
        "count": 18,
        "amount": 1219.73
      },
      {
        "label": "100–200",
        "count": 6,
        "amount": 760.86
      },
      {
        "label": "200–300",
        "count": 2,
        "amount": 444.87
      },
      {
        "label": "300–500",
        "count": 1,
        "amount": 428.0
      },
      {
        "label": "500–800",
        "count": 0,
        "amount": 0.0
      },
      {
        "label": "800–1000",
        "count": 0,
        "amount": 0.0
      },
      {
        "label": "1000+",
        "count": 1,
        "amount": 1920.0
      }
    ],
    "amountBucketsMerged": [
      {
        "label": "0–50",
        "count": 98,
        "amount": 1959.1
      },
      {
        "label": "50–200",
        "count": 24,
        "amount": 1980.59
      },
      {
        "label": "200–500",
        "count": 3,
        "amount": 872.87
      },
      {
        "label": "500+",
        "count": 1,
        "amount": 1920.0
      }
    ],
    "details": [
      {
        "name": "游戏动漫",
        "meta": "Top 10 / 共 14 笔 · 799.92 元",
        "rows": [
          [
            "08-04 CREOSIS rurudo 原画 SUGAR …",
            "116.70"
          ],
          [
            "08-31 菲林底片×980",
            "98.00"
          ],
          [
            "08-31 「绮梦邀约」限定礼盒",
            "98.00"
          ],
          [
            "08-23 Steam Purchase 183423921…",
            "85.62"
          ],
          [
            "08-15 成长计划",
            "68.00"
          ],
          [
            "08-18 bilibili必火推广",
            "50.00"
          ],
          [
            "08-25 bilibili必火推广",
            "50.00"
          ],
          [
            "08-26 bilibili必火推广",
            "50.00"
          ],
          [
            "08-29 Steam Purchase 183890991…",
            "43.70"
          ],
          [
            "08-22 bilibili必火推广",
            "40.00"
          ]
        ]
      },
      {
        "name": "交通出行",
        "meta": "Top 8 / 共 8 笔 · 2,068.76 元",
        "rows": [
          [
            "08-31 机票订单",
            "1,920.00"
          ],
          [
            "08-04 高德打车订单",
            "38.00"
          ],
          [
            "08-03 高德打车订单",
            "33.86"
          ],
          [
            "08-01 高德打车订单",
            "28.74"
          ],
          [
            "08-24 哈啰单车骑行卡自动续费",
            "17.80"
          ],
          [
            "08-01 高德打车订单",
            "15.86"
          ],
          [
            "08-13 单车",
            "9.50"
          ],
          [
            "08-11 地铁_奥林匹克公园_2025-08-06 22:…",
            "5.00"
          ]
        ]
      },
      {
        "name": "购物消费",
        "meta": "Top 10 / 共 22 笔 · 887.21 元",
        "rows": [
          [
            "08-25 /",
            "128.33"
          ],
          [
            "08-24 多点订单：919158867229",
            "120.66"
          ],
          [
            "08-09 甜茶Chantee法式透明复古蕾丝性感情绪美背撞…",
            "85.91"
          ],
          [
            "08-29 扫码支付",
            "81.76"
          ],
          [
            "08-02 商品",
            "69.00"
          ],
          [
            "08-15 扫码支付",
            "60.42"
          ],
          [
            "08-16 当当订单",
            "57.62"
          ],
          [
            "08-24 当当网",
            "55.00"
          ],
          [
            "08-02 二维码支付",
            "48.80"
          ],
          [
            "08-29 81443402-ID85118156-PA10…",
            "39.99"
          ]
        ]
      },
      {
        "name": "餐饮食品",
        "meta": "Top 10 / 共 42 笔 · 1,747.64 元",
        "rows": [
          [
            "08-22 北京味之嚼餐饮管理有限公司",
            "428.00"
          ],
          [
            "08-02 该歪火锅-大众点评微信小程序-250802111…",
            "136.00"
          ],
          [
            "08-24 银联无卡自助消费 （特约）美团 4/34 记账日…",
            "114.77"
          ],
          [
            "08-10 大众点评订单-25081011100400001…",
            "66.90"
          ],
          [
            "08-07 窑鸡王（新国展店）-美团App-25080711…",
            "63.50"
          ],
          [
            "08-31 顺家生活超市后沙峪店-0010056250831…",
            "58.20"
          ],
          [
            "08-29 【优惠价】母亲烘干牛肉干棒18g风干肉铺上班充饥…",
            "53.80"
          ],
          [
            "08-10 北京顺义中粮2店(250810190710160…",
            "49.80"
          ],
          [
            "08-03 银联快捷支付 厦门三快在线科技有限公司",
            "45.00"
          ],
          [
            "08-05 银联快捷支付 北京三快在线科技有限公司",
            "42.50"
          ]
        ]
      },
      {
        "name": "会员订阅",
        "meta": "全部 16 笔 · 392.41 元",
        "rows": [
          [
            "08-07 STRIPE",
            "144.40"
          ],
          [
            "08-11 iCloud；08.11购买",
            "68.00"
          ],
          [
            "08-23 App Store & Apple Music；…",
            "38.00"
          ],
          [
            "08-30 无卡支付",
            "27.86"
          ],
          [
            "08-17 百度网盘超级会员(1个月-自动续费)",
            "25.00"
          ],
          [
            "08-18 连续包月(网盘SVIP会员)",
            "20.00"
          ],
          [
            "08-27 购买大会员连续包月",
            "15.00"
          ],
          [
            "08-07 App Store & Apple Music；…",
            "14.89"
          ],
          [
            "08-12 网易云音乐-会员自动续费",
            "11.00"
          ],
          [
            "08-13 高档充电连续包月八",
            "10.00"
          ],
          [
            "08-06 App Store & Apple Music；…",
            "8.00"
          ],
          [
            "08-09 iCloud；08.09购买",
            "6.00"
          ],
          [
            "08-18 两轮车先充后付",
            "1.42"
          ],
          [
            "08-05 两轮车先充后付",
            "1.32"
          ],
          [
            "08-29 两轮车先充后付",
            "1.22"
          ],
          [
            "08-16 两轮车先充后付",
            "0.30"
          ]
        ]
      },
      {
        "name": "生活缴费",
        "meta": "全部 1 笔 · 200.00 元",
        "rows": [
          [
            "08-04 电费",
            "200.00"
          ]
        ]
      },
      {
        "name": "医疗健康",
        "meta": "全部 1 笔 · 244.87 元",
        "rows": [
          [
            "08-07 李星泽自助缴费",
            "244.87"
          ]
        ]
      },
      {
        "name": "教育学习",
        "meta": "全部 1 笔 · 30.00 元",
        "rows": [
          [
            "08-03 AutoDL服务器租赁",
            "30.00"
          ]
        ]
      },
      {
        "name": "其他",
        "meta": "全部 21 笔 · 361.75 元",
        "rows": [
          [
            "08-02 收款方备注:二维码收款",
            "46.00"
          ],
          [
            "08-17 无卡支付",
            "37.27"
          ],
          [
            "08-16 王记.麻辣烫订单",
            "33.90"
          ],
          [
            "08-15 无卡支付",
            "31.65"
          ],
          [
            "08-11 快捷支付 和平药房到家 3/34 记账日期 货币…",
            "25.30"
          ],
          [
            "08-09 无卡支付",
            "22.37"
          ],
          [
            "08-02 6203670250098018",
            "20.70"
          ],
          [
            "08-02 重庆谊品鲜温馨家园南门店",
            "19.29"
          ],
          [
            "08-06 /",
            "18.00"
          ],
          [
            "08-16 116630020177513596",
            "17.00"
          ],
          [
            "08-06 银联快捷支付 刘利",
            "15.78"
          ],
          [
            "08-18 42c6bac9caaf989f80faf1db…",
            "13.00"
          ],
          [
            "08-27 收银单号：2025082719121541156",
            "13.00"
          ],
          [
            "08-02 重庆江北龙湖源著天街-条码支付",
            "12.90"
          ],
          [
            "08-02 重庆江北龙湖源著天街-条码支付",
            "9.90"
          ],
          [
            "08-05 丁香医生-发起提问",
            "9.90"
          ],
          [
            "08-10 便利蜂购物",
            "6.50"
          ],
          [
            "08-16 便利蜂购物",
            "3.60"
          ],
          [
            "08-01 怡宝纯净水Pure Water;",
            "3.00"
          ],
          [
            "08-17 便利蜂购物",
            "2.00"
          ],
          [
            "08-03 AidenHet 截止25-2MMD作品参考学习…",
            "0.69"
          ]
        ]
      }
    ]
  },
  {
    "key": "2025-09",
    "title": "2025 年 9 月 纯花销占比",
    "subtitle": "已剔除转账/房租/取现/理财等 4 笔，共 691.40 元",
    "txnCount": 103,
    "total": 18927.07,
    "dailyAvg": 630.9,
    "maxTxn": 9299.0,
    "top2Pct": 32.6,
    "peakNote": "09-01 9,321.00 · 09-23 2,022.30 · 09-24 1,290.41",
    "dateRange": "2025-09-01 ~ 2025-09-30",
    "categories": [
      {
        "name": "游戏动漫",
        "amount": 1818.87,
        "pct": 9.6,
        "count": 9
      },
      {
        "name": "交通出行",
        "amount": 4353.92,
        "pct": 23.0,
        "count": 30
      },
      {
        "name": "购物消费",
        "amount": 10437.42,
        "pct": 55.1,
        "count": 10
      },
      {
        "name": "餐饮食品",
        "amount": 1510.59,
        "pct": 8.0,
        "count": 20
      },
      {
        "name": "会员订阅",
        "amount": 414.54,
        "pct": 2.2,
        "count": 16
      },
      {
        "name": "生活缴费",
        "amount": 200.0,
        "pct": 1.1,
        "count": 1
      },
      {
        "name": "医疗健康",
        "amount": 6.0,
        "pct": 0.0,
        "count": 1
      },
      {
        "name": "其他",
        "amount": 185.73,
        "pct": 1.0,
        "count": 16
      }
    ],
    "daily": [
      9321.0,
      140.07,
      239.32,
      838.0,
      142.12,
      36.0,
      520.31,
      159.36,
      78.18,
      217.51,
      95.05,
      111.16,
      138.94,
      107.79,
      226.08,
      218.32,
      885.0,
      0.0,
      12.56,
      3.5,
      185.5,
      0.0,
      2022.3,
      1290.41,
      45.49,
      663.33,
      97.3,
      23.8,
      82.77,
      1025.9
    ],
    "amountBuckets": [
      {
        "label": "0–30",
        "count": 62,
        "amount": 663.84
      },
      {
        "label": "30–50",
        "count": 8,
        "amount": 322.27
      },
      {
        "label": "50–100",
        "count": 12,
        "amount": 759.56
      },
      {
        "label": "100–200",
        "count": 9,
        "amount": 1283.5
      },
      {
        "label": "200–300",
        "count": 3,
        "amount": 714.0
      },
      {
        "label": "300–500",
        "count": 1,
        "amount": 328.0
      },
      {
        "label": "500–800",
        "count": 2,
        "amount": 1292.9
      },
      {
        "label": "800–1000",
        "count": 5,
        "amount": 4264.0
      },
      {
        "label": "1000+",
        "count": 1,
        "amount": 9299.0
      }
    ],
    "amountBucketsMerged": [
      {
        "label": "0–50",
        "count": 70,
        "amount": 986.11
      },
      {
        "label": "50–200",
        "count": 21,
        "amount": 2043.06
      },
      {
        "label": "200–500",
        "count": 4,
        "amount": 1042.0
      },
      {
        "label": "500+",
        "count": 8,
        "amount": 14855.9
      }
    ],
    "details": [
      {
        "name": "游戏动漫",
        "meta": "Top 9 / 共 9 笔 · 1,818.87 元",
        "rows": [
          [
            "09-04 【米哈游/崩坏：星穹铁道/尾款】三月七1/7比例…",
            "838.00"
          ],
          [
            "09-23 菲林底片×3280",
            "328.00"
          ],
          [
            "09-16 菲林底片×1980",
            "198.00"
          ],
          [
            "09-10 GSAS NIKKE：胜利女神 红莲 比例手办 …",
            "141.75"
          ],
          [
            "09-05 Steam Purchase 184381429…",
            "115.12"
          ],
          [
            "09-10 成长计划",
            "68.00"
          ],
          [
            "09-02 bilibili必火推广",
            "50.00"
          ],
          [
            "09-09 bilibili必火推广",
            "50.00"
          ],
          [
            "09-24 列车补给凭证",
            "30.00"
          ]
        ]
      },
      {
        "name": "交通出行",
        "meta": "Top 10 / 共 30 笔 · 4,353.92 元",
        "rows": [
          [
            "09-24 机票订单",
            "970.00"
          ],
          [
            "09-17 机票订单",
            "840.00"
          ],
          [
            "09-23 成都东北京丰台",
            "808.00"
          ],
          [
            "09-23 成都东北京丰台",
            "808.00"
          ],
          [
            "09-24 火车票",
            "153.00"
          ],
          [
            "09-24 成都东北京丰台",
            "124.00"
          ],
          [
            "09-07 高德打车订单",
            "117.56"
          ],
          [
            "09-08 高德打车订单",
            "65.78"
          ],
          [
            "09-08 高德打车订单",
            "59.58"
          ],
          [
            "09-12 1957|兰熊+老张牛肉面+有璟阁",
            "45.00"
          ]
        ]
      },
      {
        "name": "购物消费",
        "meta": "Top 10 / 共 10 笔 · 10,437.42 元",
        "rows": [
          [
            "09-01 英伟达nvidia 5070 5080 5090…",
            "9,299.00"
          ],
          [
            "09-30 surface go2 奔腾4425y处理器，8…",
            "711.90"
          ],
          [
            "09-30 微软surface Go1/2/3/4 原装键盘…",
            "288.00"
          ],
          [
            "09-27 杜蕾斯草莓随心选|001玻尿酸持久情趣超薄男用避…",
            "79.80"
          ],
          [
            "09-12 先购后付",
            "15.12"
          ],
          [
            "09-19 先购后付",
            "12.56"
          ],
          [
            "09-03 先购后付",
            "10.32"
          ],
          [
            "09-10 先购后付",
            "7.76"
          ],
          [
            "09-25 先购后付",
            "7.76"
          ],
          [
            "09-07 先购后付",
            "5.20"
          ]
        ]
      },
      {
        "name": "餐饮食品",
        "meta": "Top 10 / 共 20 笔 · 1,510.59 元",
        "rows": [
          [
            "09-26 团购-250926111004000013003…",
            "581.00"
          ],
          [
            "09-07 团购-250907111004000013073…",
            "226.00"
          ],
          [
            "09-15 /",
            "172.14"
          ],
          [
            "09-21 顺家生活超市后沙峪店-0010057250921…",
            "118.50"
          ],
          [
            "09-02 /",
            "85.00"
          ],
          [
            "09-13 渝脑壳串串王龙脊广场直营店店内购物",
            "72.00"
          ],
          [
            "09-14 柠檬芝士碱水、米香肠碱水（大米粉制作 比碱水要软…",
            "52.60"
          ],
          [
            "09-26 8946-茶百道北京顺义后沙峪山姆店8946茶百…",
            "50.80"
          ],
          [
            "09-21 消费：曾三仙No.0717|中粮祥云小镇南区店",
            "48.00"
          ],
          [
            "09-11 顺家生活超市后沙峪店-0010057250911…",
            "27.05"
          ]
        ]
      },
      {
        "name": "会员订阅",
        "meta": "全部 16 笔 · 414.54 元",
        "rows": [
          [
            "09-07 STRIPE",
            "143.43"
          ],
          [
            "09-11 iCloud；09.11购买",
            "68.00"
          ],
          [
            "09-23 App Store & Apple Music；…",
            "58.00"
          ],
          [
            "09-25 App Store & Apple Music；…",
            "27.00"
          ],
          [
            "09-17 百度网盘超级会员(1个月-自动续费)",
            "25.00"
          ],
          [
            "09-17 连续包月(网盘SVIP会员)",
            "20.00"
          ],
          [
            "09-07 App Store & Apple Music；…",
            "15.00"
          ],
          [
            "09-27 购买大会员连续包月",
            "15.00"
          ],
          [
            "09-12 网易云音乐-会员自动续费",
            "11.00"
          ],
          [
            "09-13 高档充电连续包月八",
            "10.00"
          ],
          [
            "09-06 App Store & Apple Music；…",
            "8.00"
          ],
          [
            "09-09 iCloud；09.09购买",
            "6.00"
          ],
          [
            "09-02 无卡支付",
            "5.07"
          ],
          [
            "09-16 两轮车先充后付",
            "1.32"
          ],
          [
            "09-29 App Store & Apple Music；…",
            "1.00"
          ],
          [
            "09-07 两轮车先充后付",
            "0.72"
          ]
        ]
      },
      {
        "name": "生活缴费",
        "meta": "全部 1 笔 · 200.00 元",
        "rows": [
          [
            "09-03 电费",
            "200.00"
          ]
        ]
      },
      {
        "name": "医疗健康",
        "meta": "全部 1 笔 · 6.00 元",
        "rows": [
          [
            "09-06 收款方备注:二维码收款",
            "6.00"
          ]
        ]
      },
      {
        "name": "其他",
        "meta": "全部 16 笔 · 185.73 元",
        "rows": [
          [
            "09-08 收款方备注:二维码收款",
            "25.00"
          ],
          [
            "09-09 无卡支付",
            "22.18"
          ],
          [
            "09-01 /",
            "22.00"
          ],
          [
            "09-06 云店商品",
            "22.00"
          ],
          [
            "09-03 晋家手擀面-点菜单支付",
            "18.00"
          ],
          [
            "09-24 照片打印冲印洗照片过塑封冲洗相片晒手机里的做成相…",
            "13.41"
          ],
          [
            "09-26 照片打印冲印洗照片过塑封冲洗相片晒手机里的做成相…",
            "13.41"
          ],
          [
            "09-16 e274fa1a4b918c57dc284b48…",
            "13.00"
          ],
          [
            "09-08 收款方备注:二维码收款",
            "9.00"
          ],
          [
            "09-16 6元一个月 客服xunlangbot@gmail…",
            "6.00"
          ],
          [
            "09-25 获得1天分身会员(投诉电话：1875323505…",
            "5.90"
          ],
          [
            "09-25 抢券教程，适用国补等各类拼手速券",
            "4.83"
          ],
          [
            "09-13 收款方备注:二维码收款",
            "3.00"
          ],
          [
            "09-21 苹果教育优惠秒过，过不了全额退款 zfb认证",
            "3.00"
          ],
          [
            "09-23 北京高济百康大药房有限公司安宁街分店缴费",
            "2.50"
          ],
          [
            "09-27 北京高济百康大药房有限公司安宁街分店缴费",
            "2.50"
          ]
        ]
      }
    ]
  },
  {
    "key": "2025-10",
    "title": "2025 年 10 月 纯花销占比",
    "subtitle": "已剔除转账/房租/取现/理财等 5 笔，共 1,844.00 元",
    "txnCount": 131,
    "total": 10200.53,
    "dailyAvg": 329.05,
    "maxTxn": 1528.0,
    "top2Pct": 21.7,
    "peakNote": "10-02 2,870.53 · 10-05 1,742.43 · 10-06 1,374.09",
    "dateRange": "2025-10-01 ~ 2025-10-31",
    "categories": [
      {
        "name": "游戏动漫",
        "amount": 437.9,
        "pct": 4.3,
        "count": 6
      },
      {
        "name": "交通出行",
        "amount": 1779.13,
        "pct": 17.4,
        "count": 24
      },
      {
        "name": "购物消费",
        "amount": 5275.92,
        "pct": 51.7,
        "count": 26
      },
      {
        "name": "餐饮食品",
        "amount": 1367.56,
        "pct": 13.4,
        "count": 20
      },
      {
        "name": "会员订阅",
        "amount": 566.62,
        "pct": 5.6,
        "count": 16
      },
      {
        "name": "生活缴费",
        "amount": 90.0,
        "pct": 0.9,
        "count": 3
      },
      {
        "name": "医疗健康",
        "amount": 17.91,
        "pct": 0.2,
        "count": 3
      },
      {
        "name": "教育学习",
        "amount": 40.0,
        "pct": 0.4,
        "count": 2
      },
      {
        "name": "其他",
        "amount": 625.49,
        "pct": 6.1,
        "count": 31
      }
    ],
    "daily": [
      477.53,
      2870.53,
      511.51,
      44.9,
      1742.43,
      1374.09,
      338.52,
      81.39,
      36.0,
      0.0,
      96.0,
      33.94,
      11.5,
      70.0,
      37.05,
      51.79,
      250.96,
      196.0,
      180.15,
      21.99,
      119.51,
      20.68,
      171.8,
      156.5,
      0.0,
      411.86,
      0.0,
      15.0,
      22.4,
      10.0,
      846.5
    ],
    "amountBuckets": [
      {
        "label": "0–30",
        "count": 90,
        "amount": 1149.43
      },
      {
        "label": "30–50",
        "count": 13,
        "amount": 484.03
      },
      {
        "label": "50–100",
        "count": 10,
        "amount": 628.69
      },
      {
        "label": "100–200",
        "count": 9,
        "amount": 1245.02
      },
      {
        "label": "200–300",
        "count": 1,
        "amount": 268.0
      },
      {
        "label": "300–500",
        "count": 3,
        "amount": 957.36
      },
      {
        "label": "500–800",
        "count": 2,
        "amount": 1359.0
      },
      {
        "label": "800–1000",
        "count": 0,
        "amount": 0.0
      },
      {
        "label": "1000+",
        "count": 3,
        "amount": 4109.0
      }
    ],
    "amountBucketsMerged": [
      {
        "label": "0–50",
        "count": 103,
        "amount": 1633.46
      },
      {
        "label": "50–200",
        "count": 19,
        "amount": 1873.71
      },
      {
        "label": "200–500",
        "count": 4,
        "amount": 1225.36
      },
      {
        "label": "500+",
        "count": 5,
        "amount": 5468.0
      }
    ],
    "details": [
      {
        "name": "游戏动漫",
        "meta": "Top 6 / 共 6 笔 · 437.90 元",
        "rows": [
          [
            "10-31 【优惠价】【原神官方/尾款】茜特菈莉&middo…",
            "268.00"
          ],
          [
            "10-23 bilibili必火推广",
            "50.00"
          ],
          [
            "10-23 bilibili必火推广",
            "40.00"
          ],
          [
            "10-26 【米哈游/崩坏：星穹铁道/定金】忘归人1/8手办…",
            "40.00"
          ],
          [
            "10-14 列车补给凭证",
            "30.00"
          ],
          [
            "10-24 《绝区零》星见雅动态壁纸",
            "9.90"
          ]
        ]
      },
      {
        "name": "交通出行",
        "meta": "Top 10 / 共 24 笔 · 1,779.13 元",
        "rows": [
          [
            "10-05 先住后付",
            "1,452.00"
          ],
          [
            "10-02 荒野之国双园-单人票",
            "116.00"
          ],
          [
            "10-05 高德打车订单",
            "24.67"
          ],
          [
            "10-01 高德打车订单",
            "19.53"
          ],
          [
            "10-02 高德打车订单",
            "17.87"
          ],
          [
            "10-23 哈啰单车骑行卡自动续费",
            "17.80"
          ],
          [
            "10-31 高德打车订单",
            "17.00"
          ],
          [
            "10-02 高德打车订单",
            "14.30"
          ],
          [
            "10-07 高德打车订单",
            "14.00"
          ],
          [
            "10-02 高德打车订单",
            "13.96"
          ]
        ]
      },
      {
        "name": "购物消费",
        "meta": "Top 10 / 共 26 笔 · 5,275.92 元",
        "rows": [
          [
            "10-02 微软surface proX高通蛟龙的平板电脑 …",
            "1,528.00"
          ],
          [
            "10-06 商户单号XP212510061520023098…",
            "1,129.00"
          ],
          [
            "10-02 微软Surface Pro11/10/9/8/X…",
            "799.00"
          ],
          [
            "10-31 光威龙武16gx2 4000频率",
            "560.00"
          ],
          [
            "10-02 迪卡侬",
            "309.50"
          ],
          [
            "10-17 【新品】影视飓风休闲卫衣卫裤套组 STORMCR…",
            "169.00"
          ],
          [
            "10-03 surface slim pen 1代 触控笔 …",
            "145.00"
          ],
          [
            "10-06 在线购买。如有售后问题请联系网站客服.20251…",
            "136.00"
          ],
          [
            "10-03 自助收银扫码支付",
            "88.00"
          ],
          [
            "10-24 多点订单：938033186829",
            "78.79"
          ]
        ]
      },
      {
        "name": "餐饮食品",
        "meta": "Top 10 / 共 20 笔 · 1,367.56 元",
        "rows": [
          [
            "10-01 乐花园鲜花蛋糕连锁店(广州瑞芝贸易有限责任公司)",
            "338.00"
          ],
          [
            "10-26 银联无卡自助消费 （特约）美团",
            "309.86"
          ],
          [
            "10-03 包间烧烤的店铺",
            "164.00"
          ],
          [
            "10-18 /",
            "157.00"
          ],
          [
            "10-07 良品铺子中秋月饼礼盒礼品团购广式流心蛋黄莲蓉豆沙…",
            "76.90"
          ],
          [
            "10-01 美团收银909700204943502496",
            "59.00"
          ],
          [
            "10-06 红旗连锁订单-2759749773108676",
            "42.00"
          ],
          [
            "10-24 醉面后沙峪物美店-点餐即支付-257412148…",
            "27.81"
          ],
          [
            "10-06 美团收银909700205134492658",
            "25.00"
          ],
          [
            "10-12 京优鲜生活超市诺德花园店-02912510900…",
            "24.94"
          ]
        ]
      },
      {
        "name": "会员订阅",
        "meta": "全部 16 笔 · 566.62 元",
        "rows": [
          [
            "10-07 STRIPE",
            "143.62"
          ],
          [
            "10-19 App Store & Apple Music；…",
            "100.00"
          ],
          [
            "10-11 iCloud；10.11购买",
            "68.00"
          ],
          [
            "10-23 App Store & Apple Music；…",
            "58.00"
          ],
          [
            "10-19 App Store & Apple Music；…",
            "50.00"
          ],
          [
            "10-24 App Store & Apple Music；…",
            "27.00"
          ],
          [
            "10-17 百度网盘超级会员(1个月-自动续费)",
            "25.00"
          ],
          [
            "10-17 连续包月(网盘SVIP会员)",
            "20.00"
          ],
          [
            "10-07 App Store & Apple Music；…",
            "15.00"
          ],
          [
            "10-28 购买大会员连续包月",
            "15.00"
          ],
          [
            "10-13 网易云音乐-会员自动续费",
            "11.00"
          ],
          [
            "10-14 高档充电连续包月八",
            "10.00"
          ],
          [
            "10-06 App Store & Apple Music；…",
            "8.00"
          ],
          [
            "10-09 iCloud；10.09购买",
            "6.00"
          ],
          [
            "10-08 小绿人预付卡",
            "5.00"
          ],
          [
            "10-19 小绿人预付卡",
            "5.00"
          ]
        ]
      },
      {
        "name": "生活缴费",
        "meta": "全部 3 笔 · 90.00 元",
        "rows": [
          [
            "10-26 电费",
            "50.00"
          ],
          [
            "10-21 电费",
            "20.00"
          ],
          [
            "10-21 电费",
            "20.00"
          ]
        ]
      },
      {
        "name": "医疗健康",
        "meta": "全部 3 笔 · 17.91 元",
        "rows": [
          [
            "10-18 收钱码收款",
            "6.00"
          ],
          [
            "10-19 收款方备注:二维码收款",
            "6.00"
          ],
          [
            "10-22 收钱码收款",
            "5.91"
          ]
        ]
      },
      {
        "name": "教育学习",
        "meta": "全部 2 笔 · 40.00 元",
        "rows": [
          [
            "10-14 AutoDL服务器租赁",
            "30.00"
          ],
          [
            "10-29 AutoDL服务器租赁",
            "10.00"
          ]
        ]
      },
      {
        "name": "其他",
        "meta": "全部 31 笔 · 625.49 元",
        "rows": [
          [
            "10-05 /",
            "114.40"
          ],
          [
            "10-05 书本保险箱密码盒子带锁小型锁的柜小钱箱存钱罐儿童…",
            "39.40"
          ],
          [
            "10-15 无卡支付",
            "37.05"
          ],
          [
            "10-17 无卡支付",
            "36.96"
          ],
          [
            "10-21 无卡支付",
            "36.95"
          ],
          [
            "10-03 充值支付",
            "34.67"
          ],
          [
            "10-21 无卡支付",
            "29.56"
          ],
          [
            "10-07 列车补票",
            "28.00"
          ],
          [
            "10-11 游泳包男干湿分离防水大容量浴兜2025新款洗澡收…",
            "28.00"
          ],
          [
            "10-03 众悦订单支付",
            "27.73"
          ],
          [
            "10-09 无卡支付",
            "22.24"
          ],
          [
            "10-03 一醒现做手工面（悠方店）-点餐即支付-25432…",
            "22.00"
          ],
          [
            "10-04 收款方备注:二维码收款",
            "16.00"
          ],
          [
            "10-08 洗漱收纳包男士出差旅行高档便携外出高端小号干湿分…",
            "15.67"
          ],
          [
            "10-22 无卡支付",
            "14.77"
          ],
          [
            "10-18 3e8f0e43247431e4075f5d6c…",
            "13.00"
          ],
          [
            "10-21 a3fef0208d9bcefed418948c…",
            "13.00"
          ],
          [
            "10-24 3b117ddd3e94eef89069ea03…",
            "13.00"
          ],
          [
            "10-26 收款方备注:二维码收款",
            "12.00"
          ],
          [
            "10-08 洗照片打印冲印自印拍立得定制相册3三寸冲洗手机里…",
            "11.10"
          ],
          [
            "10-01 收款方备注:二维码收款",
            "11.00"
          ],
          [
            "10-07 中国铁路成都局集团有限公司重庆客运段-消费",
            "9.00"
          ],
          [
            "10-03 支付-广汇店",
            "7.30"
          ],
          [
            "10-02 /",
            "7.00"
          ],
          [
            "10-04 酥肉排骨熊猫很忙",
            "7.00"
          ],
          [
            "10-16 6元一个月 客服xunlangbot@gmail…",
            "6.00"
          ],
          [
            "10-23 NFFA 画师绘画作品合集。",
            "6.00"
          ],
          [
            "10-03 ハリスヒロ 画师绳作品合集，画作素材，秒发货",
            "2.68"
          ],
          [
            "10-03 众悦订单支付",
            "2.63"
          ],
          [
            "10-05 Win10/11专业版激活密钥分享",
            "0.88"
          ],
          [
            "10-13 北京高济百康大药房有限公司安宁街分店缴费",
            "0.50"
          ]
        ]
      }
    ]
  },
  {
    "key": "2025-11",
    "title": "2025 年 11 月 纯花销占比",
    "subtitle": "已剔除转账/房租/取现/理财等 12 笔，共 3,659.40 元",
    "txnCount": 129,
    "total": 7853.02,
    "dailyAvg": 261.77,
    "maxTxn": 2023.0,
    "top2Pct": 35.7,
    "peakNote": "11-17 2,213.41 · 11-05 1,434.56 · 11-09 705.10",
    "dateRange": "2025-11-01 ~ 2025-11-30",
    "categories": [
      {
        "name": "游戏动漫",
        "amount": 240.0,
        "pct": 3.1,
        "count": 4
      },
      {
        "name": "交通出行",
        "amount": 2557.44,
        "pct": 32.6,
        "count": 20
      },
      {
        "name": "购物消费",
        "amount": 851.23,
        "pct": 10.8,
        "count": 22
      },
      {
        "name": "餐饮食品",
        "amount": 925.59,
        "pct": 11.8,
        "count": 28
      },
      {
        "name": "会员订阅",
        "amount": 529.86,
        "pct": 6.7,
        "count": 18
      },
      {
        "name": "通讯话费",
        "amount": 62.1,
        "pct": 0.8,
        "count": 1
      },
      {
        "name": "生活缴费",
        "amount": 299.5,
        "pct": 3.8,
        "count": 3
      },
      {
        "name": "医疗健康",
        "amount": 1371.0,
        "pct": 17.5,
        "count": 5
      },
      {
        "name": "教育学习",
        "amount": 409.89,
        "pct": 5.2,
        "count": 2
      },
      {
        "name": "其他",
        "amount": 606.41,
        "pct": 7.7,
        "count": 26
      }
    ],
    "daily": [
      193.6,
      34.57,
      30.0,
      30.0,
      1434.56,
      47.9,
      690.04,
      197.8,
      705.1,
      179.62,
      199.99,
      60.72,
      111.53,
      185.27,
      93.08,
      124.57,
      2213.41,
      66.88,
      0.0,
      87.12,
      100.68,
      356.45,
      226.79,
      188.99,
      21.3,
      29.73,
      47.72,
      36.56,
      129.03,
      30.01
    ],
    "amountBuckets": [
      {
        "label": "0–30",
        "count": 81,
        "amount": 1086.84
      },
      {
        "label": "30–50",
        "count": 21,
        "amount": 789.95
      },
      {
        "label": "50–100",
        "count": 17,
        "amount": 1071.15
      },
      {
        "label": "100–200",
        "count": 6,
        "amount": 907.8
      },
      {
        "label": "200–300",
        "count": 1,
        "amount": 291.28
      },
      {
        "label": "300–500",
        "count": 1,
        "amount": 360.0
      },
      {
        "label": "500–800",
        "count": 0,
        "amount": 0.0
      },
      {
        "label": "800–1000",
        "count": 0,
        "amount": 0.0
      },
      {
        "label": "1000+",
        "count": 2,
        "amount": 3346.0
      }
    ],
    "amountBucketsMerged": [
      {
        "label": "0–50",
        "count": 102,
        "amount": 1876.79
      },
      {
        "label": "50–200",
        "count": 23,
        "amount": 1978.95
      },
      {
        "label": "200–500",
        "count": 2,
        "amount": 651.28
      },
      {
        "label": "500+",
        "count": 2,
        "amount": 3346.0
      }
    ],
    "details": [
      {
        "name": "游戏动漫",
        "meta": "Top 4 / 共 4 笔 · 240.00 元",
        "rows": [
          [
            "11-10 【米哈游/崩坏：星穹铁道/定金】流萤1/7比例手…",
            "150.00"
          ],
          [
            "11-03 空月祝福",
            "30.00"
          ],
          [
            "11-04 列车补给凭证",
            "30.00"
          ],
          [
            "11-05 「开拓助力」礼包",
            "30.00"
          ]
        ]
      },
      {
        "name": "交通出行",
        "meta": "Top 10 / 共 20 笔 · 2,557.44 元",
        "rows": [
          [
            "11-17 去哪儿订单",
            "2,023.00"
          ],
          [
            "11-22 高德打车订单",
            "84.90"
          ],
          [
            "11-24 高德打车订单",
            "69.24"
          ],
          [
            "11-08 高德打车订单",
            "63.43"
          ],
          [
            "11-22 高德打车订单",
            "46.49"
          ],
          [
            "11-08 预付车费",
            "37.77"
          ],
          [
            "11-21 高德打车订单",
            "36.72"
          ],
          [
            "11-22 高德打车订单",
            "30.74"
          ],
          [
            "11-05 高德打车订单",
            "28.50"
          ],
          [
            "11-05 高德打车订单",
            "28.16"
          ]
        ]
      },
      {
        "name": "购物消费",
        "meta": "Top 10 / 共 22 笔 · 851.23 元",
        "rows": [
          [
            "11-07 网上快捷支付",
            "291.28"
          ],
          [
            "11-09 北京MIRA HAIR造型",
            "160.00"
          ],
          [
            "11-29 多点订单：948285446729",
            "105.03"
          ],
          [
            "11-22 刘文祥麻辣烫(保利中心店)外卖订单",
            "33.88"
          ],
          [
            "11-26 网上快捷支付",
            "29.73"
          ],
          [
            "11-11 MysticGlow可爱风性感免脱火辣纯欲床上q…",
            "27.99"
          ],
          [
            "11-22 永和大王·现磨豆浆·卤肉饭·早餐粥·盖浇饭·拌饭…",
            "24.40"
          ],
          [
            "11-12 /",
            "23.79"
          ],
          [
            "11-20 先购后付",
            "23.12"
          ],
          [
            "11-09 闲鱼寄件-寄件费_3084180261_LP00…",
            "20.30"
          ]
        ]
      },
      {
        "name": "餐饮食品",
        "meta": "Top 10 / 共 28 笔 · 925.59 元",
        "rows": [
          [
            "11-14 /",
            "150.00"
          ],
          [
            "11-24 顺家生活超市后沙峪店-0010057251124…",
            "92.75"
          ],
          [
            "11-23 网上快捷支付",
            "78.79"
          ],
          [
            "11-08 KFC_PREWX100125622941484…",
            "58.90"
          ],
          [
            "11-23 淮湘坊九",
            "53.00"
          ],
          [
            "11-13 顺家生活超市后沙峪店-0010057251113…",
            "47.83"
          ],
          [
            "11-09 美团/大众点评点餐订单-110950260458…",
            "45.00"
          ],
          [
            "11-01 京优鲜生活超市诺德花园店-02912510900…",
            "42.50"
          ],
          [
            "11-06 休闲农场压缩饼干抹茶黑曲奇代餐饱腹充饥解馋零食品…",
            "39.90"
          ],
          [
            "11-07 顺家生活超市后沙峪店-0010057251107…",
            "33.99"
          ]
        ]
      },
      {
        "name": "会员订阅",
        "meta": "全部 18 笔 · 529.86 元",
        "rows": [
          [
            "11-07 STRIPE",
            "143.27"
          ],
          [
            "11-11 iCloud；11.11购买",
            "68.00"
          ],
          [
            "11-23 App Store & Apple Music；…",
            "58.00"
          ],
          [
            "11-20 App Store & Apple Music；…",
            "55.00"
          ],
          [
            "11-24 App Store & Apple Music；…",
            "27.00"
          ],
          [
            "11-09 无卡支付",
            "26.75"
          ],
          [
            "11-30 无卡支付",
            "26.01"
          ],
          [
            "11-17 百度网盘超级会员(1个月-自动续费)",
            "25.00"
          ],
          [
            "11-16 连续包月(网盘SVIP会员)",
            "20.00"
          ],
          [
            "11-07 App Store & Apple Music；…",
            "15.00"
          ],
          [
            "11-28 购买大会员连续包月",
            "15.00"
          ],
          [
            "11-13 网易云音乐-会员自动续费",
            "11.00"
          ],
          [
            "11-14 高档充电连续包月八",
            "10.00"
          ],
          [
            "11-06 App Store & Apple Music；…",
            "8.00"
          ],
          [
            "11-09 iCloud；11.09购买",
            "6.00"
          ],
          [
            "11-28 App Store & Apple Music；…",
            "6.00"
          ],
          [
            "11-21 小绿人预付卡",
            "5.00"
          ],
          [
            "11-02 无卡支付",
            "4.83"
          ]
        ]
      },
      {
        "name": "通讯话费",
        "meta": "全部 1 笔 · 62.10 元",
        "rows": [
          [
            "11-11 100G/月-月套餐-8986062339002…",
            "62.10"
          ]
        ]
      },
      {
        "name": "生活缴费",
        "meta": "全部 3 笔 · 299.50 元",
        "rows": [
          [
            "11-07 电费",
            "199.50"
          ],
          [
            "11-01 电费",
            "50.00"
          ],
          [
            "11-17 水费-*建梅",
            "50.00"
          ]
        ]
      },
      {
        "name": "医疗健康",
        "meta": "全部 5 笔 · 1,371.00 元",
        "rows": [
          [
            "11-05 北京市顺义区板桥社区卫生服务中心",
            "1,323.00"
          ],
          [
            "11-16 北京顺祥云良子健身技术发展有限公司",
            "26.00"
          ],
          [
            "11-25 收款方备注:二维码收款",
            "8.00"
          ],
          [
            "11-27 收款方备注:二维码收款",
            "8.00"
          ],
          [
            "11-09 收款方备注:二维码收款",
            "6.00"
          ]
        ]
      },
      {
        "name": "教育学习",
        "meta": "全部 2 笔 · 409.89 元",
        "rows": [
          [
            "11-09 教育部留学服务中心",
            "360.00"
          ],
          [
            "11-16 代炼Lora模型，画风定制训练",
            "49.89"
          ]
        ]
      },
      {
        "name": "其他",
        "meta": "全部 26 笔 · 606.41 元",
        "rows": [
          [
            "11-15 无卡支付",
            "73.61"
          ],
          [
            "11-09 无卡支付",
            "51.75"
          ],
          [
            "11-18 无卡支付",
            "51.68"
          ],
          [
            "11-17 午夜派对「午夜紫鸢」空姐cos制服套装性感包臀裙…",
            "50.00"
          ],
          [
            "11-11 网上快捷支付",
            "41.90"
          ],
          [
            "11-22 收款方备注:二维码收款",
            "40.00"
          ],
          [
            "11-21 FEIEN「昭」可拆解一片式绑带丝滑性感内裤桑蚕…",
            "38.70"
          ],
          [
            "11-12 无卡支付",
            "36.93"
          ],
          [
            "11-17 无卡支付",
            "36.81"
          ],
          [
            "11-23 楂楂熊冰糖葫芦杭州武林夜市店订单",
            "25.00"
          ],
          [
            "11-13 二次元星穹铁道手机壳流萤遐蝶知更鸟风堇适用苹果i…",
            "20.40"
          ],
          [
            "11-08 北京邮电大学(北京邮电大学店)",
            "19.70"
          ],
          [
            "11-01 /",
            "19.00"
          ],
          [
            "11-22 条码支付-甜丫丫-C25001030025001…",
            "15.48"
          ],
          [
            "11-22 无卡支付",
            "14.76"
          ],
          [
            "11-09 /",
            "14.00"
          ],
          [
            "11-17 ce73a253375781f7bd357edb…",
            "13.00"
          ],
          [
            "11-08 收款方备注:二维码收款",
            "12.00"
          ],
          [
            "11-27 无卡支付",
            "8.82"
          ],
          [
            "11-08 收款方备注:二维码收款",
            "6.00"
          ],
          [
            "11-17 6元一个月 客服xunlangbot@gmail…",
            "6.00"
          ],
          [
            "11-21 y2k绑带手袖lolita蕾丝手套日系少女ins…",
            "5.06"
          ],
          [
            "11-15 北京高济百康大药房有限公司安宁街分店缴费",
            "2.50"
          ],
          [
            "11-23 公交-WE1314X-车号[66233] 16:…",
            "2.00"
          ],
          [
            "11-09 提供打印服务",
            "1.30"
          ],
          [
            "11-02 捷克电影51部合集，高清无水印，资源很全～",
            "0.01"
          ]
        ]
      }
    ]
  },
  {
    "key": "2025-12",
    "title": "2025 年 12 月 纯花销占比",
    "subtitle": "已剔除转账/房租/取现/理财等 6 笔，共 3,716.00 元",
    "txnCount": 98,
    "total": 8327.15,
    "dailyAvg": 268.62,
    "maxTxn": 1579.58,
    "top2Pct": 26.9,
    "peakNote": "12-11 1,661.10 · 12-22 1,310.43 · 12-15 1,209.19",
    "dateRange": "2025-12-01 ~ 2025-12-31",
    "categories": [
      {
        "name": "游戏动漫",
        "amount": 757.8,
        "pct": 9.1,
        "count": 7
      },
      {
        "name": "交通出行",
        "amount": 1482.43,
        "pct": 17.8,
        "count": 9
      },
      {
        "name": "购物消费",
        "amount": 1366.99,
        "pct": 16.4,
        "count": 29
      },
      {
        "name": "餐饮食品",
        "amount": 1820.33,
        "pct": 21.9,
        "count": 21
      },
      {
        "name": "会员订阅",
        "amount": 528.99,
        "pct": 6.4,
        "count": 16
      },
      {
        "name": "通讯话费",
        "amount": 299.0,
        "pct": 3.6,
        "count": 1
      },
      {
        "name": "医疗健康",
        "amount": 1579.58,
        "pct": 19.0,
        "count": 1
      },
      {
        "name": "其他",
        "amount": 492.03,
        "pct": 5.9,
        "count": 14
      }
    ],
    "daily": [
      17.52,
      4.73,
      72.13,
      12.0,
      56.0,
      130.45,
      400.52,
      10.8,
      11.6,
      364.16,
      1661.1,
      55.7,
      47.1,
      345.47,
      1209.19,
      20.0,
      351.07,
      135.1,
      22.72,
      406.34,
      147.73,
      1310.43,
      287.34,
      43.82,
      208.2,
      7.61,
      132.3,
      213.6,
      158.84,
      18.18,
      465.4
    ],
    "amountBuckets": [
      {
        "label": "0–30",
        "count": 50,
        "amount": 667.15
      },
      {
        "label": "30–50",
        "count": 18,
        "amount": 700.9
      },
      {
        "label": "50–100",
        "count": 15,
        "amount": 1062.82
      },
      {
        "label": "100–200",
        "count": 8,
        "amount": 1181.83
      },
      {
        "label": "200–300",
        "count": 4,
        "amount": 986.34
      },
      {
        "label": "300–500",
        "count": 0,
        "amount": 0.0
      },
      {
        "label": "500–800",
        "count": 0,
        "amount": 0.0
      },
      {
        "label": "800–1000",
        "count": 1,
        "amount": 900.19
      },
      {
        "label": "1000+",
        "count": 2,
        "amount": 2827.92
      }
    ],
    "amountBucketsMerged": [
      {
        "label": "0–50",
        "count": 68,
        "amount": 1368.05
      },
      {
        "label": "50–200",
        "count": 23,
        "amount": 2244.65
      },
      {
        "label": "200–500",
        "count": 4,
        "amount": 986.34
      },
      {
        "label": "500+",
        "count": 3,
        "amount": 3728.11
      }
    ],
    "details": [
      {
        "name": "游戏动漫",
        "meta": "Top 7 / 共 7 笔 · 757.80 元",
        "rows": [
          [
            "12-20 LEGO乐高专卖店(北京祥云小镇店)",
            "206.00"
          ],
          [
            "12-10 【官方正品】POPMART 星星人美味时刻系列四…",
            "158.34"
          ],
          [
            "12-10 【官方正品】POPMART123星星人手办玩偶盲…",
            "146.26"
          ],
          [
            "12-29 千岛卖家花花(71295749302993281…",
            "139.20"
          ],
          [
            "12-31 云POS销售 KYBJ30 KYBJ30SZ52…",
            "40.00"
          ],
          [
            "12-05 【米哈游/崩坏：星穹铁道】流萤春日手信系列周边 …",
            "38.00"
          ],
          [
            "12-17 列车补给凭证",
            "30.00"
          ]
        ]
      },
      {
        "name": "交通出行",
        "meta": "Top 9 / 共 9 笔 · 1,482.43 元",
        "rows": [
          [
            "12-22 机票订单",
            "1,248.34"
          ],
          [
            "12-18 标准票",
            "80.00"
          ],
          [
            "12-20 高德打车订单",
            "42.47"
          ],
          [
            "12-20 高德打车订单",
            "42.17"
          ],
          [
            "12-22 哈啰单车骑行卡自动续费",
            "17.80"
          ],
          [
            "12-10 高德打车订单",
            "15.72"
          ],
          [
            "12-27 高德打车订单",
            "12.11"
          ],
          [
            "12-04 高德打车订单",
            "12.00"
          ],
          [
            "12-24 高德打车订单",
            "11.82"
          ]
        ]
      },
      {
        "name": "购物消费",
        "meta": "Top 10 / 共 29 笔 · 1,366.99 元",
        "rows": [
          [
            "12-14 LC晶莹莓果润滑乳果香身体乳润肤乳保湿情趣按摩滋…",
            "156.00"
          ],
          [
            "12-28 立码富-爱玛（香蜜湾店）-06757",
            "150.00"
          ],
          [
            "12-25 甜茶Chantee 2025新款法式甜美少女蕾丝…",
            "130.80"
          ],
          [
            "12-07 多点订单：950563815029",
            "99.00"
          ],
          [
            "12-27 电影票低至15起 全国电影票代买 ，特价电影票，…",
            "96.00"
          ],
          [
            "12-06 多点订单：950114191835",
            "87.55"
          ],
          [
            "12-31 无印良品MUJI-北京祥云小镇-POS1",
            "78.00"
          ],
          [
            "12-07 网上快捷支付",
            "69.90"
          ],
          [
            "12-21 网上快捷支付",
            "49.00"
          ],
          [
            "12-14 【优惠价】跟着买!日本本土亚马逊月销8K捷古斯J…",
            "47.30"
          ]
        ]
      },
      {
        "name": "餐饮食品",
        "meta": "Top 10 / 共 21 笔 · 1,820.33 元",
        "rows": [
          [
            "12-15 网上快捷支付",
            "900.19"
          ],
          [
            "12-31 牧童禧肉社·韩国炭火烤肉店-大众点评微信小程序-…",
            "274.00"
          ],
          [
            "12-23 /",
            "207.34"
          ],
          [
            "12-14 顺家生活超市后沙峪店-0010057251214…",
            "96.17"
          ],
          [
            "12-21 顺家生活超市后沙峪店-0010057251221…",
            "55.07"
          ],
          [
            "12-12 肯德基宅急送(双裕北街店)外卖订单",
            "50.10"
          ],
          [
            "12-21 顺家生活超市后沙峪店-0010057251221…",
            "40.66"
          ],
          [
            "12-10 顺家生活超市后沙峪店-0010057251210…",
            "38.88"
          ],
          [
            "12-03 顺家生活超市后沙峪店-0010057251203…",
            "26.14"
          ],
          [
            "12-22 汉堡王(中粮祥云店20673)外卖订单",
            "20.10"
          ]
        ]
      },
      {
        "name": "会员订阅",
        "meta": "全部 16 笔 · 528.99 元",
        "rows": [
          [
            "12-07 STRIPE",
            "142.23"
          ],
          [
            "12-11 iCloud；12.11购买",
            "68.00"
          ],
          [
            "12-17 彩虹电热水袋暖手宝TB充电防爆支架保暖腰式防爆充…",
            "59.03"
          ],
          [
            "12-23 App Store & Apple Music；…",
            "58.00"
          ],
          [
            "12-20 App Store & Apple Music；…",
            "55.00"
          ],
          [
            "12-24 App Store & Apple Music；…",
            "27.00"
          ],
          [
            "12-17 百度网盘超级会员(1个月-自动续费)",
            "25.00"
          ],
          [
            "12-16 连续包月(网盘SVIP会员)",
            "20.00"
          ],
          [
            "12-07 App Store & Apple Music；…",
            "15.00"
          ],
          [
            "12-29 购买大会员连续包月",
            "15.00"
          ],
          [
            "12-14 网易云音乐-会员自动续费",
            "11.00"
          ],
          [
            "12-15 高档充电连续包月八",
            "10.00"
          ],
          [
            "12-06 App Store & Apple Music；…",
            "8.00"
          ],
          [
            "12-09 iCloud；12.09购买",
            "6.00"
          ],
          [
            "12-24 小绿人预付卡",
            "5.00"
          ],
          [
            "12-02 无卡支付",
            "4.73"
          ]
        ]
      },
      {
        "name": "通讯话费",
        "meta": "全部 1 笔 · 299.00 元",
        "rows": [
          [
            "12-15 100G/月-半年套餐-898606233900…",
            "299.00"
          ]
        ]
      },
      {
        "name": "医疗健康",
        "meta": "全部 1 笔 · 1,579.58 元",
        "rows": [
          [
            "12-11 湖州师范学院医学院附属鑫达医院-医学美容中心-大…",
            "1,579.58"
          ]
        ]
      },
      {
        "name": "其他",
        "meta": "全部 14 笔 · 492.03 元",
        "rows": [
          [
            "12-17 网上快捷支付",
            "159.00"
          ],
          [
            "12-25 网上快捷支付",
            "59.90"
          ],
          [
            "12-18 无卡支付",
            "51.10"
          ],
          [
            "12-17 无卡支付",
            "36.51"
          ],
          [
            "12-07 金凤成祥后沙峪",
            "34.40"
          ],
          [
            "12-17 潘婷三分钟洗发水茉莉山茶花香多效修护干枯受损发持…",
            "30.53"
          ],
          [
            "12-31 拍立方业务",
            "29.90"
          ],
          [
            "12-20 华堂商场亚运村店-超市",
            "23.80"
          ],
          [
            "12-06 收款方备注:二维码收款",
            "15.00"
          ],
          [
            "12-22 无卡支付",
            "14.59"
          ],
          [
            "12-13 1f45a1570d53b314a3937214…",
            "13.00"
          ],
          [
            "12-27 琦王花生-消费",
            "12.19"
          ],
          [
            "12-26 收钱码收款",
            "7.61"
          ],
          [
            "12-31 北京高济百康大药房有限公司安宁街分店缴费",
            "4.50"
          ]
        ]
      }
    ]
  },
  {
    "key": "2026-01",
    "title": "2026 年 1 月 纯花销占比",
    "subtitle": "已剔除转账/房租/取现/理财等 4 笔，共 1,440.00 元",
    "txnCount": 116,
    "total": 9659.31,
    "dailyAvg": 311.59,
    "maxTxn": 1325.0,
    "top2Pct": 51.3,
    "peakNote": "01-14 1,448.29 · 01-28 1,330.20 · 01-04 971.21",
    "dateRange": "2026-01-01 ~ 2026-01-31",
    "categories": [
      {
        "name": "游戏动漫",
        "amount": 2162.32,
        "pct": 22.4,
        "count": 18
      },
      {
        "name": "交通出行",
        "amount": 2794.52,
        "pct": 28.9,
        "count": 21
      },
      {
        "name": "购物消费",
        "amount": 935.98,
        "pct": 9.7,
        "count": 12
      },
      {
        "name": "餐饮食品",
        "amount": 1227.85,
        "pct": 12.7,
        "count": 20
      },
      {
        "name": "会员订阅",
        "amount": 498.24,
        "pct": 5.2,
        "count": 16
      },
      {
        "name": "生活缴费",
        "amount": 200.0,
        "pct": 2.1,
        "count": 1
      },
      {
        "name": "医疗健康",
        "amount": 1383.97,
        "pct": 14.3,
        "count": 4
      },
      {
        "name": "其他",
        "amount": 456.43,
        "pct": 4.7,
        "count": 24
      }
    ],
    "daily": [
      833.0,
      263.51,
      159.23,
      971.21,
      360.22,
      26.12,
      336.89,
      21.69,
      13.92,
      159.5,
      98.0,
      12.32,
      83.68,
      1448.29,
      49.29,
      589.0,
      66.12,
      126.46,
      802.03,
      73.4,
      345.8,
      24.44,
      144.11,
      37.82,
      342.0,
      69.63,
      21.63,
      1330.2,
      305.15,
      118.78,
      425.87
    ],
    "amountBuckets": [
      {
        "label": "0–30",
        "count": 73,
        "amount": 1084.02
      },
      {
        "label": "30–50",
        "count": 14,
        "amount": 522.2
      },
      {
        "label": "50–100",
        "count": 14,
        "amount": 926.17
      },
      {
        "label": "100–200",
        "count": 5,
        "amount": 726.67
      },
      {
        "label": "200–300",
        "count": 3,
        "amount": 629.0
      },
      {
        "label": "300–500",
        "count": 1,
        "amount": 328.0
      },
      {
        "label": "500–800",
        "count": 4,
        "amount": 2795.25
      },
      {
        "label": "800–1000",
        "count": 0,
        "amount": 0.0
      },
      {
        "label": "1000+",
        "count": 2,
        "amount": 2648.0
      }
    ],
    "amountBucketsMerged": [
      {
        "label": "0–50",
        "count": 87,
        "amount": 1606.22
      },
      {
        "label": "50–200",
        "count": 19,
        "amount": 1652.84
      },
      {
        "label": "200–500",
        "count": 4,
        "amount": 957.0
      },
      {
        "label": "500+",
        "count": 6,
        "amount": 5443.25
      }
    ],
    "details": [
      {
        "name": "游戏动漫",
        "meta": "Top 10 / 共 18 笔 · 2,162.32 元",
        "rows": [
          [
            "01-19 GSAS NIKKE：胜利女神 红莲 比例手办 …",
            "793.25"
          ],
          [
            "01-21 3280创世结晶",
            "328.00"
          ],
          [
            "01-25 【原神官方/尾款】刻晴&middot;璀夜华宴V…",
            "229.00"
          ],
          [
            "01-29 【绝区零/三Z/定金】阵营系列 维多利亚家政 艾…",
            "150.00"
          ],
          [
            "01-31 Reverse 幻想曲系列 缇娅 魅魔见习生Ve…",
            "149.70"
          ],
          [
            "01-25 【原神官方】努昂诺塔毛绒挂件 哥伦比娅 Gens…",
            "89.00"
          ],
          [
            "01-07 【米哈游/崩坏：星穹铁道】流萤春日手信系列周边 …",
            "83.00"
          ],
          [
            "01-05 千岛卖家小小包oo(73956741817886…",
            "54.00"
          ],
          [
            "01-29 芙宁娜凹版艺术券（限量500）",
            "46.00"
          ],
          [
            "01-29 X-PLUS NIKKE：胜利女神 爱丽丝 拼装…",
            "44.25"
          ]
        ]
      },
      {
        "name": "交通出行",
        "meta": "Top 10 / 共 21 笔 · 2,794.52 元",
        "rows": [
          [
            "01-28 机票订单",
            "1,325.00"
          ],
          [
            "01-04 先住后付",
            "784.00"
          ],
          [
            "01-31 成都东沙坪坝",
            "157.00"
          ],
          [
            "01-02 厦门鼓浪屿船票往返，东渡码头上下船。两个登船点可…",
            "129.50"
          ],
          [
            "01-04 【极速秒出】厦门高崎国际机场贵宾厅休息室",
            "67.50"
          ],
          [
            "01-03 下单支付",
            "60.00"
          ],
          [
            "01-05 高德打车订单",
            "49.70"
          ],
          [
            "01-04 高德打车订单",
            "30.16"
          ],
          [
            "01-02 高德打车订单",
            "26.85"
          ],
          [
            "01-03 高德打车订单",
            "23.51"
          ]
        ]
      },
      {
        "name": "购物消费",
        "meta": "Top 10 / 共 12 笔 · 935.98 元",
        "rows": [
          [
            "01-01 无印良品MUJI-北京祥云小镇-POS1",
            "629.00"
          ],
          [
            "01-30 多点订单：965913310729",
            "65.79"
          ],
          [
            "01-31 北京中粮祥云小镇店_书店",
            "58.00"
          ],
          [
            "01-14 多点订单：961338110529",
            "50.16"
          ],
          [
            "01-23 京东七鲜超市",
            "35.30"
          ],
          [
            "01-07 先购后付",
            "21.92"
          ],
          [
            "01-08 惠邻百佳超市(后沙峪店)",
            "21.69"
          ],
          [
            "01-10 散单运费-顺丰速运",
            "20.00"
          ],
          [
            "01-12 先购后付",
            "12.32"
          ],
          [
            "01-20 先购后付",
            "11.40"
          ]
        ]
      },
      {
        "name": "餐饮食品",
        "meta": "Top 10 / 共 20 笔 · 1,227.85 元",
        "rows": [
          [
            "01-16 团购-大众点评微信小程序-26011611200…",
            "589.00"
          ],
          [
            "01-01 微信充值200元送19元国王卡30天特权",
            "200.00"
          ],
          [
            "01-10 贝德尔口腔 （后沙峪店）-美团微信小程序-260…",
            "98.00"
          ],
          [
            "01-29 KFC_PREWX100125920820533…",
            "49.90"
          ],
          [
            "01-23 顺家生活超市后沙峪店-0010057260123…",
            "33.93"
          ],
          [
            "01-31 网上快捷支付",
            "27.50"
          ],
          [
            "01-05 美团订单-2601051120070000130…",
            "24.49"
          ],
          [
            "01-25 醉面后沙峪物美店-点餐即支付-270859151…",
            "24.00"
          ],
          [
            "01-31 美团订单-2601311120070000130…",
            "22.90"
          ],
          [
            "01-30 醉面后沙峪物美店-扫码付-YY034001-26…",
            "22.00"
          ]
        ]
      },
      {
        "name": "会员订阅",
        "meta": "全部 16 笔 · 498.24 元",
        "rows": [
          [
            "01-07 STRIPE",
            "140.47"
          ],
          [
            "01-11 iCloud；01.11购买",
            "68.00"
          ],
          [
            "01-23 App Store & Apple Music；…",
            "57.53"
          ],
          [
            "01-20 App Store & Apple Music；…",
            "55.00"
          ],
          [
            "01-24 App Store & Apple Music；…",
            "27.00"
          ],
          [
            "01-04 无卡支付",
            "25.58"
          ],
          [
            "01-17 百度网盘超级会员(1个月-自动续费)",
            "25.00"
          ],
          [
            "01-15 连续包月(网盘SVIP会员)",
            "20.00"
          ],
          [
            "01-07 App Store & Apple Music；…",
            "15.00"
          ],
          [
            "01-29 购买大会员连续包月",
            "15.00"
          ],
          [
            "01-14 网易云音乐-会员自动续费",
            "11.00"
          ],
          [
            "01-15 高档充电连续包月八",
            "10.00"
          ],
          [
            "01-22 充电余额充值",
            "10.00"
          ],
          [
            "01-06 App Store & Apple Music；…",
            "8.00"
          ],
          [
            "01-09 iCloud；01.09购买",
            "6.00"
          ],
          [
            "01-02 无卡支付",
            "4.66"
          ]
        ]
      },
      {
        "name": "生活缴费",
        "meta": "全部 1 笔 · 200.00 元",
        "rows": [
          [
            "01-05 电费",
            "200.00"
          ]
        ]
      },
      {
        "name": "医疗健康",
        "meta": "全部 4 笔 · 1,383.97 元",
        "rows": [
          [
            "01-14 北京市顺义区板桥社区卫生服务中心",
            "1,323.00"
          ],
          [
            "01-04 门诊收费窗口-充值",
            "36.84"
          ],
          [
            "01-10 WX-MINI|门诊|预约挂号|李*泽|20.0…",
            "20.00"
          ],
          [
            "01-04 门诊收费窗口-充值",
            "4.13"
          ]
        ]
      },
      {
        "name": "其他",
        "meta": "全部 24 笔 · 456.43 元",
        "rows": [
          [
            "01-26 网上快捷支付",
            "69.63"
          ],
          [
            "01-18 无卡支付",
            "50.56"
          ],
          [
            "01-17 无卡支付",
            "36.12"
          ],
          [
            "01-02 厦门市园林植物园-消费",
            "30.00"
          ],
          [
            "01-13 OneDrive扩容个人版office365家庭…",
            "29.68"
          ],
          [
            "01-18 收款方备注:二维码收款",
            "25.00"
          ],
          [
            "01-03 无卡支付",
            "21.72"
          ],
          [
            "01-27 无卡支付",
            "21.63"
          ],
          [
            "01-07 网上快捷支付",
            "21.00"
          ],
          [
            "01-02 厦门市政体育培训管理有限公司-消费",
            "20.00"
          ],
          [
            "01-03 收款方备注:二维码收款",
            "18.00"
          ],
          [
            "01-02 收款方备注:二维码收款",
            "16.00"
          ],
          [
            "01-22 无卡支付",
            "14.44"
          ],
          [
            "01-30 7b083e6cd79e4ea3bf8479da…",
            "12.99"
          ],
          [
            "01-02 收款方备注:二维码收款",
            "12.00"
          ],
          [
            "01-02 收款方备注:二维码收款",
            "10.00"
          ],
          [
            "01-03 厦门市思明区乐酥渔之阁食品店",
            "8.00"
          ],
          [
            "01-09 FXX/YOUTOPIA画师图集插画二次元liv…",
            "7.92"
          ],
          [
            "01-20 najar图集作品插画设计二次元原画资料素材",
            "7.00"
          ],
          [
            "01-05 画师Rinhee 2025年12月20日最新动漫…",
            "6.16"
          ],
          [
            "01-03 收款方备注:二维码收款",
            "5.00"
          ],
          [
            "01-03 公交-B3路-16:51",
            "5.00"
          ],
          [
            "01-17 (已经被举报多次，随时被下架，懂的都懂)易道云C…",
            "5.00"
          ],
          [
            "01-19 北京高济百康大药房有限公司安宁街分店缴费",
            "3.58"
          ]
        ]
      }
    ]
  },
  {
    "key": "2026-02",
    "title": "2026 年 2 月 纯花销占比",
    "subtitle": "已剔除转账/房租/取现/理财等 14 笔，共 41,022.99 元",
    "txnCount": 112,
    "total": 12916.27,
    "dailyAvg": 461.3,
    "maxTxn": 1310.0,
    "top2Pct": 39.1,
    "peakNote": "02-03 3,282.93 · 02-02 1,862.61 · 02-05 1,492.20",
    "dateRange": "2026-02-01 ~ 2026-02-28",
    "categories": [
      {
        "name": "游戏动漫",
        "amount": 2946.74,
        "pct": 22.8,
        "count": 13
      },
      {
        "name": "交通出行",
        "amount": 2104.09,
        "pct": 16.3,
        "count": 21
      },
      {
        "name": "购物消费",
        "amount": 4374.11,
        "pct": 33.9,
        "count": 28
      },
      {
        "name": "餐饮食品",
        "amount": 2470.97,
        "pct": 19.1,
        "count": 17
      },
      {
        "name": "会员订阅",
        "amount": 504.82,
        "pct": 3.9,
        "count": 16
      },
      {
        "name": "生活缴费",
        "amount": 100.0,
        "pct": 0.8,
        "count": 1
      },
      {
        "name": "其他",
        "amount": 415.54,
        "pct": 3.2,
        "count": 16
      }
    ],
    "daily": [
      517.35,
      1862.61,
      3282.93,
      25.63,
      1492.2,
      540.68,
      941.12,
      243.94,
      100.6,
      984.29,
      154.9,
      30.1,
      601.37,
      158.9,
      97.3,
      0.0,
      26.98,
      123.01,
      43.9,
      108.58,
      519.25,
      232.01,
      205.45,
      370.01,
      117.88,
      0.0,
      5.57,
      129.71
    ],
    "amountBuckets": [
      {
        "label": "0–30",
        "count": 46,
        "amount": 651.86
      },
      {
        "label": "30–50",
        "count": 12,
        "amount": 436.92
      },
      {
        "label": "50–100",
        "count": 27,
        "amount": 1844.66
      },
      {
        "label": "100–200",
        "count": 9,
        "amount": 1082.23
      },
      {
        "label": "200–300",
        "count": 6,
        "amount": 1461.45
      },
      {
        "label": "300–500",
        "count": 7,
        "amount": 2649.56
      },
      {
        "label": "500–800",
        "count": 1,
        "amount": 603.09
      },
      {
        "label": "800–1000",
        "count": 2,
        "amount": 1832.5
      },
      {
        "label": "1000+",
        "count": 2,
        "amount": 2354.0
      }
    ],
    "amountBucketsMerged": [
      {
        "label": "0–50",
        "count": 58,
        "amount": 1088.78
      },
      {
        "label": "50–200",
        "count": 36,
        "amount": 2926.89
      },
      {
        "label": "200–500",
        "count": 13,
        "amount": 4111.01
      },
      {
        "label": "500+",
        "count": 5,
        "amount": 4789.59
      }
    ],
    "details": [
      {
        "name": "游戏动漫",
        "meta": "Top 10 / 共 13 笔 · 2,946.74 元",
        "rows": [
          [
            "02-05 全新现货 WAVE RURUDO 伊芙 CARN…",
            "1,310.00"
          ],
          [
            "02-03 闲置OMAHA MANTA 1/7手办，带原包装…",
            "912.00"
          ],
          [
            "02-06 APEX 绝区零 阵营系列 天琴座 伊芙琳·舒瓦…",
            "150.00"
          ],
          [
            "02-01 FuRyu 泡面压 VOCALOID 初音未来 …",
            "98.55"
          ],
          [
            "02-06 余量追订GSC 胜利女神新的希望 妮姬 NIKK…",
            "94.89"
          ],
          [
            "02-07 千岛卖家千岛闪购潮玩(1077636887142…",
            "84.10"
          ],
          [
            "02-08 【现货包邮】GW原厂 蔚蓝档案 浦和花子 雨夜美…",
            "62.80"
          ],
          [
            "02-25 GSC POP UP PARADE BEACH …",
            "58.35"
          ],
          [
            "02-21 GSC POP UP PARADE 不时用俄语小…",
            "55.25"
          ],
          [
            "02-11 Myethos Gift+系列 原神 哥伦比娅 …",
            "50.00"
          ]
        ]
      },
      {
        "name": "交通出行",
        "meta": "Top 10 / 共 21 笔 · 2,104.09 元",
        "rows": [
          [
            "02-10 成都东北京西",
            "920.50"
          ],
          [
            "02-21 先住后付",
            "376.00"
          ],
          [
            "02-24 先住后付",
            "220.00"
          ],
          [
            "02-14 大足南成都东",
            "118.00"
          ],
          [
            "02-02 内江北成都东",
            "81.00"
          ],
          [
            "02-02 内江北成都东",
            "77.00"
          ],
          [
            "02-24 G1591A----消费",
            "58.00"
          ],
          [
            "02-24 高德打车订单",
            "50.01"
          ],
          [
            "02-10 火车票",
            "39.00"
          ],
          [
            "02-12 高德打车订单",
            "30.10"
          ]
        ]
      },
      {
        "name": "购物消费",
        "meta": "Top 10 / 共 28 笔 · 4,374.11 元",
        "rows": [
          [
            "02-02 LF2273738011873200591_商品…",
            "1,044.00"
          ],
          [
            "02-07 代拍影视飓风冲锋衣棉服，淘宝有大额消费券，可支持…",
            "464.89"
          ],
          [
            "02-03 网上快捷支付",
            "425.85"
          ],
          [
            "02-02 网上快捷支付",
            "356.06"
          ],
          [
            "02-03 LUOL噜噢花生杯纯钛双层钛杯啤酒杯茶杯便携钛水…",
            "344.75"
          ],
          [
            "02-02 GERM纯钛保温杯茶水分离泡茶杯男款钛杯2025…",
            "269.00"
          ],
          [
            "02-01 网上快捷支付",
            "246.80"
          ],
          [
            "02-07 商户单号XP242602070220033505…",
            "133.33"
          ],
          [
            "02-05 磁悬浮月球灯，木质底座，搬家清闲置，几乎全新，功…",
            "122.20"
          ],
          [
            "02-22 电影票代买15.9起一张，特价电影票、全国优惠电…",
            "113.80"
          ]
        ]
      },
      {
        "name": "餐饮食品",
        "meta": "Top 10 / 共 17 笔 · 2,470.97 元",
        "rows": [
          [
            "02-03 【优惠价】马年限定超级新品东阿阿胶桃花姬阿胶糕礼…",
            "603.09"
          ],
          [
            "02-03 【免疫礼盒】仙芝楼破壁灵芝孢子粉灵芝粉正品官方旗…",
            "364.49"
          ],
          [
            "02-03 【优惠价】【年货礼盒】江中猴姑米稀米糊30天装*…",
            "317.52"
          ],
          [
            "02-06 【优惠价】张一元茶叶四大茗茶五福礼盒红茶龙井铁观…",
            "287.89"
          ],
          [
            "02-13 【优惠价】三禾北京稻香村中式糕点礼盒点心特产小吃…",
            "230.15"
          ],
          [
            "02-13 小票号260213505711028231960…",
            "207.61"
          ],
          [
            "02-13 零食很忙重庆大足万古店-消费",
            "105.40"
          ],
          [
            "02-15 银联无卡自助消费 （特约）美团",
            "72.30"
          ],
          [
            "02-21 土门镇桂芳副食经营部",
            "60.00"
          ],
          [
            "02-01 美团订单-2602011120070000130…",
            "53.13"
          ]
        ]
      },
      {
        "name": "会员订阅",
        "meta": "全部 16 笔 · 504.82 元",
        "rows": [
          [
            "02-07 STRIPE",
            "139.50"
          ],
          [
            "02-11 iCloud；02.11购买",
            "68.00"
          ],
          [
            "02-23 App Store & Apple Music；…",
            "57.89"
          ],
          [
            "02-20 App Store & Apple Music；…",
            "55.00"
          ],
          [
            "02-28 无卡支付",
            "27.15"
          ],
          [
            "02-24 App Store & Apple Music；…",
            "27.00"
          ],
          [
            "02-04 无卡支付",
            "25.63"
          ],
          [
            "02-17 百度网盘超级会员(1个月-自动续费)",
            "25.00"
          ],
          [
            "02-14 连续包月(网盘SVIP会员)",
            "20.00"
          ],
          [
            "02-07 App Store & Apple Music；…",
            "15.00"
          ],
          [
            "02-14 网易云音乐-会员自动续费",
            "11.00"
          ],
          [
            "02-15 高档充电连续包月八",
            "10.00"
          ],
          [
            "02-06 App Store & Apple Music；…",
            "7.90"
          ],
          [
            "02-09 iCloud；02.09购买",
            "6.00"
          ],
          [
            "02-01 小绿人预付卡",
            "5.00"
          ],
          [
            "02-02 无卡支付",
            "4.75"
          ]
        ]
      },
      {
        "name": "生活缴费",
        "meta": "全部 1 笔 · 100.00 元",
        "rows": [
          [
            "02-22 电费自动缴费-根据每期出账后自动缴费",
            "100.00"
          ]
        ]
      },
      {
        "name": "其他",
        "meta": "全部 16 笔 · 415.54 元",
        "rows": [
          [
            "02-01 收款方备注:二维码收款",
            "90.00"
          ],
          [
            "02-23 /",
            "74.67"
          ],
          [
            "02-18 无卡支付",
            "50.01"
          ],
          [
            "02-20 无卡支付",
            "35.78"
          ],
          [
            "02-03 单联A4文件框办公用品文件栏桌面资料收纳筐资料架…",
            "34.50"
          ],
          [
            "02-18 【优惠价】sm挠脚心道具羽毛拍工具调教夫妻调情趣…",
            "30.80"
          ],
          [
            "02-15 48576900大足区宸福大药...",
            "15.00"
          ],
          [
            "02-22 无卡支付",
            "14.31"
          ],
          [
            "02-11 【优惠价】蝴蝶结飘带发夹高级感低马尾半扎发甜美公…",
            "12.90"
          ],
          [
            "02-19 &quot;香草味的夏天&quot;蕾丝花边袜子…",
            "11.50"
          ],
          [
            "02-21 收款方备注:二维码收款",
            "10.00"
          ],
          [
            "02-21 收款方备注:二维码收款",
            "10.00"
          ],
          [
            "02-07 【优惠价】性感低腰纯欲丁字裤攻速蕾丝T裤镂空金属…",
            "8.30"
          ],
          [
            "02-21 个体户李文凤(个人李文凤946158)",
            "8.00"
          ],
          [
            "02-01 xordel",
            "5.87"
          ],
          [
            "02-22 德阳经开区美耶仓日用百货店(个体工商户)",
            "3.90"
          ]
        ]
      }
    ]
  },
  {
    "key": "2026-03",
    "title": "2026 年 3 月 纯花销占比",
    "subtitle": "已剔除转账/房租/取现/理财等 6 笔，共 12,698.00 元",
    "txnCount": 104,
    "total": 17425.15,
    "dailyAvg": 562.1,
    "maxTxn": 4980.0,
    "top2Pct": 28.7,
    "peakNote": "03-23 5,043.20 · 03-16 2,201.23 · 03-06 1,621.80",
    "dateRange": "2026-03-01 ~ 2026-03-31",
    "categories": [
      {
        "name": "游戏动漫",
        "amount": 2816.4,
        "pct": 16.2,
        "count": 20
      },
      {
        "name": "交通出行",
        "amount": 2177.44,
        "pct": 12.5,
        "count": 6
      },
      {
        "name": "购物消费",
        "amount": 3826.7,
        "pct": 22.0,
        "count": 27
      },
      {
        "name": "餐饮食品",
        "amount": 1986.25,
        "pct": 11.4,
        "count": 16
      },
      {
        "name": "会员订阅",
        "amount": 826.19,
        "pct": 4.7,
        "count": 19
      },
      {
        "name": "生活缴费",
        "amount": 150.0,
        "pct": 0.9,
        "count": 2
      },
      {
        "name": "医疗健康",
        "amount": 290.8,
        "pct": 1.7,
        "count": 2
      },
      {
        "name": "教育学习",
        "amount": 5030.0,
        "pct": 28.9,
        "count": 2
      },
      {
        "name": "其他",
        "amount": 321.37,
        "pct": 1.8,
        "count": 10
      }
    ],
    "daily": [
      1215.17,
      0.0,
      27.54,
      0.0,
      50.0,
      1621.8,
      217.32,
      475.46,
      61.6,
      264.9,
      489.19,
      39.99,
      80.0,
      266.91,
      298.83,
      2201.23,
      43.2,
      958.83,
      193.28,
      111.22,
      473.6,
      32.8,
      5043.2,
      370.0,
      16.39,
      0.0,
      917.85,
      668.26,
      1179.7,
      56.88,
      50.0
    ],
    "amountBuckets": [
      {
        "label": "0–30",
        "count": 38,
        "amount": 493.26
      },
      {
        "label": "30–50",
        "count": 20,
        "amount": 742.77
      },
      {
        "label": "50–100",
        "count": 20,
        "amount": 1297.46
      },
      {
        "label": "100–200",
        "count": 10,
        "amount": 1526.5
      },
      {
        "label": "200–300",
        "count": 7,
        "amount": 1676.26
      },
      {
        "label": "300–500",
        "count": 2,
        "amount": 725.21
      },
      {
        "label": "500–800",
        "count": 3,
        "amount": 2017.69
      },
      {
        "label": "800–1000",
        "count": 1,
        "amount": 916.0
      },
      {
        "label": "1000+",
        "count": 3,
        "amount": 8030.0
      }
    ],
    "amountBucketsMerged": [
      {
        "label": "0–50",
        "count": 58,
        "amount": 1236.03
      },
      {
        "label": "50–200",
        "count": 30,
        "amount": 2823.96
      },
      {
        "label": "200–500",
        "count": 9,
        "amount": 2401.47
      },
      {
        "label": "500+",
        "count": 7,
        "amount": 10963.69
      }
    ],
    "details": [
      {
        "name": "游戏动漫",
        "meta": "Top 10 / 共 20 笔 · 2,816.40 元",
        "rows": [
          [
            "03-27 补款链接 GSC 胜利女神新的希望 妮姬 NIK…",
            "916.00"
          ],
          [
            "03-14 乐高玩具 [11260314069900001]",
            "249.00"
          ],
          [
            "03-06 【原神官方/尾款】梦见月瑞希&middot;绮梦…",
            "248.00"
          ],
          [
            "03-08 20260308-[P0313260308000…",
            "240.00"
          ],
          [
            "03-11 【崩坏：星穹铁道/尾款】忘归人1/8手办 星运进…",
            "229.00"
          ],
          [
            "03-18 闪魂 绝区零收藏卡第一弹-丽都万象 游戏动漫收藏…",
            "160.00"
          ],
          [
            "03-18 闪魂新款《绝区零》收藏卡第一弹",
            "145.00"
          ],
          [
            "03-08 实战包",
            "99.90"
          ],
          [
            "03-29 基础包",
            "99.90"
          ],
          [
            "03-21 【米哈游/崩坏：星穹铁道】与你同行的回忆系列明信…",
            "80.00"
          ]
        ]
      },
      {
        "name": "交通出行",
        "meta": "Top 6 / 共 6 笔 · 2,177.44 元",
        "rows": [
          [
            "03-16 机票订单",
            "2,050.00"
          ],
          [
            "03-16 高德打车订单",
            "41.50"
          ],
          [
            "03-16 高德打车订单",
            "35.73"
          ],
          [
            "03-10 高德打车订单",
            "19.64"
          ],
          [
            "03-22 哈啰单车骑行卡自动续费",
            "17.80"
          ],
          [
            "03-10 高德打车订单",
            "12.77"
          ]
        ]
      },
      {
        "name": "购物消费",
        "meta": "Top 10 / 共 27 笔 · 3,826.70 元",
        "rows": [
          [
            "03-29 北京MIRA HAIR造型",
            "1,000.00"
          ],
          [
            "03-01 网上快捷支付",
            "766.69"
          ],
          [
            "03-18 网上快捷支付",
            "382.21"
          ],
          [
            "03-21 快捷支付 GNC健安喜海外京东自营旗舰店",
            "273.60"
          ],
          [
            "03-28 订单：981880979829",
            "200.66"
          ],
          [
            "03-01 网上快捷支付",
            "199.00"
          ],
          [
            "03-10 清清清，珂润舒缓修护修红精华露40ml",
            "155.00"
          ],
          [
            "03-11 网上快捷支付",
            "142.19"
          ],
          [
            "03-28 订单：981877534129",
            "94.00"
          ],
          [
            "03-19 网上快捷支付",
            "69.90"
          ]
        ]
      },
      {
        "name": "餐饮食品",
        "meta": "Top 10 / 共 16 笔 · 1,986.25 元",
        "rows": [
          [
            "03-06 网上快捷支付",
            "678.00"
          ],
          [
            "03-06 美团收银909700210119870696",
            "573.00"
          ],
          [
            "03-15 银联无卡自助消费 （特约）美团",
            "199.69"
          ],
          [
            "03-01 美团订单-2603011120070000130…",
            "178.10"
          ],
          [
            "03-18 美团订单-2603181120070000130…",
            "108.40"
          ],
          [
            "03-16 小吊梨汤北京菜烤鸭（望京凯德Mall店）-扫码付…",
            "54.00"
          ],
          [
            "03-29 消费：曾三仙No.0717|中粮祥云小镇南区店",
            "37.00"
          ],
          [
            "03-07 KFC_PREAF100126054246793…",
            "34.40"
          ],
          [
            "03-08 北京鑫利丰源商贸有限公司",
            "25.90"
          ],
          [
            "03-28 北京鑫利丰源商贸有限公司",
            "21.90"
          ]
        ]
      },
      {
        "name": "会员订阅",
        "meta": "全部 19 笔 · 826.19 元",
        "rows": [
          [
            "03-24 年度会员",
            "343.00"
          ],
          [
            "03-07 STRIPE",
            "139.12"
          ],
          [
            "03-11 iCloud；03.11购买",
            "68.00"
          ],
          [
            "03-23 App Store & Apple Music；…",
            "58.00"
          ],
          [
            "03-28 App Store & Apple Music；…",
            "40.00"
          ],
          [
            "03-13 App Store & Apple Music；…",
            "30.00"
          ],
          [
            "03-24 App Store & Apple Music；…",
            "27.00"
          ],
          [
            "03-17 百度网盘超级会员(1个月-自动续费)",
            "25.00"
          ],
          [
            "03-16 连续包月(网盘SVIP会员)",
            "20.00"
          ],
          [
            "03-01 购买大会员连续包月",
            "15.00"
          ],
          [
            "03-07 App Store & Apple Music；…",
            "15.00"
          ],
          [
            "03-17 网易云音乐-会员自动续费",
            "11.00"
          ],
          [
            "03-18 高档充电连续包月八",
            "10.00"
          ],
          [
            "03-06 App Store & Apple Music；…",
            "8.00"
          ],
          [
            "03-09 iCloud；03.09购买",
            "6.00"
          ],
          [
            "03-28 小绿人预付卡",
            "5.00"
          ],
          [
            "03-29 免押租借充电宝",
            "3.30"
          ],
          [
            "03-27 免押租借充电宝",
            "1.85"
          ],
          [
            "03-20 两轮车先充后付",
            "0.92"
          ]
        ]
      },
      {
        "name": "生活缴费",
        "meta": "全部 2 笔 · 150.00 元",
        "rows": [
          [
            "03-20 电费自动缴费-根据每期出账后自动缴费",
            "100.00"
          ],
          [
            "03-11 水费-*建梅",
            "50.00"
          ]
        ]
      },
      {
        "name": "医疗健康",
        "meta": "全部 2 笔 · 290.80 元",
        "rows": [
          [
            "03-28 百万补贴邀1人拼团享86折鱼油95高纯度IFOS…",
            "236.00"
          ],
          [
            "03-06 网上快捷支付",
            "54.80"
          ]
        ]
      },
      {
        "name": "教育学习",
        "meta": "全部 2 笔 · 5,030.00 元",
        "rows": [
          [
            "03-23 AI大模型应用开发实战训练营-第22期",
            "4,980.00"
          ],
          [
            "03-31 火山引擎订单",
            "50.00"
          ]
        ]
      },
      {
        "name": "其他",
        "meta": "全部 10 笔 · 321.37 元",
        "rows": [
          [
            "03-18 网上快捷支付",
            "78.97"
          ],
          [
            "03-30 家庭保洁服务，2小时搞定",
            "56.88"
          ],
          [
            "03-18 无卡支付",
            "50.05"
          ],
          [
            "03-28 收款方备注:二维码收款",
            "39.90"
          ],
          [
            "03-21 立码富-西岚兰州牛肉面-43519",
            "28.00"
          ],
          [
            "03-01 网上快捷支付",
            "19.18"
          ],
          [
            "03-18 值守订单",
            "13.00"
          ],
          [
            "03-07 体验包",
            "12.90"
          ],
          [
            "03-15 北京高济百康大药房有限公司安宁街分店缴费",
            "12.19"
          ],
          [
            "03-20 北京日月七天东济康药品销售中心（个人独资）缴费",
            "10.30"
          ]
        ]
      }
    ]
  },
  {
    "key": "2026-04",
    "title": "2026 年 4 月 纯花销占比",
    "subtitle": "已剔除转账/房租/取现/理财等 4 笔，共 19,423.50 元",
    "txnCount": 87,
    "total": 13046.94,
    "dailyAvg": 434.9,
    "maxTxn": 3160.0,
    "top2Pct": 83.6,
    "peakNote": "04-17 8,549.04 · 04-29 616.27 · 04-27 507.27",
    "dateRange": "2026-04-01 ~ 2026-04-30",
    "categories": [
      {
        "name": "游戏动漫",
        "amount": 823.13,
        "pct": 6.3,
        "count": 9
      },
      {
        "name": "交通出行",
        "amount": 10091.26,
        "pct": 77.3,
        "count": 19
      },
      {
        "name": "购物消费",
        "amount": 567.64,
        "pct": 4.4,
        "count": 6
      },
      {
        "name": "餐饮食品",
        "amount": 658.19,
        "pct": 5.0,
        "count": 20
      },
      {
        "name": "会员订阅",
        "amount": 496.57,
        "pct": 3.8,
        "count": 16
      },
      {
        "name": "生活缴费",
        "amount": 100.0,
        "pct": 0.8,
        "count": 1
      },
      {
        "name": "教育学习",
        "amount": 25.0,
        "pct": 0.2,
        "count": 2
      },
      {
        "name": "其他",
        "amount": 285.15,
        "pct": 2.2,
        "count": 14
      }
    ],
    "daily": [
      64.03,
      0.0,
      37.56,
      196.81,
      111.12,
      65.54,
      153.57,
      220.28,
      41.62,
      66.88,
      87.0,
      138.42,
      39.09,
      6.63,
      31.56,
      0.0,
      8549.04,
      190.7,
      75.67,
      126.46,
      17.8,
      19.68,
      89.24,
      102.0,
      298.5,
      367.8,
      507.27,
      440.0,
      616.27,
      386.4
    ],
    "amountBuckets": [
      {
        "label": "0–30",
        "count": 47,
        "amount": 564.42
      },
      {
        "label": "30–50",
        "count": 14,
        "amount": 511.48
      },
      {
        "label": "50–100",
        "count": 8,
        "amount": 594.78
      },
      {
        "label": "100–200",
        "count": 9,
        "amount": 1212.84
      },
      {
        "label": "200–300",
        "count": 1,
        "amount": 250.75
      },
      {
        "label": "300–500",
        "count": 4,
        "amount": 1445.0
      },
      {
        "label": "500–800",
        "count": 0,
        "amount": 0.0
      },
      {
        "label": "800–1000",
        "count": 0,
        "amount": 0.0
      },
      {
        "label": "1000+",
        "count": 4,
        "amount": 8467.67
      }
    ],
    "amountBucketsMerged": [
      {
        "label": "0–50",
        "count": 61,
        "amount": 1075.9
      },
      {
        "label": "50–200",
        "count": 17,
        "amount": 1807.62
      },
      {
        "label": "200–500",
        "count": 5,
        "amount": 1695.75
      },
      {
        "label": "500+",
        "count": 4,
        "amount": 8467.67
      }
    ],
    "details": [
      {
        "name": "游戏动漫",
        "meta": "Top 9 / 共 9 笔 · 823.13 元",
        "rows": [
          [
            "04-29 X-PLUS NIKKE：胜利女神 爱丽丝 拼装…",
            "250.75"
          ],
          [
            "04-28 任天堂Switch游戏卡带NS 马里奥网球 AC…",
            "155.00"
          ],
          [
            "04-08 Steam Purchase",
            "138.27"
          ],
          [
            "04-20 基础包",
            "99.90"
          ],
          [
            "04-08 Steam Purchase",
            "52.01"
          ],
          [
            "04-19 大漫匠AniMester 「泳池开放日！更衣准备…",
            "37.20"
          ],
          [
            "04-08 空月祝福",
            "30.00"
          ],
          [
            "04-18 列车补给凭证",
            "30.00"
          ],
          [
            "04-18 绳网会员",
            "30.00"
          ]
        ]
      },
      {
        "name": "交通出行",
        "meta": "Top 10 / 共 19 笔 · 10,091.26 元",
        "rows": [
          [
            "04-17 1132545340780458",
            "3,160.00"
          ],
          [
            "04-17 商旅协议酒店订单",
            "2,164.84"
          ],
          [
            "04-17 商旅协议酒店订单",
            "1,898.49"
          ],
          [
            "04-17 商旅协议酒店订单",
            "1,244.34"
          ],
          [
            "04-27 黔南云码通数字产业运营有限公司",
            "390.00"
          ],
          [
            "04-29 【大学生-优惠票】黄果树（免门票+观光车+双程扶…",
            "360.00"
          ],
          [
            "04-30 【大学生-优惠票】黄果树（免门票+观光车+双程扶…",
            "360.00"
          ],
          [
            "04-28 12306消费",
            "150.00"
          ],
          [
            "04-28 12306消费",
            "135.00"
          ],
          [
            "04-27 12306消费",
            "96.00"
          ]
        ]
      },
      {
        "name": "购物消费",
        "meta": "Top 6 / 共 6 笔 · 567.64 元",
        "rows": [
          [
            "04-26 网上快捷支付",
            "335.00"
          ],
          [
            "04-05 扫码支付",
            "92.12"
          ],
          [
            "04-01 京东-订单编号3455249007567125",
            "41.55"
          ],
          [
            "04-19 麦当劳&麦咖啡(北京裕民大街店)外卖订单",
            "38.47"
          ],
          [
            "04-26 网上快捷支付",
            "32.80"
          ],
          [
            "04-10 网上快捷支付",
            "27.70"
          ]
        ]
      },
      {
        "name": "餐饮食品",
        "meta": "Top 10 / 共 20 笔 · 658.19 元",
        "rows": [
          [
            "04-25 美团/大众点评点餐订单-042550260533…",
            "156.00"
          ],
          [
            "04-04 美团收银909700211093614992",
            "138.00"
          ],
          [
            "04-24 美团订单-2604241120070000130…",
            "102.00"
          ],
          [
            "04-25 屈臣氏(顺义中粮祥云小镇店）-美团App-260…",
            "70.50"
          ],
          [
            "04-18 顺佳超市（马头庄店）付款58.25元",
            "58.25"
          ],
          [
            "04-12 肯德基宅急送(后沙峪店)外卖订单",
            "23.42"
          ],
          [
            "04-12 北京鑫利丰源商贸有限公司",
            "15.00"
          ],
          [
            "04-03 先购后付",
            "11.56"
          ],
          [
            "04-15 先购后付",
            "11.56"
          ],
          [
            "04-20 先购后付",
            "11.56"
          ]
        ]
      },
      {
        "name": "会员订阅",
        "meta": "全部 16 笔 · 496.57 元",
        "rows": [
          [
            "04-07 STRIPE",
            "138.57"
          ],
          [
            "04-11 iCloud；04.11购买",
            "68.00"
          ],
          [
            "04-23 App Store & Apple Music；…",
            "58.00"
          ],
          [
            "04-10 高级会员连续包月",
            "30.00"
          ],
          [
            "04-13 App Store & Apple Music；…",
            "30.00"
          ],
          [
            "04-09 无卡支付",
            "26.70"
          ],
          [
            "04-30 无卡支付",
            "26.40"
          ],
          [
            "04-17 百度网盘超级会员(1个月-自动续费)",
            "25.00"
          ],
          [
            "04-15 连续包月(网盘SVIP会员)",
            "20.00"
          ],
          [
            "04-01 购买大会员连续包月",
            "15.00"
          ],
          [
            "04-07 App Store & Apple Music；…",
            "15.00"
          ],
          [
            "04-17 网易云音乐-会员自动续费",
            "11.00"
          ],
          [
            "04-18 高档充电连续包月八",
            "10.00"
          ],
          [
            "04-18 App Store & Apple Music；…",
            "8.90"
          ],
          [
            "04-06 App Store & Apple Music；…",
            "8.00"
          ],
          [
            "04-09 iCloud；04.09购买",
            "6.00"
          ]
        ]
      },
      {
        "name": "生活缴费",
        "meta": "全部 1 笔 · 100.00 元",
        "rows": [
          [
            "04-12 电费自动缴费-根据每期出账后自动缴费",
            "100.00"
          ]
        ]
      },
      {
        "name": "教育学习",
        "meta": "全部 2 笔 · 25.00 元",
        "rows": [
          [
            "04-20 火山引擎2121757035余额充值",
            "15.00"
          ],
          [
            "04-17 火山引擎2121757035余额充值",
            "10.00"
          ]
        ]
      },
      {
        "name": "其他",
        "meta": "全部 14 笔 · 285.15 元",
        "rows": [
          [
            "04-18 无卡支付",
            "49.55"
          ],
          [
            "04-25 收款方备注:二维码收款",
            "47.00"
          ],
          [
            "04-17 无卡支付",
            "35.37"
          ],
          [
            "04-04 颐和园门票 202604041442338438…",
            "30.00"
          ],
          [
            "04-27 无卡支付",
            "21.27"
          ],
          [
            "04-23 无卡支付",
            "15.80"
          ],
          [
            "04-05 收款方备注:二维码收款",
            "15.00"
          ],
          [
            "04-22 无卡支付",
            "14.16"
          ],
          [
            "04-03 1002-2026040308040972676…",
            "13.00"
          ],
          [
            "04-03 92d4aa29ed51109154542db3…",
            "13.00"
          ],
          [
            "04-11 f5e3b11cc77ee1fc946ed974…",
            "13.00"
          ],
          [
            "04-25 /",
            "10.00"
          ],
          [
            "04-06 奥林匹克中心区服务中心景观大道店",
            "5.00"
          ],
          [
            "04-06 收款方备注:二维码收款",
            "3.00"
          ]
        ]
      }
    ]
  },
  {
    "key": "2026-05",
    "title": "2026 年 5 月 纯花销占比",
    "subtitle": "已剔除转账/房租/取现/理财等 7 笔，共 8,200.00 元",
    "txnCount": 108,
    "total": 7289.01,
    "dailyAvg": 235.13,
    "maxTxn": 1323.0,
    "top2Pct": 14.1,
    "peakNote": "05-27 1,589.81 · 05-18 1,317.78 · 05-15 380.53",
    "dateRange": "2026-05-01 ~ 2026-05-31",
    "categories": [
      {
        "name": "游戏动漫",
        "amount": 527.6,
        "pct": 7.2,
        "count": 6
      },
      {
        "name": "交通出行",
        "amount": 502.71,
        "pct": 6.9,
        "count": 15
      },
      {
        "name": "购物消费",
        "amount": 2331.05,
        "pct": 32.0,
        "count": 15
      },
      {
        "name": "餐饮食品",
        "amount": 1054.8,
        "pct": 14.5,
        "count": 22
      },
      {
        "name": "会员订阅",
        "amount": 668.18,
        "pct": 9.2,
        "count": 17
      },
      {
        "name": "通讯话费",
        "amount": 130.64,
        "pct": 1.8,
        "count": 2
      },
      {
        "name": "生活缴费",
        "amount": 200.0,
        "pct": 2.7,
        "count": 2
      },
      {
        "name": "医疗健康",
        "amount": 1440.0,
        "pct": 19.8,
        "count": 2
      },
      {
        "name": "教育学习",
        "amount": 1.04,
        "pct": 0.0,
        "count": 1
      },
      {
        "name": "其他",
        "amount": 432.99,
        "pct": 5.9,
        "count": 26
      }
    ],
    "daily": [
      344.93,
      140.24,
      338.5,
      268.69,
      302.18,
      160.79,
      250.86,
      184.25,
      133.9,
      104.26,
      167.9,
      0.0,
      0.0,
      6.71,
      380.53,
      119.8,
      25.0,
      1317.78,
      25.1,
      5.78,
      168.38,
      229.15,
      238.84,
      99.9,
      0.0,
      0.0,
      1589.81,
      278.9,
      177.94,
      108.69,
      120.2
    ],
    "amountBuckets": [
      {
        "label": "0–30",
        "count": 59,
        "amount": 734.75
      },
      {
        "label": "30–50",
        "count": 17,
        "amount": 627.95
      },
      {
        "label": "50–100",
        "count": 16,
        "amount": 1201.17
      },
      {
        "label": "100–200",
        "count": 12,
        "amount": 1543.49
      },
      {
        "label": "200–300",
        "count": 1,
        "amount": 223.0
      },
      {
        "label": "300–500",
        "count": 1,
        "amount": 334.65
      },
      {
        "label": "500–800",
        "count": 0,
        "amount": 0.0
      },
      {
        "label": "800–1000",
        "count": 0,
        "amount": 0.0
      },
      {
        "label": "1000+",
        "count": 2,
        "amount": 2624.0
      }
    ],
    "amountBucketsMerged": [
      {
        "label": "0–50",
        "count": 76,
        "amount": 1362.7
      },
      {
        "label": "50–200",
        "count": 28,
        "amount": 2744.66
      },
      {
        "label": "200–500",
        "count": 2,
        "amount": 557.65
      },
      {
        "label": "500+",
        "count": 2,
        "amount": 2624.0
      }
    ],
    "details": [
      {
        "name": "游戏动漫",
        "meta": "Top 6 / 共 6 笔 · 527.60 元",
        "rows": [
          [
            "05-11 基础包",
            "99.90"
          ],
          [
            "05-16 基础包",
            "99.90"
          ],
          [
            "05-24 基础包",
            "99.90"
          ],
          [
            "05-28 基础包",
            "99.90"
          ],
          [
            "05-06 菲林底片×980",
            "98.00"
          ],
          [
            "05-07 空月祝福",
            "30.00"
          ]
        ]
      },
      {
        "name": "交通出行",
        "meta": "Top 10 / 共 15 笔 · 502.71 元",
        "rows": [
          [
            "05-03 荔波县金鑫旅游服务有限公司",
            "150.00"
          ],
          [
            "05-01 1957|兰熊+老张牛肉面+有璟阁",
            "48.00"
          ],
          [
            "05-03 荔波县金鑫旅游服务有限公司",
            "40.00"
          ],
          [
            "05-01 高德打车订单",
            "31.76"
          ],
          [
            "05-06 高德打车订单",
            "29.49"
          ],
          [
            "05-27 高德打车订单",
            "27.16"
          ],
          [
            "05-27 高德打车订单",
            "25.48"
          ],
          [
            "05-06 高德打车订单",
            "25.30"
          ],
          [
            "05-02 高德打车订单",
            "22.42"
          ],
          [
            "05-30 高德打车订单",
            "22.00"
          ]
        ]
      },
      {
        "name": "购物消费",
        "meta": "Top 10 / 共 15 笔 · 2,331.05 元",
        "rows": [
          [
            "05-18 中国黄金足金999四叶草黄金项链女款纯金吊坠52…",
            "1,301.00"
          ],
          [
            "05-28 京东-订单编号3512249006917025",
            "169.00"
          ],
          [
            "05-08 爱小提Garnet MK.II小提琴弦尼龙弦ea…",
            "168.00"
          ],
          [
            "05-23 扫码支付",
            "162.84"
          ],
          [
            "05-21 恩米小黑盒直液式丙烯马克笔软头笔芯彩色小学生美术…",
            "103.80"
          ],
          [
            "05-27 散单运费-顺丰速运",
            "64.37"
          ],
          [
            "05-10 订单：994266046329",
            "61.26"
          ],
          [
            "05-29 小红书订单：P79561126631739842…",
            "54.00"
          ],
          [
            "05-31 京东-订单编号3515249007978463",
            "44.90"
          ],
          [
            "05-29 京东-订单编号3513449007251387",
            "43.50"
          ]
        ]
      },
      {
        "name": "餐饮食品",
        "meta": "Top 10 / 共 22 笔 · 1,054.80 元",
        "rows": [
          [
            "05-15 银联无卡自助消费 （特约）美团",
            "334.65"
          ],
          [
            "05-22 /",
            "223.00"
          ],
          [
            "05-04 陈氏人家豆米火锅-大众点评微信小程序-26050…",
            "108.00"
          ],
          [
            "05-05 贵阳万象城店_咖啡馆",
            "78.00"
          ],
          [
            "05-31 美团订单-2605311120070000130…",
            "75.30"
          ],
          [
            "05-03 团购-美团微信小程序-2605031120070…",
            "63.00"
          ],
          [
            "05-21 移动支付",
            "41.00"
          ],
          [
            "05-02 盒马烘焙 超级奥利奥千层蛋糕 400g",
            "30.82"
          ],
          [
            "05-23 北京鑫利丰源商贸有限公司",
            "18.00"
          ],
          [
            "05-10 北京鑫利丰源商贸有限公司",
            "13.00"
          ]
        ]
      },
      {
        "name": "会员订阅",
        "meta": "全部 17 笔 · 668.18 元",
        "rows": [
          [
            "05-07 STRIPE",
            "136.85"
          ],
          [
            "05-01 App Store & Apple Music；…",
            "128.00"
          ],
          [
            "05-05 App Store & Apple Music；…",
            "100.00"
          ],
          [
            "05-11 iCloud；05.11购买",
            "68.00"
          ],
          [
            "05-23 App Store & Apple Music；…",
            "58.00"
          ],
          [
            "05-10 高级会员连续包月",
            "30.00"
          ],
          [
            "05-30 无卡支付",
            "26.18"
          ],
          [
            "05-17 百度网盘超级会员(1个月-自动续费)",
            "25.00"
          ],
          [
            "05-15 连续包月(网盘SVIP会员)",
            "20.00"
          ],
          [
            "05-02 购买大会员连续包月",
            "15.00"
          ],
          [
            "05-07 App Store & Apple Music；…",
            "15.00"
          ],
          [
            "05-18 网易云音乐-会员自动续费",
            "11.00"
          ],
          [
            "05-19 高档充电连续包月八",
            "10.00"
          ],
          [
            "05-06 App Store & Apple Music；…",
            "8.00"
          ],
          [
            "05-22 免押租借充电宝",
            "6.15"
          ],
          [
            "05-09 iCloud；05.09购买",
            "6.00"
          ],
          [
            "05-15 小绿人预付卡",
            "5.00"
          ]
        ]
      },
      {
        "name": "通讯话费",
        "meta": "全部 2 笔 · 130.64 元",
        "rows": [
          [
            "05-29 为186****3776交费69.56元",
            "69.56"
          ],
          [
            "05-01 为157****8065话费充值",
            "61.08"
          ]
        ]
      },
      {
        "name": "生活缴费",
        "meta": "全部 2 笔 · 200.00 元",
        "rows": [
          [
            "05-04 电费自动缴费-根据每期出账后自动缴费",
            "100.00"
          ],
          [
            "05-27 电费自动缴费-根据每期出账后自动缴费",
            "100.00"
          ]
        ]
      },
      {
        "name": "医疗健康",
        "meta": "全部 2 笔 · 1,440.00 元",
        "rows": [
          [
            "05-27 移动支付",
            "1,323.00"
          ],
          [
            "05-09 2026年北京握奇-男员工-体检套餐",
            "117.00"
          ]
        ]
      },
      {
        "name": "教育学习",
        "meta": "全部 1 笔 · 1.04 元",
        "rows": [
          [
            "05-09 火山引擎2121757035余额充值",
            "1.04"
          ]
        ]
      },
      {
        "name": "其他",
        "meta": "全部 26 笔 · 432.99 元",
        "rows": [
          [
            "05-07 a09c58123bfc89fd5ce87c21…",
            "51.00"
          ],
          [
            "05-02 收款方备注:二维码收款",
            "40.00"
          ],
          [
            "05-01 无卡支付",
            "35.49"
          ],
          [
            "05-05 收银台支付",
            "34.00"
          ],
          [
            "05-03 收款方备注:二维码收款",
            "30.00"
          ],
          [
            "05-05 玲琅斋（蔡家街11号）【买单】消费25.00元",
            "25.00"
          ],
          [
            "05-04 收款方备注:二维码收款",
            "22.00"
          ],
          [
            "05-04 收款方备注:二维码收款",
            "20.00"
          ],
          [
            "05-03 收款方备注:二维码收款",
            "19.00"
          ],
          [
            "05-03 美宜佳贵00716店",
            "16.00"
          ],
          [
            "05-07 【低价出】【活绑700抽+9限定角色】尘白禁区初…",
            "13.00"
          ],
          [
            "05-03 11166文明路店",
            "12.80"
          ],
          [
            "05-05 郑姨妈土豆片",
            "12.00"
          ],
          [
            "05-05 收款方备注:二维码收款",
            "12.00"
          ],
          [
            "05-02 收款方备注:二维码收款",
            "10.00"
          ],
          [
            "05-02 收款方备注:二维码收款",
            "10.00"
          ],
          [
            "05-02 充值",
            "10.00"
          ],
          [
            "05-15 DeepSeekAPI服务(186******7…",
            "10.00"
          ],
          [
            "05-16 充值:阿里云服务购买，业务交易号:CFP2026…",
            "10.00"
          ],
          [
            "05-19 充值:阿里云服务购买，业务交易号:CFP2026…",
            "10.00"
          ],
          [
            "05-28 充值:阿里云服务购买，业务交易号:CFP2026…",
            "10.00"
          ],
          [
            "05-05 贵阳市南明区东涵便利店-消费",
            "9.00"
          ],
          [
            "05-03 11166文明路店",
            "5.80"
          ],
          [
            "05-02 产品：华夏游境内旅行保险,被保险人：李星泽",
            "2.00"
          ],
          [
            "05-05 公交6路",
            "2.00"
          ],
          [
            "05-03 11166文明路店",
            "1.90"
          ]
        ]
      }
    ]
  },
  {
    "key": "2026-06",
    "title": "2026 年 6 月 纯花销占比",
    "subtitle": "已剔除转账/房租/取现/理财等 9 笔，共 30,146.00 元",
    "txnCount": 111,
    "total": 13729.1,
    "dailyAvg": 457.64,
    "maxTxn": 5575.0,
    "top2Pct": 9.0,
    "peakNote": "06-29 5,582.74 · 06-15 1,006.01 · 06-19 925.08",
    "dateRange": "2026-06-01 ~ 2026-06-30",
    "categories": [
      {
        "name": "游戏动漫",
        "amount": 584.69,
        "pct": 4.3,
        "count": 11
      },
      {
        "name": "交通出行",
        "amount": 639.65,
        "pct": 4.7,
        "count": 13
      },
      {
        "name": "购物消费",
        "amount": 2794.92,
        "pct": 20.4,
        "count": 12
      },
      {
        "name": "餐饮食品",
        "amount": 2554.07,
        "pct": 18.6,
        "count": 35
      },
      {
        "name": "会员订阅",
        "amount": 512.84,
        "pct": 3.7,
        "count": 17
      },
      {
        "name": "通讯话费",
        "amount": 396.6,
        "pct": 2.9,
        "count": 2
      },
      {
        "name": "生活缴费",
        "amount": 300.0,
        "pct": 2.2,
        "count": 3
      },
      {
        "name": "教育学习",
        "amount": 5575.0,
        "pct": 40.6,
        "count": 1
      },
      {
        "name": "其他",
        "amount": 371.33,
        "pct": 2.7,
        "count": 17
      }
    ],
    "daily": [
      5.78,
      332.2,
      285.88,
      6.0,
      104.93,
      482.09,
      223.15,
      41.54,
      155.78,
      4.93,
      134.88,
      137.95,
      566.0,
      50.0,
      1006.01,
      63.05,
      293.57,
      850.04,
      925.08,
      506.39,
      121.53,
      111.76,
      138.98,
      474.12,
      179.58,
      0.0,
      798.12,
      145.9,
      5582.74,
      1.12
    ],
    "amountBuckets": [
      {
        "label": "0–30",
        "count": 60,
        "amount": 749.41
      },
      {
        "label": "30–50",
        "count": 17,
        "amount": 610.76
      },
      {
        "label": "50–100",
        "count": 11,
        "amount": 815.72
      },
      {
        "label": "100–200",
        "count": 9,
        "amount": 1087.9
      },
      {
        "label": "200–300",
        "count": 7,
        "amount": 1844.43
      },
      {
        "label": "300–500",
        "count": 4,
        "amount": 1635.03
      },
      {
        "label": "500–800",
        "count": 2,
        "amount": 1410.85
      },
      {
        "label": "800–1000",
        "count": 0,
        "amount": 0.0
      },
      {
        "label": "1000+",
        "count": 1,
        "amount": 5575.0
      }
    ],
    "amountBucketsMerged": [
      {
        "label": "0–50",
        "count": 77,
        "amount": 1360.17
      },
      {
        "label": "50–200",
        "count": 20,
        "amount": 1903.62
      },
      {
        "label": "200–500",
        "count": 11,
        "amount": 3479.46
      },
      {
        "label": "500+",
        "count": 3,
        "amount": 6985.85
      }
    ],
    "details": [
      {
        "name": "游戏动漫",
        "meta": "Top 10 / 共 11 笔 · 584.69 元",
        "rows": [
          [
            "06-02 基础包",
            "99.90"
          ],
          [
            "06-17 菲林底片×980",
            "98.00"
          ],
          [
            "06-22 Steam Purchase",
            "73.94"
          ],
          [
            "06-17 Myethos Gift+系列 崩坏：星穹铁道 …",
            "50.00"
          ],
          [
            "06-23 Myethos Gift+系列 原神 丝柯克·嘉…",
            "50.00"
          ],
          [
            "06-09 【绝区零官方】丽都时装系列第二弹 亚克力立牌 仪…",
            "48.00"
          ],
          [
            "06-09 Hobby·sakura NIKKE：胜利女神 …",
            "44.85"
          ],
          [
            "06-14 空月祝福",
            "30.00"
          ],
          [
            "06-17 列车补给凭证",
            "30.00"
          ],
          [
            "06-17 绳网会员",
            "30.00"
          ]
        ]
      },
      {
        "name": "交通出行",
        "meta": "Top 10 / 共 13 笔 · 639.65 元",
        "rows": [
          [
            "06-13 北京景台山客运索道有限公司",
            "240.00"
          ],
          [
            "06-13 北京京东大峡谷旅游服务有限公司",
            "200.00"
          ],
          [
            "06-20 高德打车订单",
            "35.59"
          ],
          [
            "06-16 高德打车订单",
            "32.84"
          ],
          [
            "06-15 高德打车订单",
            "27.60"
          ],
          [
            "06-22 高德打车订单",
            "22.60"
          ],
          [
            "06-15 1829|T2-麦当劳咖啡甜品店",
            "20.00"
          ],
          [
            "06-20 哈啰单车骑行卡自动续费",
            "17.80"
          ],
          [
            "06-22 高德打车订单",
            "15.22"
          ],
          [
            "06-20 高德打车订单",
            "13.00"
          ]
        ]
      },
      {
        "name": "购物消费",
        "meta": "Top 10 / 共 12 笔 · 2,794.92 元",
        "rows": [
          [
            "06-15 网上快捷支付",
            "673.53"
          ],
          [
            "06-18 北京顺义山姆会员商店",
            "449.04"
          ],
          [
            "06-06 网上快捷支付",
            "418.99"
          ],
          [
            "06-19 优衣库(北京中粮祥云小镇店)",
            "359.00"
          ],
          [
            "06-03 京东-订单编号3518449019271711",
            "285.88"
          ],
          [
            "06-18 购卡",
            "260.00"
          ],
          [
            "06-12 冈本003白金避孕套超薄裸入001男用官方正品旗…",
            "84.00"
          ],
          [
            "06-21 北京顺义山姆会员商店",
            "69.00"
          ],
          [
            "06-11 北京京东家政2小时日常保洁全国可预约",
            "66.88"
          ],
          [
            "06-19 北京中粮祥云小镇店_书店",
            "49.90"
          ]
        ]
      },
      {
        "name": "餐饮食品",
        "meta": "Top 10 / 共 35 笔 · 2,554.07 元",
        "rows": [
          [
            "06-27 银联无卡自助消费 （特约）美团",
            "737.32"
          ],
          [
            "06-20 美都波韩国烤肉·酱蟹畅吃-大众点评微信小程序-2…",
            "408.00"
          ],
          [
            "06-19 烹然四季椰子鸡火锅-大众点评App-260619…",
            "285.00"
          ],
          [
            "06-15 美团订单-【美团月付】主动还款2026年6月账单",
            "274.95"
          ],
          [
            "06-25 美团收银909700214056942657",
            "172.10"
          ],
          [
            "06-18 榴芒一刻猫山王榴莲冰粽星冰粽冰皮粽子水晶粽高端粽…",
            "130.00"
          ],
          [
            "06-19 布歌东京-北京中粮祥云小镇店",
            "130.00"
          ],
          [
            "06-19 北京烹然四季烹甄餐饮有限公司第一分公司-2026…",
            "35.80"
          ],
          [
            "06-27 网上快捷支付",
            "34.80"
          ],
          [
            "06-12 银联无卡自助消费 （特约）美团",
            "30.55"
          ]
        ]
      },
      {
        "name": "会员订阅",
        "meta": "全部 17 笔 · 512.84 元",
        "rows": [
          [
            "06-07 STRIPE",
            "136.50"
          ],
          [
            "06-05 App Store & Apple Music；…",
            "100.00"
          ],
          [
            "06-11 iCloud；06.11购买",
            "68.00"
          ],
          [
            "06-23 App Store & Apple Music；…",
            "58.00"
          ],
          [
            "06-09 高级会员连续包月",
            "30.00"
          ],
          [
            "06-17 百度网盘超级会员(1个月-自动续费)",
            "25.00"
          ],
          [
            "06-14 连续包月(网盘SVIP会员)",
            "20.00"
          ],
          [
            "06-02 购买大会员连续包月",
            "15.00"
          ],
          [
            "06-07 App Store & Apple Music；…",
            "15.00"
          ],
          [
            "06-18 网易云音乐-会员自动续费",
            "11.00"
          ],
          [
            "06-19 高档充电连续包月八",
            "10.00"
          ],
          [
            "06-06 App Store & Apple Music；…",
            "8.00"
          ],
          [
            "06-09 iCloud；06.09购买",
            "6.00"
          ],
          [
            "06-15 免押租借充电宝",
            "5.00"
          ],
          [
            "06-19 免押租借充电宝",
            "3.00"
          ],
          [
            "06-23 两轮车先充后付",
            "1.22"
          ],
          [
            "06-30 两轮车先充后付",
            "1.12"
          ]
        ]
      },
      {
        "name": "通讯话费",
        "meta": "全部 2 笔 · 396.60 元",
        "rows": [
          [
            "06-24 100G/月-半年套餐-898606233900…",
            "298.60"
          ],
          [
            "06-02 为157****8065话费充值",
            "98.00"
          ]
        ]
      },
      {
        "name": "生活缴费",
        "meta": "全部 3 笔 · 300.00 元",
        "rows": [
          [
            "06-13 电费自动缴费-根据每期出账后自动缴费",
            "100.00"
          ],
          [
            "06-24 水费-*建梅",
            "100.00"
          ],
          [
            "06-28 电费自动缴费-根据每期出账后自动缴费",
            "100.00"
          ]
        ]
      },
      {
        "name": "教育学习",
        "meta": "全部 1 笔 · 5,575.00 元",
        "rows": [
          [
            "06-29 小沫ROS智能体机器人课程机器人实物",
            "5,575.00"
          ]
        ]
      },
      {
        "name": "其他",
        "meta": "全部 17 笔 · 371.33 元",
        "rows": [
          [
            "06-02 无卡支付",
            "119.30"
          ],
          [
            "06-17 无卡支付",
            "35.05"
          ],
          [
            "06-19 fudi会员祥云店",
            "34.68"
          ],
          [
            "06-08 【派样返券】NARS超方瓶粉底体验装尝鲜盒 享3…",
            "29.90"
          ],
          [
            "06-07 订单支付: 202606072221050008…",
            "27.00"
          ],
          [
            "06-13 北京京味旺餐饮管理有限公司-消费",
            "26.00"
          ],
          [
            "06-17 订单支付: 202606170920260008…",
            "20.00"
          ],
          [
            "06-24 Molamola-抹茶柚子卷生重120g左右",
            "20.00"
          ],
          [
            "06-27 订单支付: 202606271152510002…",
            "20.00"
          ],
          [
            "06-20 北京市市属公园票款 20260620185616…",
            "10.00"
          ],
          [
            "06-04 AUV CLUB-微小店购买",
            "6.00"
          ],
          [
            "06-23 AUV CLUB-微小店购买",
            "6.00"
          ],
          [
            "06-27 AUV CLUB-微小店购买",
            "6.00"
          ],
          [
            "06-20 扫码付款_1号",
            "5.00"
          ],
          [
            "06-19 7-ELEVEn北京顺义祥云小镇店REDEMPT…",
            "3.90"
          ],
          [
            "06-20 收款方备注:二维码收款",
            "2.00"
          ],
          [
            "06-12 其他",
            "0.50"
          ]
        ]
      }
    ]
  },
  {
    "key": "2026-07",
    "title": "2026 年 7 月 纯花销占比",
    "subtitle": "已剔除转账/房租/取现/理财等 8 笔，共 37,812.50 元",
    "txnCount": 111,
    "total": 8635.89,
    "dailyAvg": 278.58,
    "maxTxn": 1709.0,
    "top2Pct": 51.9,
    "peakNote": "07-10 2,187.75 · 07-27 1,043.12 · 07-04 845.59",
    "dateRange": "2026-07-01 ~ 2026-07-31",
    "categories": [
      {
        "name": "游戏动漫",
        "amount": 2099.67,
        "pct": 24.3,
        "count": 20
      },
      {
        "name": "交通出行",
        "amount": 2382.17,
        "pct": 27.6,
        "count": 7
      },
      {
        "name": "购物消费",
        "amount": 1947.93,
        "pct": 22.6,
        "count": 21
      },
      {
        "name": "餐饮食品",
        "amount": 956.36,
        "pct": 11.1,
        "count": 35
      },
      {
        "name": "会员订阅",
        "amount": 459.16,
        "pct": 5.3,
        "count": 17
      },
      {
        "name": "通讯话费",
        "amount": 472.1,
        "pct": 5.5,
        "count": 3
      },
      {
        "name": "生活缴费",
        "amount": 200.0,
        "pct": 2.3,
        "count": 2
      },
      {
        "name": "医疗健康",
        "amount": 20.0,
        "pct": 0.2,
        "count": 1
      },
      {
        "name": "教育学习",
        "amount": 5.99,
        "pct": 0.1,
        "count": 1
      },
      {
        "name": "其他",
        "amount": 92.51,
        "pct": 1.1,
        "count": 4
      }
    ],
    "daily": [
      281.87,
      103.52,
      194.4,
      845.59,
      322.0,
      18.52,
      177.73,
      4.93,
      36.0,
      2187.75,
      261.35,
      359.05,
      126.63,
      405.9,
      90.0,
      33.93,
      423.13,
      0.76,
      229.3,
      27.47,
      20.04,
      29.0,
      358.0,
      10.0,
      293.77,
      334.44,
      1043.12,
      40.34,
      258.0,
      79.37,
      39.98
    ],
    "amountBuckets": [
      {
        "label": "0–30",
        "count": 60,
        "amount": 667.0
      },
      {
        "label": "30–50",
        "count": 20,
        "amount": 679.04
      },
      {
        "label": "50–100",
        "count": 9,
        "amount": 706.89
      },
      {
        "label": "100–200",
        "count": 11,
        "amount": 1614.82
      },
      {
        "label": "200–300",
        "count": 4,
        "amount": 1053.9
      },
      {
        "label": "300–500",
        "count": 5,
        "amount": 1609.24
      },
      {
        "label": "500–800",
        "count": 1,
        "amount": 596.0
      },
      {
        "label": "800–1000",
        "count": 0,
        "amount": 0.0
      },
      {
        "label": "1000+",
        "count": 1,
        "amount": 1709.0
      }
    ],
    "amountBucketsMerged": [
      {
        "label": "0–50",
        "count": 80,
        "amount": 1346.04
      },
      {
        "label": "50–200",
        "count": 20,
        "amount": 2321.71
      },
      {
        "label": "200–500",
        "count": 9,
        "amount": 2663.14
      },
      {
        "label": "500+",
        "count": 2,
        "amount": 2305.0
      }
    ],
    "details": [
      {
        "name": "游戏动漫",
        "meta": "Top 10 / 共 20 笔 · 2,099.67 元",
        "rows": [
          [
            "07-27 GSC POP UP PARADE BEACH …",
            "330.65"
          ],
          [
            "07-17 Fingle Toy rurudo原画 原创 拉…",
            "321.92"
          ],
          [
            "07-23 APEX 绝区零 仪玄·独步沧溟 Ver. 1/…",
            "300.00"
          ],
          [
            "07-05 元宝充值",
            "290.00"
          ],
          [
            "07-29 菲林底片×1980",
            "198.00"
          ],
          [
            "07-26 鸣潮代肝代打代练带肝3.5全图探索度任务星声声骸…",
            "135.00"
          ],
          [
            "07-03 基础包",
            "99.90"
          ],
          [
            "07-11 980创世结晶",
            "98.00"
          ],
          [
            "07-01 韩谷散货原神韩国pc房正比立牌 Q立牌 甘雨 胡…",
            "43.90"
          ],
          [
            "07-25 雪女立牌亚克力，动漫周边，包邮发货",
            "35.00"
          ]
        ]
      },
      {
        "name": "交通出行",
        "meta": "Top 7 / 共 7 笔 · 2,382.17 元",
        "rows": [
          [
            "07-10 机票订单",
            "1,709.00"
          ],
          [
            "07-27 如家neo酒店南京新街口汉中路店",
            "596.00"
          ],
          [
            "07-31 高德打车订单",
            "34.20"
          ],
          [
            "07-04 高德打车订单",
            "18.00"
          ],
          [
            "07-20 哈啰单车骑行卡自动续费",
            "17.47"
          ],
          [
            "07-04 地铁_花梨坎_2026-07-04 10:15:…",
            "6.00"
          ],
          [
            "07-17 单车",
            "1.50"
          ]
        ]
      },
      {
        "name": "购物消费",
        "meta": "Top 10 / 共 21 笔 · 1,947.93 元",
        "rows": [
          [
            "07-10 韩国MLB帽子专柜正品NY洋基队四季防晒大透气檐…",
            "355.00"
          ],
          [
            "07-14 400万1080双目相机同帧同步三维重建深度检测…",
            "255.00"
          ],
          [
            "07-01 康夫F9高速电吹风机家用大风力静音速干不伤发负离…",
            "209.90"
          ],
          [
            "07-26 京东-订单编号3571249015740735",
            "199.44"
          ],
          [
            "07-25 商户单号11130600726072561577…",
            "176.10"
          ],
          [
            "07-12 网上快捷支付",
            "171.46"
          ],
          [
            "07-12 网上快捷支付",
            "165.00"
          ],
          [
            "07-19 快捷支付 平台商户",
            "116.30"
          ],
          [
            "07-04 网上快捷支付",
            "79.92"
          ],
          [
            "07-25 银联快捷支付 京东商城业务",
            "44.40"
          ]
        ]
      },
      {
        "name": "餐饮食品",
        "meta": "Top 10 / 共 35 笔 · 956.36 元",
        "rows": [
          [
            "07-04 /",
            "301.67"
          ],
          [
            "07-10 /",
            "116.75"
          ],
          [
            "07-14 美团收银909700214797577206",
            "75.47"
          ],
          [
            "07-03 美团订单-2607031120070000130…",
            "54.50"
          ],
          [
            "07-17 网上快捷支付",
            "39.88"
          ],
          [
            "07-19 收款方备注:二维码收款",
            "37.30"
          ],
          [
            "07-11 美团订单-2607111120070000130…",
            "32.25"
          ],
          [
            "07-19 瑾贝十三天金凤活珠子五香/香辣10-40枚",
            "30.90"
          ],
          [
            "07-01 顺佳超市（马头庄店）付款28.73元",
            "28.07"
          ],
          [
            "07-04 老北京炸酱面（林城）-收款码",
            "25.00"
          ]
        ]
      },
      {
        "name": "会员订阅",
        "meta": "全部 17 笔 · 459.16 元",
        "rows": [
          [
            "07-07 STRIPE",
            "136.77"
          ],
          [
            "07-11 iCloud；07.11购买",
            "68.00"
          ],
          [
            "07-23 App Store & Apple Music；…",
            "58.00"
          ],
          [
            "07-09 高级会员连续包月",
            "30.00"
          ],
          [
            "07-11 App Store & Apple Music；…",
            "27.00"
          ],
          [
            "07-05 无卡支付",
            "26.01"
          ],
          [
            "07-17 百度网盘超级会员(1个月-自动续费)",
            "24.72"
          ],
          [
            "07-14 连续包月(网盘SVIP会员)",
            "20.00"
          ],
          [
            "07-03 购买大会员连续包月",
            "15.00"
          ],
          [
            "07-07 App Store & Apple Music；…",
            "15.00"
          ],
          [
            "07-19 网易云音乐-会员自动续费",
            "11.00"
          ],
          [
            "07-20 高档充电连续包月八",
            "10.00"
          ],
          [
            "07-06 App Store & Apple Music；…",
            "8.00"
          ],
          [
            "07-09 iCloud；07.09购买",
            "6.00"
          ],
          [
            "07-10 两轮车先充后付",
            "1.22"
          ],
          [
            "07-21 两轮车先充后付",
            "1.22"
          ],
          [
            "07-30 两轮车先充后付",
            "1.22"
          ]
        ]
      },
      {
        "name": "通讯话费",
        "meta": "全部 3 笔 · 472.10 元",
        "rows": [
          [
            "07-04 为186****3776交费299.00元",
            "299.00"
          ],
          [
            "07-02 为157****8065话费充值",
            "98.00"
          ],
          [
            "07-04 为186****3776交费75.10元",
            "75.10"
          ]
        ]
      },
      {
        "name": "生活缴费",
        "meta": "全部 2 笔 · 200.00 元",
        "rows": [
          [
            "07-13 电费自动缴费-根据每期出账后自动缴费",
            "100.00"
          ],
          [
            "07-27 电费自动缴费-根据每期出账后自动缴费",
            "100.00"
          ]
        ]
      },
      {
        "name": "医疗健康",
        "meta": "全部 1 笔 · 20.00 元",
        "rows": [
          [
            "07-16 商品:1084-2026071623075425…",
            "20.00"
          ]
        ]
      },
      {
        "name": "教育学习",
        "meta": "全部 1 笔 · 5.99 元",
        "rows": [
          [
            "07-05 深蓝学院全套技术课程合集｜自动驾驶 / ROS …",
            "5.99"
          ]
        ]
      },
      {
        "name": "其他",
        "meta": "全部 4 笔 · 92.51 元",
        "rows": [
          [
            "07-17 无卡支付",
            "35.11"
          ],
          [
            "07-04 中国体育彩票新中关店",
            "30.00"
          ],
          [
            "07-03 成人通票-",
            "25.00"
          ],
          [
            "07-21 打印费用",
            "2.40"
          ]
        ]
      }
    ]
  },
  {
    "key": "2026-08",
    "title": "2026 年 8 月 纯花销占比",
    "subtitle": "已剔除转账/房租/取现/理财等 8 笔，共 1,465.40 元",
    "txnCount": 95,
    "total": 7405.31,
    "dailyAvg": 238.88,
    "maxTxn": 1389.9,
    "top2Pct": 56.7,
    "peakNote": "08-07 1,732.80 · 08-05 1,037.52 · 08-25 678.00",
    "dateRange": "2026-08-01 ~ 2026-08-31",
    "categories": [
      {
        "name": "游戏动漫",
        "amount": 2054.57,
        "pct": 27.7,
        "count": 16
      },
      {
        "name": "交通出行",
        "amount": 2143.9,
        "pct": 29.0,
        "count": 8
      },
      {
        "name": "购物消费",
        "amount": 883.96,
        "pct": 11.9,
        "count": 13
      },
      {
        "name": "餐饮食品",
        "amount": 986.12,
        "pct": 13.3,
        "count": 29
      },
      {
        "name": "会员订阅",
        "amount": 640.19,
        "pct": 8.6,
        "count": 19
      },
      {
        "name": "通讯话费",
        "amount": 196.0,
        "pct": 2.6,
        "count": 2
      },
      {
        "name": "生活缴费",
        "amount": 200.0,
        "pct": 2.7,
        "count": 2
      },
      {
        "name": "医疗健康",
        "amount": 208.69,
        "pct": 2.8,
        "count": 3
      },
      {
        "name": "教育学习",
        "amount": 1.88,
        "pct": 0.0,
        "count": 2
      },
      {
        "name": "其他",
        "amount": 90.0,
        "pct": 1.2,
        "count": 1
      }
    ],
    "daily": [
      576.13,
      492.75,
      260.65,
      159.64,
      1037.52,
      8.0,
      1732.8,
      351.04,
      158.4,
      154.28,
      176.22,
      186.0,
      124.83,
      89.03,
      123.34,
      0.0,
      81.07,
      68.3,
      64.87,
      11.22,
      25.5,
      4.9,
      175.84,
      154.71,
      678.0,
      4.93,
      13.06,
      11.56,
      227.7,
      251.7,
      1.32
    ],
    "amountBuckets": [
      {
        "label": "0–30",
        "count": 49,
        "amount": 444.65
      },
      {
        "label": "30–50",
        "count": 10,
        "amount": 387.93
      },
      {
        "label": "50–100",
        "count": 19,
        "amount": 1449.53
      },
      {
        "label": "100–200",
        "count": 11,
        "amount": 1526.9
      },
      {
        "label": "200–300",
        "count": 3,
        "amount": 809.4
      },
      {
        "label": "300–500",
        "count": 0,
        "amount": 0.0
      },
      {
        "label": "500–800",
        "count": 2,
        "amount": 1397.0
      },
      {
        "label": "800–1000",
        "count": 0,
        "amount": 0.0
      },
      {
        "label": "1000+",
        "count": 1,
        "amount": 1389.9
      }
    ],
    "amountBucketsMerged": [
      {
        "label": "0–50",
        "count": 59,
        "amount": 832.58
      },
      {
        "label": "50–200",
        "count": 30,
        "amount": 2976.43
      },
      {
        "label": "200–500",
        "count": 3,
        "amount": 809.4
      },
      {
        "label": "500+",
        "count": 3,
        "amount": 2786.9
      }
    ],
    "details": [
      {
        "name": "游戏动漫",
        "meta": "Top 10 / 共 16 笔 · 2,054.57 元",
        "rows": [
          [
            "08-05 【绝区零/三Z/尾款】阵营系列 艾莲 1/7手办…",
            "719.00"
          ],
          [
            "08-08 【崩坏：星穹铁道/尾款】流萤1/8手办 春日手信…",
            "229.00"
          ],
          [
            "08-02 【预售】闪魂绝区零收藏卡第二弹-仲夏欢梦游戏周边…",
            "159.47"
          ],
          [
            "08-04 GSAS 蔚蓝档案 莉音 比例手办",
            "127.35"
          ],
          [
            "08-05 胜利女神：新的希望  情人节丝红蜜意系列立牌",
            "121.52"
          ],
          [
            "08-09 鸣潮代肝代打代练带肝3.5全图探索度任务星声声骸…",
            "120.00"
          ],
          [
            "08-03 基础包",
            "99.90"
          ],
          [
            "08-13 基础包",
            "99.90"
          ],
          [
            "08-23 基础包",
            "99.90"
          ],
          [
            "08-12 特惠礼包",
            "68.00"
          ]
        ]
      },
      {
        "name": "交通出行",
        "meta": "Top 8 / 共 8 笔 · 2,143.90 元",
        "rows": [
          [
            "08-07 机票订单",
            "1,389.90"
          ],
          [
            "08-25 商旅会员酒店订单",
            "678.00"
          ],
          [
            "08-03 高德打车订单",
            "43.50"
          ],
          [
            "08-19 高德打车订单",
            "11.00"
          ],
          [
            "08-02 南京地铁(上海路2026-08-02 17:26…",
            "8.00"
          ],
          [
            "08-29 骑行消费_中国美术学院象山校区",
            "6.00"
          ],
          [
            "08-01 支付宝支付南京禄口国际机场T1到达店REDEMP…",
            "5.50"
          ],
          [
            "08-01 南京地铁(新街口2026-08-01 21:21…",
            "2.00"
          ]
        ]
      },
      {
        "name": "购物消费",
        "meta": "Top 10 / 共 13 笔 · 883.96 元",
        "rows": [
          [
            "08-01 快尚时装（广州）有限公司",
            "299.00"
          ],
          [
            "08-29 优衣库(杭州湖滨银泰in77)",
            "199.00"
          ],
          [
            "08-30 京东-订单编号3606449001535956",
            "76.90"
          ],
          [
            "08-01 《蜘蛛侠：崭新之日》电影票代买9.9元起一张",
            "69.34"
          ],
          [
            "08-18 2026新款性感兔女郎cos制服情趣内衣床上大尺…",
            "68.30"
          ],
          [
            "08-30 京东-订单编号3606449001497505",
            "59.80"
          ],
          [
            "08-09 网上快捷支付",
            "32.40"
          ],
          [
            "08-08 美式辣妹运动短裙女夏2026新款黑色半身裙大码胖…",
            "19.95"
          ],
          [
            "08-23 散单运费-顺丰速运",
            "17.94"
          ],
          [
            "08-08 HAVEN：黑色高筒过膝长筒袜马油袜油光亮滑蕾丝…",
            "15.40"
          ]
        ]
      },
      {
        "name": "餐饮食品",
        "meta": "Top 10 / 共 29 笔 · 986.12 元",
        "rows": [
          [
            "08-02 团购-大众点评微信小程序-26080211200…",
            "281.40"
          ],
          [
            "08-07 火炉火自助餐-美团微信小程序-260807112…",
            "158.90"
          ],
          [
            "08-01 KINGLOMO（南京IFCX店）",
            "82.60"
          ],
          [
            "08-30 半下半上cafe 店内购物",
            "64.00"
          ],
          [
            "08-15 /",
            "62.34"
          ],
          [
            "08-30 半下半上cafe 店内购物",
            "51.00"
          ],
          [
            "08-02 美团收银909700215501214422",
            "42.00"
          ],
          [
            "08-08 网上快捷支付",
            "36.39"
          ],
          [
            "08-07 /",
            "33.34"
          ],
          [
            "08-21 北京鑫利丰源商贸有限公司",
            "24.00"
          ]
        ]
      },
      {
        "name": "会员订阅",
        "meta": "全部 19 笔 · 640.19 元",
        "rows": [
          [
            "08-07 STRIPE",
            "135.66"
          ],
          [
            "08-12 App Store & Apple Music；…",
            "108.00"
          ],
          [
            "08-14 App Store & Apple Music；…",
            "70.00"
          ],
          [
            "08-11 iCloud；08.11购买",
            "68.00"
          ],
          [
            "08-23 App Store & Apple Music；…",
            "58.00"
          ],
          [
            "08-15 C盘清理权益包季卡",
            "49.00"
          ],
          [
            "08-08 高级会员连续包月",
            "30.00"
          ],
          [
            "08-04 无卡支付",
            "26.77"
          ],
          [
            "08-13 连续包月(夸克网盘SVIP会员)",
            "20.00"
          ],
          [
            "08-03 购买大会员连续包月",
            "15.00"
          ],
          [
            "08-07 App Store & Apple Music；…",
            "15.00"
          ],
          [
            "08-19 网易云音乐-会员自动续费",
            "11.00"
          ],
          [
            "08-20 高档充电连续包月八",
            "10.00"
          ],
          [
            "08-06 App Store & Apple Music；…",
            "8.00"
          ],
          [
            "08-09 iCloud；08.09购买",
            "6.00"
          ],
          [
            "08-14 App Store & Apple Music；…",
            "6.00"
          ],
          [
            "08-31 两轮车先充后付",
            "1.32"
          ],
          [
            "08-11 两轮车先充后付",
            "1.22"
          ],
          [
            "08-20 两轮车先充后付",
            "1.22"
          ]
        ]
      },
      {
        "name": "通讯话费",
        "meta": "全部 2 笔 · 196.00 元",
        "rows": [
          [
            "08-03 为157****8065话费充值",
            "98.00"
          ],
          [
            "08-11 为157****8065话费充值",
            "98.00"
          ]
        ]
      },
      {
        "name": "生活缴费",
        "meta": "全部 2 笔 · 200.00 元",
        "rows": [
          [
            "08-10 电费自动缴费-根据每期出账后自动缴费",
            "100.00"
          ],
          [
            "08-24 电费自动缴费-根据每期出账后自动缴费",
            "100.00"
          ]
        ]
      },
      {
        "name": "医疗健康",
        "meta": "全部 3 笔 · 208.69 元",
        "rows": [
          [
            "08-05 犀力健身·搏击·综合格斗·泰拳XILI FITN…",
            "197.00"
          ],
          [
            "08-01 乐摩吧缓解疲劳15分钟按摩订单",
            "7.69"
          ],
          [
            "08-14 4818FU_北京犀力健身有限公司",
            "4.00"
          ]
        ]
      },
      {
        "name": "教育学习",
        "meta": "全部 2 笔 · 1.88 元",
        "rows": [
          [
            "08-02 徐静雨8堂表达课，相当炸裂，全是干货",
            "1.00"
          ],
          [
            "08-02 （24h自动秒发货）徐静雨8堂表达课，8堂提升沟…",
            "0.88"
          ]
        ]
      },
      {
        "name": "其他",
        "meta": "全部 1 笔 · 90.00 元",
        "rows": [
          [
            "08-01 收款方备注:二维码收款",
            "90.00"
          ]
        ]
      }
    ]
  }
];
// @generated-data-end

const fmt = (n: number) =>
  n.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

type BucketCategoryBlock = {
  label: string;
  count: number;
  amount: number;
  categories: Category[];
};

function BucketCategoryPies({
  title,
  blocks,
}: {
  title: string;
  blocks: BucketCategoryBlock[];
}) {
  if (blocks.length === 0) return null;
  return (
    <Stack gap={16}>
      <H3>{title}</H3>
      <Text tone="secondary" size="small">
        各金额区间内的类别金额占比（饼图按金额，表含笔数）。
      </Text>
      <Grid columns={2} gap={20} align="start">
        {blocks.map((b) => (
          <Stack key={b.label} gap={10}>
            <Text weight="semibold">
              {b.label} 元 · {b.count} 笔 · {fmt(b.amount)} 元
            </Text>
            <Grid columns="minmax(0, 1fr) minmax(0, 1.2fr)" gap={12} align="start">
              <PieChart
                donut
                size={180}
                data={b.categories.map((c) => ({
                  label: c.name,
                  value: c.amount,
                }))}
              />
              <Table
                headers={["类别", "金额", "占比", "笔数"]}
                columnAlign={["left", "right", "right", "right"]}
                striped
                rows={b.categories.map((c) => [
                  c.name,
                  fmt(c.amount),
                  `${c.pct}%`,
                  String(c.count),
                ])}
              />
            </Grid>
          </Stack>
        ))}
      </Grid>
    </Stack>
  );
}

function MonthSection({ m, defaultOpen }: { m: MonthPayload; defaultOpen: boolean }) {
  const topCats = m.categories
    .slice(0, 2)
    .map((c) => c.name)
    .join("+");

  return (
    <Card collapsible defaultOpen={defaultOpen}>
      <CardHeader
        trailing={
          <Text tone="secondary" size="small">
            ¥{fmt(m.total)} · {m.txnCount} 笔
          </Text>
        }
      >
        {m.title}
      </CardHeader>
      <CardBody>
        <Stack gap={20}>
          <Text tone="secondary" size="small">
            {m.subtitle}
          </Text>

          <Grid columns={4} gap={16}>
            <Stat value={`¥${fmt(m.total)}`} label={`花销总额（${m.txnCount} 笔）`} />
            <Stat value={`¥${fmt(m.dailyAvg)}`} label="日均花销" />
            <Stat value={`¥${fmt(m.maxTxn)}`} label="最大单笔" tone="warning" />
            <Stat
              value={`${m.top2Pct}%`}
              label={`前两类合计占比（${topCats}）`}
              tone="info"
            />
          </Grid>

          <H3>分类占比（金额 元 · 占比 · 笔数）</H3>
          <Grid columns="minmax(0, 2fr) minmax(0, 3fr)" gap={20} align="start">
            <PieChart
              donut
              size={220}
              data={m.categories.map((c) => ({ label: c.name, value: c.amount }))}
            />
            <Table
              headers={["类别", "金额 (元)", "占比", "笔数"]}
              columnAlign={["left", "right", "right", "right"]}
              striped
              rows={m.categories.map((c) => [
                c.name,
                fmt(c.amount),
                `${c.pct}%`,
                String(c.count),
              ])}
            />
          </Grid>
          <Text tone="tertiary" size="small">
            {m.dateRange} · 分类为关键词规则自动归集
          </Text>

          <H3>分类金额对比（元）</H3>
          <BarChart
            horizontal
            height={260}
            categories={m.categories.map((c) => c.name)}
            series={[
              { name: "花销金额 (元)", data: m.categories.map((c) => c.amount) },
            ]}
            valueSuffix=" 元"
          />

          <H3>每日花销趋势（元/日）</H3>
          <BarChart
            height={200}
            categories={m.daily.map((_, i) => `${i + 1}日`)}
            series={[{ name: "每日花销 (元)", data: m.daily }]}
            valueSuffix=" 元"
          />
          <Text tone="tertiary" size="small">
            峰值：{m.peakNote}
          </Text>

          <Divider />

          <H3>单笔金额区间分布（合并前 · 9 档）</H3>
          <Text tone="secondary" size="small">
            区间左闭右开，单位：元。共 {m.txnCount} 笔，合计 {fmt(m.total)} 元。
          </Text>
          <Grid columns={2} gap={20} align="start">
            <Stack gap={8}>
              <Text weight="semibold">笔数（笔）</Text>
              <BarChart
                height={240}
                categories={m.amountBuckets.map((b) => b.label)}
                series={[
                  { name: "笔数", data: m.amountBuckets.map((b) => b.count) },
                ]}
                valueSuffix=" 笔"
              />
            </Stack>
            <Stack gap={8}>
              <Text weight="semibold">金额合计（元）</Text>
              <BarChart
                height={240}
                categories={m.amountBuckets.map((b) => b.label)}
                series={[
                  { name: "金额", data: m.amountBuckets.map((b) => b.amount) },
                ]}
                valueSuffix=" 元"
              />
            </Stack>
          </Grid>
          <Table
            headers={["区间 (元)", "笔数", "金额 (元)", "占总额", "笔数占比"]}
            columnAlign={["left", "right", "right", "right", "right"]}
            striped
            rows={m.amountBuckets.map((b) => [
              b.label,
              String(b.count),
              fmt(b.amount),
              m.total > 0 ? `${((b.amount / m.total) * 100).toFixed(1)}%` : "—",
              m.txnCount > 0
                ? `${((b.count / m.txnCount) * 100).toFixed(1)}%`
                : "—",
            ])}
          />

          <H3>单笔金额区间分布（合并后 · 4 档）</H3>
          <Text tone="secondary" size="small">
            0–50（小额）· 50–200（中小额）· 200–500（中大额）· 500+（大额）
          </Text>
          <Grid columns={2} gap={20} align="start">
            <Stack gap={8}>
              <Text weight="semibold">笔数（笔）</Text>
              <BarChart
                height={200}
                categories={m.amountBucketsMerged.map((b) => b.label)}
                series={[
                  {
                    name: "笔数",
                    data: m.amountBucketsMerged.map((b) => b.count),
                  },
                ]}
                valueSuffix=" 笔"
              />
            </Stack>
            <Stack gap={8}>
              <Text weight="semibold">金额合计（元）</Text>
              <BarChart
                height={200}
                categories={m.amountBucketsMerged.map((b) => b.label)}
                series={[
                  {
                    name: "金额",
                    data: m.amountBucketsMerged.map((b) => b.amount),
                  },
                ]}
                valueSuffix=" 元"
              />
            </Stack>
          </Grid>
          <Table
            headers={["合并区间 (元)", "笔数", "金额 (元)", "占总额", "笔数占比"]}
            columnAlign={["left", "right", "right", "right", "right"]}
            striped
            rows={m.amountBucketsMerged.map((b) => [
              b.label,
              String(b.count),
              fmt(b.amount),
              m.total > 0 ? `${((b.amount / m.total) * 100).toFixed(1)}%` : "—",
              m.txnCount > 0
                ? `${((b.count / m.txnCount) * 100).toFixed(1)}%`
                : "—",
            ])}
          />

          <H3>各类别消费明细</H3>
          <Grid columns={2} gap={16} align="start">
            {m.details.map((cat) => (
              <Card key={`${m.key}-${cat.name}`}>
                <CardHeader
                  trailing={
                    <Text tone="secondary" size="small">
                      {cat.meta}
                    </Text>
                  }
                >
                  {cat.name}
                </CardHeader>
                <CardBody style={{ padding: 0 }}>
                  <Table
                    framed={false}
                    headers={["项目", "金额 (元)"]}
                    columnAlign={["left", "right"]}
                    rows={cat.rows}
                  />
                </CardBody>
              </Card>
            ))}
          </Grid>
        </Stack>
      </CardBody>
    </Card>
  );
}

export default function ExpenseYearBreakdown() {
  const total = YEAR_META.total;
  const txnCount = YEAR_META.txnCount;

  return (
    <Stack gap={24} style={{ padding: 20 }}>
      <Stack gap={4}>
        <H1>{YEAR_META.title}</H1>
        <Text tone="secondary" size="small">
          {YEAR_META.subtitle}
        </Text>
      </Stack>

      <Grid columns={4} gap={16}>
        <Stat
          value={`¥${fmt(total)}`}
          label={`全年花销（${txnCount} 笔 · ${YEAR_META.monthCount} 个月）`}
        />
        <Stat value={`¥${fmt(YEAR_META.monthlyAvg)}`} label="月均花销" />
        <Stat
          value={`¥${fmt(YEAR_META.maxMonthTotal)}`}
          label={`最高月（${YEAR_META.maxMonthLabel}）`}
          tone="warning"
        />
        <Stat
          value={`${YEAR_META.top2Pct}%`}
          label={`前两类合计（${YEAR_META.top2Label}）`}
          tone="info"
        />
      </Grid>

      <Divider />

      <H2>月度花销趋势（元）</H2>
      <BarChart
        height={240}
        categories={MONTHLY_TOTALS.map((m) => m.label)}
        series={[{ name: "月花销 (元)", data: MONTHLY_TOTALS.map((m) => m.total) }]}
        valueSuffix=" 元"
      />
      <Table
        headers={["月份", "金额 (元)", "笔数", "占全年"]}
        columnAlign={["left", "right", "right", "right"]}
        striped
        rows={MONTHLY_TOTALS.map((m) => [
          m.label,
          fmt(m.total),
          String(m.count),
          total > 0 ? `${((m.total / total) * 100).toFixed(1)}%` : "—",
        ])}
      />

      <H2>全年分类占比</H2>
      <Grid columns="minmax(0, 2fr) minmax(0, 3fr)" gap={20} align="start">
        <PieChart
          donut
          size={240}
          data={YEAR_CATEGORIES.map((c) => ({ label: c.name, value: c.amount }))}
        />
        <Table
          headers={["类别", "金额 (元)", "占比", "笔数"]}
          columnAlign={["left", "right", "right", "right"]}
          striped
          rows={YEAR_CATEGORIES.map((c) => [
            c.name,
            fmt(c.amount),
            `${c.pct}%`,
            String(c.count),
          ])}
        />
      </Grid>
      <BarChart
        horizontal
        height={280}
        categories={YEAR_CATEGORIES.map((c) => c.name)}
        series={[
          { name: "花销金额 (元)", data: YEAR_CATEGORIES.map((c) => c.amount) },
        ]}
        valueSuffix=" 元"
      />
      <Text tone="tertiary" size="small">
        数据来源：支付宝 / 微信 / 招商银行 / 中国银行 · {YEAR_META.dateRange} ·
        分类为关键词规则自动归集
      </Text>

      <Divider />

      <H2>全年单笔金额区间分布（合并前 · 9 档）</H2>
      <Text tone="secondary" size="small">
        区间左闭右开，单位：元。共 {txnCount} 笔，合计 {fmt(total)} 元。
      </Text>
      <Grid columns={2} gap={20} align="start">
        <Stack gap={8}>
          <Text weight="semibold">笔数（笔）</Text>
          <BarChart
            height={260}
            categories={YEAR_AMOUNT_BUCKETS.map((b) => b.label)}
            series={[
              { name: "笔数", data: YEAR_AMOUNT_BUCKETS.map((b) => b.count) },
            ]}
            valueSuffix=" 笔"
          />
        </Stack>
        <Stack gap={8}>
          <Text weight="semibold">金额合计（元）</Text>
          <BarChart
            height={260}
            categories={YEAR_AMOUNT_BUCKETS.map((b) => b.label)}
            series={[
              { name: "金额", data: YEAR_AMOUNT_BUCKETS.map((b) => b.amount) },
            ]}
            valueSuffix=" 元"
          />
        </Stack>
      </Grid>
      <Table
        headers={["区间 (元)", "笔数", "金额 (元)", "占总额", "笔数占比"]}
        columnAlign={["left", "right", "right", "right", "right"]}
        striped
        rows={YEAR_AMOUNT_BUCKETS.map((b) => [
          b.label,
          String(b.count),
          fmt(b.amount),
          total > 0 ? `${((b.amount / total) * 100).toFixed(1)}%` : "—",
          txnCount > 0 ? `${((b.count / txnCount) * 100).toFixed(1)}%` : "—",
        ])}
      />
      <BucketCategoryPies
        title="9 档区间 · 类别构成"
        blocks={YEAR_BUCKET_CATEGORIES}
      />

      <H2>全年单笔金额区间分布（合并后 · 4 档）</H2>
      <Text tone="secondary" size="small">
        0–50（小额）· 50–200（中小额）· 200–500（中大额）· 500+（大额）
      </Text>
      <Grid columns={2} gap={20} align="start">
        <Stack gap={8}>
          <Text weight="semibold">笔数（笔）</Text>
          <BarChart
            height={220}
            categories={YEAR_AMOUNT_BUCKETS_MERGED.map((b) => b.label)}
            series={[
              {
                name: "笔数",
                data: YEAR_AMOUNT_BUCKETS_MERGED.map((b) => b.count),
              },
            ]}
            valueSuffix=" 笔"
          />
        </Stack>
        <Stack gap={8}>
          <Text weight="semibold">金额合计（元）</Text>
          <BarChart
            height={220}
            categories={YEAR_AMOUNT_BUCKETS_MERGED.map((b) => b.label)}
            series={[
              {
                name: "金额",
                data: YEAR_AMOUNT_BUCKETS_MERGED.map((b) => b.amount),
              },
            ]}
            valueSuffix=" 元"
          />
        </Stack>
      </Grid>
      <Table
        headers={["合并区间 (元)", "笔数", "金额 (元)", "占总额", "笔数占比"]}
        columnAlign={["left", "right", "right", "right", "right"]}
        striped
        rows={YEAR_AMOUNT_BUCKETS_MERGED.map((b) => [
          b.label,
          String(b.count),
          fmt(b.amount),
          total > 0 ? `${((b.amount / total) * 100).toFixed(1)}%` : "—",
          txnCount > 0 ? `${((b.count / txnCount) * 100).toFixed(1)}%` : "—",
        ])}
      />
      <BucketCategoryPies
        title="4 档区间 · 类别构成"
        blocks={YEAR_BUCKET_CATEGORIES_MERGED}
      />

      <H2>全年大额交易明细（≥ 500 元）</H2>
      <Text tone="secondary" size="small">
        共 {YEAR_META.largeTxnCount} 笔，合计 {fmt(YEAR_META.largeTxnTotal)} 元
        {total > 0
          ? `（占全年 ${(
              (YEAR_META.largeTxnTotal / total) *
              100
            ).toFixed(1)}%）`
          : ""}
        ，按金额从高到低。
      </Text>
      <Table
        headers={["日期", "金额 (元)", "类别", "平台", "项目"]}
        columnAlign={["left", "right", "left", "left", "left"]}
        striped
        rows={LARGE_TXNS.map((t) => [
          t.date,
          fmt(t.amount),
          t.category,
          t.platform,
          t.label,
        ])}
      />

      <Divider />

      <H2>分月明细（与单月模板同结构）</H2>
      <Text tone="secondary" size="small">
        默认折叠；点击月份卡片展开查看分类、日趋势、金额区间与明细。
      </Text>
      <Stack gap={16}>
        {MONTHS.map((m, i) => (
          <MonthSection key={m.key} m={m} defaultOpen={i === MONTHS.length - 1} />
        ))}
      </Stack>

      <Callout tone="info" title="口径备注">
        分类由 expense_config.json 关键词规则自动归集；跨平台去重以支付宝/微信支出为主，银行镜像与还款类已剔除。可编辑配置后重新运行
        build_expense_report.py --all。
      </Callout>
    </Stack>
  );
}
