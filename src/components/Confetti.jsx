import { useState, useEffect } from 'react'

function Confetti({ trigger }) {
    const [pieces, setPieces] = useState([])

    useEffect(() => {
        if (!trigger) return

        const colors = [
            '#38bdf8', '#0ea5e9',
            '#ec4899', '#f43f5e',
            '#10b981', '#059669',
            '#a855f7', '#7c3aed',
            '#f59e0b', '#d97706',
            '#eab308'
        ]

        const stateTimer = setTimeout(() => {
            const piecesArray = Array.from({ length: 60 }).map((_, index) => {
                const left = Math.random() * 100
                const size = Math.random() * 8 + 6
                const delay = Math.random() * 1.5
                const duration = Math.random() * 2 + 2.5
                const color = colors[Math.floor(Math.random() * colors.length)]
                const spinDirection = Math.random() > 0.5 ? 1 : -1
                const rotation = Math.random() * 360

                return {
                    id: index,
                    style: {
                        left: `${left}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        backgroundColor: color,
                        animationDelay: `${delay}s`,
                        animationDuration: `${duration}s`,
                        '--spin-direction': spinDirection,
                        transform: `rotate(${rotation}deg)`
                    }
                }
            })
            setPieces(piecesArray)
        }, 0)

        const clearTimer = setTimeout(() => {
            setPieces([])
        }, 5000)

        return () => {
            clearTimeout(stateTimer)
            clearTimeout(clearTimer)
        }
    }, [trigger])

    if (pieces.length === 0) return null

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fall {
                    0% {
                        transform: translateY(-20px) rotate(0deg) translateX(0);
                        opacity: 1;
                    }
                    50% {
                        transform: translateY(50vh) rotate(180deg) translateX(50px);
                        opacity: 0.9;
                    }
                    100% {
                        transform: translateY(105vh) rotate(360deg) translateX(-50px);
                        opacity: 0;
                    }
                }
                .confetti-piece-item {
                    position: absolute;
                    top: -20px;
                    border-radius: 3px;
                    opacity: 0;
                    animation: fall ease-out forwards;
                }
            `}} />
            {pieces.map(piece => (
                <div
                    key={piece.id}
                    className="confetti-piece-item"
                    style={piece.style}
                />
            ))}
        </div>
    )
}

export default Confetti
