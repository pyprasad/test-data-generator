import { motion } from "framer-motion";

export default function HeroSection() {
    return (
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white py-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-2xl mx-auto"
            >
                <h1 className="text-5xl font-extrabold mb-4">
                    Generate Test Data Instantly
                </h1>
                <p className="text-lg mb-6">
                    AI-powered datasets for Positive, Negative, and Edge Cases. No code. No headache.
                </p>
                <a href="#fields" className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-full font-semibold hover:scale-105 transition-all duration-300">
                    Start Building
                </a>

            </motion.div>
        </div>
    );
}
