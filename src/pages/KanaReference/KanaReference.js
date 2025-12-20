import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Grid, Database } from 'lucide-react';
import styles from './KanaReference.module.css';

const KANA_DATA = {
    hiragana: {
        basic: [
            { char: 'あ', romaji: 'a' }, { char: 'い', romaji: 'i' }, { char: 'う', romaji: 'u' }, { char: 'え', romaji: 'e' }, { char: 'お', romaji: 'o' },
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
        ]
    },
    katakana: {
        basic: [
            { char: 'ア', romaji: 'a' }, { char: 'イ', romaji: 'i' }, { char: 'ウ', romaji: 'u' }, { char: 'エ', romaji: 'e' }, { char: 'オ', romaji: 'o' },
            { char: 'カ', romaji: 'ka' }, { char: 'キ', romaji: 'ki' }, { char: 'ク', romaji: 'ku' }, { char: 'ケ', romaji: 'ke' }, { char: 'コ', romaji: 'ko' },
            { char: 'サ', romaji: 'sa' }, { char: 'シ', romaji: 'shi' }, { char: 'ス', romaji: 'su' }, { char: 'セ', romaji: 'se' }, { char: 'ソ', romaji: 'so' },
            { char: 'タ', romaji: 'ta' }, { char: 'チ', romaji: 'chi' }, { char: 'ツ', romaji: 'tsu' }, { char: 'テ', romaji: 'te' }, { char: 'ト', romaji: 'to' },
            { char: 'ナ', romaji: 'na' }, { char: 'ニ', romaji: 'ni' }, { char: 'ヌ', romaji: 'nu' }, { char: 'ネ', romaji: 'no' }, { char: 'ノ', romaji: 'no' },
            { char: 'ハ', romaji: 'ha' }, { char: 'ヒ', romaji: 'hi' }, { char: 'フ', romaji: 'fu' }, { char: 'ヘ', romaji: 'he' }, { char: 'ホ', romaji: 'ho' },
            { char: 'マ', romaji: 'ma' }, { char: 'ミ', romaji: 'mi' }, { char: 'ム', romaji: 'mu' }, { char: 'メ', romaji: 'me' }, { char: 'モ', romaji: 'mo' },
            { char: 'ヤ', romaji: 'ya' }, { char: null, romaji: '' }, { char: 'ユ', romaji: 'yu' }, { char: null, romaji: '' }, { char: 'ヨ', romaji: 'yo' },
            { char: 'ラ', romaji: 'ra' }, { char: 'リ', romaji: 'ri' }, { char: 'ル', romaji: 'ru' }, { char: 'レ', romaji: 're' }, { char: 'ロ', romaji: 'ro' },
            { char: 'ワ', romaji: 'wa' }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: 'ヲ', romaji: 'wo' },
            { char: 'ン', romaji: 'n' }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: null, romaji: '' },
        ],
        dakuten: [
            { char: 'ガ', romaji: 'ga' }, { char: 'ギ', romaji: 'gi' }, { char: 'グ', romaji: 'gu' }, { char: 'ゲ', romaji: 'ge' }, { char: 'ゴ', romaji: 'go' },
            { char: 'ザ', romaji: 'za' }, { char: 'ジ', romaji: 'ji' }, { char: 'ズ', romaji: 'zu' }, { char: 'ぜ', romaji: 'ze' }, { char: 'ぞ', romaji: 'zo' },
            { char: 'だ', romaji: 'da' }, { char: 'ヂ', romaji: 'ji' }, { char: 'ヅ', romaji: 'zu' }, { char: 'デ', romaji: 'de' }, { char: 'ド', romaji: 'do' },
            { char: 'バ', romaji: 'ba' }, { char: 'ビ', romaji: 'bi' }, { char: 'ブ', romaji: 'bu' }, { char: 'べ', romaji: 'be' }, { char: 'ボ', romaji: 'bo' },
            { char: 'パ', romaji: 'pa' }, { char: 'ピ', romaji: 'pi' }, { char: 'プ', romaji: 'pu' }, { char: 'ペ', romaji: 'pe' }, { char: 'ポ', romaji: 'po' },
        ]
    }
};

const KanaDetailModal = ({ item, onClose }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayAudio = (e) => {
        e.stopPropagation();
        if (isPlaying) return;

        const audioPath = `/${item.romaji}.mp3`;
        const audio = new Audio(audioPath);

        setIsPlaying(true);
        audio.play().catch(error => {
            console.error("Audio missing:", audioPath);
            setIsPlaying(false);
        });

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
            <motion.div
                className={styles.modalPanel}
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
            >
                <div className={styles.modalHeader}>
                    <span className={styles.modalTitle}>Chi tiết ký tự</span>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.largeDisplay}>
                        <div className={styles.displayChar}>{item.char}</div>
                        <div className={styles.displayRomaji}>{item.romaji}</div>
                    </div>

                    <div
                        className={styles.playerControl}
                        onClick={handlePlayAudio}
                    >
                        {isPlaying ? (
                            <div className={styles.soundWave}>
                                <motion.div className={styles.bar} animate={{ height: [8, 16, 6] }} transition={{ repeat: Infinity, duration: 0.2 }} />
                                <motion.div className={styles.bar} animate={{ height: [12, 6, 14] }} transition={{ repeat: Infinity, duration: 0.3 }} />
                                <motion.div className={styles.bar} animate={{ height: [6, 14, 8] }} transition={{ repeat: Infinity, duration: 0.25 }} />
                                <motion.div className={styles.bar} animate={{ height: [16, 8, 12] }} transition={{ repeat: Infinity, duration: 0.35 }} />
                            </div>
                        ) : (
                            <Play size={20} className={styles.playIcon} fill="#95D600" />
                        )}

                        <span className={styles.playText}>
                            {isPlaying ? "Đang phát..." : "Nghe phát âm"}
                        </span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const KanaCard = React.memo(({ item, onClick, index }) => {
    if (!item || !item.char) return <div className={styles.emptySlot}></div>;

    return (
        <motion.div
            className={styles.kanaCard}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.01 }}
            onClick={() => onClick(item)}
        >
            <span className={styles.cardChar}>{item.char}</span>
            <span className={styles.cardRomaji}>{item.romaji}</span>
        </motion.div>
    );
});

const KanaSection = ({ label, items, onSelect }) => {
    const getLabelVi = (label) => {
        if (label === "Basic (Gojūon)") return "Âm cơ bản";
        if (label === "Dakuten & Handakuten") return "Âm đục & Bán đục";
        return label;
    };

    return (
        <div className={styles.sectionWrapper}>
            <div className={styles.sectionHeader}>
                {label.includes("Dakuten") ? <Database size={16} color="#666" /> : <Grid size={16} color="#666" />}
                <span className={styles.sectionLabel}>{getLabelVi(label)}</span>
                <div className={styles.sectionLine}></div>
            </div>
            <div className={styles.gridContainer}>
                {items.map((item, idx) => (
                    <KanaCard
                        key={idx}
                        item={item}
                        index={idx}
                        onClick={onSelect}
                    />
                ))}
            </div>
        </div>
    );
};

const KanaReference = () => {
    const [activeTab, setActiveTab] = useState('hiragana');
    const [selectedKana, setSelectedKana] = useState(null);
    const data = useMemo(() => KANA_DATA[activeTab], [activeTab]);

    const tabNames = {
        hiragana: "Hiragana",
        katakana: "Katakana"
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.bgPattern}></div>

            <div className={styles.contentWrapper}>
                <div className={styles.headerContainer}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.mainTitle}>
                            Bảng chữ cái <br/> <span className={styles.accent}>
                             tiếng Nhật</span>
                        </h1>
                    </div>

                    <div className={styles.tabContainer}>
                        {['hiragana', 'katakana'].map((tab) => (
                            <button
                                key={tab}
                                className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                <span>{tabNames[tab]}</span>
                                {activeTab === tab && (
                                    <motion.div
                                        className={styles.activeIndicator}
                                        layoutId="tabIndicator"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <KanaSection
                            label="Basic (Gojūon)"
                            items={data.basic}
                            onSelect={setSelectedKana}
                        />
                        <KanaSection
                            label="Dakuten & Handakuten"
                            items={data.dakuten}
                            onSelect={setSelectedKana}
                        />
                    </motion.div>
                </AnimatePresence>
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