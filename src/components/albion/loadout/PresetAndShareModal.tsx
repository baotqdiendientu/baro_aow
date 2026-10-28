'use client';

import React, { useState } from 'react';
import { AppLanguage } from '@/i18n/translations';
import {
  Check,
  Copy,
  Share2,
  Sparkles,
  Upload,
} from 'lucide-react';

export interface PresetLoadout {
  id: string;
  name_vi: string;
  name_en: string;
  tag_vi: string;
  tag_en: string;
}

export interface PresetAndShareModalProps {
  presets: PresetLoadout[];
  activePresetId: string;
  onApplyPreset: (presetId: string) => void;
  onCopyShareUrl: () => void;
  onCopyJson: () => void;
  onImportJson: (jsonText: string) => void;
  copiedType: 'url' | 'json' | null;
  lang: AppLanguage;
}

export const PresetAndShareModal: React.FC<PresetAndShareModalProps> = ({
  presets,
  activePresetId,
  onApplyPreset,
  onCopyShareUrl,
  onCopyJson,
  onImportJson,
  copiedType,
  lang,
}) => {
  const [importOpen, setImportOpen] = useState(false);
  const [jsonText, setJsonText] = useState('');

  const handleImportSubmit = () => {
    if (!jsonText.trim()) return;
    onImportJson(jsonText);
    setJsonText('');
    setImportOpen(false);
  };

  return (
    <div className="p-3 md:p-6 rounded-xl bg-bg-secondary border border-border-subtle space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-primary animate-pulse" />
            <h2 className="font-display font-bold text-base md:text-lg text-text-primary">
              {lang === 'vi'
                ? 'Bộ Lắp Trang Bị 10 Ô Nhân Vật (Albion Loadout Builder)'
                : 'Interactive 10-Slot Loadout Builder'}
            </h2>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            {lang === 'vi'
              ? 'Tự động kiểm soát ràng buộc vũ khí 2 Tay (2H khóa ô Off-Hand) và 1 Tay (1H cho phép lắp kèm Khiên, Sừng, Đuốc, Muisak).'
              : 'Enforces 2-Handed weapon locking for Off-Hand, with real-time average IP and market cost estimation.'}
          </p>
        </div>

        {/* Action Buttons: Share URL, Export JSON, Import JSON */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onCopyShareUrl}
            className="px-3.5 py-2 rounded-lg bg-accent-primary text-bg-primary text-xs font-bold flex items-center gap-1.5 shadow-rpg-gold hover:opacity-90 transition-all"
          >
            {copiedType === 'url' ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{lang === 'vi' ? 'Đã Chép Link!' : 'Copied URL!'}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>
                  {lang === 'vi' ? 'Chia sẻ Link Build' : 'Share Build URL'}
                </span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onCopyJson}
            className="px-3 py-2 rounded-lg bg-bg-primary hover:bg-bg-elevated text-text-primary border border-border-gold/50 text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            {copiedType === 'json' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{lang === 'vi' ? 'Đã chép JSON' : 'Copied JSON'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-accent-primary" />
                <span>{lang === 'vi' ? 'Xuất JSON' : 'Export JSON'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setImportOpen(!importOpen)}
            className="px-3 py-2 rounded-lg bg-bg-primary hover:bg-bg-elevated text-text-secondary hover:text-text-primary border border-border-subtle text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Nhập JSON' : 'Import JSON'}</span>
          </button>
        </div>
      </div>

      {/* Optional Import JSON Drawer */}
      {importOpen && (
        <div className="p-3 md:p-4 rounded-lg bg-bg-primary border border-border-gold/50 space-y-2">
          <label className="block text-xs font-mono text-text-secondary">
            {lang === 'vi'
              ? 'Dán mã JSON Build vào bên dưới:'
              : 'Paste Loadout JSON below:'}
          </label>
          <textarea
            rows={3}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder='{"MainHand": {"uniqueName": "T4_MAIN_1HCROSSBOW", "tier": 6, ...}}'
            className="w-full p-2.5 rounded bg-bg-secondary border border-border-subtle text-xs font-mono text-text-primary focus:outline-none focus:border-border-gold"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setImportOpen(false)}
              className="px-3 py-1 rounded text-xs text-text-secondary hover:text-text-primary"
            >
              {lang === 'vi' ? 'Đóng' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleImportSubmit}
              className="px-3 py-1 rounded bg-accent-primary text-bg-primary text-xs font-bold shadow-rpg-gold"
            >
              {lang === 'vi' ? 'Áp dụng Build' : 'Apply Build'}
            </button>
          </div>
        </div>
      )}

      {/* Meta Preset Selector Pills */}
      <div className="pt-3 border-t border-border-subtle">
        <div className="text-xs font-medium text-text-secondary mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-accent-primary" />
          <span>
            {lang === 'vi'
              ? 'Chọn nhanh Cấu Hình Mẫu Chuẩn Meta (Preset Builds):'
              : 'Quick-Load Meta Preset Builds:'}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {presets.map((preset) => {
            const isCurrent = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onApplyPreset(preset.id)}
                className={[
                  'p-3 rounded-lg border text-left transition-all flex flex-col justify-between gap-1.5',
                  isCurrent
                    ? 'bg-bg-elevated border-border-gold shadow-rpg-gold ring-1 ring-accent-primary/60'
                    : 'bg-bg-primary/70 border-border-subtle hover:border-border-gold/40',
                ].join(' ')}
              >
                <span className="font-display font-bold text-xs text-text-primary leading-snug">
                  {lang === 'vi' ? preset.name_vi : preset.name_en}
                </span>
                <span className="inline-block self-start px-1.5 py-0.5 text-[10px] font-mono rounded bg-accent-primary/15 text-accent-primary border border-border-gold/30">
                  {lang === 'vi' ? preset.tag_vi : preset.tag_en}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
