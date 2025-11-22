// app/auth/registrieren/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Registrieren – WohnenWo",
};

export default function RegistrierenPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="min-h-screen w-full flex items-center justify-center px-4">
        <div className="w-full max-w-[360px] space-y-5">
          <div className="space-y-5">
            {/* Titel + Subtext */}
            <div className="space-y-1">
              <h1 className="text-[22px] leading-tight font-semibold tracking-tight text-slate-900">
                Registrieren
              </h1>
              <p className="text-[14px] text-slate-600">
                Erstelle deinen Zugang zum WohnenWo&nbsp;Ökosystem, um Kurse,
                Training und deinen persönlichen Wirkungsbereich zu nutzen.
              </p>
            </div>

            {/* Google + Divider */}
            <div className="space-y-5">
              <button
                type="button"
                className="text-center transition duration-300 ease-out whitespace-nowrap font-medium w-full border border-slate-200 text-slate-800 bg-white md:hover:bg-slate-50 py-1.5 px-3 text-[15px] rounded-md"
              >
                <div className="flex items-center justify-center pointer-events-none">
                  <div>Mit Google fortfahren</div>
                  <div className="mr-1 order-first">
                    <svg
                      viewBox="0 0 48 48"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                    >
                      <path
                        fill="#FFC107"
                        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
                        c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
                        c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                      />
                      <path
                        fill="#FF3D00"
                        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
                        C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                      />
                      <path
                        fill="#4CAF50"
                        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
                        c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                      />
                      <path
                        fill="#1976D2"
                        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
                        c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              <div className="grid grid-cols-[1fr,0.5fr,1fr] items-center w-full justify-center">
                <div className="w-full h-px bg-slate-200 mx-auto" />
                <div className="text-slate-400 text-[14px] text-center font-normal">
                  oder
                </div>
                <div className="w-full h-px bg-slate-200 mx-auto" />
              </div>
            </div>

            {/* Formular */}
            <div>
              <form className="space-y-6">
                {/* E-Mail */}
                <div>
                  <div className="relative m-0">
                    <div className="relative">
                      <div className="space-y-0.5">
                        <div className="text-slate-500 text-[14px]">
                          E-Mail
                        </div>
                        <div className="relative">
                          <div className="flex items-center">
                            <input
                              className="
                                text-slate-900 placeholder:text-slate-400
                                py-2 px-[10px] w-full text-[14px]
                                border border-slate-200
                                md:hover:border-slate-300
                                transition ease-in-out duration-300
                                focus:outline-none focus:border-slate-300 focus:ring-0
                                rounded-md bg-slate-50
                              "
                              placeholder="E-Mail-Adresse eingeben…"
                              type="email"
                              name="email"
                            />
                          </div>
                          <div className="absolute top-[9px] md:top-0 right-3 h-max md:h-full flex items-center text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Passwort */}
                <div>
                  <div className="relative m-0">
                    <div className="relative">
                      <div className="space-y-0.5">
                        <div className="text-slate-500 text-[14px]">
                          Passwort
                        </div>
                        <div className="relative">
                          <div className="flex items-center">
                            <input
                              className="
                                text-slate-900 placeholder:text-slate-400
                                py-2 px-[10px] w-full text-[14px]
                                border border-slate-200
                                md:hover:border-slate-300
                                transition ease-in-out duration-300
                                focus:outline-none focus:border-slate-300 focus:ring-0
                                rounded-md bg-slate-50
                              "
                              placeholder="Passwort wählen…"
                              type="password"
                              name="password"
                            />
                          </div>
                          <div className="absolute top-[9px] md:top-0 right-3 h-max md:h-full flex items-center text-slate-400 cursor-pointer">
                            <svg
                              stroke="currentColor"
                              fill="none"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                              <line x1="1" y1="1" x2="23" y2="23"></line>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <p className="text-[13px] text-red-500 mt-0.5"></p>
                    </div>
                  </div>
                </div>

                {/* Passwort bestätigen */}
                <div>
                  <div className="relative m-0">
                    <div className="relative">
                      <div className="space-y-0.5">
                        <div className="text-slate-500 text-[14px]">
                          Passwort bestätigen
                        </div>
                        <div className="relative">
                          <div className="flex items-center">
                            <input
                              className="
                                text-slate-900 placeholder:text-slate-400
                                py-2 px-[10px] w-full text-[14px]
                                border border-slate-200
                                md:hover:border-slate-300
                                transition ease-in-out duration-300
                                focus:outline-none focus:border-slate-300 focus:ring-0
                                rounded-md bg-slate-50
                              "
                              placeholder="Passwort wiederholen…"
                              type="password"
                              name="passwordConfirm"
                            />
                          </div>
                        </div>
                      </div>
                      <p className="text-[13px] text-red-500 mt-0.5"></p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <button
                  type="submit"
                  className="
                    text-center transition duration-300 ease-out whitespace-nowrap font-medium
                    w-full bg-slate-900 text-white border border-slate-900
                    md:hover:bg-black
                    py-1.5 px-3 text-[15px] rounded-md
                  "
                >
                  Mit E-Mail registrieren
                </button>
              </form>

              {/* Rechtliches */}
              <div className="hidden sm:block mt-4 text-[13px] text-slate-500 text-center">
                Indem du auf „Mit Google/E-Mail fortfahren“ klickst,
                bestätigst du, dass du die{" "}
                <a
                  href="/recht/agb"
                  className="underline underline-offset-[3px]"
                >
                  Bedingungen
                </a>{" "}
                &amp;{" "}
                <a
                  href="/recht/datenschutz"
                  className="underline underline-offset-[3px]"
                >
                  Datenschutzhinweise
                </a>{" "}
                von WohnenWo gelesen und verstanden hast.
              </div>
            </div>

            {/* Switch zu Anmelden */}
            <div className="text-[14px] text-slate-500 text-center sm:mt-2">
              Du hast bereits ein Konto?{" "}
              <Link
                href="/auth/anmelden"
                className="underline underline-offset-[3px] text-slate-800 hover:text-slate-900"
              >
                Anmelden
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
