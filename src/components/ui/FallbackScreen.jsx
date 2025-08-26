import { motion } from "framer-motion";
import { ShoppingBag, RefreshCw } from "lucide-react";

export default function FallbackScreen({
    title = "No Items Available",
    subtitle = "We couldn't find any items at the moment",
    icon: Icon = ShoppingBag,
    actionText = "Try Again",
    onAction = null,
    theme = "amber",
    showAction = true
}) {
    const themeClasses = {
        amber: {
            gradient: "from-[#f3ecd2] via-[#f8f3e8] to-[#e6d7b8]",
            card: "bg-white/80 border-amber-200",
            icon: "text-amber-600",
            button: "bg-amber-500 hover:bg-amber-600 text-white",
            text: "text-amber-900",
            subtitle: "text-amber-700"
        },
        blue: {
            gradient: "from-blue-50 via-blue-100 to-blue-200",
            card: "bg-white/80 border-blue-200",
            icon: "text-blue-600",
            button: "bg-blue-500 hover:bg-blue-600 text-white",
            text: "text-blue-900",
            subtitle: "text-blue-700"
        },
        green: {
            gradient: "from-green-50 via-green-100 to-green-200",
            card: "bg-white/80 border-green-200",
            icon: "text-green-600",
            button: "bg-green-500 hover:bg-green-600 text-white",
            text: "text-green-900",
            subtitle: "text-green-700"
        }
    };

    const currentTheme = themeClasses[theme] || themeClasses.amber;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className={`min-h-[60vh] flex items-center justify-center px-4`}
        >
            <div className={`max-w-md w-full text-center p-8 rounded-2xl shadow-lg backdrop-blur-sm border ${currentTheme.card}`}>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                    }}
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-opacity-20 bg-current mb-6 ${currentTheme.icon}`}
                >
                    <Icon size={40} />
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`text-2xl font-bold mb-3 ${currentTheme.text}`}
                >
                    {title}
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className={`text-lg mb-6 leading-relaxed ${currentTheme.subtitle}`}
                >
                    {subtitle}
                </motion.p>

                {showAction && onAction && (
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        onClick={onAction}
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md ${currentTheme.button}`}
                    >
                        <RefreshCw size={18} />
                        {actionText}
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}