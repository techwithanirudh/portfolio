// The facts behind the reader ladder demo on the Depensa page. Plain data with
// no imports, so the remark plugin that writes the page's llms text can read
// it too, and the demo and its text description never drift apart.

export type RungId = 'blob' | 'json' | 'script'

export interface Rung {
  id: RungId
  label: string
  /** What the learner tries on this rung, one short line */
  tries: string
}

export const RUNGS: Rung[] = [
  {
    id: 'json',
    label: 'Orders JSON',
    tries: 'The request the site makes for your orders',
  },
  {
    id: 'blob',
    label: 'Data blob',
    tries: 'Data baked into the page, like __NEXT_DATA__',
  },
  {
    id: 'script',
    label: 'Card script',
    tries: 'A script over the rendered order cards, as a last resort',
  },
]

export type ShopId = 'amazon' | 'blinkit' | 'next' | 'stubborn'

export interface Reader {
  /** One JSONata expression per field */
  fields: Record<string, string>
  /** Where the order list lives, also JSONata */
  orders: string
  /** Blinkit's list only has IDs, so its reader fetches each order too */
  perOrder?: string
}

export interface Shop {
  id: ShopId
  label: string
  /** The result under each rung it reached, in order; the last one wins */
  notes: Partial<Record<RungId, string>>
  reader?: Reader
  /** The field a site change breaks, and the expression v2 swaps in */
  repair?: { field: string; to: string }
  site: string
  /** The rung that worked, if any */
  winner?: RungId
}

export const SHOPS: Shop[] = [
  {
    id: 'next',
    label: 'A Next.js shop',
    notes: {
      blob: '18 orders in __NEXT_DATA__',
      json: 'No orders request on the page',
    },
    reader: {
      fields: {
        date: 'placedAt',
        id: 'orderNumber',
        total: 'totals.grand',
      },
      orders: 'props.pageProps.orders',
    },
    repair: { field: 'total', to: 'summary.total' },
    site: 'shop.example',
    winner: 'blob',
  },
  {
    id: 'blinkit',
    label: 'Blinkit',
    notes: {
      json: "12 order IDs, then each order's details",
    },
    reader: {
      fields: {
        date: 'created_at',
        id: 'order_id',
        total: 'bill.total',
      },
      orders: 'orders',
      perOrder: 'order_id',
    },
    repair: { field: 'total', to: 'bill_details.grand_total' },
    site: 'blinkit.com',
    winner: 'json',
  },
  {
    id: 'amazon',
    label: 'Amazon',
    notes: {
      blob: 'No order data in the page',
      json: 'No orders request it can use',
      script: '24 order cards read',
    },
    reader: {
      fields: {
        date: 'placed',
        id: 'orderId',
        total: "$number($replace(total, /[^0-9.]/, ''))",
      },
      orders: 'cards',
    },
    repair: { field: 'date', to: 'orderDate' },
    site: 'amazon.example',
    winner: 'script',
  },
  {
    id: 'stubborn',
    label: 'Stubborn site',
    notes: {
      blob: 'No data in the page',
      json: 'Nothing that looks like orders',
      script: 'No order cards it can read',
    },
    site: 'stubborn.example',
  },
]

export const rungLabel = (id: RungId) =>
  RUNGS.find((rung) => rung.id === id)?.label ?? id

/** The saved reader as the JSON the runner replays */
export function readerJson(shop: Shop, version: number) {
  if (!(shop.reader && shop.winner)) {
    return
  }
  const { fields, orders, perOrder } = shop.reader
  const repaired =
    version > 1 && shop.repair
      ? { ...fields, [shop.repair.field]: shop.repair.to }
      : fields

  // Entries, not an object literal, so the keys keep reading order
  const entries: [string, unknown][] = [
    ['site', shop.site],
    ['version', version],
    ['source', SOURCE[shop.winner]],
    ['orders', orders],
    ...(perOrder ? [['fetchEach', perOrder] as [string, unknown]] : []),
    [
      'fields',
      Object.fromEntries(FIELD_ORDER.map((key) => [key, repaired[key]])),
    ],
  ]

  return JSON.stringify(Object.fromEntries(entries), null, 2)
}

const SOURCE: Record<RungId, string> = {
  blob: 'data-blob',
  json: 'orders-json',
  script: 'card-script',
}

const FIELD_ORDER = ['id', 'date', 'total']

// Marks code names as code, so Markdown doesn't read their underscores as bold
const code = (text: string) =>
  text.replaceAll('__NEXT_DATA__', '`__NEXT_DATA__`')

/** The plain Markdown the llms text gets in place of the live demo */
export function readerLadderText() {
  const rungs = RUNGS.map(
    (rung, index) =>
      `${index + 1}. ${rung.label}: ${code(rung.tries.charAt(0).toLowerCase() + rung.tries.slice(1))}.`
  ).join('\n')
  const runs = SHOPS.map((shop) => {
    const tried = RUNGS.filter((rung) => shop.notes[rung.id])
      .map((rung) => `${rung.label} (${code(shop.notes[rung.id] ?? '')})`)
      .join(', then ')
    const result = shop.winner
      ? `saved a reader that uses ${rungLabel(shop.winner)}`
      : "nothing worked, so the app says it can't read that site"
    return `- ${shop.label}: tried ${tried}; ${result}.`
  }).join('\n')

  return [
    'Reader ladder (an interactive demo on the page). The learner agent tries three ways to read your orders, in order, and keeps the first one that works:',
    rungs,
    "If none of them works, the app tells you it can't read that site. The one that works is saved as a versioned reader: JSON with one JSONata expression per field, which a plain runner replays with no model.",
    `Example runs in the demo (illustrative values):\n${runs}`,
    'When a site changes and a reader breaks, a repair agent writes version 2. Version 1 stays active until version 2 passes a live test.',
  ].join('\n\n')
}
