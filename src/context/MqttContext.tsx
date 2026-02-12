'use client';

import React, { createContext, useContext, useEffect, useState, useRef, ReactNode, useCallback } from 'react';
import mqtt from 'mqtt';

export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface NodeStatus {
    id: string;
    name: string;
    type: 'THERMOSTAT' | 'DISPLAY' | 'LIGHT';
    status: 'ONLINE' | 'OFFLINE' | 'COMPROMISED';
    ip: string;
    lastSeen: number;
    data: Record<string, unknown>;
}

interface MqttContextType {
    status: 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'RECONNECTING';
    threatLevel: ThreatLevel;
    nodes: Record<string, NodeStatus>;
    trafficData: { time: string; packets: number; type: string }[];
    publish: (topic: string, message: string) => void;
    updateNodeIp: (id: string, ip: string) => void;
    resetSimulation: () => void;
}

const MqttContext = createContext<MqttContextType | undefined>(undefined);

export const MqttProvider = ({ children }: { children: ReactNode }) => {
    const clientRef = useRef<mqtt.MqttClient | null>(null);
    const [status, setStatus] = useState<MqttContextType['status']>('CONNECTING');
    const [threatLevel, setThreatLevel] = useState<ThreatLevel>('LOW');

    const [nodes, setNodes] = useState<Record<string, NodeStatus>>({
        'node-a': { id: 'node-a', name: 'Smart Thermostat', type: 'THERMOSTAT', status: 'ONLINE', ip: '192.168.0.204', lastSeen: 0, data: { temp: 24, target: 24 } },
        'node-b': { id: 'node-b', name: 'Office Display', type: 'DISPLAY', status: 'ONLINE', ip: '192.168.0.119', lastSeen: 0, data: { msg: 'Welcome' } },
        'node-c': { id: 'node-c', name: 'Smart Light', type: 'LIGHT', status: 'ONLINE', ip: '192.168.0.108', lastSeen: 0, data: { state: false } },
    });

    const [trafficData, setTrafficData] = useState<{ time: string; packets: number; type: string }[]>([]);

    const handleMessage = useCallback((topic: string, payload: string) => {
        try {
            const data = JSON.parse(payload);

            if (topic === 'aegis/stats') {
                setTrafficData(prev => {
                    const timeStr = new Date().toLocaleTimeString();
                    const newData = [...prev, { time: timeStr, packets: data.packet_rate, type: 'normal' }];
                    return newData.slice(-50);
                });

                if (data.prob_attack > 0.8) {
                    setThreatLevel('CRITICAL');
                } else if (data.prob_attack > 0.5) {
                    setThreatLevel('HIGH');
                } else {
                    setThreatLevel('LOW');
                }
            } else if (topic === 'aegis/alerts') {
                setThreatLevel('CRITICAL');
            } else if (topic.startsWith('aegis/node/')) {
                // Handle node updates
            }

        } catch (e) {
            console.error('Failed to parse MQTT message', e);
        }
    }, []);

    useEffect(() => {
        console.log('Connecting to MQTT Broker...');
        const mqttClient = mqtt.connect('wss://broker.hivemq.com:8000/mqtt', {
            clientId: `aegis_dashboard_${Math.random().toString(16).substr(2, 8)}`,
            keepalive: 60,
        });

        mqttClient.on('connect', () => {
            console.log('Connected to MQTT Broker');
            setStatus('CONNECTED');
            mqttClient.subscribe('aegis/#', (err) => {
                if (!err) {
                    console.log('Subscribed to aegis/#');
                }
            });
        });

        mqttClient.on('message', (topic, message) => {
            const payload = message.toString();
            handleMessage(topic, payload);
        });

        mqttClient.on('reconnect', () => {
            setStatus('RECONNECTING');
        });

        mqttClient.on('close', () => {
            setStatus('DISCONNECTED');
        });

        clientRef.current = mqttClient;

        return () => {
            mqttClient.end();
        };
    }, [handleMessage]);

    const publish = (topic: string, message: string) => {
        if (clientRef.current) {
            clientRef.current.publish(topic, message);
        }
    };

    const updateNodeIp = (id: string, ip: string) => {
        setNodes(prev => ({
            ...prev,
            [id]: { ...prev[id], ip }
        }));
    };

    const resetSimulation = () => {
        publish('aegis/commands', JSON.stringify({ action: 'RESET_ALL' }));
        setThreatLevel('LOW');
        setNodes(prev => ({
            ...prev,
            'node-a': { ...prev['node-a'], status: 'ONLINE', data: { temp: 24, target: 24 } },
            'node-b': { ...prev['node-b'], status: 'ONLINE', data: { msg: 'Welcome' } }
        }));
    };

    return (
        <MqttContext.Provider value={{ status, threatLevel, nodes, trafficData, publish, updateNodeIp, resetSimulation }}>
            {children}
        </MqttContext.Provider>
    );
};

export const useMqtt = () => {
    const context = useContext(MqttContext);
    if (context === undefined) {
        throw new Error('useMqtt must be used within a MqttProvider');
    }
    return context;
};
