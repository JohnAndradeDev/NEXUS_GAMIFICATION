import { useState } from "react";
import { BrandLogo } from "../components/Login/BrandLogo";
import { ErrorBanner } from "../components/Login/ErrorBanner";
import { LoginForm } from "../components/Login/LoginForm";

export default function Login() {
  const [showError, setShowError] = useState(false);

  // function handleToggleError() {
  //   setShowError((currentValue) => !currentValue);
  // }

  function handleDismissError() {
    setShowError(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center overflow-x-hidden bg-background px-4 py-6 font-body-md text-on-surface antialiased selection:bg-primary/20 selection:text-primary sm:px-6 md:p-gutter">
      <section className="relative mx-auto w-full max-w-md rounded-xl border border-surface-variant/40 bg-surface-container-low/85 p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-7 md:p-8">
        <div className="pointer-events-none absolute -left-32 -top-32 -z-10 h-80 w-80 rounded-full bg-primary-container/10 blur-3xl sm:h-96 sm:w-96" />

        <div className="pointer-events-none absolute -bottom-32 -right-32 -z-10 h-80 w-80 rounded-full bg-secondary-container/20 blur-3xl sm:h-96 sm:w-96" />

        <div className="relative flex w-full flex-col">
          <BrandLogo />

          {showError && <ErrorBanner onDismiss={handleDismissError} />}

          <LoginForm
            showError={showError}
            onCredentialsError={() => setShowError(true)}
            onClearError={() => setShowError(false)}
          />

          {/* <div className="mt-space-md flex items-center justify-center pt-space-xs">
            <button
              type="button"
              onClick={handleToggleError}
              className="flex items-center gap-1 rounded px-2 py-1 text-xs text-on-surface-variant/80 transition hover:text-error"
            >
              <span className="text-[14px]">⚠</span>
              <span>Simular erro de credencial</span>
            </button>
          </div> */}

          <footer className="mt-space-md flex flex-col items-center gap-1 border-t border-surface-variant/30 pt-space-md text-center sm:mt-space-lg">
            <p className="text-[11px] text-on-surface-variant/80 sm:text-body-sm">
              NEXUS © 2026 • Sistema corporativo de gamificação
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}
