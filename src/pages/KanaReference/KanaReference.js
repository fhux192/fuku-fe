import React, { useState, useMemo, useEffect, memo } from 'react';
import { X, Play, Grid, Database, Layers, ChevronDown, Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './KanaReference.module.css';

import a_img from '../../assets/images/hiragana/a.png';
import a_audio from '../../assets/voices/a.mp3';
import i_img from '../../assets/images/hiragana/i.png';
import i_audio from '../../assets/voices/i.mp3';
import u_img from '../../assets/images/hiragana/u.png';
import u_audio from '../../assets/voices/u.mp3';
import e_img from '../../assets/images/hiragana/e.png';
import e_audio from '../../assets/voices/e.mp3';
import o_img from '../../assets/images/hiragana/o.png';
import o_audio from '../../assets/voices/o.mp3';

import ka_img from '../../assets/images/hiragana/ka.png';
import ka_audio from '../../assets/voices/ka.mp3';
import ki_img from '../../assets/images/hiragana/ki.png';
import ki_audio from '../../assets/voices/ki.mp3';
import ku_img from '../../assets/images/hiragana/ku.png';
import ku_audio from '../../assets/voices/ku.mp3';
import ke_img from '../../assets/images/hiragana/ke.png';
import ke_audio from '../../assets/voices/ke.mp3';
import ko_img from '../../assets/images/hiragana/ko.png';
import ko_audio from '../../assets/voices/ko.mp3';

import sa_img from '../../assets/images/hiragana/sa.png';
import sa_audio from '../../assets/voices/sa.mp3';
import shi_img from '../../assets/images/hiragana/shi.png';
import shi_audio from '../../assets/voices/shi.mp3';
import su_img from '../../assets/images/hiragana/su.png';
import su_audio from '../../assets/voices/su.mp3';
import se_img from '../../assets/images/hiragana/se.png';
import se_audio from '../../assets/voices/se.mp3';
import so_img from '../../assets/images/hiragana/so.png';
import so_audio from '../../assets/voices/so.mp3';

import ta_img from '../../assets/images/hiragana/ta.png';
import ta_audio from '../../assets/voices/ta.mp3';
import chi_img from '../../assets/images/hiragana/chi.png';
import chi_audio from '../../assets/voices/chi.mp3';
import tsu_img from '../../assets/images/hiragana/tsu.png';
import tsu_audio from '../../assets/voices/tsu.mp3';
import te_img from '../../assets/images/hiragana/te.png';
import te_audio from '../../assets/voices/te.mp3';
import to_img from '../../assets/images/hiragana/to.png';
import to_audio from '../../assets/voices/to.mp3';

// import na_img from '../../assets/images/hiragana/na.png';
import na_audio from '../../assets/voices/na.mp3';
// import ni_img from '../../assets/images/hiragana/ni.png';
import ni_audio from '../../assets/voices/ni.mp3';
// import nu_img from '../../assets/images/hiragana/nu.png';
import nu_audio from '../../assets/voices/nu.mp3';
// import ne_img from '../../assets/images/hiragana/ne.png';
import ne_audio from '../../assets/voices/ne.mp3';
// import no_img from '../../assets/images/hiragana/no.png';
import no_audio from '../../assets/voices/no.mp3';

// import ha_img from '../../assets/images/hiragana/ha.png';
import ha_audio from '../../assets/voices/ha.mp3';
// import hi_img from '../../assets/images/hiragana/hi.png';
import hi_audio from '../../assets/voices/hi.mp3';
// import fu_img from '../../assets/images/hiragana/fu.png';
import fu_audio from '../../assets/voices/fu.mp3';
// import he_img from '../../assets/images/hiragana/he.png';
import he_audio from '../../assets/voices/he.mp3';
// import ho_img from '../../assets/images/hiragana/ho.png';
import ho_audio from '../../assets/voices/ho.mp3';

// import ma_img from '../../assets/images/hiragana/ma.png';
import ma_audio from '../../assets/voices/ma.mp3';
// import mi_img from '../../assets/images/hiragana/mi.png';
import mi_audio from '../../assets/voices/mi.mp3';
// import mu_img from '../../assets/images/hiragana/mu.png';
import mu_audio from '../../assets/voices/mu.mp3';
// import me_img from '../../assets/images/hiragana/me.png';
import me_audio from '../../assets/voices/me.mp3';
// import mo_img from '../../assets/images/hiragana/mo.png';
import mo_audio from '../../assets/voices/mo.mp3';

// import ya_img from '../../assets/images/hiragana/ya.png';
import ya_audio from '../../assets/voices/ya.mp3';
// import yu_img from '../../assets/images/hiragana/yu.png';
import yu_audio from '../../assets/voices/yu.mp3';
// import yo_img from '../../assets/images/hiragana/yo.png';
import yo_audio from '../../assets/voices/yo.mp3';

// import ra_img from '../../assets/images/hiragana/ra.png';
import ra_audio from '../../assets/voices/ra.mp3';
// import ri_img from '../../assets/images/hiragana/ri.png';
import ri_audio from '../../assets/voices/ri.mp3';
// import ru_img from '../../assets/images/hiragana/ru.png';
import ru_audio from '../../assets/voices/ru.mp3';
// import re_img from '../../assets/images/hiragana/re.png';
import re_audio from '../../assets/voices/re.mp3';
// import ro_img from '../../assets/images/hiragana/ro.png';
import ro_audio from '../../assets/voices/ro.mp3';

// import wa_img from '../../assets/images/hiragana/wa.png';
import wa_audio from '../../assets/voices/wa.mp3';
// import wo_img from '../../assets/images/hiragana/wo.png';
import wo_audio from '../../assets/voices/wo.mp3';
// import n_img from '../../assets/images/hiragana/n.png';
import n_audio from '../../assets/voices/n.mp3';

const KANA_DATA = {
    hiragana: {
        basic: [
            { char: 'あ', romaji: 'a', audio: a_audio, image: a_img },
            { char: 'い', romaji: 'i', audio: i_audio, image: i_img },
            { char: 'う', romaji: 'u', audio: u_audio, image: u_img },
            { char: 'え', romaji: 'e', audio: e_audio, image: e_img },
            { char: 'お', romaji: 'o', audio: o_audio, image: o_img },
            { char: 'か', romaji: 'ka', audio: ka_audio, image: ka_img },
            { char: 'き', romaji: 'ki', audio: ki_audio, image: ki_img },
            { char: 'く', romaji: 'ku', audio: ku_audio, image: ku_img },
            { char: 'け', romaji: 'ke', audio: ke_audio, image: ke_img },
            { char: 'こ', romaji: 'ko', audio: ko_audio, image: ko_img },
            { char: 'さ', romaji: 'sa', audio: sa_audio, image: sa_img },
            { char: 'し', romaji: 'shi', audio: shi_audio, image: shi_img },
            { char: 'す', romaji: 'su', audio: su_audio, image: su_img },
            { char: 'せ', romaji: 'se', audio: se_audio, image: se_img },
            { char: 'そ', romaji: 'so', audio: so_audio, image: so_img },
            { char: 'た', romaji: 'ta', audio: ta_audio, image: ta_img },
            { char: 'ち', romaji: 'chi', audio: chi_audio, image: chi_img },
            { char: 'つ', romaji: 'tsu', audio: tsu_audio, image: tsu_img },
            { char: 'て', romaji: 'te', audio: te_audio, image: te_img },
            { char: 'と', romaji: 'to', audio: to_audio, image: to_img },
            { char: 'な', romaji: 'na', audio: na_audio }, { char: 'に', romaji: 'ni', audio: ni_audio }, { char: 'ぬ', romaji: 'nu', audio: nu_audio }, { char: 'ね', romaji: 'ne', audio: ne_audio }, { char: 'の', romaji: 'no', audio: no_audio },
            { char: 'は', romaji: 'ha', audio: ha_audio }, { char: 'ひ', romaji: 'hi', audio: hi_audio }, { char: 'ふ', romaji: 'fu', audio: fu_audio }, { char: 'へ', romaji: 'he', audio: he_audio }, { char: 'ほ', romaji: 'ho', audio: ho_audio },
            { char: 'ま', romaji: 'ma', audio: ma_audio }, { char: 'み', romaji: 'mi', audio: mi_audio }, { char: 'む', romaji: 'mu', audio: mu_audio }, { char: 'め', romaji: 'me', audio: me_audio }, { char: 'も', romaji: 'mo', audio: mo_audio },
            { char: 'や', romaji: 'ya', audio: ya_audio }, { char: null, romaji: '', audio: null }, { char: 'ゆ', romaji: 'yu', audio: yu_audio }, { char: null, romaji: '', audio: null }, { char: 'よ', romaji: 'yo', audio: yo_audio },
            { char: 'ら', romaji: 'ra', audio: ra_audio }, { char: 'り', romaji: 'ri', audio: ri_audio }, { char: 'る', romaji: 'ru', audio: ru_audio }, { char: 'れ', romaji: 're', audio: re_audio }, { char: 'ろ', romaji: 'ro', audio: ro_audio },
            { char: 'わ', romaji: 'wa', audio: wa_audio }, { char: null, romaji: '', audio: null }, { char: null, romaji: '', audio: null }, { char: null, romaji: '', audio: null }, { char: 'を', romaji: 'wo', audio: wo_audio },
            { char: 'ん', romaji: 'n', audio: n_audio }, { char: null, romaji: '', audio: null }, { char: null, romaji: '', audio: null }, { char: null, romaji: '', audio: null }, { char: null, romaji: '', audio: null },
        ],
        dakuten: [
            { char: 'が', romaji: 'ga' }, { char: 'ぎ', romaji: 'gi' }, { char: 'ぐ', romaji: 'gu' }, { char: 'げ', romaji: 'ge' }, { char: 'ご', romaji: 'go' },
            { char: 'ざ', romaji: 'za' }, { char: 'じ', romaji: 'ji' }, { char: 'ず', romaji: 'zu' }, { char: 'ぜ', romaji: 'ze' }, { char: 'ぞ', romaji: 'zo' },
            { char: 'だ', romaji: 'da' }, { char: 'ぢ', romaji: 'ji' }, { char: 'づ', romaji: 'zu' }, { char: 'で', romaji: 'de' }, { char: 'ど', romaji: 'do' },
            { char: 'ば', romaji: 'ba' }, { char: 'び', romaji: 'bi' }, { char: 'ぶ', romaji: 'bu' }, { char: 'べ', romaji: 'be' }, { char: 'ぼ', romaji: 'bo' },
            { char: 'ぱ', romaji: 'pa' }, { char: 'ぴ', romaji: 'pi' }, { char: 'ぷ', romaji: 'pu' }, { char: 'ぺ', romaji: 'pe' }, { char: 'ぽ', romaji: 'po' },
        ],
        youon: [
            { char: 'きゃ', romaji: 'kya' }, { char: 'きゅ', romaji: 'kyu' }, { char: 'きょ', romaji: 'kyo' },
            { char: 'しゃ', romaji: 'sha' }, { char: 'しゅ', romaji: 'shu' }, { char: 'しょ', romaji: 'sho' },
            { char: 'ちゃ', romaji: 'cha' }, { char: 'ちゅ', romaji: 'chu' }, { char: 'ちょ', romaji: 'cho' },
            { char: 'にゃ', romaji: 'nya' }, { char: 'にゅ', romaji: 'nyu' }, { char: 'にょ', romaji: 'nyo' },
            { char: 'ひゃ', romaji: 'hya' }, { char: 'ひゅ', romaji: 'hyu' }, { char: 'ひょ', romaji: 'hyo' },
            { char: 'みゃ', romaji: 'mya' }, { char: 'みゅ', romaji: 'myu' }, { char: 'みょ', romaji: 'myo' },
            { char: 'りゃ', romaji: 'rya' }, { char: 'りゅ', romaji: 'ryu' }, { char: 'りょ', romaji: 'ryo' },
            { char: 'ぎゃ', romaji: 'gya' }, { char: 'ぎゅ', romaji: 'gyu' }, { char: 'ぎょ', romaji: 'gyo' },
            { char: 'じゃ', romaji: 'ja' }, { char: 'じゅ', romaji: 'ju' }, { char: 'じょ', romaji: 'jo' },
            { char: 'びゃ', romaji: 'bya' }, { char: 'びゅ', romaji: 'byu' }, { char: 'びょ', romaji: 'byo' },
            { char: 'ぴゃ', romaji: 'pya' }, { char: 'ぴゅ', romaji: 'pyu' }, { char: 'ぴょ', romaji: 'pyo' }
        ]
    },
    katakana: {
        basic: [
            { char: 'ア', romaji: 'a', audio: a_audio }, { char: 'イ', romaji: 'i', audio: i_audio }, { char: 'ウ', romaji: 'u', audio: u_audio }, { char: 'エ', romaji: 'e', audio: e_audio }, { char: 'オ', romaji: 'o', audio: o_audio },
            { char: 'カ', romaji: 'ka', audio: ka_audio }, { char: 'キ', romaji: 'ki', audio: ki_audio }, { char: 'ク', romaji: 'ku', audio: ku_audio }, { char: 'ケ', romaji: 'ke', audio: ke_audio }, { char: 'コ', romaji: 'ko', audio: ko_audio },
            { char: 'サ', romaji: 'sa', audio: sa_audio }, { char: 'シ', romaji: 'shi', audio: shi_audio }, { char: 'ス', romaji: 'su', audio: su_audio }, { char: 'セ', romaji: 'se', audio: se_audio }, { char: 'ソ', romaji: 'so', audio: so_audio },
            { char: 'タ', romaji: 'ta', audio: ta_audio }, { char: 'チ', romaji: 'chi', audio: chi_audio }, { char: 'ツ', romaji: 'tsu', audio: tsu_audio }, { char: 'テ', romaji: 'te', audio: te_audio }, { char: 'ト', romaji: 'to', audio: to_audio },
            { char: 'ナ', romaji: 'na', audio: na_audio }, { char: 'ニ', romaji: 'ni', audio: ni_audio }, { char: 'ヌ', romaji: 'nu', audio: nu_audio }, { char: 'ネ', romaji: 'ne', audio: ne_audio }, { char: 'ノ', romaji: 'no', audio: no_audio },
            { char: 'ハ', romaji: 'ha', audio: ha_audio }, { char: 'ヒ', romaji: 'hi', audio: hi_audio }, { char: 'フ', romaji: 'fu', audio: fu_audio }, { char: 'ヘ', romaji: 'he', audio: he_audio }, { char: 'ホ', romaji: 'ho', audio: ho_audio },
            { char: 'マ', romaji: 'ma', audio: ma_audio }, { char: 'ミ', romaji: 'mi', audio: mi_audio }, { char: 'ム', romaji: 'mu', audio: mu_audio }, { char: 'メ', romaji: 'me', audio: me_audio }, { char: 'モ', romaji: 'mo', audio: mo_audio },
            { char: 'ヤ', romaji: 'ya', audio: ya_audio }, { char: null, romaji: '', audio: null }, { char: 'ユ', romaji: 'yu', audio: yu_audio }, { char: null, romaji: '', audio: null }, { char: 'ヨ', romaji: 'yo', audio: yo_audio },
            { char: 'ラ', romaji: 'ra', audio: ra_audio }, { char: 'リ', romaji: 'ri', audio: ri_audio }, { char: 'ル', romaji: 'ru', audio: ru_audio }, { char: 'レ', romaji: 're', audio: re_audio }, { char: 'ロ', romaji: 'ro', audio: ro_audio },
            { char: 'ワ', romaji: 'wa', audio: wa_audio }, { char: null, romaji: '', audio: null }, { char: null, romaji: '', audio: null }, { char: null, romaji: '', audio: null }, { char: 'ヲ', romaji: 'wo', audio: wo_audio },
            { char: 'ン', romaji: 'n', audio: n_audio }, { char: null, romaji: '', audio: null }, { char: null, romaji: '', audio: null }, { char: null, romaji: '', audio: null }, { char: null, romaji: '', audio: null },
        ],
        dakuten: [
            { char: 'ガ', romaji: 'ga' }, { char: 'ギ', romaji: 'gi' }, { char: 'グ', romaji: 'gu' }, { char: 'ゲ', romaji: 'ge' }, { char: 'ゴ', romaji: 'go' },
            { char: 'ザ', romaji: 'za' }, { char: 'ジ', romaji: 'ji' }, { char: 'ズ', romaji: 'zu' }, { char: 'ゼ', romaji: 'ze' }, { char: 'ゾ', romaji: 'zo' },
            { char: 'ダ', romaji: 'da' }, { char: 'ヂ', romaji: 'ji' }, { char: 'ヅ', romaji: 'zu' }, { char: 'デ', romaji: 'de' }, { char: 'ド', romaji: 'do' },
            { char: 'バ', romaji: 'ba' }, { char: 'ビ', romaji: 'bi' }, { char: 'ブ', romaji: 'bu' }, { char: 'ベ', romaji: 'be' }, { char: 'ボ', romaji: 'bo' },
            { char: 'パ', romaji: 'pa' }, { char: 'ピ', romaji: 'pi' }, { char: 'プ', romaji: 'pu' }, { char: 'ペ', romaji: 'pe' }, { char: 'ポ', romaji: 'po' },
        ],
        youon: [
            { char: 'キャ', romaji: 'kya' }, { char: 'キュ', romaji: 'kyu' }, { char: 'キョ', romaji: 'kyo' },
            { char: 'シャ', romaji: 'sha' }, { char: 'シュ', romaji: 'shu' }, { char: 'ショ', romaji: 'sho' },
            { char: 'チャ', romaji: 'cha' }, { char: 'チュ', romaji: 'chu' }, { char: 'チョ', romaji: 'cho' },
            { char: 'ニャ', romaji: 'nya' }, { char: 'ニュ', romaji: 'nyu' }, { char: 'ニョ', romaji: 'nyo' },
            { char: 'ヒャ', romaji: 'hya' }, { char: 'ヒュ', romaji: 'hyu' }, { char: 'ヒョ', romaji: 'hyo' },
            { char: 'ミャ', romaji: 'mya' }, { char: 'ミュ', romaji: 'myu' }, { char: 'ミョ', romaji: 'myo' },
            { char: 'リャ', romaji: 'rya' }, { char: 'リュ', romaji: 'ryu' }, { char: 'リョ', romaji: 'ryo' },
            { char: 'ギャ', romaji: 'gya' }, { char: 'ギュ', romaji: 'gyu' }, { char: 'ギョ', romaji: 'gyo' },
            { char: 'ジャ', romaji: 'ja' }, { char: 'ジュ', romaji: 'ju' }, { char: 'ジョ', romaji: 'jo' },
            { char: 'ビャ', romaji: 'bya' }, { char: 'ビュ', romaji: 'byu' }, { char: 'ビョ', romaji: 'byo' },
            { char: 'ピャ', romaji: 'pya' }, { char: 'ピュ', romaji: 'pyu' }, { char: 'ピョ', romaji: 'pyo' }
        ]
    }
};

const KanaCard = memo(({ item, onClick }) => {
    return (
        <div
            className={styles.kanaCard}
            onClick={onClick}
            style={{ cursor: 'pointer' }}
        >
            <span className={styles.cardChar}>{item.char}</span>
            <span className={styles.cardRomaji}>{item.romaji}</span>
        </div>
    );
});

const KanaDetailModal = ({ item, onClose, onPrev, onNext, canPrev, canNext }) => {
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
        <div
            className={styles.modalBackdrop}
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
                        <div key={`${item.char}-hero`} className={styles.heroInner}>
                            {item.image ? (
                                <div className={styles.heroImageWrapper}>
                                    <img
                                        src={item.image}
                                        alt={item.char}
                                        className={styles.heroImage}
                                    />
                                </div>
                            ) : (
                                <div className={styles.heroCharDisplay}>{item.char}</div>
                            )}
                        </div>
                        <button
                            className={`${styles.navBtn} ${styles.navBtnLeft} ${!canPrev ? styles.disabled : ''}`}
                            onClick={onPrev}
                            disabled={!canPrev}
                        >
                            <ChevronLeft size={32} />
                        </button>
                        <button
                            className={`${styles.navBtn} ${styles.navBtnRight} ${!canNext ? styles.disabled : ''}`}
                            onClick={onNext}
                            disabled={!canNext}
                        >
                            <ChevronRight size={32} />
                        </button>
                    </div>

                    <div key={`${item.char}-romaji`} className={styles.romajiBadge}>
                        <span className={styles.romajiText}>{item.romaji}</span>
                        <span className={styles.romajiLabel}>Romaji</span>
                    </div>

                    <div
                        className={`${styles.playerBtn} ${!item.audio ? styles.disabled : ''} ${isPlaying ? styles.playing : ''}`}
                        onClick={handlePlayAudio}
                    >
                        <div className={styles.playIconWrapper}>
                            {isPlaying ? <Volume2 size={16} /> : <Play size={16} fill="currentColor" style={{ marginLeft: 2 }} />}
                        </div>

                        <span className={styles.playLabel}>
                            {!item.audio ? "Chưa có âm thanh" : (isPlaying ? "Đang phát..." : "Phát âm mẫu")}
                        </span>

                        {isPlaying && (
                            <div className={styles.soundWave}>
                                <div className={styles.bar} />
                                <div className={styles.bar} />
                                <div className={styles.bar} />
                                <div className={styles.bar} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const KanaSection = memo(({ type, items, onSelect, isOpen, onToggle }) => {
    const labels = { basic: "Âm cơ bản", dakuten: "Âm đục & Bán đục", youon: "Âm ghép" };
    // const labels = { basic: "Âm cơ bản", dakuten: "Âm đục & Bán đục" };
    const icons = { basic: <Grid size={18} />, dakuten: <Database size={18} />, youon: <Layers size={18} /> };

    return (
        <div className={`${styles.sectionWrapper} ${isOpen ? styles.isOpen : ''}`}>
            <button className={styles.accordionHeader} onClick={onToggle}>
                <div className={styles.headerInfo}>
                    <span className={`${styles.iconBox} ${isOpen ? styles.iconActive : ''}`}>{icons[type]}</span>
                    <span className={styles.sectionLabel}>{labels[type]}</span>
                </div>
                <div
                    className={styles.chevronWrapper}
                >
                    <ChevronDown size={20} color="#666" />
                </div>
            </button>

            {isOpen && (
                <div className={styles.accordionContent}>
                    <div
                        className={`${styles.gridContainer} ${type === 'youon' ? styles.youonGrid : ''}`}
                    >
                        {items.map((item, idx) => (
                            item && item.char ? (
                                <KanaCard
                                    key={`${type}-${idx}-${item.char}`}
                                    item={item}
                                    onClick={() => onSelect(item)}
                                    style={{ '--idx': idx }}
                                />
                            ) : <div key={idx} className={styles.emptySlot} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
});

const KanaReference = () => {
    const [activeTab, setActiveTab] = useState('hiragana');
    const [selectedKana, setSelectedKana] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [openSections, setOpenSections] = useState({ basic: true, dakuten: false, youon: false });

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const data = useMemo(() => KANA_DATA[activeTab], [activeTab]);

    const flatKana = useMemo(() => {
        return [...data.basic, ...data.dakuten, ...data.youon].filter(item => item?.char);
    }, [data]);

    const handleSelect = (item) => {
        const idx = flatKana.findIndex(i => i.char === item.char);
        if (idx !== -1) {
            setCurrentIndex(idx);
            setSelectedKana(flatKana[idx]);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            const newIndex = currentIndex - 1;
            setCurrentIndex(newIndex);
            setSelectedKana(flatKana[newIndex]);
        }
    };

    const handleNext = () => {
        if (currentIndex < flatKana.length - 1) {
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);
            setSelectedKana(flatKana[newIndex]);
        }
    };

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
                            </button>
                        ))}
                        <div
                            className={styles.activeIndicator}
                            style={{
                                transform: activeTab === 'hiragana' ? 'translateX(0)' : 'translateX(100%)'
                            }}
                        />
                    </div>
                </div>

                <div
                    key={activeTab}
                    className={styles.accordionList}
                >
                    {['basic', 'dakuten', 'youon'].map((section) => (
                        // {['basic', 'dakuten'].map((section) => (
                        <KanaSection
                            key={section}
                            type={section}
                            items={data[section]}
                            onSelect={handleSelect}
                            isOpen={openSections[section]}
                            onToggle={() => toggleSection(section)}
                        />
                    ))}
                </div>
            </div>

            {selectedKana && (
                <KanaDetailModal
                    item={selectedKana}
                    onClose={() => setSelectedKana(null)}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    canPrev={currentIndex > 0}
                    canNext={currentIndex < flatKana.length - 1}
                />
            )}
        </div>
    );
};

export default KanaReference;