import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronLeft, ChevronRight, Boxes, Layers, Shirt } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import CategoryManage from './Category/CategoryManage'



function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const activeTab = queryParams.get("tab") || "dashboard";

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false)


    const navigation = [
        { name: 'Category Record', href: '#/client/dashboard?tab=category', icon: Boxes, current: activeTab === "category" },
        { name: 'Type Record', href: '#/client/dashboard?tab=types', icon: Layers, current: activeTab === "types" },
        { name: 'Cloth Record', href: '#/client/dashboard?tab=cloth', icon: Shirt, current: activeTab === "cloth" },

    ];

    const sidebarVariants = {
        open: {
            x: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        },
        closed: {
            x: "-100%",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        }
    }

    const overlayVariants = {
        open: {
            opacity: 1,
            transition: {
                duration: 0.3
            }
        },
        closed: {
            opacity: 0,
            transition: {
                duration: 0.3
            }
        }
    }

    const desktopSidebarVariants = {
        expanded: {
            width: 288, // w-72 = 18rem = 288px
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        },
        collapsed: {
            width: 80, // w-20 = 5rem = 80px
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        }
    }

    const mainContentVariants = {
        expanded: {
            marginLeft: 288,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        },
        collapsed: {
            marginLeft: 80,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        }
    }

    const textVariants = {
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.2,
                delay: 0.1
            }
        },
        hidden: {
            opacity: 0,
            scale: 0.8,
            transition: {
                duration: 0.2
            }
        }
    }

    const renderContent = () => {
        switch (activeTab) {
            case "category":
                return <CategoryManage />;
            case "types":
                return <div>Type Overview</div>;
            case "cloth":
                return <div>Cloth Overview</div>;
            default:
                return <div>Category Overview</div>;
        }
    };

    return (
        <>
            <div>
                {/* Mobile sidebar overlay */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <>
                            <motion.div
                                initial="closed"
                                animate="open"
                                exit="closed"
                                variants={overlayVariants}
                                className="fixed inset-0 bg-gray-900/80 z-40 lg:hidden"
                                onClick={() => setSidebarOpen(false)}
                            />

                            <motion.div
                                initial="closed"
                                animate="open"
                                exit="closed"
                                variants={sidebarVariants}
                                className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
                            >
                                <div className="flex h-full flex-col bg-[#2d1810] shadow-xl">
                                    {/* Close button */}
                                    <div className="flex items-center justify-between p-4">
                                        <img
                                            alt="Your Company"
                                            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                                            className="h-8 w-auto"
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setSidebarOpen(false)}
                                            className="rounded-md p-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                        >
                                            <X className="h-6 w-6" />
                                        </motion.button>
                                    </div>

                                    {/* Navigation */}
                                    <nav className="flex-1 px-4 pb-4">
                                        <ul className="space-y-2">
                                            {navigation.map((item, index) => (
                                                <motion.li
                                                    key={item.name}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{
                                                        opacity: 1,
                                                        x: 0,
                                                        transition: { delay: index * 0.1 }
                                                    }}
                                                >
                                                    <a
                                                        href={item.href}
                                                        className={classNames(
                                                            item.current
                                                                ? 'bg-gray-700 text-white'
                                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                            'group flex items-center gap-x-3 rounded-md p-3 text-sm font-semibold transition-colors'
                                                        )}
                                                    >
                                                        <item.icon className="h-5 w-5 shrink-0" />
                                                        {item.name}
                                                    </a>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </nav>

                                    {/* User profile */}
                                    <div className="border-t border-gray-700 p-4">
                                        <a
                                            href="#/sa/login"
                                            className="flex items-center gap-x-3 rounded-md p-3 text-sm font-semibold text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                        >
                                            <img
                                                alt="Profile"
                                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                className="h-8 w-8 rounded-full"
                                            />
                                            <span>Tom Cook</span>
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Desktop sidebar */}
                <motion.div
                    variants={desktopSidebarVariants}
                    animate={desktopSidebarCollapsed ? "collapsed" : "expanded"}
                    className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col bg-[#2d1810] overflow-hidden"
                >
                    <div className="flex grow flex-col gap-y-5 px-6 pb-4">
                        {/* Header with toggle button */}
                        <div className="flex h-16 shrink-0 items-center justify-between">
                            <AnimatePresence mode="wait">
                                {!desktopSidebarCollapsed && (
                                    <motion.img
                                        key="logo"
                                        variants={textVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        alt="Your Company"
                                        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                                        className="h-8 w-auto"
                                    />
                                )}
                            </AnimatePresence>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setDesktopSidebarCollapsed(!desktopSidebarCollapsed)}
                                className={classNames(
                                    "rounded-md p-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors",
                                    desktopSidebarCollapsed ? "mx-auto" : ""
                                )}
                            >
                                {desktopSidebarCollapsed ? (
                                    <ChevronRight className="h-5 w-5" />
                                ) : (
                                    <ChevronLeft className="h-5 w-5" />
                                )}
                            </motion.button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex flex-1 flex-col">
                            <ul className="flex flex-1 flex-col gap-y-7">
                                <li>
                                    <ul className={classNames(
                                        "space-y-1",
                                        desktopSidebarCollapsed ? "mx-0" : "-mx-2"
                                    )}>
                                        {navigation.map((item) => (
                                            <li key={item.name}>
                                                <motion.a
                                                    href={item.href}
                                                    whileHover={{ scale: 1.02 }}
                                                    className={classNames(
                                                        item.current
                                                            ? 'bg-gray-700 text-white'
                                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold transition-colors',
                                                        desktopSidebarCollapsed ? 'justify-center' : ''
                                                    )}
                                                    title={desktopSidebarCollapsed ? item.name : undefined}
                                                >
                                                    <item.icon className="h-6 w-6 shrink-0" />
                                                    <AnimatePresence mode="wait">
                                                        {!desktopSidebarCollapsed && (
                                                            <motion.span
                                                                variants={textVariants}
                                                                initial="hidden"
                                                                animate="visible"
                                                                exit="hidden"
                                                            >
                                                                {item.name}
                                                            </motion.span>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>

                                {/* User profile */}
                                <li className={classNames(
                                    "mt-auto",
                                    desktopSidebarCollapsed ? "mx-0" : "-mx-6"
                                )}>
                                    <motion.a
                                        href="#/sa/login"
                                        whileHover={{ scale: 1.02 }}
                                        className={classNames(
                                            "flex items-center gap-x-4 py-3 text-sm font-semibold text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded-md",
                                            desktopSidebarCollapsed ? "justify-center " : "px-6"
                                        )}
                                        title={desktopSidebarCollapsed ? "Tom Cook" : undefined}
                                    >
                                        <img
                                            alt="Profile"
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                            className="h-8 w-8 rounded-full"
                                        />
                                        <AnimatePresence mode="wait">
                                            {!desktopSidebarCollapsed && (
                                                <motion.span
                                                    variants={textVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="hidden"
                                                >
                                                    Tom Cook
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </motion.a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </motion.div>

                {/* Mobile header */}
                <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-[#2d1810] px-4 py-4 shadow-sm sm:px-6 lg:hidden">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="rounded-md p-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                        <Menu className="h-6 w-6" />
                    </motion.button>

                    <div className="flex-1 text-sm font-semibold text-white">
                        Dashboard
                    </div>

                    <a href="/sa/login" className="rounded-full">
                        <img
                            alt="Profile"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            className="h-8 w-8 rounded-full"
                        />
                    </a>
                </div>

                {/* Main content */}
                <motion.main
                    variants={mainContentVariants}
                    className={`transition-all duration-300 ease-in-out ${!desktopSidebarCollapsed ? "lg:pl-72" : "lg:pl-0"
                        }`}>
                    {renderContent()}
                </motion.main>

            </div>
        </>
    )
}