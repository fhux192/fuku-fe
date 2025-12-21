import React, { useState, useMemo, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Grid, Database, Layers, ChevronDown, Volume2 } from 'lucide-react';
import styles from './KanaReference.module.css';

import hira_a_img from '../../assets/images/hiragana/a.png';
import hira_a_audio from '../../assets/voices/a.mp3';
import hira_i_img from '../../assets/images/hiragana/i.png';
import hira_i_audio from '../../assets/voices/i.mp3';
import hira_u_img from '../../assets/images/hiragana/u.png';
import hira_u_audio from '../../assets/voices/u.mp3';
import hira_e_img from '../../assets/images/hiragana/e.png';
import hira_e_audio from '../../assets/voices/e.mp3';
import hira_o_img from '../../assets/images/hiragana/o.png';
import hira_o_audio from '../../assets/voices/o.mp3';

const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.01,
            delayChildren: 0.03
        }
    },
    exit: {
        opacity: 0,
        transition: { staggerChildren: 0.02, staggerDirection: -1 }
    }
};

const cardVariants = {
    hidden: {
        y: 30,
        opacity: 0,
        scale: 0.6
    },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 320,
            damping: 14,
            mass: 0.8
        }
    }
};

const tabContentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 25
        }
    },
    exit: { opacity: 0, x: 20, transition: { duration: 0.15 } }
};

const KANA_DATA = {
    hiragana: {
        basic: [
            { char: 'あ', romaji: 'a', image: hira_a_img, audio: hira_a_audio },
            { char: 'い', romaji: 'i', image: hira_i_img, audio: hira_i_audio },
            { char: 'う', romaji: 'u', image: hira_u_img, audio: hira_u_audio },
            { char: 'え', romaji: 'e', image: hira_e_img, audio: hira_e_audio },
            { char: 'お', romaji: 'o', image: hira_o_img, audio: hira_o_audio },
            { char: 'か', romaji: 'ka' }, { char: 'き', romaji: 'ki' }, { char: 'く', romaji: 'ku' }, { char: 'け', romaji: 'ke' }, { char: 'こ', romaji: 'ko' },
            { char: 'さ', romaji: 'sa' }, { char: 'し', romaji: 'shi' }, { char: 'す', romaji: 'su' }, { char: 'せ', romaji: 'se' }, { char: 'そ', romaji: 'so' },
            { char: 'た', romaji: 'ta' }, { char: 'ち', romaji: 'chi' }, { char: 'つ', romaji: 'tsu' }, { char: 'て', romaji: 'te' }, { char: 'と', romaji: 'to' },
            { char: 'な', romaji: 'na' }, { char: 'に', romaji: 'ni' }, { char: 'ぬ', romaji: 'nu' }, { char: 'ね', romaji: 'ne' }, { char: 'の', romaji: 'no' },
            { char: 'は', romaji: 'ha' }, { char: 'ひ', romaji: 'hi' }, { char: 'ふ', romaji: 'fu' }, { char: 'へ', romaji: 'he' }, { char: 'ほ', romaji: 'ho' },
            { char: 'ま', romaji: 'ma' }, { char: 'み', romaji: 'mi' }, { char: 'む', romaji: 'mu' }, { char: 'め', romaji: 'me' }, { char: 'も', romaji: 'mo' },
            { char: 'や', romaji: 'ya' }, { char: null, romaji: '' }, { char: 'ゆ', romaji: 'yu' }, { char: null, romaji: '' }, { char: 'よ', romaji: 'yo' },
            { char: 'ら', romaji: 'ra' }, { char: 'り', romaji: 'ri' }, { char: 'る', romaji: 'ru' }, { char: 'れ', romaji: 're' }, { char: 'ろ', romaji: 'ro' },
            { char: 'わ', romaji: 'wa' }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: 'を', romaji: 'wo' },
            { char: 'ん', romaji: 'n' }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: null, romaji: '' },
        ],
        dakuten: [
            { char: 'が', romaji: 'ga' }, { char: 'ぎ', romaji: 'gi' }, { char: 'ぐ', romaji: 'gu' }, { char: 'げ', romaji: 'ge' }, { char: 'ご', romaji: 'go' },
            { char: 'ざ', romaji: 'za' }, { char: 'じ', romaji: 'ji' }, { char: 'ず', romaji: 'zu' }, { char: 'ぜ', romaji: 'ze' }, { char: 'ぞ', romaji: 'zo' },
            { char: 'だ', romaji: 'da' }, { char: 'ぢ', romaji: 'ji' }, { char: 'づ', romaji: 'zu' }, { char: 'で', romaji: 'de' }, { char: 'ど', romaji: 'do' },
            { char: 'ば', romaji: 'ba' }, { char: 'び', romaji: 'bi' }, { char: 'ぶ', romaji: 'bu' }, { char: 'べ', romaji: 'be' }, { char: 'ぼ', romaji: 'bo' },
            { char: 'ぱ', romaji: 'pa' }, { char: 'ぴ', romaji: 'pi' }, { char: 'ぷ', romaji: 'pu' }, { char: 'ぺ', romaji: 'pe' }, { char: 'ぽ', romaji: 'po' },
        ],
        // youon: [
        //     { char: 'きゃ', romaji: 'kya' }, { char: 'きゅ', romaji: 'kyu' }, { char: 'きょ', romaji: 'kyo' },
        //     { char: 'しゃ', romaji: 'sha' }, { char: 'しゅ', romaji: 'shu' }, { char: 'しょ', romaji: 'sho' },
        //     { char: 'ちゃ', romaji: 'cha' }, { char: 'ちゅ', romaji: 'chu' }, { char: 'ちょ', romaji: 'cho' },
        //     { char: 'にゃ', romaji: 'nya' }, { char: 'にゅ', romaji: 'nyu' }, { char: 'にょ', romaji: 'nyo' },
        //     { char: 'ひゃ', romaji: 'hya' }, { char: 'ひゅ', romaji: 'hyu' }, { char: 'ひょ', romaji: 'hyo' },
        //     { char: 'みゃ', romaji: 'mya' }, { char: 'みゅ', romaji: 'myu' }, { char: 'みょ', romaji: 'myo' },
        //     { char: 'りゃ', romaji: 'rya' }, { char: 'りゅ', romaji: 'ryu' }, { char: 'りょ', romaji: 'ryo' },
        //     { char: 'ぎゃ', romaji: 'gya' }, { char: 'ぎゅ', romaji: 'gyu' }, { char: 'ぎょ', romaji: 'gyo' },
        //     { char: 'じゃ', romaji: 'ja' }, { char: 'じゅ', romaji: 'ju' }, { char: 'じょ', romaji: 'jo' },
        //     { char: 'びゃ', romaji: 'bya' }, { char: 'びゅ', romaji: 'byu' }, { char: 'びょ', romaji: 'byo' },
        //     { char: 'ぴゃ', romaji: 'pya' }, { char: 'ぴゅ', romaji: 'pyu' }, { char: 'ぴょ', romaji: 'pyo' }
        // ]
    },
    katakana: {
        basic: [
            { char: 'ア', romaji: 'a' }, { char: 'イ', romaji: 'i' }, { char: 'ウ', romaji: 'u' }, { char: 'エ', romaji: 'e' }, { char: 'オ', romaji: 'o' },
            { char: 'カ', romaji: 'ka' }, { char: 'キ', romaji: 'ki' }, { char: 'ク', romaji: 'ku' }, { char: 'ケ', romaji: 'ke' }, { char: 'コ', romaji: 'ko' },
            { char: 'サ', romaji: 'sa' }, { char: 'シ', romaji: 'shi' }, { char: 'ス', romaji: 'su' }, { char: 'セ', romaji: 'se' }, { char: 'ソ', romaji: 'so' },
            { char: 'タ', romaji: 'ta' }, { char: 'チ', romaji: 'chi' }, { char: 'ツ', romaji: 'tsu' }, { char: 'テ', romaji: 'te' }, { char: 'ト', romaji: 'to' },
            { char: 'ナ', romaji: 'na' }, { char: 'ニ', romaji: 'ni' }, { char: 'ヌ', romaji: 'nu' }, { char: 'ネ', romaji: 'ne' }, { char: 'ノ', romaji: 'no' },
            { char: 'ハ', romaji: 'ha' }, { char: 'ヒ', romaji: 'hi' }, { char: 'フ', romaji: 'fu' }, { char: 'ヘ', romaji: 'he' }, { char: 'ホ', romaji: 'ho' },
            { char: 'マ', romaji: 'ma' }, { char: 'ミ', romaji: 'mi' }, { char: 'ム', romaji: 'mu' }, { char: 'メ', romaji: 'me' }, { char: 'モ', romaji: 'mo' },
            { char: 'ヤ', romaji: 'ya' }, { char: 'ユ', romaji: 'yu' }, { char: 'ヨ', romaji: 'yo' },
            { char: 'ラ', romaji: 'ra' }, { char: 'リ', romaji: 'ri' }, { char: 'ル', romaji: 'ru' }, { char: 'レ', romaji: 're' }, { char: 'ロ', romaji: 'ro' },
            { char: 'ワ', romaji: 'wa' }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: 'ヲ', romaji: 'wo' },
            { char: 'ン', romaji: 'n' }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: null, romaji: '' },
        ],
        dakuten: [
            { char: 'ガ', romaji: 'ga' }, { char: 'ギ', romaji: 'gi' }, { char: 'グ', romaji: 'gu' }, { char: 'ゲ', romaji: 'ge' }, { char: 'ゴ', romaji: 'go' },
            { char: 'ザ', romaji: 'za' }, { char: 'ジ', romaji: 'ji' }, { char: 'ズ', romaji: 'zu' }, { char: 'ゼ', romaji: 'ze' }, { char: 'ゾ', romaji: 'zo' },
            { char: 'ダ', romaji: 'da' }, { char: 'ヂ', romaji: 'ji' }, { char: 'ヅ', romaji: 'zu' }, { char: 'デ', romaji: 'de' }, { char: 'ド', romaji: 'do' },
            { char: 'バ', romaji: 'ba' }, { char: 'ビ', romaji: 'bi' }, { char: 'ブ', romaji: 'bu' }, { char: 'ベ', romaji: 'be' }, { char: 'ボ', romaji: 'bo' },
            { char: 'パ', romaji: 'pa' }, { char: 'ピ', romaji: 'pi' }, { char: 'プ', romaji: 'pu' }, { char: 'ペ', romaji: 'pe' }, { char: 'ポ', romaji: 'po' },
        ],
        // youon: [
        //     { char: 'キャ', romaji: 'kya' }, { char: 'キュ', romaji: 'kyu' }, { char: 'キョ', romaji: 'kyo' },
        //     { char: 'シャ', romaji: 'sha' }, { char: 'シュ', romaji: 'shu' }, { char: 'ショ', romaji: 'sho' },
        //     { char: 'チャ', romaji: 'cha' }, { char: 'チュ', romaji: 'chu' }, { char: 'チョ', romaji: 'cho' },
        //     { char: 'ニャ', romaji: 'nya' }, { char: 'ニュ', romaji: 'nyu' }, { char: 'ニョ', romaji: 'nyo' },
        //     { char: 'ヒャ', romaji: 'hya' }, { char: 'ヒュ', romaji: 'hyu' }, { char: 'ヒョ', romaji: 'hyo' },
        //     { char: 'ミャ', romaji: 'mya' }, { char: 'ミュ', romaji: 'myu' }, { char: 'ミョ', romaji: 'myo' },
        //     { char: 'リャ', romaji: 'rya' }, { char: 'リュ', romaji: 'ryu' }, { char: 'リョ', romaji: 'ryo' },
        //     { char: 'ギャ', romaji: 'gya' }, { char: 'ギュ', romaji: 'gyu' }, { char: 'ギョ', romaji: 'gyo' },
        //     { char: 'ジャ', romaji: 'ja' }, { char: 'ジュ', romaji: 'ju' }, { char: 'ジョ', romaji: 'jo' },
        //     { char: 'ビャ', romaji: 'bya' }, { char: 'ビュ', romaji: 'byu' }, { char: 'ビョ', romaji: 'byo' },
        //     { char: 'ピャ', romaji: 'pya' }, { char: 'ピュ', romaji: 'pyu' }, { char: 'ピョ', romaji: 'pyo' }
        // ]
    }
};

const KanaCard = memo(({ item, onClick }) => {
    return (
        <motion.div
            className={styles.kanaCard}
            onClick={onClick}
            variants={cardVariants}

            whileTap={{
                scale: 0.9,
                transition: { type: "spring", stiffness: 400, damping: 20 }
            }}
            style={{ cursor: 'pointer' }}
        >
            <span className={styles.cardChar}>{item.char}</span>
            <span className={styles.cardRomaji}>{item.romaji}</span>
        </motion.div>
    );
});

const KanaDetailModal = ({ item, onClose }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handlePlayAudio = (e) => {
        e.stopPropagation();
        if (isPlaying || !item.audio) return;

        const audio = new Audio(item.audio);
        setIsPlaying(true);
        audio.play().catch(() => setIsPlaying(false));
        audio.onended = () => setIsPlaying(false);
    };

    if (!item) return null;

    return (
        <motion.div
            className={styles.modalBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <div
                className={styles.modalPanel}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.mobileHandle} />

                <div className={styles.modalHeader}>
                    <span className={styles.modalTitle}>Chi tiết ký tự</span>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.heroContainer}>
                        {item.image ? (
                            <div className={styles.heroImageWrapper}>
                                <motion.img
                                    src={item.image}
                                    alt={item.char}
                                    className={styles.heroImage}
                                    initial={{ scale: 0.1, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                />
                            </div>
                        ) : (
                            <div className={styles.heroCharDisplay}>{item.char}</div>
                        )}
                    </div>

                    <div className={styles.romajiBadge}>
                        <span className={styles.romajiText}>{item.romaji}</span>
                        <span className={styles.romajiLabel}>Romaji</span>
                    </div>

                    <motion.div
                        className={`${styles.playerBtn} ${!item.audio ? styles.disabled : ''} ${isPlaying ? styles.playing : ''}`}
                        onClick={handlePlayAudio}
                        whileTap={{ scale: 0.95 }}
                        whileHover={item.audio ? { scale: 1.05 } : {}}
                    >
                        <div className={styles.playIconWrapper}>
                            {isPlaying ? <Volume2 size={16} /> : <Play size={16} fill="currentColor" style={{ marginLeft: 2 }} />}
                        </div>

                        <span className={styles.playLabel}>
                            {!item.audio ? "Không có âm thanh" : (isPlaying ? "Đang phát..." : "Phát âm mẫu")}
                        </span>

                        {isPlaying && (
                            <div className={styles.soundWave}>
                                <motion.div className={styles.bar} animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.3 }} />
                                <motion.div className={styles.bar} animate={{ height: [12, 6, 12] }} transition={{ repeat: Infinity, duration: 0.4, delay: 0.1 }} />
                                <motion.div className={styles.bar} animate={{ height: [16, 8, 16] }} transition={{ repeat: Infinity, duration: 0.35, delay: 0.2 }} />
                                <motion.div className={styles.bar} animate={{ height: [10, 18, 10] }} transition={{ repeat: Infinity, duration: 0.45, delay: 0.05 }} />
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

const KanaSection = memo(({ type, items, onSelect, isOpen, onToggle }) => {
    // const labels = { basic: "Âm cơ bản", dakuten: "Âm đục & Bán đục", youon: "Âm ghép" };
    const labels = { basic: "Âm cơ bản", dakuten: "Âm đục & Bán đục" };
    const icons = { basic: <Grid size={18} />, dakuten: <Database size={18} />, youon: <Layers size={18} /> };

    return (
        <div className={`${styles.sectionWrapper} ${isOpen ? styles.isOpen : ''}`}>
            <button className={styles.accordionHeader} onClick={onToggle}>
                <div className={styles.headerInfo}>
                    <span className={`${styles.iconBox} ${isOpen ? styles.iconActive : ''}`}>{icons[type]}</span>
                    <span className={styles.sectionLabel}>{labels[type]}</span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <ChevronDown size={20} color="#666" />
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className={styles.accordionContent}
                    >
                        <motion.div
                            className={`${styles.gridContainer} ${type === 'youon' ? styles.youonGrid : ''}`}
                            variants={gridContainerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {items.map((item, idx) => (
                                item && item.char ? (
                                    <KanaCard
                                        key={`${type}-${idx}-${item.char}`}
                                        item={item}
                                        onClick={() => onSelect(item)}
                                    />
                                ) : <div key={idx} className={styles.emptySlot} />
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

const KanaReference = () => {
    const [activeTab, setActiveTab] = useState('hiragana');
    const [selectedKana, setSelectedKana] = useState(null);
    const [openSections, setOpenSections] = useState({ basic: true, dakuten: false, youon: false });

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const data = useMemo(() => KANA_DATA[activeTab], [activeTab]);

    return (
        <div className={styles.pageContainer}>
            <div className={styles.contentWrapper}>
                <div className={styles.headerContainer}>
                    <div className={styles.tabContainer}>
                        {['hiragana', 'katakana'].map((tab) => (
                            <button
                                key={tab}
                                className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                {activeTab === tab && (
                                    <motion.div
                                        className={styles.activeIndicator}
                                        layoutId="tabUnderline"
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div
                    key={activeTab}
                    variants={tabContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={styles.accordionList}
                >
                    {/*{['basic', 'dakuten', 'youon'].map((section) => (*/}
                    {['basic', 'dakuten'].map((section) => (
                        <KanaSection
                            key={section}
                            type={section}
                            items={data[section]}
                            onSelect={setSelectedKana}
                            isOpen={openSections[section]}
                            onToggle={() => toggleSection(section)}
                        />
                    ))}
                </motion.div>
            </div>

            <AnimatePresence>
                {selectedKana && (
                    <KanaDetailModal
                        item={selectedKana}
                        onClose={() => setSelectedKana(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default KanaReference;