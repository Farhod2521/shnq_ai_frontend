import MarketingLayout from "../components/marketing/MarketingLayout";

const plans = [
  {
    name: "Boshlang'ich",
    price: "0 so'm",
    description: "Kichik loyihalar va sinov uchun.",
    features: [
      "Asosiy SHNQ bo'limlari",
      "Cheklangan so'rovlar",
      "Manbali javoblar",
    ],
  },
  {
    name: "Professional",
    price: "Moslashuvchan",
    description: "Muhandislar va loyiha jamoalari uchun.",
    features: [
      "To'liq SHNQ bazasiga kirish",
      "Tezkor qidiruv va filtrlash",
      "Jamoa uchun qulay",
    ],
    highlighted: true,
  },
  {
    name: "Korporativ",
    price: "Shartnoma asosida",
    description: "Yirik tashkilotlar va integratsiyalar uchun.",
    features: [
      "Barcha me'yoriy hujjatlar",
      "Kengaytirilgan analytics",
      "Maxsus qo'llab-quvvatlash",
    ],
  },
];

export default function PricePage() {
  return (
    <MarketingLayout>
      <section className="mx-auto w-full max-w-7xl px-6 pb-20 pt-16 lg:px-10 lg:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
            Narxlar
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            SHNQ AI barcha uchun hamyonbop yechim
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
            Kichik loyihalardan tortib yirik qurilish kompaniyalarigacha — mos paketni
            tanlang.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`flex h-full flex-col rounded-3xl border p-6 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900/60 ${
                plan.highlighted
                  ? "border-blue-200 bg-white shadow-lg shadow-blue-600/10 dark:border-blue-900/60"
                  : "border-slate-200 bg-white/90"
              }`}
            >
              <div>
                <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{plan.description}</p>
                <p className="mt-4 text-2xl font-black text-blue-600 dark:text-blue-300">
                  {plan.price}
                </p>
              </div>

              <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm text-slate-700 dark:text-slate-200">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] text-blue-600 dark:text-blue-300">
                      check_circle
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`mt-6 inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-bold transition-all ${
                  plan.highlighted
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : "border border-slate-200 bg-white text-slate-800 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-slate-600"
                }`}
              >
                Paketni tanlash
              </button>
            </article>
          ))}
        </div>
      </section>
    </MarketingLayout>
  );
}

