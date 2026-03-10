"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import MarketingLayout from "./components/marketing/MarketingLayout";
import { getProfile, loginUser, registerUser } from "./lib/backendApi";
import { useAuthSession, writeAuthSession } from "./lib/authSession";
import { useI18n } from "./providers";
import styles from "./page.module.css";

const REGISTER_NOTICE_STORAGE_KEY = "shnq_register_notice";

type RegisterNotice = {
  login: string;
  password: string;
};

function nowTime() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

function HomeContent() {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const authSession = useAuthSession();
  const authParam = searchParams.get("auth");
  const showAuthPanel = (authParam === "login" || authParam === "register") && !authSession;
  const authTab: "login" | "register" = authParam === "register" ? "register" : "login";
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
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
  const [registerNotice, setRegisterNotice] = useState<RegisterNotice | null>(null);

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

  const openAuthTab = (tab: "login" | "register") => {
    setAuthError("");
    setAuthSuccess("");
    const params = new URLSearchParams(searchParams.toString());
    params.set("auth", tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const toErrorMessage = (error: unknown) => {
    if (error instanceof Error && error.message.trim()) {
      return error.message.trim();
    }
    return t("home.auth.error.generic", "Xatolik yuz berdi. Qayta urinib ko'ring.");
  };

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (authLoading) {
      return;
    }

    const loginValue = loginPhone.trim();
    const passwordValue = loginPassword.trim();
    if (!loginValue || !passwordValue) {
      setAuthSuccess("");
      setAuthError(t("home.auth.error.login_required", "Telefon raqami va parolni kiriting."));
      return;
    }

    setAuthLoading(true);
    setAuthError("");
    setAuthSuccess("");

    try {
      const data = await loginUser({
        login: loginValue,
        password: passwordValue,
      });
      const profile = await getProfile(data.token).catch(() => data.user);
      writeAuthSession({ token: data.token, user: profile });
      setLoginPassword("");
      router.replace("/", { scroll: false });
    } catch (error) {
      setAuthError(toErrorMessage(error));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (authLoading) {
      return;
    }

    const fullName = registerName.trim();
    const emailValue = registerEmail.trim();
    const phoneValue = registerPhone.trim();
    if (!fullName || !emailValue || !phoneValue) {
      setAuthSuccess("");
      setAuthError(t("home.auth.error.register_required", "Barcha maydonlarni to'ldiring."));
      return;
    }

    const parts = fullName.split(/\s+/).filter(Boolean);
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || firstName;
    if (firstName.length < 2 || lastName.length < 2) {
      setAuthSuccess("");
      setAuthError(t("home.auth.error.name", "Ism va familyani to'g'ri kiriting."));
      return;
    }

    setAuthLoading(true);
    setAuthError("");
    setAuthSuccess("");

    try {
      const data = await registerUser({
        first_name: firstName,
        last_name: lastName,
        email: emailValue,
        phone: phoneValue,
      });
      const generatedPassword = data.generated_password;
      const loginValue = data.user.login || data.user.phone || phoneValue;
      let sessionToken = data.token;
      let sessionUser = data.user;
      try {
        const loginResult = await loginUser({
          login: loginValue,
          password: generatedPassword,
        });
        sessionToken = loginResult.token;
        sessionUser = await getProfile(loginResult.token).catch(() => loginResult.user ?? data.user);
      } catch {
        sessionUser = await getProfile(data.token).catch(() => data.user);
      }

      writeAuthSession({ token: sessionToken, user: sessionUser });
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          REGISTER_NOTICE_STORAGE_KEY,
          JSON.stringify({ login: loginValue, password: generatedPassword })
        );
      }
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPhone("");
      setLoginPhone(loginValue);
      setLoginPassword("");
      router.replace("/", { scroll: false });
    } catch (error) {
      setAuthError(toErrorMessage(error));
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    if (!authSession || typeof window === "undefined") {
      return;
    }
    const saved = window.sessionStorage.getItem(REGISTER_NOTICE_STORAGE_KEY);
    if (!saved) {
      return;
    }
    try {
      const parsed = JSON.parse(saved) as Partial<RegisterNotice>;
      if (typeof parsed.login === "string" && typeof parsed.password === "string") {
        setRegisterNotice({ login: parsed.login, password: parsed.password });
      }
    } catch {
      // ignore broken session payload
    }
    window.sessionStorage.removeItem(REGISTER_NOTICE_STORAGE_KEY);
  }, [authSession]);

  useEffect(() => {
    if (showAuthPanel) {
      return;
    }

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
  }, [conv, showAuthPanel, t]);

  return (
    <MarketingLayout>
      <div className={styles.page}>
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
            {showAuthPanel ? (
              <div className={styles.authCard}>
                <div className={styles.authTabs}>
                  <button
                    type="button"
                    className={`${styles.authTabButton} ${authTab === "login" ? styles.authTabButtonActive : ""}`}
                    onClick={() => openAuthTab("login")}
                  >
                    {t("home.auth.tabs.login", "Kirish")}
                  </button>
                  <button
                    type="button"
                    className={`${styles.authTabButton} ${authTab === "register" ? styles.authTabButtonActive : ""}`}
                    onClick={() => openAuthTab("register")}
                  >
                    {t("home.auth.tabs.register", "Ro'yxatdan o'tish")}
                  </button>
                </div>

                {authTab === "login" ? (
                  <form className={styles.authForm} onSubmit={handleLoginSubmit}>
                    <label className={styles.authLabel} htmlFor="home-login-phone">
                      {t("home.auth.login.phone", "Telefon raqami")}
                    </label>
                    <input
                      id="home-login-phone"
                      type="tel"
                      className={styles.authInput}
                      placeholder="+998 90 123 45 67"
                      value={loginPhone}
                      onChange={(event) => setLoginPhone(event.target.value)}
                      disabled={authLoading}
                    />

                    <label className={styles.authLabel} htmlFor="home-login-password">
                      {t("home.auth.login.password", "Parol")}
                    </label>
                    <input
                      id="home-login-password"
                      type="password"
                      className={styles.authInput}
                      value={loginPassword}
                      onChange={(event) => setLoginPassword(event.target.value)}
                      disabled={authLoading}
                    />

                    <div className={styles.authHelperRow}>
                      <label className={styles.authRemember}>
                        <input type="checkbox" />
                        <span>{t("home.auth.login.remember", "Eslab qolish")}</span>
                      </label>
                      <a
                        href="#"
                        className={styles.authForgot}
                        onClick={(event) => event.preventDefault()}
                      >
                        {t("home.auth.login.forgot", "Parolni unutdingizmi?")}
                      </a>
                    </div>

                    {authError ? <div className={`${styles.authNotice} ${styles.authError}`}>{authError}</div> : null}
                    {authSuccess ? <div className={`${styles.authNotice} ${styles.authSuccess}`}>{authSuccess}</div> : null}

                    <button type="submit" className={styles.authSubmit} disabled={authLoading}>
                      {authLoading
                        ? t("home.auth.login.loading", "Kirish...")
                        : t("home.auth.login.submit", "Kirish")}
                    </button>
                  </form>
                ) : (
                  <form className={styles.authForm} onSubmit={handleRegisterSubmit}>
                    <label className={styles.authLabel} htmlFor="home-register-name">
                      {t("home.auth.register.name", "Ism familya")}
                    </label>
                    <input
                      id="home-register-name"
                      type="text"
                      className={styles.authInput}
                      value={registerName}
                      onChange={(event) => setRegisterName(event.target.value)}
                      disabled={authLoading}
                    />

                    <label className={styles.authLabel} htmlFor="home-register-email">
                      {t("home.auth.register.email", "Gmail")}
                    </label>
                    <input
                      id="home-register-email"
                      type="email"
                      className={styles.authInput}
                      value={registerEmail}
                      onChange={(event) => setRegisterEmail(event.target.value)}
                      disabled={authLoading}
                    />

                    <label className={styles.authLabel} htmlFor="home-register-phone">
                      {t("home.auth.register.phone", "Telefon raqami")}
                    </label>
                    <input
                      id="home-register-phone"
                      type="tel"
                      className={styles.authInput}
                      placeholder="+998 90 123 45 67"
                      value={registerPhone}
                      onChange={(event) => setRegisterPhone(event.target.value)}
                      disabled={authLoading}
                    />

                    {authError ? <div className={`${styles.authNotice} ${styles.authError}`}>{authError}</div> : null}
                    {authSuccess ? <div className={`${styles.authNotice} ${styles.authSuccess}`}>{authSuccess}</div> : null}

                    <button type="submit" className={styles.authSubmit} disabled={authLoading}>
                      {authLoading
                        ? t("home.auth.register.loading", "Yaratilmoqda...")
                        : t("home.auth.register.submit", "Ro'yxatdan o'tish")}
                    </button>
                  </form>
                )}
              </div>
            ) : (
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
                    {"->"}
                  </Link>
                </div>
              </div>
            )}
          </section>
        </main>

        {registerNotice ? (
          <div className={styles.registerModalBackdrop} role="dialog" aria-modal="true">
            <div className={styles.registerModal}>
              <h3 className={styles.registerModalTitle}>Ro&apos;yxatdan o&apos;tish yakunlandi</h3>
              <p className={styles.registerModalText}>
                Login va parolni saqlab qo&apos;ying:
              </p>
              <div className={styles.registerModalField}>
                <span>Login</span>
                <strong>{registerNotice.login}</strong>
              </div>
              <div className={styles.registerModalField}>
                <span>Parol</span>
                <strong>{registerNotice.password}</strong>
              </div>
              <button
                type="button"
                className={styles.registerModalButton}
                onClick={() => setRegisterNotice(null)}
              >
                Tushunarli
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </MarketingLayout>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
