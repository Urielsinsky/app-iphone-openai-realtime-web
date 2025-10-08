import { useState, useEffect, useCallback, useRef } from 'react';

const DAILY_LIMIT_MS = 5 * 60 * 1000; // 5 minutos en milisegundos
const STORAGE_KEY = 'chidolingo_daily_usage';

interface DailyUsage {
  date: string; // formato YYYY-MM-DD
  timeUsedMs: number; // milisegundos usados
}

export const useDailyLimit = () => {
  const [timeUsedToday, setTimeUsedToday] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(DAILY_LIMIT_MS);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const baseTimeRef = useRef<number>(0); // Tiempo base al iniciar sesión

  // Obtener fecha actual en formato YYYY-MM-DD
  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  // Cargar uso del día desde localStorage
  const loadDailyUsage = useCallback((): DailyUsage => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const usage: DailyUsage = JSON.parse(stored);
        const today = getCurrentDate();

        // Si es un día diferente, resetear
        if (usage.date !== today) {
          return {
            date: today,
            timeUsedMs: 0
          };
        }

        return usage;
      }
    } catch (error) {
      console.error('Error loading daily usage:', error);
    }

    return {
      date: getCurrentDate(),
      timeUsedMs: 0
    };
  }, []);

  // Guardar uso del día en localStorage
  const saveDailyUsage = useCallback((timeUsedMs: number) => {
    try {
      const usage: DailyUsage = {
        date: getCurrentDate(),
        timeUsedMs
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
    } catch (error) {
      console.error('Error saving daily usage:', error);
    }
  }, []);

  // Inicializar al cargar
  useEffect(() => {
    const usage = loadDailyUsage();
    setTimeUsedToday(usage.timeUsedMs);
    baseTimeRef.current = usage.timeUsedMs;
    const remaining = DAILY_LIMIT_MS - usage.timeUsedMs;
    setTimeRemaining(remaining);
    setIsLimitReached(remaining <= 0);
  }, [loadDailyUsage]);

  // Iniciar contador
  const startTracking = useCallback(() => {
    // Limpiar timer anterior si existe
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const currentUsage = loadDailyUsage();
    baseTimeRef.current = currentUsage.timeUsedMs;

    if (DAILY_LIMIT_MS - baseTimeRef.current <= 0) {
      setIsLimitReached(true);
      return;
    }

    startTimeRef.current = Date.now();

    // Actualizar cada segundo
    timerRef.current = setInterval(() => {
      if (startTimeRef.current !== null) {
        const elapsed = Date.now() - startTimeRef.current;
        const newTimeUsed = baseTimeRef.current + elapsed;

        setTimeUsedToday(newTimeUsed);
        const remaining = DAILY_LIMIT_MS - newTimeUsed;
        setTimeRemaining(remaining);

        // Guardar en localStorage cada 5 segundos para no saturar
        if (Math.floor(elapsed / 1000) % 5 === 0) {
          saveDailyUsage(newTimeUsed);
        }

        // Verificar si se alcanzó el límite
        if (remaining <= 0) {
          setIsLimitReached(true);
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          saveDailyUsage(newTimeUsed);
        }
      }
    }, 1000);
  }, [loadDailyUsage, saveDailyUsage]);

  // Detener contador
  const stopTracking = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Guardar tiempo final
    if (startTimeRef.current !== null) {
      const elapsed = Date.now() - startTimeRef.current;
      const finalTimeUsed = baseTimeRef.current + elapsed;
      setTimeUsedToday(finalTimeUsed);
      saveDailyUsage(finalTimeUsed);
      startTimeRef.current = null;
    }
  }, [saveDailyUsage]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Formatear tiempo restante para mostrar
  const formatTimeRemaining = useCallback(() => {
    const totalSeconds = Math.max(0, Math.floor(timeRemaining / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [timeRemaining]);

  return {
    timeUsedToday,
    timeRemaining,
    isLimitReached,
    startTracking,
    stopTracking,
    formatTimeRemaining,
    dailyLimitMs: DAILY_LIMIT_MS
  };
};
