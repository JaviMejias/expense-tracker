import { useEffect, useState } from 'react'

export default function AuraBackground({ activeColor, isDark }) {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    const auraColors = {
        rose: { primary: 'rgba(244, 63, 94, 0.4)', secondary: 'rgba(225, 29, 72, 0.3)' },
        emerald: { primary: 'rgba(16, 185, 129, 0.4)', secondary: 'rgba(5, 150, 105, 0.3)' },
        indigo: { primary: 'rgba(99, 102, 241, 0.4)', secondary: 'rgba(79, 70, 229, 0.3)' },
        pink: { primary: 'rgba(236, 72, 153, 0.4)', secondary: 'rgba(219, 39, 119, 0.3)' },
    }

    const currentAura = auraColors[activeColor] || auraColors.indigo

    return (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
            {/* Mouse Spotlight */}
            <div
                className="absolute w-[600px] h-[600px] rounded-full blur-[100px] transition-opacity duration-500 ease-in-out"
                style={{
                    background: `radial-gradient(circle, ${currentAura.primary} 0%, transparent 70%)`,
                    transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)`,
                    opacity: isDark ? 0.6 : 0.3
                }}
            />
            
            {/* Background Floating Blobs */}
            <div 
                className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full blur-[120px] mix-blend-screen opacity-50 animate-blob"
                style={{ backgroundColor: currentAura.secondary }}
            />
            <div 
                className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] mix-blend-screen opacity-40 animate-blob animation-delay-2000"
                style={{ backgroundColor: currentAura.primary }}
            />
            <div 
                className="absolute bottom-[-20%] left-[20%] w-[700px] h-[700px] rounded-full blur-[120px] mix-blend-screen opacity-50 animate-blob animation-delay-4000"
                style={{ backgroundColor: currentAura.secondary }}
            />
        </div>
    )
}
