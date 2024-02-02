"use client"

import { useEffect, useContext } from "react"
import { motion, useMotionValue} from "framer-motion"
import { CursorContext } from "@/providers/CursorProvider"

export default function CustomCursor() {

    const cursorState = useContext(CursorContext)
    const cursorType = cursorState[0]

    const WIDTH = 8
    const cursorX = useMotionValue(-100)
    const cursorY = useMotionValue(-100)

    useEffect(() => {
        const moveCursor = (e: any) => {
            cursorX.set(e.clientX - WIDTH)
            cursorY.set(e.clientY - WIDTH)
        }
        window.addEventListener('mousemove', moveCursor)
        return () => {
            window.removeEventListener('mousemove', moveCursor)
        }
    }, [cursorX, cursorY])


    const hoverVariants = {
        hovered: {
            scale: 16,
            transition: {
                duration: 0.2,
                ease: 'easeInOut',
            },
            opacity: 1,
            mixBlendMode: 'difference',
            background: 'white'
        },
        default: {
            scale: 2,
            border: '4px solid rgb(0, 109, 189)',
            transition: {
                duration: 0.2,
                ease: 'easeInOut',
            },
            opacity: 1,
        },
    }

    return (
        <motion.div
            variants={hoverVariants as any}
            animate={cursorType}
            className="sm:block hidden fixed left-0 top-0 w-4 h-4 border-[4px] rounded-full pointer-events-none z-50"
            style={{
                translateX: cursorX,
                translateY: cursorY,
            }}>

        </motion.div>
    )
}