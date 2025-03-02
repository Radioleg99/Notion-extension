import PomodoroTimer from "@/components/pomodoro-timer"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md mx-auto">
        <PomodoroTimer />
      </div>
    </main>
  )
}

