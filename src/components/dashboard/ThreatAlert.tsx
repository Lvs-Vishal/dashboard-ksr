'use client';

import React from 'react';
import { useMqtt } from '@/context/MqttContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon } from 'lucide-react';

export default function ThreatAlert() {
    const { threatLevel } = useMqtt();
    const visible = threatLevel === 'CRITICAL';

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center bg-red-900/20 backdrop-blur-sm"
                >
                    <div className="absolute inset-0 border-[20px] border-red-500/50 animate-pulse" />

                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="bg-black/90 border-2 border-red-500 p-8 rounded-2xl flex flex-col items-center gap-4 shadow-[0_0_50px_rgba(255,0,0,0.5)]"
                    >
                        <AlertOctagon className="w-24 h-24 text-red-500 animate-bounce" />
                        <h1 className="text-4xl font-black text-red-500 tracking-widest glitch-text">
                            INTRUSION DETECTED
                        </h1>
                        <div className="text-xl font-mono text-white/80">
                            ACTIVE COUNTER-MEASURES ENGAGED
                        </div>
                        <div className="w-full bg-red-900/30 h-2 rounded-full overflow-hidden mt-4">
                            <motion.div
                                className="h-full bg-red-500"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
