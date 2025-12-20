import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Grid, Database } from 'lucide-react';
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

const KANA_DATA = {
    hiragana: {
        basic: [
            { char: 'あ', romaji: 'a', image: hira_a_img, audio: hira_a_audio },
            { char: 'い', romaji: 'i', image: hira_i_img, audio: hira_i_audio },
            { char: 'う', romaji: 'u', image: hira_u_img, audio: hira_u_audio },
            { char: 'え', romaji: 'e', image: hira_e_img, audio: hira_e_audio },
            { char: 'お', romaji: 'o', image: hira_o_img, audio: hira_o_audio },

            { char: 'か', romaji: 'ka', image: null, audio: null }, { char: 'き', romaji: 'ki', image: null, audio: null }, { char: 'く', romaji: 'ku', image: null, audio: null }, { char: 'け', romaji: 'ke', image: null, audio: null }, { char: 'こ', romaji: 'ko', image: null, audio: null },
            { char: 'さ', romaji: 'sa', image: null, audio: null }, { char: 'し', romaji: 'shi', image: null, audio: null }, { char: 'す', romaji: 'su', image: null, audio: null }, { char: 'せ', romaji: 'se', image: null, audio: null }, { char: 'そ', romaji: 'so', image: null, audio: null },
            { char: 'た', romaji: 'ta', image: null, audio: null }, { char: 'ち', romaji: 'chi', image: null, audio: null }, { char: 'つ', romaji: 'tsu', image: null, audio: null }, { char: 'て', romaji: 'te', image: null, audio: null }, { char: 'と', romaji: 'to', image: null, audio: null },
            { char: 'な', romaji: 'na', image: null, audio: null }, { char: 'に', romaji: 'ni', image: null, audio: null }, { char: 'ぬ', romaji: 'nu', image: null, audio: null }, { char: 'ね', romaji: 'ne', image: null, audio: null }, { char: 'の', romaji: 'no', image: null, audio: null },
            { char: 'は', romaji: 'ha', image: null, audio: null }, { char: 'ひ', romaji: 'hi', image: null, audio: null }, { char: 'ふ', romaji: 'fu', image: null, audio: null }, { char: 'へ', romaji: 'he', image: null, audio: null }, { char: 'ほ', romaji: 'ho', image: null, audio: null },
            { char: 'ま', romaji: 'ma', image: null, audio: null }, { char: 'み', romaji: 'mi', image: null, audio: null }, { char: 'む', romaji: 'mu', image: null, audio: null }, { char: 'め', romaji: 'me', image: null, audio: null }, { char: 'も', romaji: 'mo', image: null, audio: null },
            { char: 'や', romaji: 'ya', image: null, audio: null }, { char: null, romaji: '' }, { char: 'ゆ', romaji: 'yu', image: null, audio: null }, { char: null, romaji: '' }, { char: 'よ', romaji: 'yo', image: null, audio: null },
            { char: 'ら', romaji: 'ra', image: null, audio: null }, { char: 'り', romaji: 'ri', image: null, audio: null }, { char: 'る', romaji: 'ru', image: null, audio: null }, { char: 'れ', romaji: 're', image: null, audio: null }, { char: 'ろ', romaji: 'ro', image: null, audio: null },
            { char: 'わ', romaji: 'wa', image: null, audio: null }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: 'を', romaji: 'wo', image: null, audio: null },
            { char: 'ん', romaji: 'n', image: null, audio: null }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: null, romaji: '' },
        ],
        dakuten: [
            { char: 'が', romaji: 'ga', image: null, audio: null }, { char: 'ぎ', romaji: 'gi', image: null, audio: null }, { char: 'ぐ', romaji: 'gu', image: null, audio: null }, { char: 'げ', romaji: 'ge', image: null, audio: null }, { char: 'ご', romaji: 'go', image: null, audio: null },
            { char: 'ざ', romaji: 'za', image: null, audio: null }, { char: 'じ', romaji: 'ji', image: null, audio: null }, { char: 'ず', romaji: 'zu', image: null, audio: null }, { char: 'ぜ', romaji: 'ze', image: null, audio: null }, { char: 'ぞ', romaji: 'zo', image: null, audio: null },
            { char: 'だ', romaji: 'da', image: null, audio: null }, { char: 'ぢ', romaji: 'ji', image: null, audio: null }, { char: 'づ', romaji: 'zu', image: null, audio: null }, { char: 'đ', romaji: 'de', image: null, audio: null }, { char: 'ど', romaji: 'do', image: null, audio: null },
            { char: 'ば', romaji: 'ba', image: null, audio: null }, { char: 'び', romaji: 'bi', image: null, audio: null }, { char: 'ぶ', romaji: 'bu', image: null, audio: null }, { char: 'べ', romaji: 'be', image: null, audio: null }, { char: 'ぼ', romaji: 'bo', image: null, audio: null },
            { char: 'ぱ', romaji: 'pa', image: null, audio: null }, { char: 'ぴ', romaji: 'pi', image: null, audio: null }, { char: 'ぷ', romaji: 'pu', image: null, audio: null }, { char: 'ぺ', romaji: 'pe', image: null, audio: null }, { char: 'ぽ', romaji: 'po', image: null, audio: null },
        ]
    },
    katakana: {
        basic: [
            { char: 'ア', romaji: 'a', image: null, audio: null }, { char: 'イ', romaji: 'i', image: null, audio: null }, { char: 'ウ', romaji: 'u', image: null, audio: null }, { char: 'エ', romaji: 'e', image: null, audio: null }, { char: 'オ', romaji: 'o', image: null, audio: null },
            { char: 'カ', romaji: 'ka', image: null, audio: null }, { char: 'キ', romaji: 'ki', image: null, audio: null }, { char: 'ク', romaji: 'ku', image: null, audio: null }, { char: 'ケ', romaji: 'ke', image: null, audio: null }, { char: 'コ', romaji: 'ko', image: null, audio: null },
            { char: 'サ', romaji: 'sa', image: null, audio: null }, { char: 'シ', romaji: 'shi', image: null, audio: null }, { char: 'ス', romaji: 'su', image: null, audio: null }, { char: 'セ', romaji: 'se', image: null, audio: null }, { char: 'ソ', romaji: 'so', image: null, audio: null },
            { char: 'タ', romaji: 'ta', image: null, audio: null }, { char: 'チ', romaji: 'chi', image: null, audio: null }, { char: 'ツ', romaji: 'tsu', image: null, audio: null }, { char: 'テ', romaji: 'te', image: null, audio: null }, { char: 'ト', romaji: 'to', image: null, audio: null },
            { char: 'ナ', romaji: 'na', image: null, audio: null }, { char: 'ニ', romaji: 'ni', image: null, audio: null }, { char: 'ヌ', romaji: 'nu', image: null, audio: null }, { char: 'ネ', romaji: 'no', image: null, audio: null }, { char: 'ノ', romaji: 'no', image: null, audio: null },
            { char: 'ハ', romaji: 'ha', image: null, audio: null }, { char: 'ヒ', romaji: 'hi', image: null, audio: null }, { char: 'フ', romaji: 'fu', image: null, audio: null }, { char: 'ヘ', romaji: 'he', image: null, audio: null }, { char: 'ホ', romaji: 'ho', image: null, audio: null },
            { char: 'マ', romaji: 'ma', image: null, audio: null }, { char: 'ミ', romaji: 'mi', image: null, audio: null }, { char: 'ム', romaji: 'mu', image: null, audio: null }, { char: 'メ', romaji: 'me', image: null, audio: null }, { char: 'モ', romaji: 'mo', image: null, audio: null },
            { char: 'ヤ', romaji: 'ya', image: null, audio: null }, { char: null, romaji: '' }, { char: 'ユ', romaji: 'yu', image: null, audio: null }, { char: null, romaji: '' }, { char: 'ヨ', romaji: 'yo', image: null, audio: null },
            { char: 'ラ', romaji: 'ra', image: null, audio: null }, { char: 'リ', romaji: 'ri', image: null, audio: null }, { char: 'ル', romaji: 'ru', image: null, audio: null }, { char: 'レ', romaji: 're', image: null, audio: null }, { char: 'ロ', romaji: 'ro', image: null, audio: null },
            { char: 'ワ', romaji: 'wa', image: null, audio: null }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: 'ヲ', romaji: 'wo', image: null, audio: null },
            { char: 'ン', romaji: 'n', image: null, audio: null }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: null, romaji: '' },
        ],
        dakuten: [
            { char: 'ガ', romaji: 'ga', image: null, audio: null }, { char: 'ギ', romaji: 'gi', image: null, audio: null }, { char: 'グ', romaji: 'gu', image: null, audio: null }, { char: 'ゲ', romaji: 'ge', image: null, audio: null }, { char: 'ゴ', romaji: 'go', image: null, audio: null },
            { char: 'ザ', romaji: 'za', image: null, audio: null }, { char: 'ジ', romaji: 'ji', image: null, audio: null }, { char: 'ズ', romaji: 'zu', image: null, audio: null }, { char: 'ぜ', romaji: 'ze', image: null, audio: null }, { char: 'ぞ', romaji: 'zo', image: null, audio: null },
            { char: 'だ', romaji: 'da', image: null, audio: null }, { char: 'ヂ', romaji: 'ji', image: null, audio: null }, { char: 'ヅ', romaji: 'zu', image: null, audio: null }, { char: 'デ', romaji: 'de', image: null, audio: null }, { char: 'ド', romaji: 'do', image: null, audio: null },
            { char: 'バ', romaji: 'ba', image: null, audio: null }, { char: 'ビ', romaji: 'bi', image: null, audio: null }, { char: 'ブ', romaji: 'bu', image: null, audio: null }, { char: 'べ', romaji: 'be', image: null, audio: null }, { char: 'ボ', romaji: 'bo', image: null, audio: null },
            { char: 'パ', romaji: 'pa', image: null, audio: null }, { char: 'pi', romaji: 'pi', image: null, audio: null }, { char: 'プ', romaji: 'pu', image: null, audio: null }, { char: 'ペ', romaji: 'pe', image: null, audio: null }, { char: 'ポ', romaji: 'po', image: null, audio: null },
        ]
    }
};

const KanaDetailModal = ({ item, onClose }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayAudio = (e) => {
        e.stopPropagation();
        if (isPlaying || !item.audio) return;

        // Sử dụng biến audio đã được import từ dữ liệu
        const audio = new Audio(item.audio);

        setIsPlaying(true);
        audio.play().catch(error => {
            console.error("Lỗi âm thanh:", error);
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
                        <div className={styles.imgContainer}>
                            {item.image ? (
                                <img src={item.image} alt={item.char}  />
                            ) : (
                                <div className={styles.displayChar}>{item.char}</div>
                            )}
                        </div>
                    </div>

                    <div
                        className={`${styles.playerControl} ${!item.audio ? styles.disabled : ''}`}
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
                            <Play size={20} className={styles.playIcon} fill={item.audio ? "#95D600" : "#ccc"} />
                        )}

                        <span className={styles.playText}>
                            {!item.audio ? "Chưa có phát âm" : isPlaying ? "Đang phát..." : "Nghe phát âm"}
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