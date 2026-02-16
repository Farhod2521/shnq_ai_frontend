"use client";

import Link from "next/link";
import { JetBrains_Mono, Sora } from "next/font/google";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import MarketingLayout from "./components/marketing/MarketingLayout";
import { useI18n } from "./providers";
import styles from "./page.module.css";

const sora = Sora({ subsets: ["latin"], variable: "--home-sora" });
const jetMono = JetBrains_Mono({ subsets: ["latin"], variable: "--home-mono" });

function nowTime() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

export default function Home() {
  const { t } = useI18n();
  const [chatStatus, setChatStatus] = useState("Faol");
  const [inputPreview, setInputPreview] = useState("");

  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingText, setGreetingText] = useState("");
  const [greetingDone, setGreetingDone] = useState(false);
  const [greetingTime, setGreetingTime] = useState("");

  const [showUser, setShowUser] = useState(false);
  const [userText, setUserText] = useState("");
  const [userDone, setUserDone] = useState(false);
  const [userTime, setUserTime] = useState("");

  const [showScanBubble, setShowScanBubble] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [answerDone, setAnswerDone] = useState(false);
  const [answerTime, setAnswerTime] = useState("");

  const isAlive = useRef(true);
  const timers = useRef<number[]>([]);
  const conv = useMemo(
    () => ({
      botHello: t(
        "home.chat.demo.bot_hello",
        "Assalomu alaykum! SHNQ va GOST normalari bo'yicha savollaringizga javob beraman. Qanday yordam kerak?"
      ),
      userQuestion: t(
        "home.chat.demo.user_question",
        "Xavfsizlik belgilarini o'rnatish qaysi standartga muvofiq amalga oshiriladi?"
      ),
      botAnswer: t(
        "home.chat.demo.bot_answer",
        "GOST ISO 3864-1-2013 talablariga muvofiq o'rnatiladi. Belgining shakli, rangi va o'lchami shu standartda belgilangan."
      ),
    }),
    [t]
  );

  useEffect(() => {
    isAlive.current = true;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(resolve, ms);
        timers.current.push(id);
      });

    const typeText = async (
      fullText: string,
      speed: number,
      setText: (text: string) => void
    ) => {
      for (let i = 1; i <= fullText.length; i += 1) {
        if (!isAlive.current) return false;
        setText(fullText.slice(0, i));
        await sleep(speed);
      }
      return true;
    };

    const resetAll = () => {
      setChatStatus(t("home.chat.status.active", "Faol"));
      setInputPreview(t("home.chat.input.placeholder", "Savol yozing..."));
      setShowGreeting(false);
      setGreetingText("");
      setGreetingDone(false);
      setGreetingTime("");
      setShowUser(false);
      setUserText("");
      setUserDone(false);
      setUserTime("");
      setShowScanBubble(false);
      setShowAnswer(false);
      setAnswerText("");
      setAnswerDone(false);
      setAnswerTime("");
    };

    const runLoop = async () => {
      while (isAlive.current) {
        resetAll();
        await sleep(350);
        if (!isAlive.current) break;

        setChatStatus(t("home.chat.status.typing_bot", "Yozmoqda..."));
        setShowGreeting(true);
        const typedGreeting = await typeText(conv.botHello, 20, setGreetingText);
        if (!typedGreeting || !isAlive.current) break;
        setGreetingDone(true);
        setGreetingTime(nowTime());
        setChatStatus(t("home.chat.status.active", "Faol"));

        await sleep(900);
        if (!isAlive.current) break;

        setChatStatus(t("home.chat.status.typing_user", "Foydalanuvchi yozmoqda..."));
        setShowUser(true);
        let inputAccumulator = "";
        for (let i = 0; i < conv.userQuestion.length; i += 1) {
          inputAccumulator += conv.userQuestion[i];
          setInputPreview(inputAccumulator);
          await sleep(36);
          if (!isAlive.current) break;
        }
        if (!isAlive.current) break;

        const typedUser = await typeText(conv.userQuestion, 30, setUserText);
        if (!typedUser || !isAlive.current) break;
        setUserDone(true);
        setUserTime(nowTime());
        setInputPreview(t("home.chat.input.placeholder", "Savol yozing..."));
        setChatStatus(t("home.chat.status.scanning", "Hujjat skan qilinmoqda..."));

        await sleep(220);
        if (!isAlive.current) break;
        setShowScanBubble(true);

        await sleep(2500);
        if (!isAlive.current) break;
        setShowScanBubble(false);

        setChatStatus(t("home.chat.status.sending", "Javob uzatilmoqda..."));
        setShowAnswer(true);
        const typedAnswer = await typeText(conv.botAnswer, 26, setAnswerText);
        if (!typedAnswer || !isAlive.current) break;
        setAnswerDone(true);
        setAnswerTime(nowTime());
        setChatStatus(t("home.chat.status.active", "Faol"));

        await sleep(4000);
      }
    };

    runLoop();

    return () => {
      isAlive.current = false;
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };
  }, [conv, t]);

  return (
    <MarketingLayout>
      <div className={`${styles.page} ${sora.variable} ${jetMono.variable}`}>
        <div className={styles.bg}>
          <div className={styles.bgGlow} />
          <div className={styles.bgGrid} />
        </div>

        <main className={styles.hero}>
          <section className={styles.leftCol}>
            <div className={styles.leftTextBlock}>
              <div className={styles.kicker}>
                <span className={styles.kdot} />
                <span>{t("home.kicker", "SHNQ AI V2.0 - Yangi avlod")}</span>
              </div>
              <h1 className={styles.h1}>
                {t("home.title.l1", "Qurilish hujjatlarini")}
                <br />
                <em>{t("home.title.l2", "soniyalar ichida")}</em>
                <br />
                {t("home.title.l3", "tahlil qiling")}
              </h1>
              <p className={styles.hdesc}>
                {t(
                  "home.description",
                  "SHNQ, GOST va QMQ normalarini sun'iy intellekt yordamida real-time tahlil qiling. Tegishli bandlarni manbasi bilan oling."
                )}
              </p>
              <div className={styles.heroBtns}>
                <Link href="/chat" className={styles.btnBlue}>
                  {t("home.cta.chat", "Suhbatni boshlash")}
                </Link>
                <Link href="/about" className={styles.btnGhost}>
                  {t("home.cta.docs", "Hujjatlar")}
                </Link>
              </div>
              <div className={styles.tags}>
                <span>{t("home.tag.shnq", "SHNQ")}</span>
                <span>{t("home.tag.qmq", "QMQ")}</span>
                <span>{t("home.tag.gost", "GOST")}</span>
                <span>{t("home.tag.standards", "STANDARTLAR")}</span>
              </div>
            </div>
          </section>

          <section className={styles.rightCol}>
            <div className={styles.chatCard}>
              <div className={styles.chatHead}>
                <div className={styles.chatHeadLeft}>
                  <span className={styles.chatAvatar}>AI</span>
                  <span>
                    <span className={styles.chatName}>SHNQ AI</span>
                    <span className={styles.chatStatus}>{chatStatus}</span>
                  </span>
                </div>
                <div className={styles.chatDots}>
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              <div className={styles.chatMessages}>
                <div className={`${styles.msgRow} ${showGreeting ? styles.msgVisible : ""}`}>
                  {!greetingDone ? (
                    <div className={styles.robotLead}>
                      <Image src="/robot-scan.svg" alt="Robot" width={48} height={60} className={styles.robotLeadImg} />
                    </div>
                  ) : (
                    <div className={`${styles.msgAvatar} ${styles.msgAvatarCompact}`}>
                      <Image src="/robot-scan.svg" alt="Robot avatar" width={18} height={18} className={styles.avatarSvg} />
                    </div>
                  )}
                  <div className={`${styles.bubble} ${styles.botBubble}`}>
                    <p>{greetingText}</p>
                    <span className={styles.meta}>{greetingDone ? greetingTime : ""}</span>
                  </div>
                </div>

                <div
                  className={`${styles.msgRow} ${styles.msgRowRight} ${
                    showUser ? styles.msgVisible : ""
                  }`}
                >
                  <div className={`${styles.msgAvatar} ${userDone ? styles.msgAvatarCompact : ""}`}>U</div>
                  <div className={`${styles.bubble} ${styles.userBubble}`}>
                    <p>{userText}</p>
                    <span className={styles.meta}>{userDone ? userTime : ""}</span>
                  </div>
                </div>

                <div className={`${styles.msgRow} ${showScanBubble ? styles.msgVisible : ""}`}>
                  <div className={styles.robotLead}>
                    <Image src="/robot-scan.svg" alt="Robot scan" width={44} height={56} className={styles.robotLeadImg} />
                  </div>
                  <div className={`${styles.bubble} ${styles.botBubble} ${styles.scanCloud}`}>
                    <div className={styles.scanMiniDoc}>
                      <div className={styles.scanMiniBeam} />
                      <div className={styles.scanMiniLine} />
                      <div className={styles.scanMiniLine} />
                      <div className={styles.scanMiniLineActive} />
                      <div className={styles.scanMiniLine} />
                    </div>
                  </div>
                </div>

                <div className={`${styles.msgRow} ${showAnswer ? styles.msgVisible : ""}`}>
                  <div className={`${styles.msgAvatar} ${styles.msgAvatarCompact}`}>
                    <Image src="/robot-scan.svg" alt="Robot avatar" width={18} height={18} className={styles.avatarSvg} />
                  </div>
                  <div className={`${styles.bubble} ${styles.botBubble}`}>
                    <p>{answerText}</p>
                    <span className={styles.meta}>{answerDone ? answerTime : ""}</span>
                  </div>
                </div>
              </div>

                <div className={styles.chatInput}>
                  <div className={styles.chatInputField}>{inputPreview}</div>
                <Link href="/chat" className={styles.sendButton}>
                  →
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </MarketingLayout>
  );
}

