import MarketingLayout from "../components/marketing/MarketingLayout";

const faqItems = [
  {
    q: "SHNQ AI Assistent nima va u qanday ishlaydi?",
    a: "SHNQ AI — qurilish me'yorlari va qoidalari bo'yicha aqlli qidiruv va tahlil yordamchisi. Savolingizni yuborasiz, tizim mos bob va bandlarni topib, javobni manbasi bilan qaytaradi.",
  },
  {
    q: "Qaysi hujjatlar bazada mavjud?",
    a: "Tizim SHNQ, QMQ va keng tarqalgan normativ hujjatlar asosida ishlashga mo'ljallangan. Baza bosqichma-bosqich kengaytiriladi va yangilanadi.",
  },
  {
    q: "Javoblar manbali bo'ladimi?",
    a: "Ha. Javoblar bilan birga tegishli hujjat, bob va band ko'rsatiladi. Muhim qarorlar uchun baribir asl hujjatni tekshirish tavsiya etiladi.",
  },
  {
    q: "SHNQga aloqasi bo'lmagan savollarga javob beradimi?",
    a: "Yo'q. Tizim faqat SHNQ doirasidagi savollarga javob beradi va mavzudan tashqari savollarni muloyimlik bilan rad etadi.",
  },
];

export default function FaqPage() {
  return (
    <MarketingLayout>
      <section className="mx-auto w-full max-w-5xl px-6 pb-20 pt-16 lg:px-10 lg:pt-24">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
            FAQ
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Eng ko'p so'raladigan savollar
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
            Agar bu yerda javob topmasangiz, bog&apos;lanish sahifasi orqali yozing.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4">
          {faqItems.map((item) => (
            <article
              key={item.q}
              className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
            >
              <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                {item.q}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">{item.a}</p>
            </article>
          ))}
        </div>
      </section>
    </MarketingLayout>
  );
}

