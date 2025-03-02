"use client"

import { useState, useEffect, useRef } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatTime } from "@/lib/utils"

type TimerMode = "pomodoro" | "shortBreak" | "longBreak"

const TIMER_SETTINGS = {
  pomodoro: 25 * 60, // 25 minutes in seconds
  shortBreak: 5 * 60, // 5 minutes in seconds
  longBreak: 15 * 60, // 15 minutes in seconds
}

export default function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>("pomodoro")
  const [timeLeft, setTimeLeft] = useState(TIMER_SETTINGS[mode])
  const [isActive, setIsActive] = useState(false)
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3")
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  // Handle timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (isActive && timeLeft === 0) {
      // Timer completed
      if (audioRef.current) {
        audioRef.current.play().catch((e) => console.error("Audio play failed:", e))
      }

      if (mode === "pomodoro") {
        const newCount = completedPomodoros + 1
        setCompletedPomodoros(newCount)

        // After 4 pomodoros, take a long break
        if (newCount % 4 === 0) {
          setMode("longBreak")
          setTimeLeft(TIMER_SETTINGS.longBreak)
        } else {
          setMode("shortBreak")
          setTimeLeft(TIMER_SETTINGS.shortBreak)
        }
      } else {
        // After a break, go back to pomodoro
        setMode("pomodoro")
        setTimeLeft(TIMER_SETTINGS.pomodoro)
      }

      setIsActive(false)
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [isActive, timeLeft, mode, completedPomodoros])

  // Reset timer when mode changes
  useEffect(() => {
    setTimeLeft(TIMER_SETTINGS[mode])
    setIsActive(false)
  }, [mode])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(TIMER_SETTINGS[mode])
  }

  const handleModeChange = (value: string) => {
    setMode(value as TimerMode)
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-center text-2xl font-bold">Pomodoro Timer</CardTitle>
      </CardHeader>
      <Tabs value={mode} onValueChange={handleModeChange} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4 mx-4">
          <TabsTrigger value="pomodoro">Focus</TabsTrigger>
          <TabsTrigger value="shortBreak">Short Break</TabsTrigger>
          <TabsTrigger value="longBreak">Long Break</TabsTrigger>
        </TabsList>
      </Tabs>
      <CardContent className="flex flex-col items-center pb-2">
        <div className="text-7xl font-mono font-bold mb-8 tabular-nums">{formatTime(timeLeft)}</div>
        <div className="flex gap-4 mb-4">
          <Button size="lg" onClick={toggleTimer} className="w-28" variant={isActive ? "outline" : "default"}>
            {isActive ? "Pause" : "Start"}
          </Button>
          <Button
            size="lg"
            onClick={resetTimer}
            variant="outline"
            className="w-28"
            disabled={timeLeft === TIMER_SETTINGS[mode]}
          >
            Reset
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="text-sm text-muted-foreground">Completed: {completedPomodoros}</div>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          title="Sound notification when timer ends"
        >
          <Bell className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

