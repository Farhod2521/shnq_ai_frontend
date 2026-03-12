"use client";

import { useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react";
import type {
  ChatFilterCategoryItem,
  ChatFilterDocumentItem,
  ChatFilterPayload,
  ChatFilterSectionItem,
  ChatFilterTreeResponse,
} from "../lib/backendApi";
import { useI18n } from "../providers";

type ChatComposerProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
  variant?: "footer" | "inline";
  filterTree?: ChatFilterTreeResponse | null;
  selectedFilters?: ChatFilterPayload;
  onFiltersChange?: (next: ChatFilterPayload) => void;
};

const EMPTY_FILTERS: Required<ChatFilterPayload> = {
  section_ids: [],
  category_ids: [],
  document_codes: [],
  chapter_ids: [],
  chapter_titles: [],
};

function normalizeFilters(value?: ChatFilterPayload): Required<ChatFilterPayload> {
  return {
    section_ids: value?.section_ids || [],
    category_ids: value?.category_ids || [],
    document_codes: value?.document_codes || [],
    chapter_ids: value?.chapter_ids || [],
    chapter_titles: value?.chapter_titles || [],
  };
}

function toggleInList(current: string[], target: string, checked: boolean): string[] {
  if (!target) {
    return current;
  }
  if (checked) {
    if (current.includes(target)) {
      return current;
    }
    return [...current, target];
  }
  return current.filter((item) => item !== target);
}

function renderIndent(level: number) {
  return { paddingLeft: `${Math.max(0, level) * 14}px` };
}

export default function ChatComposer({
  onSend,
  disabled,
  variant = "footer",
  filterTree,
  selectedFilters,
  onFiltersChange,
}: ChatComposerProps) {
  const { t } = useI18n();
  const [value, setValue] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedDocuments, setExpandedDocuments] = useState<string[]>([]);
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const filterMenuRef = useRef<HTMLDivElement | null>(null);

  const normalizedFilters = useMemo(() => normalizeFilters(selectedFilters), [selectedFilters]);

  useEffect(() => {
    const el = textRef.current;
    if (!el) {
      return;
    }
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }, [value]);


  useEffect(() => {
    if (!showFilterMenu) {
      return;
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (!filterMenuRef.current) {
        return;
      }
      if (event.target instanceof Node && filterMenuRef.current.contains(event.target)) {
        return;
      }
      setShowFilterMenu(false);
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [showFilterMenu]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }
    onSend(trimmed);
    setValue("");
  };

  const activeFilterCount =
    normalizedFilters.section_ids.length +
    normalizedFilters.category_ids.length +
    normalizedFilters.document_codes.length +
    normalizedFilters.chapter_ids.length +
    normalizedFilters.chapter_titles.length;

  const updateFilter = (key: keyof ChatFilterPayload, id: string, checked: boolean) => {
    if (!onFiltersChange) {
      return;
    }
    const next = normalizeFilters(normalizedFilters);
    if (key === "section_ids") {
      next.section_ids = toggleInList(next.section_ids, id, checked);
    } else if (key === "category_ids") {
      next.category_ids = toggleInList(next.category_ids, id, checked);
    } else if (key === "document_codes") {
      next.document_codes = toggleInList(next.document_codes, id, checked);
    } else if (key === "chapter_ids") {
      next.chapter_ids = toggleInList(next.chapter_ids, id, checked);
    } else if (key === "chapter_titles") {
      next.chapter_titles = toggleInList(next.chapter_titles, id, checked);
    }
    onFiltersChange(next);
  };

  const toggleExpand = (
    id: string,
    values: string[],
    setValues: Dispatch<SetStateAction<string[]>>
  ) => {
    setValues(values.includes(id) ? values.filter((item) => item !== id) : [...values, id]);
  };

  const selectAll = () => {
    if (!onFiltersChange || !filterTree?.sections?.length) {
      return;
    }
    const allSectionIds: string[] = [];
    const allCategoryIds: string[] = [];
    const allDocumentCodes: string[] = [];
    const allChapterIds: string[] = [];
    for (const section of filterTree.sections) {
      allSectionIds.push(section.id);
      for (const category of section.categories || []) {
        allCategoryIds.push(category.id);
        for (const document of category.documents || []) {
          allDocumentCodes.push(document.code);
          for (const chapter of document.chapters || []) {
            allChapterIds.push(chapter.id);
          }
        }
      }
    }
    onFiltersChange({
      section_ids: allSectionIds,
      category_ids: allCategoryIds,
      document_codes: allDocumentCodes,
      chapter_ids: allChapterIds,
      chapter_titles: [],
    });
  };

  const clearAll = () => {
    onFiltersChange?.({ ...EMPTY_FILTERS });
  };

  const renderDocument = (document: ChatFilterDocumentItem, level: number) => {
    const isExpanded = expandedDocuments.includes(document.id);
    const hasChildren = (document.chapters || []).length > 0;
    return (
      <div key={document.id} className="space-y-1">
        <div className="flex items-center gap-2" style={renderIndent(level)}>
          <button
            type="button"
            className="text-slate-500"
            onClick={() => toggleExpand(document.id, expandedDocuments, setExpandedDocuments)}
            disabled={!hasChildren}
          >
            <span className="material-symbols-outlined text-[16px]">
              {hasChildren ? (isExpanded ? "expand_more" : "chevron_right") : "radio_button_unchecked"}
            </span>
          </button>
          <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
            <input
              type="checkbox"
              checked={normalizedFilters.document_codes.includes(document.code)}
              onChange={(event) => updateFilter("document_codes", document.code, event.target.checked)}
            />
            <span>{document.code} - {document.title}</span>
          </label>
        </div>
        {isExpanded
          ? (document.chapters || []).map((chapter) => (
              <div key={chapter.id} className="flex items-center gap-2" style={renderIndent(level + 1)}>
                <span className="material-symbols-outlined text-[14px] text-slate-400">subdirectory_arrow_right</span>
                <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={normalizedFilters.chapter_ids.includes(chapter.id)}
                    onChange={(event) => updateFilter("chapter_ids", chapter.id, event.target.checked)}
                  />
                  <span>{chapter.title}</span>
                </label>
              </div>
            ))
          : null}
      </div>
    );
  };

  const renderCategory = (category: ChatFilterCategoryItem, level: number) => {
    const isExpanded = expandedCategories.includes(category.id);
    const hasChildren = (category.documents || []).length > 0;
    return (
      <div key={category.id} className="space-y-1">
        <div className="flex items-center gap-2" style={renderIndent(level)}>
          <button
            type="button"
            className="text-slate-500"
            onClick={() => toggleExpand(category.id, expandedCategories, setExpandedCategories)}
            disabled={!hasChildren}
          >
            <span className="material-symbols-outlined text-[16px]">
              {hasChildren ? (isExpanded ? "expand_more" : "chevron_right") : "radio_button_unchecked"}
            </span>
          </button>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200">
            <input
              type="checkbox"
              checked={normalizedFilters.category_ids.includes(category.id)}
              onChange={(event) => updateFilter("category_ids", category.id, event.target.checked)}
            />
            <span>{category.code} - {category.name}</span>
          </label>
        </div>
        {isExpanded ? (category.documents || []).map((document) => renderDocument(document, level + 1)) : null}
      </div>
    );
  };

  const renderSection = (section: ChatFilterSectionItem) => {
    const isExpanded = expandedSections.includes(section.id);
    const hasChildren = (section.categories || []).length > 0;
    return (
      <div key={section.id} className="space-y-1 rounded-lg border border-slate-200 p-2 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="text-slate-500"
            onClick={() => toggleExpand(section.id, expandedSections, setExpandedSections)}
            disabled={!hasChildren}
          >
            <span className="material-symbols-outlined text-[16px]">
              {hasChildren ? (isExpanded ? "expand_more" : "chevron_right") : "radio_button_unchecked"}
            </span>
          </button>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-100">
            <input
              type="checkbox"
              checked={normalizedFilters.section_ids.includes(section.id)}
              onChange={(event) => updateFilter("section_ids", section.id, event.target.checked)}
            />
            <span>{section.code} - {section.name}</span>
          </label>
        </div>
        {isExpanded ? (section.categories || []).map((category) => renderCategory(category, 1)) : null}
      </div>
    );
  };

  return (
    <div
      className={`${
        variant === "footer"
          ? "chat-composer-footer border-t border-slate-200 bg-white px-6 py-3 dark:border-slate-800 dark:bg-slate-900"
          : "rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      }`}
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="relative flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-blue-300 dark:border-slate-800 dark:bg-slate-800/60">
          <button
            type="button"
            className="relative text-slate-400 transition hover:text-blue-600"
            onClick={() => setShowFilterMenu((prev) => !prev)}
            disabled={disabled}
            title={t("chat.filters.open", "Filterlar")}
          >
            <span className="material-symbols-outlined text-[22px]">add_circle</span>
            {activeFilterCount > 0 ? (
              <span className="absolute -right-2 -top-2 rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            ) : null}
          </button>

          {showFilterMenu ? (
            <div
              ref={filterMenuRef}
              className="absolute bottom-[calc(100%+12px)] left-0 z-30 w-[420px] max-w-[92vw] rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {t("chat.filters.title", "Qidiruv filtrlari")}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t("chat.filters.subtitle", "Bo'lim, kategoriya va hujjatlar bo'yicha cheklash")}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                  onClick={() => setShowFilterMenu(false)}
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <div className="mb-2 flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  onClick={selectAll}
                >
                  {t("chat.filters.select_all", "Hammasini tanlash")}
                </button>
                <button
                  type="button"
                  className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  onClick={clearAll}
                >
                  {t("chat.filters.clear", "Tozalash")}
                </button>
              </div>

              <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
                {!filterTree ? (
                  <p className="py-5 text-center text-xs text-slate-500 dark:text-slate-400">
                    {t("chat.filters.loading", "Filterlar yuklanmoqda...")}
                  </p>
                ) : filterTree.sections.length === 0 ? (
                  <p className="py-5 text-center text-xs text-slate-500 dark:text-slate-400">
                    {t("chat.filters.empty", "Filter uchun ma'lumot topilmadi")}
                  </p>
                ) : (
                  filterTree.sections.map((section) => renderSection(section))
                )}
              </div>
            </div>
          ) : null}

          <textarea
            ref={textRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
            placeholder={t("chat.input.placeholder", "SHNQ AI ga savol bering...")}
            className="min-h-[28px] max-h-[220px] flex-1 resize-none overflow-y-auto bg-transparent text-sm leading-6 text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
            rows={1}
            disabled={disabled}
          />
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-60"
            onClick={handleSend}
            disabled={disabled}
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
