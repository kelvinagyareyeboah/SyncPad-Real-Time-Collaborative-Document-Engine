type DiffType = "equal" | "insert" | "delete";

export interface DiffResult {
  type: DiffType;
  text: string;
}

/**
 * Escapes special characters for safe rendering in HTML.
 */
function escapeHTML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Computes a word-by-word diff between two plain text strings using
 * a Longest Common Subsequence (LCS) dynamic programming algorithm.
 */
export function computeWordDiff(oldStr: string, newStr: string): DiffResult[] {
  // Tokenize into words, whitespace, and punctuation to keep formatting readable
  const tokenize = (str: string): string[] => {
    return str.split(/(\s+|\b)/).filter((x) => x.length > 0);
  };

  const oldTokens = tokenize(oldStr || "");
  const newTokens = tokenize(newStr || "");

  const m = oldTokens.length;
  const n = newTokens.length;

  // DP table for LCS length
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldTokens[i - 1] === newTokens[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: DiffResult[] = [];
  let i = m,
    j = n;

  // Backtrack to assemble the diff
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldTokens[i - 1] === newTokens[j - 1]) {
      result.push({ type: "equal", text: oldTokens[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.push({ type: "insert", text: newTokens[j - 1] });
      j--;
    } else {
      result.push({ type: "delete", text: oldTokens[i - 1] });
      i--;
    }
  }

  return result.reverse();
}

/**
 * Compiles a word diff into visual HTML using standard <ins> and <del> tags
 * styled for high readability in light and dark modes.
 */
export function renderDiffToHTML(oldStr: string, newStr: string): string {
  const diffs = computeWordDiff(oldStr, newStr);
  let html = "";

  // Group contiguous tokens of the same type to keep output HTML clean
  let currentGroupType: DiffType | null = null;
  let currentGroupText = "";

  const flushGroup = () => {
    if (!currentGroupText) return;
    const escaped = escapeHTML(currentGroupText);

    if (currentGroupType === "equal") {
      // Retain newlines by replacing them with <br />
      html += escaped.replace(/\n/g, "<br />");
    } else if (currentGroupType === "insert") {
      html += `<ins class="bg-emerald-100 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-300 px-0.5 mx-0.5 rounded-sm decoration-emerald-500 font-semibold select-none">${escaped.replace(/\n/g, "<br />")}</ins>`;
    } else if (currentGroupType === "delete") {
      html += `<del class="bg-rose-100 text-rose-950 dark:bg-rose-950/40 dark:text-rose-300 line-through px-0.5 mx-0.5 rounded-sm decoration-rose-500 opacity-70 select-none">${escaped.replace(/\n/g, "<br />")}</del>`;
    }

    currentGroupText = "";
  };

  for (const diff of diffs) {
    if (diff.type !== currentGroupType) {
      flushGroup();
      currentGroupType = diff.type;
    }
    currentGroupText += diff.text;
  }
  flushGroup();

  // Wrap the resulting text blocks in standard paragraphs
  const paragraphs = html.split("<br /><br />");
  return paragraphs
    .map((p) => `<p style="margin-bottom: 1em; line-height: 1.6;">${p}</p>`)
    .join("");
}
