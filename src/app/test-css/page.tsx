'use client';

export default function TestCSSPage() {
    return (
        <div className="fixed inset-0 bg-red-500 flex items-center justify-center">
            <div className="bg-white p-10 rounded-3xl shadow-2xl transform hover:scale-110 transition-transform">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">CSS Test</h1>
                <p className="text-lg text-slate-600">If you see a red background and this is centered, Tailwind is working.</p>
                <button className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    Example Button
                </button>
            </div>
        </div>
    );
}
