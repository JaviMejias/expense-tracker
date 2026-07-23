import { motion } from 'framer-motion'

const pageVariants = {
    initial: {
        opacity: 0,
        x: 25,
    },
    in: {
        opacity: 1,
        x: 0,
    },
    out: {
        opacity: 0,
        x: -25,
    }
}

const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.25
}

function PageTransition({ children }) {
    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="w-full h-full"
        >
            {children}
        </motion.div>
    )
}

export default PageTransition
