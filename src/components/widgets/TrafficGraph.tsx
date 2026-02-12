'use client';

import React from 'react';
import { useMqtt } from '@/context/MqttContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function TrafficGraph() {
    const { trafficData, threatLevel } = useMqtt();

    const strokeColor = threatLevel === 'CRITICAL' ? '#ff003c' : '#00ff41';

    return (
        <div className="h-64 w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-neutral-400 tracking-wider">LIVE 802.11 TRAFFIC ANALYSIS</h3>
                <div className="flex gap-2 text-[10px] font-mono">
                    <span className="text-green-500">MGMT FRAMES</span>
                    <span className="text-blue-500">DATA FRAMES</span>
                </div>
            </div>

            <div className="h-full w-full absolute inset-0 pt-12 pr-4 pb-4 pl-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trafficData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis dataKey="time" hide />
                        <YAxis hide domain={[0, 'auto']} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff' }}
                            itemStyle={{ fontSize: '12px' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="packets"
                            stroke={strokeColor}
                            strokeWidth={2}
                            dot={false}
                            isAnimationActive={false} // Disable standard animation for real-time feel
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
