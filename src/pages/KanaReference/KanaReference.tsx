// ============================================================================
// KanaReference.tsx
// Japanese Kana learning reference - synced with Login design system
// ============================================================================

import React, { useState, useMemo, useEffect, useCallback, useRef, memo } from 'react';
import type { FC, ReactNode } from 'react';
import { X, Play, Grid, Database, Layers, ChevronDown, Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './KanaReference.module.css';

// ============================================================================
// Asset Imports - Hiragana Images (A-line to Ta-line only)
// ============================================================================

import a_img from '../../assets/images/hiragana/a.png';
import i_img from '../../assets/images/hiragana/i.png';
import u_img from '../../assets/images/hiragana/u.png';
import e_img from '../../assets/images/hiragana/e.png';
import o_img from '../../assets/images/hiragana/o.png';
import ka_img from '../../assets/images/hiragana/ka.png';
import ki_img from '../../assets/images/hiragana/ki.png';
import ku_img from '../../assets/images/hiragana/ku.png';
import ke_img from '../../assets/images/hiragana/ke.png';
import ko_img from '../../assets/images/hiragana/ko.png';
import sa_img from '../../assets/images/hiragana/sa.png';
import shi_img from '../../assets/images/hiragana/shi.png';
import su_img from '../../assets/images/hiragana/su.png';
import se_img from '../../assets/images/hiragana/se.png';
import so_img from '../../assets/images/hiragana/so.png';
import ta_img from '../../assets/images/hiragana/ta.png';
import chi_img from '../../assets/images/hiragana/chi.png';
import tsu_img from '../../assets/images/hiragana/tsu.png';
import te_img from '../../assets/images/hiragana/te.png';
import to_img from '../../assets/images/hiragana/to.png';

// ============================================================================
// Asset Imports - Audio Files (Basic - All lines)
// ============================================================================

import a_audio from '../../assets/voices/a.mp3';
import i_audio from '../../assets/voices/i.mp3';
import u_audio from '../../assets/voices/u.mp3';
import e_audio from '../../assets/voices/e.mp3';
import o_audio from '../../assets/voices/o.mp3';
import ka_audio from '../../assets/voices/ka.mp3';
import ki_audio from '../../assets/voices/ki.mp3';
import ku_audio from '../../assets/voices/ku.mp3';
import ke_audio from '../../assets/voices/ke.mp3';
import ko_audio from '../../assets/voices/ko.mp3';
import sa_audio from '../../assets/voices/sa.mp3';
import shi_audio from '../../assets/voices/shi.mp3';
import su_audio from '../../assets/voices/su.mp3';
import se_audio from '../../assets/voices/se.mp3';
import so_audio from '../../assets/voices/so.mp3';
import ta_audio from '../../assets/voices/ta.mp3';
import chi_audio from '../../assets/voices/chi.mp3';
import tsu_audio from '../../assets/voices/tsu.mp3';
import te_audio from '../../assets/voices/te.mp3';
import to_audio from '../../assets/voices/to.mp3';
import na_audio from '../../assets/voices/na.mp3';
import ni_audio from '../../assets/voices/ni.mp3';
import nu_audio from '../../assets/voices/nu.mp3';
import ne_audio from '../../assets/voices/ne.mp3';
import no_audio from '../../assets/voices/no.mp3';
import ha_audio from '../../assets/voices/ha.mp3';
import hi_audio from '../../assets/voices/hi.mp3';
import fu_audio from '../../assets/voices/fu.mp3';
import he_audio from '../../assets/voices/he.mp3';
import ho_audio from '../../assets/voices/ho.mp3';
import ma_audio from '../../assets/voices/ma.mp3';
import mi_audio from '../../assets/voices/mi.mp3';
import mu_audio from '../../assets/voices/mu.mp3';
import me_audio from '../../assets/voices/me.mp3';
import mo_audio from '../../assets/voices/mo.mp3';
import ya_audio from '../../assets/voices/ya.mp3';
import yu_audio from '../../assets/voices/yu.mp3';
import yo_audio from '../../assets/voices/yo.mp3';
import ra_audio from '../../assets/voices/ra.mp3';
import ri_audio from '../../assets/voices/ri.mp3';
import ru_audio from '../../assets/voices/ru.mp3';
import re_audio from '../../assets/voices/re.mp3';
import ro_audio from '../../assets/voices/ro.mp3';
import wa_audio from '../../assets/voices/wa.mp3';
import wo_audio from '../../assets/voices/wo.mp3';
import n_audio from '../../assets/voices/n.mp3';

// ============================================================================
// Asset Imports - Audio Files (Dakuten)
// ============================================================================

import ga_audio from '../../assets/voices/ga.mp3';
import gi_audio from '../../assets/voices/gi.mp3';
import gu_audio from '../../assets/voices/gu.mp3';
import ge_audio from '../../assets/voices/ge.mp3';
import go_audio from '../../assets/voices/go.mp3';
import za_audio from '../../assets/voices/za.mp3';
import ji_audio from '../../assets/voices/ji.mp3';
import zu_audio from '../../assets/voices/zu.mp3';
import ze_audio from '../../assets/voices/ze.mp3';
import zo_audio from '../../assets/voices/zo.mp3';
import da_audio from '../../assets/voices/da.mp3';
import de_audio from '../../assets/voices/de.mp3';
import do_audio from '../../assets/voices/do.mp3';
import ba_audio from '../../assets/voices/ba.mp3';
import bi_audio from '../../assets/voices/bi.mp3';
import bu_audio from '../../assets/voices/bu.mp3';
import be_audio from '../../assets/voices/be.mp3';
import bo_audio from '../../assets/voices/bo.mp3';
import pa_audio from '../../assets/voices/pa.mp3';
import pi_audio from '../../assets/voices/pi.mp3';
import pu_audio from '../../assets/voices/pu.mp3';
import pe_audio from '../../assets/voices/pe.mp3';
import po_audio from '../../assets/voices/po.mp3';

// ============================================================================
// Asset Imports - Audio Files (Youon)
// ============================================================================

import kya_audio from '../../assets/voices/kya.mp3';
import kyu_audio from '../../assets/voices/kyu.mp3';
import kyo_audio from '../../assets/voices/kyo.mp3';
import sha_audio from '../../assets/voices/sha.mp3';
import shu_audio from '../../assets/voices/shu.mp3';
import sho_audio from '../../assets/voices/sho.mp3';
import cha_audio from '../../assets/voices/cha.mp3';
import chu_audio from '../../assets/voices/chu.mp3';
import cho_audio from '../../assets/voices/cho.mp3';
import nya_audio from '../../assets/voices/nya.mp3';
import nyu_audio from '../../assets/voices/nyu.mp3';
import nyo_audio from '../../assets/voices/nyo.mp3';
import hya_audio from '../../assets/voices/hya.mp3';
import hyu_audio from '../../assets/voices/hyu.mp3';
import hyo_audio from '../../assets/voices/hyo.mp3';
import mya_audio from '../../assets/voices/mya.mp3';
import myu_audio from '../../assets/voices/myu.mp3';
import myo_audio from '../../assets/voices/myo.mp3';
import rya_audio from '../../assets/voices/rya.mp3';
import ryu_audio from '../../assets/voices/ryu.mp3';
import ryo_audio from '../../assets/voices/ryo.mp3';
import gya_audio from '../../assets/voices/gya.mp3';
import gyu_audio from '../../assets/voices/gyu.mp3';
import gyo_audio from '../../assets/voices/gyo.mp3';
import ja_audio from '../../assets/voices/ja.mp3';
import ju_audio from '../../assets/voices/ju.mp3';
import jo_audio from '../../assets/voices/jo.mp3';
import bya_audio from '../../assets/voices/bya.mp3';
import byu_audio from '../../assets/voices/byu.mp3';
import byo_audio from '../../assets/voices/byo.mp3';
import pya_audio from '../../assets/voices/pya.mp3';
import pyu_audio from '../../assets/voices/pyu.mp3';
import pyo_audio from '../../assets/voices/pyo.mp3';

// ============================================================================
// Types
// ============================================================================

interface KanaItem {
    char: string | null;
    romaji: string;
    audio: string | null;
    image?: string;
}

interface KanaCategory {
    basic: KanaItem[];
    dakuten: KanaItem[];
    youon: KanaItem[];
}

interface KanaDataType {
    hiragana: KanaCategory;
    katakana: KanaCategory;
}

type TabType = 'hiragana' | 'katakana';
type SectionType = 'basic' | 'dakuten' | 'youon';

interface OpenSections {
    basic: boolean;
    dakuten: boolean;
    youon: boolean;
}

interface KanaCardProps {
    item: KanaItem;
    onClick: () => void;
}

interface KanaDetailModalProps {
    item: KanaItem;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
    canPrev: boolean;
    canNext: boolean;
}

interface KanaSectionProps {
    type: SectionType;
    items: KanaItem[];
    onSelect: (item: KanaItem) => void;
    isOpen: boolean;
    onToggle: () => void;
}

// ============================================================================
// Constants
// ============================================================================

const SECTION_LABELS: Record<SectionType, string> = {
    basic: 'Âm cơ bản',
    dakuten: 'Âm đục & Bán đục',
    youon: 'Âm ghép'
};

const SECTION_ICONS: Record<SectionType, ReactNode> = {
    basic: <Grid size={18} />,
    dakuten: <Database size={18} />,
    youon: <Layers size={18} />
};

// ============================================================================
// Kana Data
// ============================================================================

const KANA_DATA: KanaDataType = {
    hiragana: {
        basic: [
            // A-line (with images)
            { char: 'あ', romaji: 'a', audio: a_audio, image: a_img },
            { char: 'い', romaji: 'i', audio: i_audio, image: i_img },
            { char: 'う', romaji: 'u', audio: u_audio, image: u_img },
            { char: 'え', romaji: 'e', audio: e_audio, image: e_img },
            { char: 'お', romaji: 'o', audio: o_audio, image: o_img },
            // Ka-line (with images)
            { char: 'か', romaji: 'ka', audio: ka_audio, image: ka_img },
            { char: 'き', romaji: 'ki', audio: ki_audio, image: ki_img },
            { char: 'く', romaji: 'ku', audio: ku_audio, image: ku_img },
            { char: 'け', romaji: 'ke', audio: ke_audio, image: ke_img },
            { char: 'こ', romaji: 'ko', audio: ko_audio, image: ko_img },
            // Sa-line (with images)
            { char: 'さ', romaji: 'sa', audio: sa_audio, image: sa_img },
            { char: 'し', romaji: 'shi', audio: shi_audio, image: shi_img },
            { char: 'す', romaji: 'su', audio: su_audio, image: su_img },
            { char: 'せ', romaji: 'se', audio: se_audio, image: se_img },
            { char: 'そ', romaji: 'so', audio: so_audio, image: so_img },
            // Ta-line (with images)
            { char: 'た', romaji: 'ta', audio: ta_audio, image: ta_img },
            { char: 'ち', romaji: 'chi', audio: chi_audio, image: chi_img },
            { char: 'つ', romaji: 'tsu', audio: tsu_audio, image: tsu_img },
            { char: 'て', romaji: 'te', audio: te_audio, image: te_img },
            { char: 'と', romaji: 'to', audio: to_audio, image: to_img },
            // Na-line (audio only)
            { char: 'な', romaji: 'na', audio: na_audio },
            { char: 'に', romaji: 'ni', audio: ni_audio },
            { char: 'ぬ', romaji: 'nu', audio: nu_audio },
            { char: 'ね', romaji: 'ne', audio: ne_audio },
            { char: 'の', romaji: 'no', audio: no_audio },
            // Ha-line (audio only)
            { char: 'は', romaji: 'ha', audio: ha_audio },
            { char: 'ひ', romaji: 'hi', audio: hi_audio },
            { char: 'ふ', romaji: 'fu', audio: fu_audio },
            { char: 'へ', romaji: 'he', audio: he_audio },
            { char: 'ほ', romaji: 'ho', audio: ho_audio },
            // Ma-line (audio only)
            { char: 'ま', romaji: 'ma', audio: ma_audio },
            { char: 'み', romaji: 'mi', audio: mi_audio },
            { char: 'む', romaji: 'mu', audio: mu_audio },
            { char: 'め', romaji: 'me', audio: me_audio },
            { char: 'も', romaji: 'mo', audio: mo_audio },
            // Ya-line (with empty slots)
            { char: 'や', romaji: 'ya', audio: ya_audio },
            { char: null, romaji: '', audio: null },
            { char: 'ゆ', romaji: 'yu', audio: yu_audio },
            { char: null, romaji: '', audio: null },
            { char: 'よ', romaji: 'yo', audio: yo_audio },
            // Ra-line (audio only)
            { char: 'ら', romaji: 'ra', audio: ra_audio },
            { char: 'り', romaji: 'ri', audio: ri_audio },
            { char: 'る', romaji: 'ru', audio: ru_audio },
            { char: 'れ', romaji: 're', audio: re_audio },
            { char: 'ろ', romaji: 'ro', audio: ro_audio },
            // Wa-line (with empty slots)
            { char: 'わ', romaji: 'wa', audio: wa_audio },
            { char: null, romaji: '', audio: null },
            { char: null, romaji: '', audio: null },
            { char: null, romaji: '', audio: null },
            { char: 'を', romaji: 'wo', audio: wo_audio },
            // N
            { char: 'ん', romaji: 'n', audio: n_audio },
            { char: null, romaji: '', audio: null },
            { char: null, romaji: '', audio: null },
            { char: null, romaji: '', audio: null },
            { char: null, romaji: '', audio: null },
        ],
        dakuten: [
            // Ga-line
            { char: 'が', romaji: 'ga', audio: ga_audio },
            { char: 'ぎ', romaji: 'gi', audio: gi_audio },
            { char: 'ぐ', romaji: 'gu', audio: gu_audio },
            { char: 'げ', romaji: 'ge', audio: ge_audio },
            { char: 'ご', romaji: 'go', audio: go_audio },
            // Za-line
            { char: 'ざ', romaji: 'za', audio: za_audio },
            { char: 'じ', romaji: 'ji', audio: ji_audio },
            { char: 'ず', romaji: 'zu', audio: zu_audio },
            { char: 'ぜ', romaji: 'ze', audio: ze_audio },
            { char: 'ぞ', romaji: 'zo', audio: zo_audio },
            // Da-line (ji/zu share audio with za-line)
            { char: 'だ', romaji: 'da', audio: da_audio },
            { char: 'ぢ', romaji: 'ji', audio: ji_audio },
            { char: 'づ', romaji: 'zu', audio: zu_audio },
            { char: 'で', romaji: 'de', audio: de_audio },
            { char: 'ど', romaji: 'do', audio: do_audio },
            // Ba-line
            { char: 'ば', romaji: 'ba', audio: ba_audio },
            { char: 'び', romaji: 'bi', audio: bi_audio },
            { char: 'ぶ', romaji: 'bu', audio: bu_audio },
            { char: 'べ', romaji: 'be', audio: be_audio },
            { char: 'ぼ', romaji: 'bo', audio: bo_audio },
            // Pa-line
            { char: 'ぱ', romaji: 'pa', audio: pa_audio },
            { char: 'ぴ', romaji: 'pi', audio: pi_audio },
            { char: 'ぷ', romaji: 'pu', audio: pu_audio },
            { char: 'ぺ', romaji: 'pe', audio: pe_audio },
            { char: 'ぽ', romaji: 'po', audio: po_audio },
        ],
        youon: [
            // Kya-line
            { char: 'きゃ', romaji: 'kya', audio: kya_audio },
            { char: 'きゅ', romaji: 'kyu', audio: kyu_audio },
            { char: 'きょ', romaji: 'kyo', audio: kyo_audio },
            // Sha-line
            { char: 'しゃ', romaji: 'sha', audio: sha_audio },
            { char: 'しゅ', romaji: 'shu', audio: shu_audio },
            { char: 'しょ', romaji: 'sho', audio: sho_audio },
            // Cha-line
            { char: 'ちゃ', romaji: 'cha', audio: cha_audio },
            { char: 'ちゅ', romaji: 'chu', audio: chu_audio },
            { char: 'ちょ', romaji: 'cho', audio: cho_audio },
            // Nya-line
            { char: 'にゃ', romaji: 'nya', audio: nya_audio },
            { char: 'にゅ', romaji: 'nyu', audio: nyu_audio },
            { char: 'にょ', romaji: 'nyo', audio: nyo_audio },
            // Hya-line
            { char: 'ひゃ', romaji: 'hya', audio: hya_audio },
            { char: 'ひゅ', romaji: 'hyu', audio: hyu_audio },
            { char: 'ひょ', romaji: 'hyo', audio: hyo_audio },
            // Mya-line
            { char: 'みゃ', romaji: 'mya', audio: mya_audio },
            { char: 'みゅ', romaji: 'myu', audio: myu_audio },
            { char: 'みょ', romaji: 'myo', audio: myo_audio },
            // Rya-line
            { char: 'りゃ', romaji: 'rya', audio: rya_audio },
            { char: 'りゅ', romaji: 'ryu', audio: ryu_audio },
            { char: 'りょ', romaji: 'ryo', audio: ryo_audio },
            // Gya-line
            { char: 'ぎゃ', romaji: 'gya', audio: gya_audio },
            { char: 'ぎゅ', romaji: 'gyu', audio: gyu_audio },
            { char: 'ぎょ', romaji: 'gyo', audio: gyo_audio },
            // Ja-line
            { char: 'じゃ', romaji: 'ja', audio: ja_audio },
            { char: 'じゅ', romaji: 'ju', audio: ju_audio },
            { char: 'じょ', romaji: 'jo', audio: jo_audio },
            // Bya-line
            { char: 'びゃ', romaji: 'bya', audio: bya_audio },
            { char: 'びゅ', romaji: 'byu', audio: byu_audio },
            { char: 'びょ', romaji: 'byo', audio: byo_audio },
            // Pya-line
            { char: 'ぴゃ', romaji: 'pya', audio: pya_audio },
            { char: 'ぴゅ', romaji: 'pyu', audio: pyu_audio },
            { char: 'ぴょ', romaji: 'pyo', audio: pyo_audio },
        ]
    },
    katakana: {
        basic: [
            // A-line
            { char: 'ア', romaji: 'a', audio: a_audio },
            { char: 'イ', romaji: 'i', audio: i_audio },
            { char: 'ウ', romaji: 'u', audio: u_audio },
            { char: 'エ', romaji: 'e', audio: e_audio },
            { char: 'オ', romaji: 'o', audio: o_audio },
            // Ka-line
            { char: 'カ', romaji: 'ka', audio: ka_audio },
            { char: 'キ', romaji: 'ki', audio: ki_audio },
            { char: 'ク', romaji: 'ku', audio: ku_audio },
            { char: 'ケ', romaji: 'ke', audio: ke_audio },
            { char: 'コ', romaji: 'ko', audio: ko_audio },
            // Sa-line
            { char: 'サ', romaji: 'sa', audio: sa_audio },
            { char: 'シ', romaji: 'shi', audio: shi_audio },
            { char: 'ス', romaji: 'su', audio: su_audio },
            { char: 'セ', romaji: 'se', audio: se_audio },
            { char: 'ソ', romaji: 'so', audio: so_audio },
            // Ta-line
            { char: 'タ', romaji: 'ta', audio: ta_audio },
            { char: 'チ', romaji: 'chi', audio: chi_audio },
            { char: 'ツ', romaji: 'tsu', audio: tsu_audio },
            { char: 'テ', romaji: 'te', audio: te_audio },
            { char: 'ト', romaji: 'to', audio: to_audio },
            // Na-line
            { char: 'ナ', romaji: 'na', audio: na_audio },
            { char: 'ニ', romaji: 'ni', audio: ni_audio },
            { char: 'ヌ', romaji: 'nu', audio: nu_audio },
            { char: 'ネ', romaji: 'ne', audio: ne_audio },
            { char: 'ノ', romaji: 'no', audio: no_audio },
            // Ha-line
            { char: 'ハ', romaji: 'ha', audio: ha_audio },
            { char: 'ヒ', romaji: 'hi', audio: hi_audio },
            { char: 'フ', romaji: 'fu', audio: fu_audio },
            { char: 'ヘ', romaji: 'he', audio: he_audio },
            { char: 'ホ', romaji: 'ho', audio: ho_audio },
            // Ma-line
            { char: 'マ', romaji: 'ma', audio: ma_audio },
            { char: 'ミ', romaji: 'mi', audio: mi_audio },
            { char: 'ム', romaji: 'mu', audio: mu_audio },
            { char: 'メ', romaji: 'me', audio: me_audio },
            { char: 'モ', romaji: 'mo', audio: mo_audio },
            // Ya-line
            { char: 'ヤ', romaji: 'ya', audio: ya_audio },
            { char: null, romaji: '', audio: null },
            { char: 'ユ', romaji: 'yu', audio: yu_audio },
            { char: null, romaji: '', audio: null },
            { char: 'ヨ', romaji: 'yo', audio: yo_audio },
            // Ra-line
            { char: 'ラ', romaji: 'ra', audio: ra_audio },
            { char: 'リ', romaji: 'ri', audio: ri_audio },
            { char: 'ル', romaji: 'ru', audio: ru_audio },
            { char: 'レ', romaji: 're', audio: re_audio },
            { char: 'ロ', romaji: 'ro', audio: ro_audio },
            // Wa-line
            { char: 'ワ', romaji: 'wa', audio: wa_audio },
            { char: null, romaji: '', audio: null },
            { char: null, romaji: '', audio: null },
            { char: null, romaji: '', audio: null },
            { char: 'ヲ', romaji: 'wo', audio: wo_audio },
            // N
            { char: 'ン', romaji: 'n', audio: n_audio },
            { char: null, romaji: '', audio: null },
            { char: null, romaji: '', audio: null },
            { char: null, romaji: '', audio: null },
            { char: null, romaji: '', audio: null },
        ],
        dakuten: [
            // Ga-line
            { char: 'ガ', romaji: 'ga', audio: ga_audio },
            { char: 'ギ', romaji: 'gi', audio: gi_audio },
            { char: 'グ', romaji: 'gu', audio: gu_audio },
            { char: 'ゲ', romaji: 'ge', audio: ge_audio },
            { char: 'ゴ', romaji: 'go', audio: go_audio },
            // Za-line
            { char: 'ザ', romaji: 'za', audio: za_audio },
            { char: 'ジ', romaji: 'ji', audio: ji_audio },
            { char: 'ズ', romaji: 'zu', audio: zu_audio },
            { char: 'ゼ', romaji: 'ze', audio: ze_audio },
            { char: 'ゾ', romaji: 'zo', audio: zo_audio },
            // Da-line
            { char: 'ダ', romaji: 'da', audio: da_audio },
            { char: 'ヂ', romaji: 'ji', audio: ji_audio },
            { char: 'ヅ', romaji: 'zu', audio: zu_audio },
            { char: 'デ', romaji: 'de', audio: de_audio },
            { char: 'ド', romaji: 'do', audio: do_audio },
            // Ba-line
            { char: 'バ', romaji: 'ba', audio: ba_audio },
            { char: 'ビ', romaji: 'bi', audio: bi_audio },
            { char: 'ブ', romaji: 'bu', audio: bu_audio },
            { char: 'ベ', romaji: 'be', audio: be_audio },
            { char: 'ボ', romaji: 'bo', audio: bo_audio },
            // Pa-line
            { char: 'パ', romaji: 'pa', audio: pa_audio },
            { char: 'ピ', romaji: 'pi', audio: pi_audio },
            { char: 'プ', romaji: 'pu', audio: pu_audio },
            { char: 'ペ', romaji: 'pe', audio: pe_audio },
            { char: 'ポ', romaji: 'po', audio: po_audio },
        ],
        youon: [
            // Kya-line
            { char: 'キャ', romaji: 'kya', audio: kya_audio },
            { char: 'キュ', romaji: 'kyu', audio: kyu_audio },
            { char: 'キョ', romaji: 'kyo', audio: kyo_audio },
            // Sha-line
            { char: 'シャ', romaji: 'sha', audio: sha_audio },
            { char: 'シュ', romaji: 'shu', audio: shu_audio },
            { char: 'ショ', romaji: 'sho', audio: sho_audio },
            // Cha-line
            { char: 'チャ', romaji: 'cha', audio: cha_audio },
            { char: 'チュ', romaji: 'chu', audio: chu_audio },
            { char: 'チョ', romaji: 'cho', audio: cho_audio },
            // Nya-line
            { char: 'ニャ', romaji: 'nya', audio: nya_audio },
            { char: 'ニュ', romaji: 'nyu', audio: nyu_audio },
            { char: 'ニョ', romaji: 'nyo', audio: nyo_audio },
            // Hya-line
            { char: 'ヒャ', romaji: 'hya', audio: hya_audio },
            { char: 'ヒュ', romaji: 'hyu', audio: hyu_audio },
            { char: 'ヒョ', romaji: 'hyo', audio: hyo_audio },
            // Mya-line
            { char: 'ミャ', romaji: 'mya', audio: mya_audio },
            { char: 'ミュ', romaji: 'myu', audio: myu_audio },
            { char: 'ミョ', romaji: 'myo', audio: myo_audio },
            // Rya-line
            { char: 'リャ', romaji: 'rya', audio: rya_audio },
            { char: 'リュ', romaji: 'ryu', audio: ryu_audio },
            { char: 'リョ', romaji: 'ryo', audio: ryo_audio },
            // Gya-line
            { char: 'ギャ', romaji: 'gya', audio: gya_audio },
            { char: 'ギュ', romaji: 'gyu', audio: gyu_audio },
            { char: 'ギョ', romaji: 'gyo', audio: gyo_audio },
            // Ja-line
            { char: 'ジャ', romaji: 'ja', audio: ja_audio },
            { char: 'ジュ', romaji: 'ju', audio: ju_audio },
            { char: 'ジョ', romaji: 'jo', audio: jo_audio },
            // Bya-line
            { char: 'ビャ', romaji: 'bya', audio: bya_audio },
            { char: 'ビュ', romaji: 'byu', audio: byu_audio },
            { char: 'ビョ', romaji: 'byo', audio: byo_audio },
            // Pya-line
            { char: 'ピャ', romaji: 'pya', audio: pya_audio },
            { char: 'ピュ', romaji: 'pyu', audio: pyu_audio },
            { char: 'ピョ', romaji: 'pyo', audio: pyo_audio },
        ]
    }
};

// ============================================================================
// Sub Components
// ============================================================================

// ----------------------------------------------------------------------------
// KanaCard - Individual character card
// ----------------------------------------------------------------------------

const KanaCard: FC<KanaCardProps> = memo(({ item, onClick }) => {
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>): void => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
        }
    }, [onClick]);

    return (
        <div
            className={styles.kanaCard}
            onClick={onClick}
            role="button"
            tabIndex={0}
            aria-label={`${item.char} - ${item.romaji}`}
            onKeyDown={handleKeyDown}
        >
            <span className={styles.cardChar}>{item.char}</span>
            <span className={styles.cardRomaji}>{item.romaji}</span>
        </div>
    );
});

KanaCard.displayName = 'KanaCard';

// ----------------------------------------------------------------------------
// KanaDetailModal - Character detail popup
// ----------------------------------------------------------------------------

const KanaDetailModal: FC<KanaDetailModalProps> = ({
                                                       item,
                                                       onClose,
                                                       onPrev,
                                                       onNext,
                                                       canPrev,
                                                       canNext
                                                   }) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Prevent body scroll when modal open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent): void => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft' && canPrev) onPrev();
            if (e.key === 'ArrowRight' && canNext) onNext();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, onPrev, onNext, canPrev, canNext]);

    // Stop audio when item changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setIsPlaying(false);
    }, [item]);

    const handlePlayAudio = useCallback((e: React.MouseEvent): void => {
        e.stopPropagation();
        if (isPlaying || !item.audio) return;

        const audio = new Audio(item.audio);
        audioRef.current = audio;
        setIsPlaying(true);

        audio.play().catch(() => setIsPlaying(false));
        audio.onended = () => {
            setIsPlaying(false);
            audioRef.current = null;
        };
    }, [isPlaying, item.audio]);

    if (!item) return null;

    return (
        <div
            className={styles.modalBackdrop}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className={styles.modalPanel}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Mobile drag handle */}
                <div className={styles.mobileHandle} aria-hidden="true" />

                {/* Header */}
                <div className={styles.modalHeader}>
                    <span id="modal-title" className={styles.modalTitle}>
                        Chi tiết ký tự
                    </span>
                    <button
                        className={styles.closeBtn}
                        onClick={onClose}
                        aria-label="Đóng"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className={styles.modalBody}>
                    {/* Hero display */}
                    <div className={styles.heroContainer}>
                        <div key={`${item.char}-hero`} className={styles.heroInner}>
                            {item.image ? (
                                <div className={styles.heroImageWrapper}>
                                    <img
                                        src={item.image}
                                        alt={item.char || ''}
                                        className={styles.heroImage}
                                    />
                                </div>
                            ) : (
                                <div className={styles.heroCharDisplay}>
                                    {item.char}
                                </div>
                            )}
                        </div>

                        {/* Nav buttons */}
                        <button
                            className={`${styles.navBtn} ${styles.navBtnLeft} ${!canPrev ? styles.disabled : ''}`}
                            onClick={onPrev}
                            disabled={!canPrev}
                            aria-label="Ký tự trước"
                        >
                            <ChevronLeft size={32} />
                        </button>
                        <button
                            className={`${styles.navBtn} ${styles.navBtnRight} ${!canNext ? styles.disabled : ''}`}
                            onClick={onNext}
                            disabled={!canNext}
                            aria-label="Ký tự tiếp theo"
                        >
                            <ChevronRight size={32} />
                        </button>
                    </div>

                    {/* Romaji badge */}
                    <div key={`${item.char}-romaji`} className={styles.romajiBadge}>
                        <span className={styles.romajiText}>{item.romaji}</span>
                        <span className={styles.romajiLabel}>Romaji</span>
                    </div>

                    {/* Audio player */}
                    <div
                        className={`${styles.playerBtn} ${!item.audio ? styles.disabled : ''} ${isPlaying ? styles.playing : ''}`}
                        onClick={handlePlayAudio}
                        role="button"
                        tabIndex={item.audio ? 0 : -1}
                        aria-label={!item.audio ? 'Chưa có âm thanh' : (isPlaying ? 'Đang phát' : 'Phát âm mẫu')}
                    >
                        <div className={styles.playIconWrapper}>
                            {isPlaying ? (
                                <Volume2 size={16} />
                            ) : (
                                <Play size={16} fill="currentColor" style={{ marginLeft: 2 }} />
                            )}
                        </div>

                        <span className={styles.playLabel}>
                            {!item.audio ? 'Chưa có âm thanh' : (isPlaying ? 'Đang phát...' : 'Phát âm mẫu')}
                        </span>

                        {/* Sound wave animation */}
                        {isPlaying && (
                            <div className={styles.soundWave} aria-hidden="true">
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

// ----------------------------------------------------------------------------
// KanaSection - Accordion section
// ----------------------------------------------------------------------------

const KanaSection: FC<KanaSectionProps> = memo(({
                                                    type,
                                                    items,
                                                    onSelect,
                                                    isOpen,
                                                    onToggle
                                                }) => {
    return (
        <div className={`${styles.sectionWrapper} ${isOpen ? styles.isOpen : ''}`}>
            <button
                className={styles.accordionHeader}
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-controls={`section-${type}`}
            >
                <div className={styles.headerInfo}>
                    <span className={`${styles.iconBox} ${isOpen ? styles.iconActive : ''}`}>
                        {SECTION_ICONS[type]}
                    </span>
                    <span className={styles.sectionLabel}>
                        {SECTION_LABELS[type]}
                    </span>
                </div>
                <div className={styles.chevronWrapper}>
                    <ChevronDown size={20} />
                </div>
            </button>

            {isOpen && (
                <div
                    id={`section-${type}`}
                    className={styles.accordionContent}
                    role="region"
                >
                    <div className={`${styles.gridContainer} ${type === 'youon' ? styles.youonGrid : ''}`}>
                        {items.map((item, idx) => (
                            item && item.char ? (
                                <KanaCard
                                    key={`${type}-${idx}-${item.char}`}
                                    item={item}
                                    onClick={() => onSelect(item)}
                                />
                            ) : (
                                <div
                                    key={`empty-${type}-${idx}`}
                                    className={styles.emptySlot}
                                    aria-hidden="true"
                                />
                            )
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
});

KanaSection.displayName = 'KanaSection';

// ============================================================================
// Main Component
// ============================================================================

const KanaReference: FC = () => {
    // ------------------------------------------------------------------------
    // State
    // ------------------------------------------------------------------------

    const [activeTab, setActiveTab] = useState<TabType>('hiragana');
    const [selectedKana, setSelectedKana] = useState<KanaItem | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [openSections, setOpenSections] = useState<OpenSections>({
        basic: true,
        dakuten: false,
        youon: false
    });

    // ------------------------------------------------------------------------
    // Memoized Data
    // ------------------------------------------------------------------------

    const data = useMemo(() => KANA_DATA[activeTab], [activeTab]);

    const flatKana = useMemo(() => {
        return [...data.basic, ...data.dakuten, ...data.youon]
            .filter((item): item is KanaItem => item?.char !== null);
    }, [data]);

    // ------------------------------------------------------------------------
    // Handlers
    // ------------------------------------------------------------------------

    const toggleSection = useCallback((section: SectionType): void => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    }, []);

    const handleTabChange = useCallback((tab: TabType): void => {
        setActiveTab(tab);
        setOpenSections({ basic: true, dakuten: false, youon: false });
    }, []);

    const handleSelect = useCallback((item: KanaItem): void => {
        const idx = flatKana.findIndex(i => i.char === item.char);
        if (idx !== -1) {
            setCurrentIndex(idx);
            setSelectedKana(flatKana[idx]);
        }
    }, [flatKana]);

    const handlePrev = useCallback((): void => {
        if (currentIndex > 0) {
            const newIndex = currentIndex - 1;
            setCurrentIndex(newIndex);
            setSelectedKana(flatKana[newIndex]);
        }
    }, [currentIndex, flatKana]);

    const handleNext = useCallback((): void => {
        if (currentIndex < flatKana.length - 1) {
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);
            setSelectedKana(flatKana[newIndex]);
        }
    }, [currentIndex, flatKana]);

    const handleCloseModal = useCallback((): void => {
        setSelectedKana(null);
    }, []);

    // ------------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------------

    return (
        <div className={styles.pageContainer}>
            <div className={styles.contentWrapper}>
                {/* Tab Header */}
                <div className={styles.headerContainer}>
                    <div className={styles.tabContainer} role="tablist">
                        {(['hiragana', 'katakana'] as TabType[]).map((tab) => (
                            <button
                                key={tab}
                                className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`}
                                onClick={() => handleTabChange(tab)}
                                role="tab"
                                aria-selected={activeTab === tab}
                                aria-controls={`panel-${tab}`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                        <div
                            className={styles.activeIndicator}
                            style={{
                                transform: activeTab === 'hiragana' ? 'translateX(0)' : 'translateX(100%)'
                            }}
                            aria-hidden="true"
                        />
                    </div>
                </div>

                {/* Accordion Sections */}
                <div
                    key={activeTab}
                    className={styles.accordionList}
                    role="tabpanel"
                    id={`panel-${activeTab}`}
                >
                    {(['basic', 'dakuten', 'youon'] as SectionType[]).map((section) => (
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

            {/* Detail Modal */}
            {selectedKana && (
                <KanaDetailModal
                    item={selectedKana}
                    onClose={handleCloseModal}
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