'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Gift, Sparkles, Send, AlertCircle } from 'lucide-react';

type ScreenState = 'loading' | 'played' | 'hook' | 'shake' | 'quiz' | 'reward' | 'form' | 'success';

const SCRIPT_URL = 'LINK_CỦA_TÔI'; // Thay bằng link Google Apps Script của bạn

const BANKS = [
    'Vietcombank', 'Techcombank', 'MBBank', 'VPBank', 'ACB', 'BIDV', 'VietinBank', 'Agribank', 'TPBank', 'Sacombank', 'Khác'
];

const QUESTIONS = [
    {
        question: 'Theo bạn, vẻ bề ngoài của Lê Văn Phú Thịnh trông thế nào?',
        answers: [
            { text: 'A. Đẹp trai', score: 30 },
            { text: 'B. Chấm 7/10', score: 15 },
            { text: 'C. Xấu điên', score: 5 },
        ]
    },
    {
        question: 'Lê Văn Phú Thịnh mượn tiền thì bạn có sẵn sàng không?',
        answers: [
            { text: 'A. Cần bao nhiêu cho mượn bấy nhiêu', score: 30 },
            { text: 'B. Cò kè bớt một thêm hai', score: 15 },
            { text: 'C. Chặn block', score: 5 },
        ]
    },
    {
        question: 'Tật xấu lớn nhất của Lê Văn Phú Thịnh là gì?',
        answers: [
            { text: 'A. Quá hoàn hảo', score: 10 },
            { text: 'B. Hay ngủ nướng/ra dẻ', score: 40 },
            { text: 'C. Ăn nhiều mập mạp', score: 20 },
        ]
    }
];

export default function LixiGame() {
    const [screen, setScreen] = useState<ScreenState>('loading');
    const [deviceId, setDeviceId] = useState('');
    const [shaken, setShaken] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);

    // Form state
    const [name, setName] = useState('');
    const [account, setAccount] = useState('');
    const [bank, setBank] = useState(BANKS[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const checkPlayed = () => {
            const played = localStorage.getItem('hasPlayed');
            if (played === 'true') {
                setScreen('played');
            } else {
                let id = localStorage.getItem('deviceId');
                if (!id) {
                    id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
                    localStorage.setItem('deviceId', id);
                }
                setDeviceId(id);
                setScreen('hook');
            }
        };
        checkPlayed();
    }, []);

    const requestMotionPermission = async () => {
        if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
            try {
                const permissionState = await (DeviceMotionEvent as any).requestPermission();
                if (permissionState === 'granted') {
                    setScreen('shake');
                } else {
                    alert('Cần cấp quyền cảm biến để chơi game lắc xì!');
                    setScreen('shake');
                }
            } catch (error) {
                console.error(error);
                setScreen('shake');
            }
        } else {
            setScreen('shake');
        }
    };

    const triggerFall = useCallback(() => {
        if (shaken) return;
        setShaken(true);
        setTimeout(() => {
            setScreen('quiz');
        }, 1500);
    }, [shaken]);

    useEffect(() => {
        if (screen !== 'shake') return;

        const handleMotion = (event: DeviceMotionEvent) => {
            const { accelerationIncludingGravity } = event;
            if (!accelerationIncludingGravity) return;
            const { x, y, z } = accelerationIncludingGravity;
            const acceleration = Math.sqrt((x || 0) ** 2 + (y || 0) ** 2 + (z || 0) ** 2);

            if (acceleration > 18 && !shaken) {
                triggerFall();
            }
        };

        window.addEventListener('devicemotion', handleMotion);
        return () => window.removeEventListener('devicemotion', handleMotion);
    }, [screen, shaken, triggerFall]);

    const handleAnswer = (points: number) => {
        setScore(prev => prev + points);
        if (currentQuestion < QUESTIONS.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            setScreen('reward');
            setTimeout(() => {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#FFD700', '#FF0000', '#FFA500']
                });
            }, 500);
        }
    };

    const rewardAmount = score >= 80 ? 10000 : 5000;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !account || !bank) return;

        setIsSubmitting(true);
        try {
            const payload = {
                deviceId,
                accountName: name,
                accountNumber: account,
                bankName: bank,
                amount: rewardAmount,
            };

            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            localStorage.setItem('hasPlayed', 'true');
            setScreen('success');
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (screen === 'loading') {
        return <div className="min-h-screen bg-red-600 flex items-center justify-center text-yellow-400 font-bold text-xl">Đang tải...</div>;
    }

    if (screen === 'played') {
        return (
            <div className="min-h-screen bg-red-600 flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-yellow-100 p-8 rounded-2xl shadow-2xl max-w-sm w-full border-4 border-yellow-400"
                >
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Tham lam quá nha!</h2>
                    <p className="text-red-800 font-medium">Lì xì nhận 1 lần thôi. Chúc mừng năm mới!</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-red-600 overflow-hidden relative font-sans selection:bg-yellow-400 selection:text-red-900">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-32 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>

            <AnimatePresence mode="wait">

                {/* SCREEN 1: HOOK */}
                {screen === 'hook' && (
                    <motion.div
                        key="hook"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, rotateY: 90 }}
                        transition={{ duration: 0.5 }}
                        className="min-h-screen flex flex-col items-center justify-center p-6"
                    >
                        <div className="bg-gradient-to-b from-red-500 to-red-700 p-8 rounded-3xl shadow-2xl border-4 border-yellow-400 max-w-sm w-full text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4 animate-pulse" />
                            <h1 className="text-3xl font-black text-yellow-400 mb-2 tracking-tight drop-shadow-md">
                                LÌ XÌ TẾT <br /> BÍNH NGỌ
                            </h1>
                            <p className="text-yellow-100 mb-8 font-medium">Nhận lộc đầu năm cùng Lê Văn Phú Thịnh!</p>

                            <button
                                onClick={requestMotionPermission}
                                className="relative z-10 bg-yellow-400 hover:bg-yellow-300 text-red-700 font-bold text-xl py-4 px-8 rounded-full shadow-[0_6px_0_#b45309] active:shadow-[0_0px_0_#b45309] active:translate-y-[6px] transition-all w-full flex items-center justify-center gap-2"
                            >
                                <Gift className="w-6 h-6" />
                                MỞ THIỆP NGAY
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* MÀN HÌNH 2: LẮC ĐIỆN THOẠI - CÀNH MAI TREO BAO LÌ XÌ */}
                {screen === 'shake' && (
                    <motion.div
                        key="shake"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
                        style={{ background: 'linear-gradient(180deg, #1a0a00 0%, #3d0c00 25%, #6b1a0a 50%, #8b2010 75%, #4a0e00 100%)' }}
                        onClick={() => !shaken && triggerFall()}
                    >
                        {/* Hiệu ứng nền trang trí - ánh sáng vàng lung linh */}
                        <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-500/15 rounded-full blur-[100px] pointer-events-none"></div>
                        <div className="absolute bottom-20 left-10 w-56 h-56 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-400/8 rounded-full blur-[120px] pointer-events-none"></div>

                        <h2 className="text-2xl font-bold text-yellow-400 text-center mb-6 z-10 drop-shadow-md px-4">
                            Hãy lắc mạnh điện thoại để bao lì xì rơi xuống!
                        </h2>

                        {/* Cành mai + bao lì xì treo */}
                        <div className="relative z-10 w-full max-w-sm" style={{ height: '420px' }}>
                            {/* Ảnh cành mai */}
                            <img
                                src="/c%C3%A0nh%20mai.png"
                                alt="Cành mai vàng"
                                className="w-full h-auto absolute top-0 left-0 z-20 pointer-events-none drop-shadow-lg"
                                style={{ maxHeight: '220px', objectFit: 'contain' }}
                            />

                            {/* 3 bao lì xì treo từ cành mai */}
                            {[0, 1, 2].map((i) => {
                                const positions = [
                                    { left: '18%', top: '120px', delay: 0 },
                                    { left: '48%', top: '100px', delay: 0.3 },
                                    { left: '75%', top: '130px', delay: 0.6 },
                                ];
                                const pos = positions[i];
                                const isFalling = shaken && i === 1;

                                return (
                                    <div key={i} className="absolute z-10" style={{ left: pos.left, top: pos.top }}>
                                        {/* Dây treo */}
                                        {!isFalling && (
                                            <div className="w-[2px] h-8 bg-yellow-600/70 mx-auto"></div>
                                        )}
                                        {/* Bao lì xì */}
                                        <motion.div
                                            animate={isFalling ? {
                                                y: [0, 20, 400],
                                                rotate: [0, -15, 25, -10, 45],
                                                opacity: [1, 1, 0],
                                                scale: [1, 1.1, 0.8],
                                            } : {
                                                rotate: [-3, 3, -3],
                                                y: [0, 4, 0],
                                            }}
                                            transition={isFalling ? {
                                                duration: 1.2,
                                                ease: 'easeIn',
                                            } : {
                                                repeat: Infinity,
                                                duration: 2.5 + i * 0.3,
                                                ease: 'easeInOut',
                                                delay: pos.delay,
                                            }}
                                            style={{ transformOrigin: 'top center' }}
                                        >
                                            <img
                                                src="/bao%20l%C3%AC%20xi.png"
                                                alt="Bao lì xì"
                                                className="w-16 h-auto drop-shadow-xl cursor-pointer"
                                                style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
                                            />
                                        </motion.div>
                                    </div>
                                );
                            })}
                        </div>

                        {!shaken && (
                            <button
                                onClick={(e) => { e.stopPropagation(); triggerFall(); }}
                                className="mt-4 text-yellow-200/60 underline text-sm z-10"
                            >
                                Lắc không được? Nhấn vào đây!
                            </button>
                        )}
                    </motion.div>
                )}

                {/* MÀN HÌNH 3: CÂU HỎI QUIZ - MỞ NIÊM PHONG BAO LÌ XÌ */}
                {screen === 'quiz' && (
                    <motion.div
                        key="quiz"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="min-h-screen flex flex-col items-center justify-center p-4"
                    >
                        <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-md w-full border-4 border-yellow-400 relative">
                            {/* Huy hiệu số câu hỏi */}
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 text-red-700 font-bold px-6 py-2 rounded-full shadow-md border-2 border-white">
                                Câu {currentQuestion + 1} / {QUESTIONS.length}
                            </div>

                            {/* Tiêu đề popup câu hỏi */}
                            <div className="mt-6 mb-4 text-center">
                                <p className="text-red-600 font-bold text-lg leading-snug">
                                    🔓 Trả lời câu hỏi để mở niêm phong bao lì xì
                                </p>
                                <div className="w-16 h-1 bg-yellow-400 rounded-full mx-auto mt-2"></div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center leading-relaxed">
                                {QUESTIONS[currentQuestion].question}
                            </h3>

                            <div className="space-y-3">
                                {QUESTIONS[currentQuestion].answers.map((answer, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(answer.score)}
                                        className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 transition-colors font-medium text-gray-700 active:scale-[0.98]"
                                    >
                                        {answer.text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* MÀN HÌNH 4: THƯỞNG - LỜI CHÚC + ẢNH TIỀN THẬT */}
                {screen === 'reward' && (
                    <motion.div
                        key="reward"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="min-h-screen flex flex-col items-center justify-center p-6"
                    >
                        {/* Lời chúc Tết */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-center mb-8"
                        >
                            <h2 className="text-3xl font-black text-yellow-400 mb-3 drop-shadow-md">
                                🎊 Chúc Mừng Năm Mới! 🎊
                            </h2>
                            <p className="text-yellow-100 text-lg font-medium leading-relaxed">
                                Phát Tài Phát Lộc, Vạn Sự Như Ý!<br />
                                An Khang Thịnh Vượng, Sức Khỏe Dồi Dào!
                            </p>
                        </motion.div>

                        {/* Phong bao lì xì nằm ngang + tờ tiền trồi ra */}
                        <div className="relative mb-10" style={{ width: '340px', height: '200px' }}>
                            {/* Mặt sau bao lì xì - nền đỏ đậm */}
                            <div className="absolute inset-0 bg-red-800 rounded-xl border-2 border-yellow-600 shadow-2xl"></div>

                            {/* Tờ tiền trượt ra bên phải - NẰM TRÊN tam giác đỏ */}
                            <motion.div
                                initial={{ x: 0 }}
                                animate={{ x: 100 }}
                                transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                                className="absolute top-3 bottom-3 rounded-lg overflow-hidden shadow-lg z-30 bg-white"
                                style={{ left: '40%', right: '12px', minWidth: '180px' }}
                            >
                                <img
                                    src={rewardAmount >= 10000 ? '/10000.png' : '/5000.png'}
                                    alt={`${rewardAmount.toLocaleString('vi-VN')}đ`}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>

                            {/* Mặt trước bao lì xì (phần phải - che tiền ban đầu) */}
                            <div className="absolute top-0 bottom-0 right-0 w-3/4 bg-red-600 rounded-r-xl shadow-[4px_0_10px_rgba(0,0,0,0.2)] flex items-center justify-center z-20 overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full">
                                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                        <polygon points="0,0 0,100 50,50" fill="#dc2626" />
                                        <polygon points="0,0 100,0 100,100 0,100" fill="#dc2626" />
                                        <polyline points="0,0 50,50 0,100" fill="none" stroke="#b91c1c" strokeWidth="2" />
                                    </svg>
                                </div>
                                <div className="w-14 h-14 border-2 border-yellow-400 rounded-full flex items-center justify-center bg-red-700 z-10 shadow-md">
                                    <span className="text-yellow-400 font-bold text-lg">Tết</span>
                                </div>
                            </div>

                            {/* Nắp bao mở ra (bên trái) */}
                            <motion.div
                                initial={{ rotateY: 0 }}
                                animate={{ rotateY: -180 }}
                                transition={{ duration: 0.6 }}
                                style={{ transformOrigin: 'left' }}
                                className="absolute top-0 bottom-0 left-0 w-1/4 z-40"
                            >
                                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-red-500 drop-shadow-md">
                                    <polygon points="0,0 0,100 100,50" fill="currentColor" />
                                </svg>
                            </motion.div>
                        </div>

                        <button
                            onClick={() => setScreen('form')}
                            className="bg-yellow-400 hover:bg-yellow-300 text-red-700 font-bold text-xl py-4 px-8 rounded-full shadow-[0_6px_0_#b45309] active:shadow-[0_0px_0_#b45309] active:translate-y-[6px] transition-all w-full max-w-xs"
                        >
                            NHẬN LÌ XÌ
                        </button>
                    </motion.div>
                )}

                {/* SCREEN 5: FORM */}
                {screen === 'form' && (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="min-h-screen flex flex-col items-center justify-center p-4"
                    >
                        <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-md w-full border-4 border-yellow-400">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-red-600">Thông Tin Nhận Thưởng</h2>
                                <p className="text-gray-500 text-sm mt-1">Phần thưởng: <strong className="text-green-600 text-lg">{rewardAmount.toLocaleString('vi-VN')}đ</strong></p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Tên chủ tài khoản</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={e => setName(e.target.value.toUpperCase())}
                                        placeholder="NGUYEN VAN A"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-0 outline-none transition-colors uppercase"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Số tài khoản</label>
                                    <input
                                        type="text"
                                        required
                                        value={account}
                                        onChange={e => setAccount(e.target.value.replace(/\D/g, ''))}
                                        placeholder="123456789"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-0 outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Ngân hàng</label>
                                    <select
                                        value={bank}
                                        onChange={e => setBank(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-0 outline-none transition-colors bg-white"
                                    >
                                        {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-70"
                                >
                                    {isSubmitting ? 'Đang gửi...' : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            GỬI YÊU CẦU
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}

                {/* SCREEN 6: SUCCESS */}
                {screen === 'success' && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
                    >
                        <div className="bg-yellow-100 p-8 rounded-3xl shadow-2xl max-w-sm w-full border-4 border-yellow-400">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-red-600 mb-2">Gửi thành công!</h2>
                            <p className="text-gray-700 font-medium mb-6">
                                Chờ xíu nha, Thịnh sẽ chuyển khoản lì xì cho bạn sớm thôi! Chúc bạn năm mới vui vẻ!
                            </p>
                            <div className="text-sm text-gray-500 border-t border-gray-200 pt-4">
                                Mã thiết bị: <span className="font-mono">{deviceId.substring(0, 8)}</span>
                            </div>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}
